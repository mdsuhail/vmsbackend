const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const resourceService = require('../services/resources/resourceService');

router.get('/', auth.isAuthenticated, resourceService.getAll);
router.post('/', auth.isAuthenticated, resourceService.create);
router.get('/:resourceId', auth.isAuthenticated, resourceService.getById);
router.put('/:resourceId', auth.isAuthenticated, resourceService.updateById);
router.delete('/:resourceId', auth.isAuthenticated, resourceService.deleteById);

module.exports = router;