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
                    {goalsToShow.map((goal, index) => (
                        <div
                            className="display-flex justify-content-between"
                            key={index}
                        >
                            <div>
                                <span>{stickerMap[goal.sticker][0]}</span>
                                <span className="left-padding-3">{goal.name}</span>
                            </div>
                            <div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => hideGoal(goal.name)}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" /> Delete Goal
                                </Button>
                            </div>
                        </div>
                    ))}
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
