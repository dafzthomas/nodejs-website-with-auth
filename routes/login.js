const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.view('login', {
        site_title: 'Login',
    });
});

router.post('/', (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();

    next();
});

router.post(
    '/',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res, next) => {
        req.session.save(err => {
            if (err) {
                res.view('login', {
                    site_title: 'Login',
                    errorMessage: err,
                });

                return;
            }

            res.redirect('/dashboard');
        });
    },
);

module.exports = router;
