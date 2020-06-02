/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
 
router.get('/testing2', function(req, res, next) {
  res.send('Hello v2.0 GET API from testing2.com');
});

module.exports = router;