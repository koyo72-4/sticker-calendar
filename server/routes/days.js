const express = require('express');
const { Day, Goal } = require('../models/models');

const router = express.Router();

router.get('/:year', async (req, res) => {
    const days = await Day
        .find({
            year: req.params.year
        }).populate('stars._id');
    return res.send(days);
});

router.post('/', async (req, res) => {
    const newDay = new Day({
        dayNumber: req.body.day,
        month: req.body.month,
        year: req.body.year,
        stars: []
    });
    const goal = await Goal.findOne({
        name: req.body.goal
    });
    newDay.stars.push({ _id: goal._id });
    await newDay.save();
    return res.send(newDay);
});

router.put('/:year/:month/:day', async (req, res) => {
    const day = await Day.findOne({
        year: req.params.year,
        month: req.params.month,
        dayNumber: req.params.day
    })
    const goal = await Goal.findOne({
        name: req.body.goal
    });
    if (!day.stars.some(({ _id }) => _id.equals(goal._id))) {
        day.stars.push({ _id: goal._id });
        await day.save();
    }
    return res.send(day);
});

module.exports = router;
