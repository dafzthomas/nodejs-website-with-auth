const express = require('express');
const passport = require('passport');

const router = express.Router();

const _data = require('../lib/data');
const models = require('../lib/models');
const UserController = require('../controllers/user.controller');

router.put('/', passport.authenticate('local'), async (req, res, next) => {
    try {
        await UserController.updateUser(req.user._id, data.payload);

        res.status(200);
    } catch (e) {
        console.error(e);

        res.status(500);
    }
});

router.delete('/', passport.authenticate('local'), async (req, res, next) => {
    var userData = req.user;

    try {
        await _data.delete('users', userData._id.toString());
    } catch (e) {
        res.status(500).jsonp({
            errorMessage: 'Could not delete user',
        });

        return;
    }

    const userChecks = models.validate.userChecks(userData.checks);
    const checksToDelete = userChecks.length;

    if (checksToDelete < 1) {
        res.status(200);

        return;
    }

    let deletionErrors = false;

    for (check in userChecks) {
        try {
            await _data.delete('checks', check._id.toString());
        } catch (e) {
            deletionErrors = true;
        }
    }

    if (deletionErrors) {
        res.status(500).jsonp({
            errorMessage:
                'Errors encountered while attempting to delete all the users checks all checks may not have deleted from the system successfully',
        });

        return;
    }

    res.status(200);
});

module.exports = router;
