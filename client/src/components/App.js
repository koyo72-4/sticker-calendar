import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
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
		this.handleSearch = this.handleSearch.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.shiftYear = this.shiftYear.bind(this);
	}

	handleInputChange({ target: { name, value }}) {
		const year = name === 'year' ? parseInt(value, 10) : this.state.year;
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
		fetch(`/api/stars/year/${this.state.year}`)
			.then(response => response.json())
			.then(result => {
				this.setState({
					starredDays: result,
					populatedYear: populateYear(this.state.year)
				});
			});
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
