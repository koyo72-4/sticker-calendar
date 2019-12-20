import React from 'react';
import { Day } from './Day';
import { DAYS } from '../util/months';
import '../css/Month.css';

export const Month = React.forwardRef((props, ref) => (
    <table
        style={{tableLayout: 'fixed'}}
        className={`${props.monthName} opacity0`}
        ref={ref}
    >
        <caption>{props.monthName}</caption>
        <thead>
            <tr>
                {DAYS.map(day =>
                    <th key={day}>{day}</th>
                )}
            </tr>
        </thead>
        <tbody>
            {props.month.map((week, index) => {
                return (
                    <tr key={`week${index}`}>
                        {week.map((day, i) => {
                            if (day) {
                                const starredDay = props.starredDays.find(starredDay => starredDay.day === day);
                                const starred = !!starredDay;
                                let starsToDisplay = [];
                                if (starred) {
                                    if (!props.goal) {
                                        starsToDisplay = starredDay.stars;
                                    } else if (starredDay.stars.includes(props.goal)) {
                                        starsToDisplay = [props.goal];
                                    }
                                }
                                return (
                                    <Day
                                        key={`week${index}day${i}`}
                                        day={day}
                                        monthName={props.monthName}
                                        starred={starred}
                                        stars={starsToDisplay}
                                        handleClick={props.handleClick}
                                    />
                                );
                            } else {
                                return <td key={`week${index}day${i}`}></td>;
                            }
                        })}
                    </tr>
                );
            })}
        </tbody>
    </table>
));
