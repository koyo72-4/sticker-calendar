const express = require('express');
const mongoose = require('mongoose');
const stars = require('./server/routes/stars');
const goals = require('./server/routes/goals');
const days = require('./server/routes/days');

mongoose.connect('mongodb://localhost/sticker-calendar', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log('Error: Could not connect to MongoDB.', error));

const app = express();

app.use(express.json());
app.use('/api/stars', stars);
app.use('/api/goals', goals);
app.use('/api/days', days);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening for your requests on port ${port}!`));
