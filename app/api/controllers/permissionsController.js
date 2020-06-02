const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const permissionService = require('../services/permissions/permissionService');

router.get('/', auth.isAuthenticated, permissionService.getAll);
router.post('/', auth.isAuthenticated, permissionService.create);
router.get('/:permissionId', auth.isAuthenticated, permissionService.getById);
router.put('/:permissionId', auth.isAuthenticated, permissionService.updateById);
router.delete('/:permissionId', auth.isAuthenticated, permissionService.deleteById);

module.exports = router;