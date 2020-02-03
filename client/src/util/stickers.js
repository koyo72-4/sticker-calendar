import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faDumbbell, faBook, faDrum, faCandyCane } from '@fortawesome/free-solid-svg-icons';

export const stickerMap = {
    'star': [
        <FontAwesomeIcon icon={faStar} aria-hidden="true" />,
        <option value="star" key="star" className="select-fontawesome">&#xf005; star</option>
    ],
    'dumbbell': [
        <FontAwesomeIcon icon={faDumbbell} aria-hidden="true" />,
        <option value="dumbbell" key="dumbbell" className="select-fontawesome">&#xf44b; dumbbell</option>
    ],
    'book': [
        <FontAwesomeIcon icon={faBook} aria-hidden="true" />,
        <option value="book" key="book" className="select-fontawesome">&#xf02d; book</option>
    ],
    'drum': [
        <FontAwesomeIcon icon={faDrum} aria-hidden="true" />,
        <option value="drum" key="drum" className="select-fontawesome">&#xf569; drum</option>
    ],
    'candy-cane': [
        <FontAwesomeIcon icon={faCandyCane} aria-hidden="true" />,
        <option value="candy-cane" key="candy-cane" className="select-fontawesome">&#xf786; candy cane</option>
    ]
};
