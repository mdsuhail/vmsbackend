const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const dashboardService = require('../services/dashboard/dashboardService');

router.get('/', auth.isAuthenticated, dashboardService.getData);
router.get('/graph/signin', auth.isAuthenticated, dashboardService.graphSignin);
router.get('/graph/signout', auth.isAuthenticated, dashboardService.graphSignout);

module.exports = router;