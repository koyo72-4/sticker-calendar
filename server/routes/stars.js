const express = require('express');
const starDays = require('../seed/stars')();

const router = express.Router();

router.get('/', (req, res) => {
    res.send(starDays);
});

router.get('/:year', (req, res) => {
    const goal = req.query.goal;
    const filterStars = ({ year, stars }) => {
        if (year === parseInt(req.params.year)) {
            return goal ? stars.includes(goal) : true;
        }
        return false;
    };
    const stars = starDays.filter(filterStars);

    if (stars.length) {
        return res.send(stars);
    } else {
        return res.send('No stars have been achieved that year');
    }
});

module.exports = router;
