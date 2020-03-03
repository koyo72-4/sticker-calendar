import React, { useState, useRef, useEffect, useReducer } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Month } from './Month';
import { GoalSelect } from './GoalSelect';
import { GoalCreator } from './GoalCreator';
import { GoalEditor } from './GoalEditor';
import { YearSwitcher } from './YearSwitcher';
import { TodaysStars } from './TodaysStars';
import { populateYear, MONTHS } from '../util/months';
import { useFormField } from '../util/useFormField';
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

function yearReducer(state, action) {
	switch (action.type) {
		case 'change':
			return action.newYear;
		case 'subtractOne':
			return state - 1;
		case 'addOne':
			return state + 1;
		default:
			throw new Error('yearReducer error: unexpected action');
	}
}

export const App = () => {
	const currentYear = new Date().getFullYear();
	const [ year, dispatchYear ] = useReducer(yearReducer, currentYear);

	const [ populatedYear, setPopulatedYear ] = useState(populateYear(currentYear));
	const [ yearInputValue, setYearInputValue ] = useState(currentYear.toString());
	const [ goalsArray, setGoalsArray ] = useState([]);
	const [ starredDays, setStarredDays ] = useState([]);
	const [ showTodayAlert, setShowTodayAlert ] = useState(false);

	const goal = useFormField('');

	const monthRefs = useRef([...Array(12)].map(value => React.createRef()));
	const goalApi = new GoalApi();
	const dayApi = new DayApi();

	const getStarredDays = () => {
		dayApi.getDays(year)
			.then(setStarredDays);
	};

	const getGoals = () => {
		goalApi.getGoals()
			.then(setGoalsArray);
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
							{...goal}
						/>
						<GoalCreator
							getGoals={getGoals}
						/>
					</div>
					<GoalEditor
						goalsArray={goalsArray}
						handleEditGoals={handleEditGoals}
					/>
					<YearSwitcher
						year={year}
						inputValue={yearInputValue}
						setInputValue={setYearInputValue}
						dispatchYear={dispatchYear}
					/>
					{!starredDays.length && <p>No stars have yet been achieved this year. You can do it!</p>}
				</div>
				<div style={{marginLeft: "50px"}}>
					<TodaysStars
						goalsArray={goalsArray}
						setShowTodayAlert={setShowTodayAlert}
						getStarredDays={getStarredDays}
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
						year={year}
						key={index}
						ref={monthRefs.current[index]}
						getStarredDays={getStarredDays}
					/>
				);
			})}
		</div>
	);
};
