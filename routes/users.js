const express = require('express');
const router = express.Router();

const { getAllUsers, loginUser } = require('../managers/userManager');

router.get('/', (req, res) => {
    return getAllUsers(req, res);
});

router.post('/login', (req, res) => {
    return loginUser(req, res);
});

module.exports = router;
