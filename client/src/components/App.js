import React from 'react';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import { YearSwitcher } from './YearSwitcher';
import { populateYear, MONTHS } from '../util/months';
import StarApi from '../util/starApi';
import '../css/App.css';

const intersectionCallback = (entries, observer) => {
	const changeOpacity = (element, intersectionRatio) => {
		const opacityClass = Array.from(element.classList).find(cssClass => cssClass.includes('opacity'));
		const roundedIntersectionRatio = Math.floor(intersectionRatio * 10) / 10;
		element.classList.replace(opacityClass, `opacity${roundedIntersectionRatio * 100}`);
	};
	entries.forEach(entry => {
		changeOpacity(entry.target, entry.intersectionRatio);
		if (entry.intersectionRatio === 1) {
			observer.unobserve(entry.target);
		}
	});
};

class App extends React.Component {
	currentYear = new Date().getFullYear();

	state = {
		year: this.currentYear,
		populatedYear: populateYear(this.currentYear),
		yearInputValue: this.currentYear.toString(),
		goal: '',
		starredDays: []
	};

	monthRefs = this.state.populatedYear.reduce((refsObject, value, index) => {
		refsObject[`month${index}`] = React.createRef();
		return refsObject;
	}, {});

	formRef = React.createRef();

	observer = new IntersectionObserver(intersectionCallback, {
		threshold: new Array(101).fill(0).map((value, index, array) => index / (array.length - 1))
	});

	starApi = new StarApi();

	getStarredDays = () => {
		this.starApi.getStars(this.state.year)
			.then(result => {
				this.setState({ starredDays: result });
			});
	};

	handleGoalChange = ({ target: { value }}) => {
		this.getStarredDays();
		this.setState({ goal: value });
	};

	handleClick = (month, day, alreadyStarred) => {
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
	};

	updateYear = transform => {
		this.setState(prevState => {
			const newYear = transform(prevState);
			return {
				year: newYear,
				populatedYear: populateYear(newYear),
				yearInputValue: newYear.toString()
			};
		}, this.getStarredDays);
	};

	handleInputChange = ({ target: { value } }) => {
		this.setState({ yearInputValue: value.trim() });
	};

	subtractOne = () => {
		this.updateYear(stateObj => stateObj.year - 1);
	};

	addOne = () => {
		this.updateYear(stateObj => stateObj.year + 1);
	};

	handleSubmit = event => {
        const formIsValid = this.formRef.current.reportValidity();
        if (formIsValid) {
            event.preventDefault();
            this.updateYear(stateObj => parseInt(stateObj.yearInputValue, 10));
        }
	};

	handleKeyPress = event => {
		if (event.charCode === 13) {
			this.handleSubmit(event);
		}
	};

	componentDidMount() {
		this.getStarredDays();

		Object.values(this.monthRefs).forEach(value => {
			this.observer.observe(value.current);
		});
	}

	render() {
		const { starredDays, populatedYear, year, yearInputValue, goal } = this.state;

		return (
			<div className="container">
				<h1>Sticker Calendar</h1>
				<GoalSelect
					goal={goal}
					handleGoalChange={this.handleGoalChange}
				/>
				<YearSwitcher
					year={year}
					yearInputValue={yearInputValue}
					handleInputChange={this.handleInputChange}
					subtractOne={this.subtractOne}
					addOne={this.addOne}
					handleSubmit={this.handleSubmit}
					handleKeyPress={this.handleKeyPress}
					updateYear={this.updateYear}
					ref={this.formRef}
				/>
				{!starredDays.length && <p>No stars have yet been achieved this year. You can do it!</p>}
				{populatedYear.map((month, index) => {
					const monthName = MONTHS[index];
					const starredDaysInMonth = starredDays.filter(starredDay =>
						starredDay.year === year && starredDay.month === monthName
					);
					return (
						<Month
							month={month}
							monthName={monthName}
							starredDays={starredDaysInMonth}
							goal={goal}
							handleClick={this.handleClick}
							key={index}
							ref={this.monthRefs[`month${index}`]}
						/>
					);
				})}
			</div>
		);
	}
}

export default App;
