import React from 'react';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import YearSwitcher from './YearSwitcher';
import { populateYear, MONTHS } from '../util/months';
import StarApi from '../util/starApi';
import '../css/App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		const currentYear = new Date().getFullYear();

		this.state = {
			year: currentYear,
			populatedYear: populateYear(currentYear),
			goal: '',
			starredDays: []
		};

		this.monthRefs = this.state.populatedYear.reduce((refsObject, value, index) => {
			refsObject[`month${index + 1}`] = React.createRef();
			return refsObject;
		}, {});

		const intersectionCallback = (entries, observer) => {
			const changeOpacity = (element, intersectionRatio) => {
				const opacityClass = Array.from(element.classList).find(cssClass => cssClass.includes('opacity'));
				const roundedIntersectionRatio = Math.floor(intersectionRatio * 10) / 10;
				element.classList.replace(opacityClass, `opacity${roundedIntersectionRatio * 100}`);
				if (roundedIntersectionRatio === 1) {
					observer.unobserve(element);
				}
			};
			entries.forEach(entry => {
				changeOpacity(entry.target, entry.intersectionRatio);
			});
		};

		this.observer = new IntersectionObserver(intersectionCallback, {
			threshold: new Array(101).fill(0).map((value, index, array) => index / (array.length - 1))
		});

		this.starApi = new StarApi();

		this.getStarredDays = this.getStarredDays.bind(this);
		this.handleGoalChange = this.handleGoalChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.updateYear = this.updateYear.bind(this);
	}

	getStarredDays() {
		this.starApi.getStars(this.state.year)
			.then(result => {
				this.setState({ starredDays: result });
			});
	}

	updateYear(year) {
		this.setState({ year, populatedYear: populateYear(year) }, this.getStarredDays);
	}

	handleGoalChange({ target: { value }}) {
		this.getStarredDays();
		this.setState({ goal: value });
	}

	handleClick(month, day, alreadyStarred) {
		const { year, goal } = this.state;
		const starDayObject = {
			year,
			month,
			day,
			stars: [goal]
		};
		const starMethod = alreadyStarred ? 'addStar' : 'createStarDay';

		this.starApi[starMethod](starDayObject)
			.then(this.getStarredDays);
	}

	componentDidMount() {
		this.getStarredDays();

		Object.values(this.monthRefs).forEach(value => {
			this.observer.observe(value.current);
		});
	}

	render() {
		const { starredDays, populatedYear, year, goal } = this.state;

		return (
			<div className="container">
				<h1>Sticker Calendar</h1>
				<GoalSelect
					goal={goal}
					handleGoalChange={this.handleGoalChange}
				/>
				<YearSwitcher
					year={year}
					updateYear={this.updateYear}
				/>
				{!starredDays.length && <p>No stars have yet been achieved this year. You can do it!</p>}
				{populatedYear.map((month, index) => {
					const monthName = MONTHS[index];
					const starredDaysInMonth = starredDays.filter(starredDay =>
						year === starredDay.year && monthName === starredDay.month
					);

					return (
						<Month
							month={month}
							monthName={monthName}
							starredDays={starredDaysInMonth}
							goal={goal}
							handleClick={this.handleClick}
							key={index}
							ref={this.monthRefs[`month${index + 1}`]}
						/>
					);
				})}
			</div>
		);
	}
}

export default App;
