const express = require('express');
const stars = require('./server/routes/stars');

const app = express();

app.use(express.json());
app.use('/api/stars', stars);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening for your requests on port ${port}!`));
