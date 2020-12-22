const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Create Express application
var app = express();
app.use(passport.initialize());

const companyService = require('../services/companies/companiesService');

router.get('/', [auth.isAuthenticated, authorize.authorize('companies', 'read')], companyService.getAll);
router.post('/', auth.isAuthenticated, companyService.create);
router.get('/profile/:companyId', auth.isAuthenticated, companyService.getById);
router.get('/:companyId/employees', auth.isAuthenticated, companyService.getCompanyEmployeesById);
router.put('/profile/:companyId', auth.isAuthenticated, companyService.updateById);
router.delete('/delete/:companyId', auth.isAuthenticated, companyService.deleteById);
router.post('/validate', companyService.validateDomain);

//for visitor
router.get('/detail/:companyId', companyService.getDetailById);

module.exports = router;
