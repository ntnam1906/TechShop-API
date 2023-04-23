const express = require('express');
const apiAdmin = require('./apiAdmin');
const apiLocal = require('./apiLocal');

const mainRouter = express.Router();

mainRouter.use('/api/admin', apiAdmin);
mainRouter.use('/api/local', apiLocal);
mainRouter.use('/', (req, res) => {
    res.sendStatus(200);
});

module.exports = mainRouter