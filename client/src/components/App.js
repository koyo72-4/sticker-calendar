import React from 'react';
import { Month } from './Month';
import { populateYear, monthIndexMap } from '../util/months';
import '../css/App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			year: 2020,
			populatedYear: populateYear(2020),
			goal: '',
			starredDays: [],
			goalSpecificStarredDays: []
		};

		this.monthRefs = this.state.populatedYear.reduce((refsObject, value, index) => {
			refsObject[`month${index + 1}`] = React.createRef();
			return refsObject;
		}, {});

		const intersectionCallback = (entries, observer) => {
			entries.forEach(entry => {
				const cssClasses = Array.from(entry.target.classList);
				const opacityClass = cssClasses.find(cssClass => cssClass.includes('opacity'));
				if (entry.intersectionRatio === 1.0) {
					entry.target.classList.replace(opacityClass, 'opacity100');
					observer.unobserve(entry.target);
				} else if (entry.intersectionRatio >= 0.75) {
					entry.target.classList.replace(opacityClass, 'opacity50');
				} else if (entry.intersectionRatio >= 0.5) {
					entry.target.classList.replace(opacityClass, 'opacity25');
				} else if (entry.intersectionRatio >= 0.1) {
					entry.target.classList.replace(opacityClass, 'opacity10');
				} else {
					entry.target.classList.replace(opacityClass, 'opacity0');
				}
			});
		};

		this.observer = new IntersectionObserver(intersectionCallback, {
			threshold: new Array(101).fill(0).map((value, index, array) => index / (array.length - 1))
		});

		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleGoalChange = this.handleGoalChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleYearChange(event) {
		const year = parseInt(event.target.value);
		const goalSpecificStarredDays = this.state.goal
			? this.state.starredDays.reduce((daysArray, starredDay) => {
					if (starredDay.stars.includes(this.state.goal)) {
						daysArray.push({ ...starredDay, stars: [this.state.goal] });
					}
					return daysArray;
				}, [])
			: [];

		fetch(`/api/stars/year/${year}`)
			.then(response => response.json())
			.then(result => {
				this.setState({
					year,
					populatedYear: populateYear(year),
					starredDays: result,
					goalSpecificStarredDays
				});
			});
	}

	handleGoalChange(event) {
		const goal = event.target.value;
		const goalSpecificStarredDays = goal
			? this.state.starredDays.reduce((daysArray, starredDay) => {
					if (starredDay.stars.includes(goal)) {
						daysArray.push({ ...starredDay, stars: [goal] });
					}
					return daysArray;
				}, [])
			: [];

		this.setState({
			goal,
			goalSpecificStarredDays
		});
	}

	handleClick() {
		console.log('clicked!');
	}

	componentDidMount() {
		fetch(`/api/stars/year/${this.state.year}`)
			.then(response => response.json())
			.then(result => {
				this.setState({ starredDays: result });
			});

		Object.values(this.monthRefs).forEach(value => {
			this.observer.observe(value.current);
		});
	}

	render() {
		const { starredDays, goal, goalSpecificStarredDays, populatedYear, year } = this.state;
		const starredDaysToDisplay = goal ? goalSpecificStarredDays : starredDays;

		return (
			<div className="container">
				<h1>Sticker Calendar</h1>
				<br/>
				<label htmlFor="year-select">Year: </label>
				<select id="year-select" onChange={this.handleYearChange}>
					<option value="2020">2020</option>
					<option value="2021">2021</option>
					<option value="2022">2022</option>
					<option value="2023">2023</option>
				</select>
				<br/>
				<label htmlFor="goal-select">What is your goal? </label>
				<select id="goal-select" onChange={this.handleGoalChange}>
					<option value="">All Goals</option>
					<option value="exercise">Exercise</option>
					<option value="novel">Work on your novel</option>
					<option value="instrument">Practice a musical instrument</option>
					<option value="sweets">Avoid sweets</option>
				</select>
				<br/>
				<br/>
				{populatedYear.map((month, index) => {
					const monthIndex = index + 1;
					const starredDaysInMonth = starredDaysToDisplay.filter(starredDay => {
						return (
							(year === starredDay.year) &&
							(monthIndexMap.get(monthIndex) === starredDay.month)
						);
					});

					return (
						<Month
							month={month}
							starredDays={starredDaysInMonth}
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
