import React from 'react';

export const GoalSelect = ({ goal, goalsArray, handleGoalChange }) => {
    return (
        <div className="y-margin-15">
            <label htmlFor="goal-select">What is your goal? </label>
            <select
                id="goal-select"
                name="goal"
                value={goal}
                onChange={handleGoalChange}
            >
                <option value="">All Goals</option>
                {goalsArray.map((goal, index) => {
                    return <option value={goal.name} key={index}>{goal.name}</option>;
                })}
            </select>
        </div>
    );
};
