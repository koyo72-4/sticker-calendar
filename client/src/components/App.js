import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import { populateYear, monthIndexMap } from '../util/months';
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
		this.handleSearch = this.handleSearch.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.shiftYear = this.shiftYear.bind(this);
	}

	getStarredDays() {
		this.starApi.getStars(this.state.year)
			.then(result => {
				this.setState({ starredDays: result });
			});
	}

	handleGoalChange({ target: { value }}) {
		this.getStarredDays();
		this.setState({ goal: value });
	}

	handleYearChange({ target: { value } }) {
		this.setState({ year: parseInt(value, 10) });
	}

	shiftYear({ target: { id } }) {
		const year = id === 'subtractYear'
			? this.state.year - 1
			: this.state.year + 1;
		this.setState({ year }, () => {
			this.handleSearch();
		});
	}

	handleSearch() {
		this.getStarredDays();
		this.setState({ populatedYear: populateYear(this.state.year) });
	}

	handleKeyPress({ charCode }) {
		if (charCode === 13) {
			this.handleSearch();
		}
	}

	handleClick(month, day, alreadyStarred) {
		const { year, goal } = this.state;
		const starDayObject = {
			year,
			month: [...monthIndexMap.entries()].find(([key]) => key === month)[1],
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
				<br/>
				<GoalSelect
					goal={goal}
					handleGoalChange={this.handleGoalChange}
				/>
				<br />
				<br />
				<label htmlFor="year-input">Year: </label>
				<input
					type="text"
					id="year-input"
					name="year"
					value={year}
					onChange={this.handleYearChange}
					onKeyPress={this.handleKeyPress}
				/>
				<br />
				<br />
				<button
					id="subtractYear"
					onClick={this.shiftYear}
				>
					<FontAwesomeIcon icon={faCaretLeft} className="caret-left" />
					{year - 1}
				</button>
				<button
					id="addYear"
					onClick={this.shiftYear}
				>
					{year + 1}
					<FontAwesomeIcon icon={faCaretRight} className="caret-right" />
				</button>
				<br />
				<br />
				<button
					onClick={this.handleSearch}
				>
					Submit
				</button>
				<br/>
				<br/>
				{!starredDays.length && <p>No stars have yet been achieved this year. You can do it!</p>}
				{populatedYear.map((month, index) => {
					const monthIndex = index + 1;
					const starredDaysInMonth = starredDays.filter(starredDay =>
						(year === starredDay.year) &&
						(monthIndexMap.get(monthIndex) === starredDay.month)
					);

					return (
						<Month
							month={month}
							starredDays={starredDaysInMonth}
							goal={goal}
							handleClick={this.handleClick}
							index={monthIndex}
							key={monthIndex}
							ref={this.monthRefs[`month${index + 1}`]}
						/>
					);
				})}
			</div>
		);
	}
}

export default App;
