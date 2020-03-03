import React from 'react';
import { stickerMap } from '../util/stickers';
import DayApi from '../util/dayApi';
import '../css/Day.css';

const dayApi = new DayApi();

export const Day = ({ day, month, year, starred, stars, goal, getStarredDays }) => {
    const handleClick = () => {
		const starDayObject = {
			year,
			month,
			day,
			goal
		};
		const starMethod = starred ? 'addStarToDay' : 'createStarDay';

		dayApi[starMethod](starDayObject)
			.then(getStarredDays);
    };

    return (
        <td>
            <button
                className="dayButton"
                onClick={handleClick}
            >
                {day}
                {(stars && stars.length > 0) &&
                    stars.map(star => (
                        <span className="star">
                            {stickerMap[star._id.sticker][0]}
                            <span className="sr-only">{star._id.sticker}</span>
                        </span>
                    ))
                }
            </button>
        </td>
    );
};
