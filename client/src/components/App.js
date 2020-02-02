import React, { useState, useRef, useEffect } from 'react';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import { GoalCreator } from './GoalCreator';
import { YearSwitcher } from './YearSwitcher';
import { populateYear, MONTHS } from '../util/months';
import GoalApi from '../util/goalApi';
import DayApi from '../util/dayApi';
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
	const [ goalInputValue, setGoalInputValue ] = useState('');
	const [ sticker, setSticker ] = useState('star');
	const [ goal, setGoal ] = useState('');
	const [ goalsArray, setGoalsArray ] = useState([])
	const [ starredDays, setStarredDays ] = useState([]);

	const monthRefs = useRef([...Array(12)].map(value => React.createRef()));
	const formRef = useRef();
	const goalApi = new GoalApi();
	const dayApi = new DayApi();

	const observer = new IntersectionObserver(intersectionCallback, {
		threshold: [...Array(101)].map((value, index, array) => index / (array.length - 1))
	});

	const getStarredDays = () => {
		dayApi.getDays(year)
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
			goal
		};
		const starMethod = alreadyStarred ? 'addStarToDay' : 'createStarDay';

		dayApi[starMethod](starDayObject)
			.then(getStarredDays);
	};

	const updateYear = newYear => {
		setYear(newYear);
		setPopulatedYear(populateYear(newYear));
		setYearInputValue(newYear.toString());
	};

	const handleInputChange = ({ target: { id, value } }) => {
		if (id === 'year-input') {
			setYearInputValue(value.trim());
		} else {
			setGoalInputValue(value.trim());
		}
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

	const handleStickerChange = ({ target: { value } }) => {
		setSticker(value);
	};

	const saveGoal = (name, sticker) => {
		const goalObject = {
			name,
			sticker
		};
		goalApi.createGoal(goalObject)
			.then(goalApi.getGoals)
			.then(result => {
				setGoalsArray(result);
			});
	};

	useEffect(() => {
		getStarredDays();
		goalApi.getGoals()
			.then(result => {
				setGoalsArray(result);
			});

		monthRefs.current.forEach(month => observer.observe(month.current));
	}, []);

	useEffect(() => {
		getStarredDays();
	}, [year]);

	return (
		<div className="container">
			<h1>Sticker Calendar</h1>
			<div
				style={{display: "flex", alignItems: "center"}}
			>
				<GoalSelect
					goal={goal}
					goalsArray={goalsArray}
					handleGoalChange={handleGoalChange}
					handleInputChange={handleInputChange}
				/>
				<GoalCreator
					saveGoal={saveGoal}
					goalInputValue={goalInputValue}
					sticker={sticker}
					handleStickerChange={handleStickerChange}
					handleInputChange={handleInputChange}
				/>
			</div>
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
