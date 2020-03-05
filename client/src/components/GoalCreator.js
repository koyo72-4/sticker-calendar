import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { stickerMap } from '../util/stickers';
import { useFormField } from '../util/useFormField';
import GoalApi from '../util/goalApi';
import FetchDataContext from '../util/FetchDataContext';
import '../css/App.css';

const goalApi = new GoalApi();

export const GoalCreator = () => {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const goalInput = useFormField('');
    const sticker = useFormField('star');
    const { getGoals } = useContext(FetchDataContext);

    const saveGoal = (name, sticker) => {
		const goalObject = {
			name,
			sticker
		};
		goalApi.createGoal(goalObject)
			.then(getGoals);
	};
    
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
                show={showModal}
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
                            {...goalInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="sticker-select">Sticker: </label>
                        <select
                            id="sticker-select"
                            name="sticker"
                            {...sticker}
                            className="select-fontawesome"
                        >
                            {Object.values(stickerMap).map(([faComponent, option]) => option)}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => saveGoal(goalInput.value, sticker.value)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
