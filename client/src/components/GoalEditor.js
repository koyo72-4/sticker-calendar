import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { stickerMap } from '../util/stickers';
import GoalApi from '../util/goalApi';
import FetchDataContext from '../util/FetchDataContext';
import '../css/App.css';

const goalApi = new GoalApi();

export const GoalEditor = ({ goalsArray }) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ goalsToShow, setGoalsToShow ] = useState(goalsArray);
    const { getGoals } = useContext(FetchDataContext);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const hideGoal = goalName => {
        setGoalsToShow(goalsToShow.filter(({ name }) => name !== goalName));
    };

    const changeSticker = (goal, { target: { value } }) => {
        const updatedGoals = goalsToShow.map(originalGoal => {
            if (originalGoal.name === goal.name) {
                return { ...originalGoal, sticker: value };
            } else {
                return originalGoal;
            }
        });
        setGoalsToShow(updatedGoals);
    };

    const handleEdit = goalsToKeep => {
		const goalsToChange = goalsToKeep.filter(goal => {
			const originalGoal = goalsArray.find(({ name }) => name === goal.name);
			return originalGoal && originalGoal.sticker !== goal.sticker;
		});

		const goalsToDelete = goalsArray.filter(({ name }) =>
			!goalsToKeep.some(goal => goal.name === name));

		if (goalsToDelete.length && goalsToChange.length) {
			goalApi.deleteGoals(goalsToDelete)
				.then(() => goalApi.updateGoals(goalsToChange))
				.then(getGoals);
		} else if (goalsToDelete.length) {
			goalApi.deleteGoals(goalsToDelete)
				.then(getGoals);
		} else if (goalsToChange.length) {
			goalApi.updateGoals(goalsToChange)
				.then(getGoals);
		}
	};

    useEffect(() => {
        setGoalsToShow(goalsArray);
    }, [goalsArray]);

    return (
        <>
            <Button
                variant="outline-primary"
                size="sm"
                onClick={handleShowModal}
            >
                Edit your goals
            </Button>
            <Modal
                show={showModal}
                onHide={handleCloseModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Goal Editor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {goalsToShow.map((goal, index) => {
                        const originalGoalSticker = goalsArray.find(originalGoal => originalGoal.name === goal.name).sticker;
                        return (
                            <div
                                className="display-flex justify-content-between"
                                key={index}
                            >
                                <div>
                                    <span>{stickerMap[originalGoalSticker][0]}</span>
                                    <span className="left-padding-3">{goal.name}</span>
                                </div>
                                <div>
                                    <label htmlFor="sticker-select">Sticker: </label>
                                    <select
                                        id="sticker-select"
                                        name="sticker"
                                        value={goal.sticker}
                                        onChange={event => changeSticker(goal, event)}
                                        className="select-fontawesome"
                                    >
                                        {Object.values(stickerMap).map(([faComponent, option]) => option)}
                                    </select>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => hideGoal(goal.name)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" /> Delete Goal
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleEdit(goalsToShow)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
