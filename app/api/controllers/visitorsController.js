const express = require('express');
const router = express.Router();
var passport = require('passport');
const auth = require('../middlewares/auth');

// Create Express application
var app = express();
app.use(passport.initialize());

const visitorService = require('../services/visitors/visitorService');

router.get('/', auth.isAuthenticated, visitorService.getAll);
router.post('/', auth.isAuthenticated, visitorService.createOrUpdate);
router.post('/preapproved', auth.isAuthenticated, visitorService.createOrUpdatePreApproved);
router.post('/preapproved/checkin', auth.isAuthenticated, visitorService.preApprovedCheckin);
router.post('/avatar', auth.isAuthenticated, visitorService.profileAvatar);
router.post('/face', auth.isAuthenticated, visitorService.getByFaceData);
router.get('/profile/:visitorId', auth.isAuthenticated, visitorService.getById);
router.put('/profile/:visitorId', auth.isAuthenticated, visitorService.updateById);
router.put('/signout/:visitorId', auth.isAuthenticated, visitorService.signOut);
router.delete('/delete/:visitorId', auth.isAuthenticated, visitorService.deleteById);

//outside visitors
router.get('/detail/:contact', auth.isAuthenticated, visitorService.getByContact);
router.get('/checkedin/:contact', auth.isAuthenticated, visitorService.checkVisitorCheckedin);
router.get('/checkedout/:contact', auth.isAuthenticated, visitorService.checkVisitorCheckedout);
router.post('/save', auth.isAuthenticated, visitorService.createOrUpdate);
router.post('/signout', auth.isAuthenticated, visitorService.signOutByContact);

//public api
router.get('/detail/byid/:visitorId', visitorService.getById);
router.put('/approve/:visitorId', visitorService.approvalStatus);

module.exports = router;
