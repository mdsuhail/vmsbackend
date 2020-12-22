/* 
 * This is index file for project v1
 * 
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../config/passport')(passport);

var authenticationController = require('./../../app/api/controllers/authenticationController');
var resourceController = require('./../../app/api/controllers/resourcesController');
var permissionController = require('./../../app/api/controllers/permissionsController');
var roleController = require('./../../app/api/controllers/rolesController');
var dashboardController = require('./../../app/api/controllers/dashboardController');
var userController = require('./../../app/api/controllers/usersController');
var companyController = require('./../../app/api/controllers/companiesController');
var branchController = require('./../../app/api/controllers/branchesController');
var departmentController = require('./../../app/api/controllers/departmentsController');
var employeeController = require('./../../app/api/controllers/employeesController');
var visitorController = require('./../../app/api/controllers/visitorsController');
var visitorCategoryController = require('./../../app/api/controllers/visitorcategoriesController');
var otpController = require('./../../app/api/controllers/otpController');
var faceRecognitionController = require('./../../app/api/controllers/faceRecognitionController');

router.use('/authentication', authenticationController);
router.use('/resources', resourceController);
router.use('/permissions', permissionController);
router.use('/roles', roleController);
router.use('/dashboard', dashboardController);
router.use('/users', userController);
//router.use('/user', userController);
router.use('/companies', companyController);
router.use('/branches', branchController);
router.use('/departments', departmentController);
router.use('/employees', employeeController);
router.use('/visitors', visitorController);
router.use('/visitorcategories', visitorCategoryController);
router.use('/otp', otpController);
router.use('/face', faceRecognitionController);

module.exports = router;