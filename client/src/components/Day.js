import React from 'react';
import { stickerMap } from '../util/stickers';
import '../css/Day.css';

export const Day = ({ day, monthName, starred, stars, handleClick }) => (
    <td>
        <button
            className="dayButton"
            onClick={() => handleClick(monthName, day, starred)}
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
