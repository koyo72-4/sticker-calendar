import React, { useContext } from 'react';
import { stickerMap } from '../util/stickers';
import DayApi from '../util/dayApi';
import FetchDataContext from '../util/FetchDataContext';
import '../css/Day.css';

const dayApi = new DayApi();

export const Day = ({ day, month, year, starred, stars, goal }) => {
    const { getStarredDays } = useContext(FetchDataContext);

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
                            <span className="screen-reader-only">{star._id.sticker}</span>
                        </span>
                    ))
                }
            </button>
        </td>
    );
};
