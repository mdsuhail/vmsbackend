const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const visitorcategoryService = require('../services/visitorcategories/visitorcategoryService');

router.get('/', auth.isAuthenticated, visitorcategoryService.getAll);
router.post('/', auth.isAuthenticated, visitorcategoryService.create);
router.get('/profile/:visitorcategoryId', auth.isAuthenticated, visitorcategoryService.getById);
router.put('/profile/:visitorcategoryId', auth.isAuthenticated, visitorcategoryService.updateById);
router.delete('/delete/:visitorcategoryId', auth.isAuthenticated, visitorcategoryService.deleteById);

module.exports = router;