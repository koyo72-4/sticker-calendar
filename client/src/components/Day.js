import React from 'react';
import '../css/Day.css';

export const Day = ({ day, monthName, starred, stars, handleClick }) => (
    <td>
        <button
            className="dayButton"
            onClick={() => handleClick(monthName, day, starred)}
        >
            {day}
            {starred && <span className="star">{stars.join(', ')}</span>}
        </button>
    </td>
);
