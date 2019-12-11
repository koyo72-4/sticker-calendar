import React from 'react';
import { Month } from './Month';
import { populateYear, monthIndexMap } from '../util/months';
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

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleInputChange({ target: { name, value }}) {
		const year = name === 'year' ? parseInt(value) : this.state.year;
		const goal = name === 'goal' ? value : this.state.goal;
		const fetchUrl = `/api/stars/year/${year}`;

		fetch(fetchUrl)
			.then(response => response.json())
			.then(result => {
				this.setState({
					[name]: name === 'year' ? year : goal,
					...name === 'year' && { populatedYear: populateYear(year) },
					starredDays: result
				});
			});
	}

	handleClick(month, day, alreadyStarred) {
		const { year, goal } = this.state;
		const starDayObject = {
			year,
			month: [...monthIndexMap.entries()].find(([key]) => key === month)[1],
			day,
			stars: [goal]
		};
		const requestMethod = alreadyStarred ? 'PUT' : 'POST';

		fetch(`/api/stars${requestMethod === 'PUT' ? '/add' : ''}`, {
			method: requestMethod,
			body: JSON.stringify(starDayObject),
			headers: {'Content-Type': 'application/json'}
		})
			.then(response => response.json())
			.then(result => {
				fetch(`/api/stars/year/${year}`)
					.then(response => response.json())
					.then(result => {
						this.setState({
							starredDays: result
						});
					});
			});

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
		const { starredDays, populatedYear, year, goal } = this.state;

		return (
			<div className="container">
				<h1>Sticker Calendar</h1>
				<br/>
				<label htmlFor="year-select">Year: </label>
				<select
					id="year-select"
					name="year"
					value={year}
					onChange={this.handleInputChange}
				>
					<option value="2017">2017</option>
					<option value="2018">2018</option>
					<option value="2019">2019</option>
					<option value="2020">2020</option>
					<option value="2021">2021</option>
					<option value="2022">2022</option>
					<option value="2023">2023</option>
				</select>
				<br/>
				<label htmlFor="goal-select">What is your goal? </label>
				<select
					id="goal-select"
					name="goal"
					value={goal}
					onChange={this.handleInputChange}
				>
					<option value="">All Goals</option>
					<option value="exercise">Exercise</option>
					<option value="novel">Work on your novel</option>
					<option value="instrument">Practice a musical instrument</option>
					<option value="sweets">Avoid sweets</option>
				</select>
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
