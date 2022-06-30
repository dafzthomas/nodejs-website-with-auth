const config = require('../config');

const Auth = {};

Auth.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.session.pageData = {
            user: {
                email: req.user.email,
            },
        };

        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = Auth;
