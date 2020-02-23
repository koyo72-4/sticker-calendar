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

function useFormField(initialValue) {
	const [ value, setValue ] = useState(initialValue);
	return {
		value,
		handleChange: ({ target: { value } }) => {
			setValue(value);
		}
	};
}

export const App = () => {
	const currentYear = new Date().getFullYear();

	const [ year, setYear ] = useState(currentYear);
	const [ populatedYear, setPopulatedYear ] = useState(populateYear(currentYear));
	const [ yearInputValue, setYearInputValue ] = useState(currentYear.toString());
	const [ goalsArray, setGoalsArray ] = useState([]);
	const [ checkedArray, setCheckedArray ] = useState([]);
	const [ starredDays, setStarredDays ] = useState([]);
	const [ showTodayAlert, setShowTodayAlert ] = useState(false);

	const goal = useFormField('');
	const sticker = useFormField('star');
	const goalInput = useFormField('');

	const monthRefs = useRef([...Array(12)].map(value => React.createRef()));
	const formRef = useRef();
	const goalApi = new GoalApi();
	const dayApi = new DayApi();

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

	const handleClick = (month, day, alreadyStarred) => {
		const starDayObject = {
			year,
			month,
			day,
			goal: goal.value
		};
		const starMethod = alreadyStarred ? 'addStarToDay' : 'createStarDay';

		dayApi[starMethod](starDayObject)
			.then(getStarredDays);
	};

	const handleYearInputChange = ({ target: { value } }) => {
		setYearInputValue(value.trim());
	};

	const subtractOne = () => setYear(prevYear => prevYear - 1);

	const addOne = () => setYear(prevYear => prevYear + 1);

	const handleSubmit = event => {
        const formIsValid = formRef.current.reportValidity();
        if (formIsValid) {
            event.preventDefault();
            setYear(parseInt(yearInputValue, 10));
        }
	};

	const handleTodaySubmit = event => {
		event.preventDefault();
		const today = new Date();

		const starDayObject = {
			year: today.getFullYear(),
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

	const saveGoal = (name, sticker) => {
		const goalObject = {
			name,
			sticker
		};
		goalApi.createGoal(goalObject)
			.then(getGoals);
	};

	const handleEditGoals = goalsToKeep => {
		const goalsToChange = goalsToKeep.filter(goal => {
			const originalGoal = goalsArray.find(({ name }) => name === goal.name);
			return originalGoal && originalGoal.sticker !== goal.sticker;
		});

		const goalsToDelete = goalsArray.filter(({ name }) =>
			!goalsToKeep.some(goal => goal.name === name));

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
		const observer = new IntersectionObserver(intersectionCallback, {
			threshold: [...Array(101)].map((value, index, array) => index / (array.length - 1))
		});
		const animatedMonths = monthRefs.current;

		animatedMonths.forEach(month => observer.observe(month.current));
		return () => {
			animatedMonths.forEach(month => observer.unobserve(month.current));
		};
	}, [year]);

	useEffect(() => {
		getStarredDays();
	}, [year, goalsArray]);

	useEffect(() => {
		setPopulatedYear(populateYear(year));
		setYearInputValue(year.toString());
	}, [year]);

	useEffect(() => {
		getGoals();
	}, []);

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
							goalsArray={goalsArray}
							goal={goal.value}
							handleGoalChange={goal.handleChange}
						/>
						<GoalCreator
							saveGoal={saveGoal}
							goalInputValue={goalInput.value}
							handleGoalInputChange={goalInput.handleChange}
							sticker={sticker.value}
							handleStickerChange={sticker.handleChange}
						/>
					</div>
					<GoalEditor
						goalsArray={goalsArray}
						handleEditGoals={handleEditGoals}
					/>
					<YearSwitcher
						year={year}
						yearInputValue={yearInputValue}
						handleYearInputChange={handleYearInputChange}
						subtractOne={subtractOne}
						addOne={addOne}
						handleSubmit={handleSubmit}
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
						goal={goal.value}
						handleClick={handleClick}
						key={index}
						ref={monthRefs.current[index]}
					/>
				);
			})}
		</div>
	);
};
