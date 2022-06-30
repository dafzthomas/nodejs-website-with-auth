const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
    await req.logout();

    res.redirect('/login');
});

module.exports = router;
