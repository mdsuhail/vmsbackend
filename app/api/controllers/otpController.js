const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const otpService = require('../services/otp/otpService');

router.post('/send', auth.isAuthenticated, otpService.send);
router.post('/verify', auth.isAuthenticated, otpService.verify);

module.exports = router;