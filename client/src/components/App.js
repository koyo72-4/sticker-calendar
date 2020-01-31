import React, { useState, useRef, useEffect } from 'react';
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

export const App = () => {
	const currentYear = new Date().getFullYear();

	const [ year, setYear ] = useState(currentYear);
	const [ populatedYear, setPopulatedYear ] = useState(populateYear(currentYear));
	const [ yearInputValue, setYearInputValue ] = useState(currentYear.toString());
	const [ goal, setGoal ] = useState('');
	const [ starredDays, setStarredDays ] = useState([]);

	const monthRefs = useRef([...Array(12)].map(value => React.createRef()));
	const formRef = useRef();
	const starApi = new StarApi();

	const observer = new IntersectionObserver(intersectionCallback, {
		threshold: [...Array(101)].map((value, index, array) => index / (array.length - 1))
	});

	const getStarredDays = () => {
		starApi.getStars(year)
			.then(result => {
				setStarredDays(result);
			});
	};

	const handleGoalChange = ({ target: { value }}) => {
		getStarredDays();
		setGoal(value);
	};

	const handleClick = (month, day, alreadyStarred) => {
		const starDayObject = {
			year,
			month,
			day,
			stars: [goal]
		};
		const starMethod = alreadyStarred ? 'addStar' : 'createStarDay';

		starApi[starMethod](starDayObject)
			.then(getStarredDays);
	};

	const updateYear = newYear => {
		setYear(newYear);
		setPopulatedYear(populateYear(newYear));
		setYearInputValue(newYear.toString());
	};

	const handleInputChange = ({ target: { value } }) => {
		setYearInputValue(value.trim());
	};

	const subtractOne = () => {
		updateYear(year - 1);
	};

	const addOne = () => {
		updateYear(year + 1);
	};

	const handleSubmit = event => {
        const formIsValid = formRef.current.reportValidity();
        if (formIsValid) {
            event.preventDefault();
            updateYear(parseInt(yearInputValue, 10));
        }
	};

	const handleKeyPress = event => {
		if (event.charCode === 13) {
			handleSubmit(event);
		}
	};

	useEffect(() => {
		getStarredDays();

		monthRefs.current.forEach(month => observer.observe(month.current));
	}, []);

	useEffect(() => {
		getStarredDays();
	}, [year]);

	return (
		<div className="container">
			<h1>Sticker Calendar</h1>
			<GoalSelect
				goal={goal}
				handleGoalChange={handleGoalChange}
			/>
			<YearSwitcher
				year={year}
				yearInputValue={yearInputValue}
				handleInputChange={handleInputChange}
				subtractOne={subtractOne}
				addOne={addOne}
				handleSubmit={handleSubmit}
				handleKeyPress={handleKeyPress}
				updateYear={updateYear}
				ref={formRef}
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
						handleClick={handleClick}
						key={index}
						ref={monthRefs.current[index]}
					/>
				);
			})}
		</div>
	);
};
