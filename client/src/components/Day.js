import React from 'react';
import '../css/Day.css';

export const Day = ({ day, monthName, starred, stars, handleClick }) => (
    <td>
        <button
            className="dayButton"
            onClick={() => handleClick(monthName, day, starred)}
        >
            {day}
            {(stars && stars.length > 0) && <span className="star">
                {stars.map(star => star._id.sticker.substring(0, star._id.sticker.length - 5)).join(', ')}
            </span>}
        </button>
    </td>
);
