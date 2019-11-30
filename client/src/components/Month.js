import React from 'react';
import Day from './Day';
import '../css/Month.css';

export const Month = React.forwardRef((props, ref) => (
    <table
        style={{tableLayout: 'fixed'}}
        className={`${props.index} opacity0`}
        ref={ref}
    >
        <caption>{`Month${props.index}`}</caption>
        <thead>
            <tr>
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
            </tr>
        </thead>
        <tbody>
            {props.month.map((week, index, month) => {
                return (
                    <tr key={`tr ${month} ${index} ${week}`}>
                        {week.map((day, index, week) => {
                            const starredDay = props.starredDays.find(starredDay => starredDay.day === day);
                            const starred = !!starredDay;

                            return (
                                <Day
                                    key={`td ${week} ${index} ${day}`}
                                    day={day}
                                    starred={starred}
                                    stars={starred ? starredDay.stars : ['']}
                                />
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    </table>
));
