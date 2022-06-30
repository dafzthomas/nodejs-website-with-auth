const ObjectId = require('mongodb').ObjectId;

const _data = require('../lib/data');
const models = require('../lib/models');
const email = require('../lib/email');

const UserController = {};

UserController.runNewUserCommands = async function (userEmail) {};

UserController.getRawUser = async function (userId) {
    const isEmail = models.validate.userEmail(userId);

    let userData;

    try {
        if (isEmail) {
            userData = await _data.read('users', { email: userId });
        } else {
            userData = await _data.read('users', { _id: new ObjectId(userId) });
        }

        return userData;
    } catch (error) {
        return false;
    }
};

UserController.updateUser = async function (userId, data) {
    const userData = await UserController.getRawUser(userId);

    userData.receiveEmails = data.receiveEmails;

    try {
        await _data.update('users', userId, userData);
    } catch (error) {
        return false;
    }
};

UserController.deleteUser = async function (userId) {
    const userObj = await UserController.getRawUser(userId);

    try {
        if (userObj.checks.length > 0) {
            await _data.deleteMany('checks', {
                _id: {
                    $in: userObj.checks,
                },
            });

            await _data.deleteMany('checksHistory', {
                checkId: {
                    $in: userObj.checks,
                },
            });
        }

        await _data.delete('users', userObj._id.toString());

        return;
    } catch (error) {
        console.error(error);
    }
};

module.exports = UserController;
