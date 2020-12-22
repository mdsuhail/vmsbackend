/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var config = require('../../../config/database');
var jwt = require('jsonwebtoken');
var moment = require('moment'); // require

module.exports.getCurrentUser = function (headers) {
    var currentUser = null;
    if (headers && headers.authorization) {
        var authorization = headers.authorization.split(' ')[1];
        var currentUser = jwt.verify(authorization, config.secret);
    }
    return currentUser;
}
module.exports.getCurrentUserNew = function (req, res) {
    var currentUser = {};
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];
        var currentUser = jwt.verify(authorization, config.secret);
    }
    return currentUser;
}
module.exports.getUserQueryCondition = function (user) {
    var query = {};
    if (user.role.name === 'companyadmin') {
        query['company'] = ObjectId(user.company._id);
    } else if (user.role && (user.role.name === 'branchadmin' || user.role.name === 'user')) {
        query['branch'] = ObjectId(user.branch._id)
    }
    // console.log(query);
    return query;
}
module.exports.getQueryCondition = function (user, params) {
    var query = {};
    if (user) {
        if (user.role.name === 'employee')
            query['whomToMeet'] = {$eq: user._id};
    }
    if (params) {
        if (params.start && params.end) {
            var endDate = new Date(params.end);
            endDate.setHours(23, 59, 59, 999);
            query['createdAt'] = {$gte: new Date(params.start), $lt: endDate};
        } else if (params.start)
            query['createdAt'] = {$gte: new Date(params.start)};
        else if (params.end) {
            var endDate = new Date(params.end);
            endDate.setHours(23, 59, 59, 999);
            query['createdAt'] = {$lt: endDate};
        }
        if (params.type == 'signin')
            query['signOut'] = '';
        if (params.type == 'signout')
            query['signOut'] = {$ne: ''};
        if (params.employee != undefined && params.employee != '')
            query['whomToMeet'] = {$eq: params.employee};
        if (params.department != undefined && params.department != '')
            query['department'] = {$eq: params.department};
    }
    return query;
}
module.exports.getVisitorTotalMonthlyQueryCondition = function (user, params = {}) {
    var query = {};
    if (params) {
        query['createdAt'] = {$gte: new Date(params.start), $lt: new Date(params.end)};
    }
    return query;
}
module.exports.getQueryConditionWithDefault = function (user) {
    var query = {};
    //    if (user.role.name !== 'superadmin') {
    //        query = {$or: [{company: user.company._id}, {default: true}]};
    //    }
    return query;
}
module.exports.getQueryConditionForRole = function (user, params) {
    var query = {"name": {$ne: "superadmin"}};
    if (params.type === 'all')
        query = {"default": true};
    else if (user.role.name === 'superadmin') {
        //query = {$or: [{company: user.company._id}, {default: true}], 'name': {$ne: "superadmin"}};
        query = {"name": {$nin: ["superadmin"]}};
    } else if (user.role.name === 'companyadmin') {
        query = {"name": {$nin: ["superadmin"]}};
    } else if (user.role.name === 'branchadmin') {
        query = {"name": {$in: ["user", "employee"]}};
    }
    return query;
}
module.exports.visitorsSigninQuery = function (user) {
    var query = {signOut: ''};
    if (user) {
        if (user.role.name === 'employee')
            query['whomToMeet'] = {$eq: user._id};
    }
    //    if (user.role.name !== 'superadmin') {
    //        query = {company: user.company._id, signOut: ''}
    //    }
    return query;
}
module.exports.visitorsSignoutQuery = function (user) {
    var query = {signOut: {$ne: ''}};
    if (user) {
        if (user.role.name === 'employee')
            query['whomToMeet'] = {$eq: user._id};
    }
    //    if (user.role.name !== 'superadmin') {
    //        query = {company: user.company._id, signOut: {$ne: ''}}
    //    }
    return query;
}
module.exports.getSigninMatchQueryForGroup = function (user) {

    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);

    var query = {"signOut": "", createdAt: {$gte: start, $lt: end}};
    if (user.role.name !== 'superadmin') {
        //query = {"signOut": "", company: ObjectId(user.company._id), "createdAt": new Date()};
        query = {"signOut": "", "createdAt": new Date()};
    }
    return query;
}
module.exports.getVisitorEmployeeQueryCondition = function () {
    var query = {};
    //var query = {company: ObjectId(compId)};
    return query;
}
module.exports.getSignoutMatchQueryForGroup = function (user) {
    var query = {"signOut": {$ne: ""}};
    if (user.role.name !== 'superadmin') {
        //query = {"signOut": {$ne: ""}, company: ObjectId(user.company._id)};
        query = {"signOut": {$ne: ""}};
    }
    return query;
}
module.exports.logEvents = function (req, res, next) {
    var currentUser = module.exports.getCurrentUser(req.headers);
    var url = module.exports.parseUrl(req.url);
    console.log('body - ' + req.body);
    console.log('company - ' + currentUser.company._id);
    console.log('user - ' + currentUser._id);
    //console.log('role - ' + currentUser.role._id);
    console.log('method - ' + req.method);
    console.log('url - ' + req.url);
    console.log('resource - ' + url);
    console.log('httpVersion - ' + req.httpVersion);
    console.log('host - ' + req.headers.host);
    console.log('origin - ' + req.headers.origin);
    console.log('statusCode -' + res.statusCode);
    next();
}
module.exports.parseUrl = function (url) {
    return url.split('/')[1];
}
module.exports.mapMonth = function (datas = []) {
    var j = 0;
    var result = [];
    for (var i = 1; i <= 12; i++) {
        if (datas.length) {
            let searched = datas.find(data => data._id == i);
            if (searched) {
                result[j++] = searched.total;
            } else
                result[j++] = 0;
        } else {
            result[j++] = 0;
        }
    }
    return result;
}
module.exports.getCompanyDbFromEmail = function (email = '') {
    return email.substr(email.indexOf("@") + 1, email.indexOf(".") - (email.indexOf("@") + 1));
}
module.exports.getDbName = function (name = '') {
    return name.replace(/\s+/g, '').toLowerCase() + '_' + Math.random().toString(36).substring(7);
}
module.exports.getPrefix = function (name = '') {
    return name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substring(7);
}
module.exports.getNameWithSeparator = function (name = '', separator = '-') {
    return name.replace(/\s+/g, separator).toLowerCase();
}
module.exports.getCollectionPrefix = function (req, res) {
    var currentUser = req.user;
    var query = req.query;
    if (currentUser && currentUser !== null && currentUser.branch && currentUser.branch !== null)
        return currentUser.branch.prefix;
    else if (query && query.prefix !== null)
        return query.prefix;
    else
        return '';
}
module.exports.getCompanyDomain = function (req) {
    if (req.body.email && req.body.email !== '') {
        var email = req.body.email
        var domain = email.replace(/.*@/, "");
        return domain.toLowerCase()
    } else
        return ''
}
module.exports.getVisitorCheckinQueryCondition = function (user, params = {}) {
    var query = {};
    if (params) {
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        var end = new Date();
        end.setHours(23, 59, 59, 999);
        var todayDate = new Date().toISOString().split('T')[0]
        if (params.contact) {
            query = {
                'contact': {$eq: params.contact},
                'signOut': {$eq: ''},
                $or: [{'createdAt': {$gte: start, $lte: end}}, {'preApprovedDate': {$eq: todayDate}}]
            }
            // query['contact'] = {$eq: params.contact};
            // query['createdAt'] = {$gte: start, $lte: end};
            // query['preApprovedDate'] = {$or: {$gte: start, $lte: end}};
            // query['signOut'] = {$eq: ''};
        }
    }
    return query;
}
module.exports.getVisitorCheckoutQueryCondition = function (user, params = {}) {
    var query = {};
    if (params) {
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        var end = new Date();
        end.setHours(23, 59, 59, 999);
        var todayDate = new Date().toISOString().split('T')[0]
        if (params.contact) {
            query = {
                'contact': {$eq: params.contact},
                'signOut': {$eq: ''},
                $or: [{'createdAt': {$gte: start, $lte: end}}, {'preApprovedDate': {$eq: todayDate}}]
            }
            // query['contact'] = {$eq: params.contact};
            // query['createdAt'] = {$gte: start, $lte: end};
            // query['signOut'] = {$eq: ''};
        }
        ;
    }
    return query;
}
