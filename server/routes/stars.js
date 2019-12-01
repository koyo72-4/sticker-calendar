const express = require('express');
const Joi = require('@hapi/joi');
const starDays = require('../seed/stars')();
import { isLeapYear } from '../../client/src/util/months';

const router = express.Router();

router.get('/', (req, res) => {
    res.send(starDays);
});

router.get('/year/:year', (req, res) => {
    const { goal } = req.query;
    const filterStarDaysByYear = (({ year }) => year === parseInt(req.params.year));

    let filteredDays = starDays.filter(filterStarDaysByYear);
    if (goal) {
        filteredDays = filteredDays.reduce((daysArray, starredDay) => {
            if (starredDay.stars.includes(goal)) {
                daysArray.push({ ...starredDay, stars: [goal] });
            }
            return daysArray;
        }, []);
    }

    if (filteredDays.length) {
        res.send(filteredDays);
    } else {
        res.send('No stars have been achieved that year');
    }
});

router.get('/:id', (req, res) => {
    const star = starDays.find(starDay => starDay.id === parseInt(req.params.id));
    if (!star) {
        return res.status(404).send('The starred day with the given id was not found.');
    }
    res.send(star);
});

const monthDays = new Map([
    [
        ['jan', 'mar', 'may', 'jul', 'aug', 'oct', 'dec'],
        31
    ],
    [
        ['apr', 'jun', 'sep', 'nov'],
        30
    ]
    // the number of days in feb is variable and so is not a part of this map
]);

router.post('/', async (req, res) => {
    const { error } = validateStar(req.body);
    if (error) {
        return res.status(400).send(error.details.map(error => error.message).join('\n'));
    }

    const year = parseInt(req.body.year);
    const day = parseInt(req.body.day);

    let numberOfDays;
    if (req.body.month === 'feb') {
        numberOfDays = isLeapYear(year) ? 29 : 28;
    } else {
        numberOfDays = monthDays.get(
            [...monthDays.keys()].find(months => months.includes(req.body.month))
        );
    }

    if (day > numberOfDays) {
        return res.status(400).send('Invalid date');
    }

    const star = {
        id: starDays.length + 1,
        year,
        day,
        ...req.body
    };
    starDays.push(star);
    res.send(star);
});

router.put('/:id', (req, res) => {
    const star = starDays.find(starDay => starDay.id === parseInt(req.params.id));
    if (!star) {
        return res.status(404).send('The starred day with the given id was not found.');
    }

    const { error } = validateStar(req.body);
    if (error) {
        return res.status(400).send(error.details.map(error => error.message).join('\n'));
    }

    const updatedStar = {
        ...star,
        ...req.body
    };
    starDays.splice(starDays.indexOf(star), 1, updatedStar);
    res.send(updatedStar);
});

router.delete('/:id', (req, res) => {
    const star = starDays.find(starDay => starDay.id === parseInt(req.params.id));
    if (!star) {
        return res.status(404).send('The starred day with the given id was not found.');
    }

    starDays.splice(starDays.indexOf(star), 1);
    res.send(star);
});

function validateStar(star) {
    const schema = Joi.object().keys({
        year: Joi.number().integer().min(1753).max(9999).required(),
        month: Joi.string().valid('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec').required(),
        day: Joi.number().integer().min(1).max(31).required(),
        stars: Joi.array().items(Joi.string().required()).required()
    });

    return schema.validate(star, { abortEarly: false });
}

module.exports = router;
