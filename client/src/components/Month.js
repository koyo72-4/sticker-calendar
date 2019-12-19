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
            {props.month.map((week, index, month) => {
                return (
                    <tr key={`tr ${month} ${index} ${week}`}>
                        {week.map((day, index, week) => {
                            const starredDay = props.starredDays.find(starredDay => starredDay.day === day);
                            const starred = !!starredDay;

                            let starsToDisplay;
                            if (starred) {
                                if (props.goal) {
                                    if (starredDay.stars.includes(props.goal)) {
                                        starsToDisplay = [props.goal];
                                    } else {
                                        starsToDisplay = [];
                                    }
                                } else {
                                    starsToDisplay = starredDay.stars;
                                }
                            } else {
                                starsToDisplay = [];
                            }

                            return (
                                <Day
                                    key={`td ${week} ${index} ${day}`}
                                    day={day}
                                    monthName={props.monthName}
                                    starred={starred}
                                    stars={starsToDisplay}
                                    handleClick={props.handleClick}
                                />
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    </table>
));
