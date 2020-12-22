var express = require('express');
var router = express.Router();

const subscriptions = require('../app/api/middlewares/subscriptions');

router.use('/v1', [subscriptions.subscriptions], require('./v1'));
module.exports = router;
