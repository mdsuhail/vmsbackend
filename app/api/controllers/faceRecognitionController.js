const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const faceRecognitionService = require('../services/faceRecognition/faceRecognitionService');

router.post('/add', auth.isAuthenticated, faceRecognitionService.addFace);
router.post('/recognize', auth.isAuthenticated, faceRecognitionService.recognize);

module.exports = router;