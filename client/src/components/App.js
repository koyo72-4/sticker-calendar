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
			starredDays: []
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
		this.handleClick = this.handleClick.bind(this);
	}

	handleYearChange(event) {
		const year = parseInt(event.target.value);
		this.setState({ year, populatedYear: populateYear(year) });
	}

	handleClick() {
		console.log('clicked!');
	}

	componentDidMount() {
		fetch('/api/stars')
			.then(response => response.json())
			.then(result => {
				this.setState({ starredDays: result });
			});

		Object.values(this.monthRefs).forEach(value => {
			this.observer.observe(value.current);
		});
	}

	render() {
		const { starredDays, populatedYear, year } = this.state;

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
				<p>What is your goal?</p>
				<select>
					<option value="exercise">Exercise</option>
					<option value="novel">Work on your novel</option>
					<option value="instrument">Practice a musical instrument</option>
					<option value="sweets">Avoid sweets</option>
				</select>
				<br/>
				<br/>
				{populatedYear.map((month, index) => {
					const monthIndex = index + 1;
					const starredDaysInMonth = starredDays.filter(starredDay => {
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
