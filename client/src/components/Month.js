import React from 'react';
import uuid from 'react-uuid';
import { Day } from './Day';
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
            {props.month.map(week => {
                return (
                    <tr key={uuid()}>
                        {week.map(day => {
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
                                    key={uuid()}
                                    day={day}
                                    month={props.index}
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
