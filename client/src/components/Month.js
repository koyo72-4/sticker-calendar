import React from 'react';
import { Day } from './Day';
import { DAYS } from '../util/months';
import '../css/Month.css';

export const Month = React.forwardRef((
    { month, monthName, starredDays, goal, year },
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
                                const starredDay = starredDays.find(starredDay => starredDay.dayNumber === day);
                                const starred = !!starredDay;
                                let starsToDisplay = [];
                                if (starred) {
                                    if (!goal) {
                                        starsToDisplay = starredDay.stars;
                                    } else {
                                        const goalToDisplay = starredDay.stars.find(star => star._id.name === goal);
                                        if (goalToDisplay) {
                                            starsToDisplay = [goalToDisplay];
                                        }
                                    }
                                }
                                return (
                                    <Day
                                        key={`week${index}day${i}`}
                                        day={day}
                                        month={monthName}
                                        year={year}
                                        starred={starred}
                                        stars={starsToDisplay}
                                        goal={goal}
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
