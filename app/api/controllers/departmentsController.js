const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const departmentService = require('../services/departments/departmentService');

router.get('/', auth.isAuthenticated, departmentService.getAll);
router.post('/', auth.isAuthenticated, departmentService.create);
router.get('/profile/:departmentId', auth.isAuthenticated, departmentService.getById);
router.put('/profile/:departmentId', auth.isAuthenticated, departmentService.updateById);
router.delete('/delete/:departmentId', auth.isAuthenticated, departmentService.deleteById);

module.exports = router;