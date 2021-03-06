const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const employeeService = require('../services/employees/employeeService');

router.get('/', auth.isAuthenticated, employeeService.getAll);
router.post('/', auth.isAuthenticated, employeeService.create);
router.post('/import', auth.isAuthenticated, employeeService.createImport);
router.get('/profile/:employeeId', auth.isAuthenticated, employeeService.getById);
router.get('/profile/email/:employeeEmail', auth.isAuthenticated, employeeService.getByEmail);
router.get('/:departmentId/department', auth.isAuthenticated, employeeService.getByDepartmentId);
router.put('/profile/:employeeId', auth.isAuthenticated, employeeService.updateById);
router.delete('/delete/:employeeId', auth.isAuthenticated, employeeService.deleteById);
router.get('/validation', employeeService.getBranchEmployeeValidation);
router.put('/validation/status/update', employeeService.updateVerificationStatus);

//for visitors only
router.get('/visitor/:companyId', auth.isAuthenticated, employeeService.getEmployeesForVisitor);

module.exports = router;
