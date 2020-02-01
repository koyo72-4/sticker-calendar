const express = require('express');
const { Goal } = require('../models/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const goals = await Goal.find().sort({ name: 1 });
    res.send(goals);
});

router.post('/', async (req, res) => {
    const newGoal = new Goal({
        name: req.body.name, 
        sticker: req.body.sticker
    });

    await newGoal.save();
    res.send(newGoal);
});

module.exports = router;
