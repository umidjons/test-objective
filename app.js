require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env-test' : '.env' });
require('./infrastructure/db');
const config = require('./infrastructure/config');

const express = require('express');
const app = express();

app.use(express.json());

app.use('/api', require('./modules/User'));

app.use((error, req, res, next) => {
    console.error('ERR>', error.message);

    res.status(error.status || 400);

    res.json({ error: error.message });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(config.server.port, config.server.host, () => {
        console.log(`Server started at ${ config.server.host }:${ config.server.port }!`);
    });
}

module.exports = app;
