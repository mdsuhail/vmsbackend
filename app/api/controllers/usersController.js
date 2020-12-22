const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Create our Express application
var app = express();
app.use(passport.initialize());

const userService = require('../services/users/userService');

router.post('/register', userService.register);
//router.get('/', auth.isAuthenticated, authorize('user', 'read'), userService.getAll);
router.get('/', auth.isAuthenticated, userService.getAll);
router.get('/profile/:userId', auth.isAuthenticated, userService.getById);
router.get('/profile/email/:userEmail', userService.getByEmail);
router.put('/profile/:userId', auth.isAuthenticated, userService.updateById);
router.delete('/delete/:userId', auth.isAuthenticated, userService.deleteById);

module.exports = router;
