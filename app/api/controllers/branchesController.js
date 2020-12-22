const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const branchService = require('../services/branches/branchesService');

router.get('/', auth.isAuthenticated, branchService.getAll);
router.get('/:companyId/company', auth.isAuthenticated, branchService.getByCompanyId);
router.post('/', auth.isAuthenticated, branchService.create);
router.get('/profile/:branchId', auth.isAuthenticated, branchService.getById);
//router.get('/:branchId/employees', auth.isAuthenticated, branchService.getCompanyEmployeesById);
router.put('/profile/:branchId', auth.isAuthenticated, branchService.updateById);
router.delete('/delete/:branchId', auth.isAuthenticated, branchService.deleteById);
router.get('/:companyId/company/employee/validation', branchService.getByCompanyIdForEmployeeValidation);

module.exports = router;