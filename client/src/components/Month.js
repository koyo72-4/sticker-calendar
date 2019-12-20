import React from 'react';
import { Day } from './Day';
import { DAYS } from '../util/months';
import '../css/Month.css';

export const Month = React.forwardRef((
    { month, monthName, starredDays, goal, handleClick },
    ref
) => (
    <table
        style={{tableLayout: 'fixed'}}
        className={`${monthName} opacity0`}
        ref={ref}
    >
        <caption>{monthName}</caption>
        <thead>
            <tr>
                {DAYS.map(day =>
                    <th key={day}>{day}</th>
                )}
            </tr>
        </thead>
        <tbody>
            {month.map((week, index) => {
                return (
                    <tr key={`week${index}`}>
                        {week.map((day, i) => {
                            if (day) {
                                const starredDay = starredDays.find(starredDay => starredDay.day === day);
                                const starred = !!starredDay;
                                let starsToDisplay = [];
                                if (starred) {
                                    if (!goal) {
                                        starsToDisplay = starredDay.stars;
                                    } else if (starredDay.stars.includes(goal)) {
                                        starsToDisplay = [goal];
                                    }
                                }
                                return (
                                    <Day
                                        key={`week${index}day${i}`}
                                        day={day}
                                        monthName={monthName}
                                        starred={starred}
                                        stars={starsToDisplay}
                                        handleClick={handleClick}
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
