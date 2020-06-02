const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Create Express application
var app = express();
app.use(passport.initialize());

const roleService = require('../services/roles/roleService');

router.get('/', auth.isAuthenticated, roleService.getAll);
router.post('/', auth.isAuthenticated, roleService.create);
router.get('/:roleId', auth.isAuthenticated, roleService.getById);
router.put('/:roleId', auth.isAuthenticated, roleService.updateById);
router.delete('/:roleId', auth.isAuthenticated, roleService.deleteById);

module.exports = router;