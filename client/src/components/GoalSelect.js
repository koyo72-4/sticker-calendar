import React from 'react';

export const GoalSelect = ({ goalsArray, value, onChange }) => {
    return (
        <div className="y-margin-15">
            <label htmlFor="goal-select">What is your goal? </label>
            <select
                id="goal-select"
                name="goal"
                value={value}
                onChange={onChange}
            >
                <option value="">All Goals</option>
                {goalsArray.map((goal, index) => {
                    return <option value={goal.name} key={index}>{goal.name}</option>;
                })}
            </select>
        </div>
    );
};
