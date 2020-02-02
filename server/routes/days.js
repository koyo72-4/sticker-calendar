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

module.exports = router;
