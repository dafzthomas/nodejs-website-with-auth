const express = require('express');
const crypto = require('crypto');
const add = require('date-fns/add');

const router = express.Router();

const config = require('../config');
const _data = require('../lib/data');

const UserController = require('../controllers/user.controller');

router.post('/payhere', async (req, res) => {
    res.status(200).jsonp({ hello: 'world!' });
});

module.exports = router;
