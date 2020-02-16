import React, { useState, useRef, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import { GoalCreator } from './GoalCreator';
import { GoalEditor } from './GoalEditor';
import { YearSwitcher } from './YearSwitcher';
import { TodaysStars } from './TodaysStars';
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
	const [ goalsArray, setGoalsArray ] = useState([]);
	const [ checkedArray, setCheckedArray ] = useState([]);
	const [ starredDays, setStarredDays ] = useState([]);
	const [ showTodayAlert, setShowTodayAlert ] = useState(false);

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

	const getGoals = () => {
		goalApi.getGoals()
			.then(setGoalsArray);
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

	const handleTodaySubmit = event => {
		event.preventDefault();
		const today = new Date();

		const starDayObject = {
			year,
			month: MONTHS[today.getMonth()],
			day: today.getDate(),
			goals: checkedArray
		};

		dayApi.addStars(starDayObject)
			.then(getStarredDays)
			.then(() => setShowTodayAlert(true));

		setCheckedArray([]);
	};

	const handleTodayChange = ({ target: { name } }) => {
		if (checkedArray.includes(name)) {
			setCheckedArray(checkedArray.filter(item => item !== name));
		} else {
			setCheckedArray([...checkedArray, name]);
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
			.then(getGoals);
	};

	const handleEditGoals = goalsToKeep => {
		const goalsToChange = goalsToKeep.reduce((newArray, goal) => {
			const originalGoal = goalsArray.find(({ name }) => name === goal.name);
			if (originalGoal && originalGoal.sticker !== goal.sticker) {
				newArray.push(goal);
			}
			return newArray;
		}, []);

		const goalsToDelete = goalsArray
			.filter(({ name }) => {
				return goalsToKeep.find(goal => goal.name === name) === undefined
			})
			.map(({ name }) => name);

		if (goalsToDelete.length && goalsToChange.length) {
			goalApi.deleteGoals(goalsToDelete)
				.then(() => goalApi.updateGoals(goalsToChange))
				.then(getGoals);
		} else if (goalsToDelete.length) {
			goalApi.deleteGoals(goalsToDelete)
				.then(getGoals);
		} else if (goalsToChange.length) {
			goalApi.updateGoals(goalsToChange)
				.then(getGoals);
		}
	};

	useEffect(() => {
		getStarredDays();
		getGoals();
		monthRefs.current.forEach(month => observer.observe(month.current));
	}, []);

	useEffect(() => {
		getStarredDays();
	}, [year, goalsArray]);

	return (
		<div className="container">
			{showTodayAlert &&
				<Alert variant="success" onClose={() => setShowTodayAlert(false)} dismissible>
					<Alert.Heading>Nice work!</Alert.Heading>
					<p>Your calendar has been updated to show what you achieved today.</p>
				</Alert>
			}
			<h1>Sticker Calendar</h1>
			<div className="display-flex">
				<div>
					<div className="display-flex align-items-center">
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
					<GoalEditor
						goalsArray={goalsArray}
						handleEditGoals={handleEditGoals}
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
				</div>
				<div style={{marginLeft: "50px"}}>
					<TodaysStars
						goalsArray={goalsArray}
						checkedArray={checkedArray}
						handleTodayChange={handleTodayChange}
						handleTodaySubmit={handleTodaySubmit}
					/>
				</div>
			</div>
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
