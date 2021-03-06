import React, { useState, useContext } from 'react';
import { MONTHS } from '../util/months';
import DayApi from '../util/dayApi';
import FetchDataContext from '../util/FetchDataContext';

const dayApi = new DayApi();

export const TodaysStars = ({ goalsArray, setShowTodayAlert }) => {
    const [ checkedArray, setCheckedArray ] = useState([]);
    const { getStarredDays } = useContext(FetchDataContext);

    const handleSubmit = event => {
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

	const handleChange = event => {
        const { name } = event.target;
		if (checkedArray.includes(name)) {
			setCheckedArray(checkedArray.filter(item => item !== name));
		} else {
			setCheckedArray([...checkedArray, name]);
		}
	};

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>What have you worked on today?</legend>
                {goalsArray.map(({ name, _id }) => (
                    <React.Fragment key={_id}>
                        <input
                            type="checkbox"
                            id={`today-goal-${_id}`}
                            name={name}
                            checked={checkedArray.includes(name)}
                            onChange={handleChange}
                        />
                        <label htmlFor={`today-goal-${_id}`}>{name}</label>
                        <br />
                    </React.Fragment>
                ))}
                <button type="submit">Add to calendar</button>
            </fieldset>
        </form>
    );
};
