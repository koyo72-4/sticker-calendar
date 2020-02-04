import React from 'react';

export const TodaysStars = ({ goalsArray, checkedArray, handleTodayChange, handleTodaySubmit }) => {
    return (
        <form onSubmit={handleTodaySubmit}>
            <fieldset>
                <legend>What have you worked on today?</legend>
                {goalsArray.map(goal => (
                    <>
                        <input
                            type="checkbox"
                            id={goal.name}
                            name={goal.name}
                            checked={checkedArray.includes(goal.name)}
                            onChange={handleTodayChange}
                        />
                        <label htmlFor={goal.name}>{goal.name}</label>
                        <br />
                    </>
                ))}
                <button type="submit">Add to calendar</button>
            </fieldset>
        </form>
    );
};
