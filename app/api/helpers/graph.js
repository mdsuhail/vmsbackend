/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var config = require("../../../config/constant");
var moment = require('moment');
var jwt = require('jsonwebtoken');
module.exports.getSigninQueryForHour = function (user) {
    var signInQuery = {};
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    var match = {"signOut": "", createdAt: {$gte: start, $lt: end}};
//    if (user.role.name !== 'superadmin') {
//        match = {"signOut": "", company: ObjectId(user.company._id), createdAt: {$gte: start, $lt: end}};
//    }
    signInQuery.match = match;
    signInQuery.project = {"h": {"$hour": "$createdAt"}};
    signInQuery.group = "$h";
    return signInQuery;
}
module.exports.getSignoutQueryForHour = function (user) {
    var signOutQuery = {};
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    var match = {"signOut": {$ne: ""}, createdAt: {$gte: start, $lt: end}};
//    if (user.role.name !== 'superadmin') {
//        match = {"signOut": {$ne: ""}, company: ObjectId(user.company._id), createdAt: {$gte: start, $lt: end}};
//    }
    signOutQuery.match = match;
    signOutQuery.project = {"h": {"$hour": "$createdAt"}};
    signOutQuery.group = "$h";
    return signOutQuery;
}
module.exports.getSigninQueryForDate = function (user, start, end) {
    var signInQuery = {};
    start = new Date(start);
    end = new Date(end);
    var match = {"signOut": "", "createdAt": {$gte: start, $lt: end}};
//    if (user.role.name !== 'superadmin') {
//        match = {"signOut": "", "company": ObjectId(user.company._id), "createdAt": {$gte: start, $lt: end}};
//    }
    signInQuery.match = match;
    signInQuery.project = {
        createdAt:
                {
                    $dateToString:
                            {format: "%d-%m-%Y", date: "$createdAt"}
                }
    };
    signInQuery.group = "$createdAt";
    return signInQuery;
}
module.exports.getSignoutQueryForDate = function (user, start, end) {
    var signOutQuery = {};
    start = new Date(start);
    end = new Date(end);
    var match = {"signOut": {$ne: ""}, "createdAt": {$gte: start, $lt: end}};
//    if (user.role.name !== 'superadmin') {
//        match = {"signOut": {$ne: ""}, "company": ObjectId(user.company._id), "createdAt": {$gte: start, $lt: end}};
//    }
    signOutQuery.match = match;
    signOutQuery.project = {
        createdAt:
                {
                    $dateToString:
                            {format: "%d-%m-%Y", date: "$createdAt"}
                }
    };
    signOutQuery.group = "$createdAt";
    return signOutQuery;
}
module.exports.mapFilterDate = function (datas = []) {
    var result = [];
    var graphData = [];
    var graphLabel = [];
    datas.forEach((data, key) => {
        graphData[key] = data.total;
        graphLabel[key] = data._id;
    })
    result['graphData'] = graphData;
    result['graphLabel'] = graphLabel;
    return result;
}
module.exports.mapHour = function (datas = []) {
    var j = 1;
    var result = [];
    for (var i = 1; i <= 24; i++) {
        if (datas.length) {
            let searched = datas.find(data => data._id == i);
            if (searched) {
                result[(j + 6) % 24] = searched.total;
            } else {
                result[(j + 6) % 24] = 0;
            }
            j++;
        } else {
            result[j++] = 0;
        }
    }
    return result;
}
module.exports.mapHourLabels = function () {
    var labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    return labels;
}
module.exports.getSigninQueryForWeek = function (user) {
    var signInQuery = {};
    var start = moment().subtract(7, 'days');
    var end = new Date();
    var match = {"signOut": "", createdAt: {$gte: start._d, $lt: end}};
//    if (user.role.name !== 'superadmin') {
//        match = {"signOut": "", company: ObjectId(user.company._id), createdAt: {$gte: start, $lt: end}};
//    }
    signInQuery.match = match;
    signInQuery.project = {"d": {"$dayOfMonth": "$createdAt"}};
    signInQuery.group = "$d";
    return signInQuery;
}
module.exports.mapWeek = function (datas = []) {
    var j = 0;
    var result = [];
    for (var i = 1; i <= 7; i++) {
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
module.exports.graphBackgroundSignin = function (totalData = 0) {
    var j = 0;
    var result = [];
    for (var i = 0; i < totalData; i++) {
        result[j++] = "rgba(255,179,67,1)";
    }
    return result;
}
module.exports.graphBackgroundSignout = function (totalData = 0) {
    var j = 0;
    var result = [];
    for (var i = 0; i < totalData; i++) {
        result[j++] = "rgba(7,177,198,1)";
    }
    return result;
}
module.exports.graphBackground = function (totalData = 0) {
    var j = 0;
    var result = [];
    for (var i = 0; i < totalData; i++) {
        result[j++] = module.exports.random_rgba();
    }
    return result;
}
module.exports.random_rgba = function () {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}