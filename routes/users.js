const express = require('express');
const router = express.Router();

const { loginUser, createNewUser } = require('../managers/userManager');

router.post('/login', (req, res) => {
    return loginUser(req, res);
});

router.post('/create', (req, res) => {
    return createNewUser(req, res);
});

module.exports = router;
