const express = require('express');
const router = express.Router();

const authenticationService = require('../services/authentication/authenticationService');

//router.post('/register', authenticationService.register);
router.post('/login', authenticationService.login);

module.exports = router;