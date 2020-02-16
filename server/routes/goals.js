const express = require('express');
const { Goal } = require('../models/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const goals = await Goal.find().sort({ name: 1 });
    return res.send(goals);
});

router.post('/', async (req, res) => {
    const newGoal = new Goal({
        name: req.body.name, 
        sticker: req.body.sticker
    });

    await newGoal.save();
    return res.send(newGoal);
});

router.delete('/', async (req, res) => {
    const goalsToDelete = req.body.goals;
    const result = await Goal.deleteMany({
        'name': {
            $in: goalsToDelete
        }
    });
    return res.send(result);
});

router.put('/', async (req, res) => {
    const goalsToChange = req.body.goals;
    goalsToChange.forEach(async goal => {
        const originalGoal = await Goal.findByIdAndUpdate(goal._id, {
            sticker: goal.sticker
        });
    });
    return res.send(goalsToChange);
});

module.exports = router;
