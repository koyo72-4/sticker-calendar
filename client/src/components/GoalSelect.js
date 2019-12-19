import React from 'react';

export const GoalSelect = ({ goal, handleGoalChange }) => {
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
                <option value="exercise">Exercise</option>
                <option value="novel">Work on your novel</option>
                <option value="instrument">Practice a musical instrument</option>
                <option value="sweets">Avoid sweets</option>
            </select>
        </div>
    );
};
