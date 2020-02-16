import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { stickerMap } from '../util/stickers';
import '../css/App.css';

export const GoalEditor = ({ goalsArray, handleEditGoals }) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ goalsToShow, setGoalsToShow ] = useState(goalsArray);
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
                    <Button
                        onClick={() => handleEditGoals(goalsToShow)}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
