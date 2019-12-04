import React from 'react';
import '../css/Day.css';

export const Day = props => (
    <td>
        <button
            className="dayButton"
            onClick={() => props.handleClick(props.month, props.day, props.starred)}
        >
            {props.day}
            {props.starred && <span className="star">{props.stars.join(', ')}</span>}
        </button>
    </td>
);
