import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const GoalCreator = ({ saveGoal, goalInputValue, handleInputChange, sticker, handleStickerChange }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    return (
        <>
            <Button
                aria-label="Add a new goal"
                style={{marginLeft: "15px"}}
                onClick={handleShow}
            >
                <span aria-hidden="true">+</span>
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>New Goal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="goal-input">Goal name: </label>
                        <input
                            type="text"
                            name="name"
                            id="goal-input"
                            value={goalInputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="sticker-select">Sticker: </label>
                        <select
                            id="sticker-select"
                            name="sticker"
                            value={sticker}
                            onChange={handleStickerChange}
                        >
                            <option value="star">star</option>
                            <option value="weight">weight</option>
                            <option value="book">book</option>
                            <option value="trumpet">trumpet</option>
                            <option value="candy">candy</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => saveGoal(goalInputValue, sticker)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
