const express = require('express');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');
const UserController = require('../controllers/user.controller');

router.get('/', (req, res, next) => {
    res.view('register', {
        site_title: 'Register',
    });
});

router.post('/', async (req, res) => {
    if (req.body['new-password'] !== req.body['new-confirm-password']) {
        res.view('register', { errorMessage: 'Passwords do not match.' });
    }

    req.body['new-email'] = req.body['new-email'].toLowerCase();

    User.register(
        new User({ email: req.body['new-email'] }),
        req.body['new-password'],
        async function (err, user) {
            if (err) {
                res.view('register', { user: user, errorMessage: err });

                return;
            }

            await UserController.runNewUserCommands(user.email);

            res.viewRedirect('/login', {
                successMessage: 'Register successful, please sign in.',
            });
        },
    );
});

module.exports = router;
