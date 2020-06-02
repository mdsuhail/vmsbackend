/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');

//const visitorModel = require('../../models/visitorsModel');
//const companyModel = require('../../models/companiesModel');
//const departmentModel = require('../../models/departmentsModel');
//const employeeModel = require('../../models/employeesModel');

const connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');
var graph = require('../../helpers/graph');
module.exports = {
    getData: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantVisitorModel(prefix);
        Promise.all([
            connTen.visitorModel.countDocuments(func.getQueryCondition(currentUser)),
            connTen.visitorModel.countDocuments(func.visitorsSigninQuery(currentUser)),
            connTen.visitorModel.countDocuments(func.visitorsSignoutQuery(currentUser)),
            connTen.departmentModel.countDocuments(func.getQueryCondition(currentUser)),
            connTen.employeeModel.countDocuments(func.getQueryCondition(currentUser)),
        ]).then(([totalVisitors, totalSigninVisitors, totalSignoutVisitors, totalDepartments, totalEmployees ]) => {
            res.json({
                success: true,
                statusCode: res.statusCode,
                message: "Data found!!!",
                data: {
                    counterData: {
                        totalVisitors: totalVisitors,
                        totalSigninVisitors: totalSigninVisitors,
                        totalSignoutVisitors: totalSignoutVisitors,
                        totalDepartments: totalDepartments,
                        totalEmployees: totalEmployees
                    }
                }
            });
        });
    },
    graphSignin: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        var filter = req.query;
        if (filter.start && filter.end) {
            var signinQuery = graph.getSigninQueryForDate(currentUser, filter.start, filter.end);
        } else {
            var signinQuery = graph.getSigninQueryForHour(currentUser);
        }
        connTen.visitorModel.aggregate([
            {
                $match: {
                    "$and": [
                        signinQuery.match
                    ]
                }
            },
            {
                $project:
                        signinQuery.project
            },
            {
                "$group": {
                    "_id": signinQuery.group,
                    total: {$sum: 1}
                }
            },
            // Sort result by createdAt asc
            {
                $sort:
                        {"_id": 1}
            },
        ]).exec(function (err, signInVisitorsData) {
            if (err) {
                next(err);
            } else {
                var signInVisitors = {};
                signInVisitors['data'] = signInVisitorsData;
                if (filter.start && filter.end) {
                    var graphLevelsData = graph.mapFilterDate(signInVisitorsData);
                    signInVisitors['graphData'] = graphLevelsData['graphData'];
                    signInVisitors['graphLabels'] = graphLevelsData['graphLabel'];
                    signInVisitors['graphBackground'] = graph.graphBackgroundSignin(signInVisitors['graphData'].length);
                } else {
                    signInVisitors['graphData'] = graph.mapHour(signInVisitorsData);
                    signInVisitors['graphLabels'] = graph.mapHourLabels();
                    signInVisitors['graphBackground'] = graph.graphBackgroundSignin(signInVisitors['graphData'].length);
                }
                signInVisitors['low'] = Math.min.apply(null, signInVisitors['graphData']);
                signInVisitors['high'] = Math.max.apply(null, signInVisitors['graphData']);
            }
            res.json({
                success: true,
                statusCode: res.statusCode,
                message: "Data found!!!",
                data: {
                    signInVisitors: signInVisitors
                }
            });
        });
    },
    graphSignout: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        var filter = req.query;
        if (filter.start && filter.end) {
            var signoutQuery = graph.getSignoutQueryForDate(currentUser, filter.start, filter.end);
        } else {
            var signoutQuery = graph.getSignoutQueryForHour(currentUser);
        }
        connTen.visitorModel.aggregate([
            {
                $match: {
                    "$and": [
                        signoutQuery.match
                    ]
                }
            },
            {
                $project:
                        signoutQuery.project
            },
            {
                "$group": {
                    "_id": signoutQuery.group,
                    total: {$sum: 1}
                }
            },
            // Sort result by createdAt asc
            {
                $sort:
                        {"_id": 1}
            },
        ]).exec(function (err, signOutVisitorsData) {
            if (err) {
                next(err);
            } else {
                var signOutVisitors = {};
                signOutVisitors['data'] = signOutVisitorsData;
                if (filter.start && filter.end) {
                    var graphLevelsData = graph.mapFilterDate(signOutVisitorsData);
                    signOutVisitors['graphData'] = graphLevelsData['graphData'];
                    signOutVisitors['graphLabels'] = graphLevelsData['graphLabel'];
                    signOutVisitors['graphBackground'] = graph.graphBackgroundSignout(signOutVisitors['graphData'].length);
                } else {
                    signOutVisitors['graphData'] = graph.mapHour(signOutVisitorsData);
                    signOutVisitors['graphLabels'] = graph.mapHourLabels();
                    signOutVisitors['graphBackground'] = graph.graphBackgroundSignout(signOutVisitors['graphData'].length);
                }
                signOutVisitors['low'] = Math.min.apply(null, signOutVisitors['graphData']);
                signOutVisitors['high'] = Math.max.apply(null, signOutVisitors['graphData']);
            }
            res.json({
                success: true,
                statusCode: res.statusCode,
                message: "Data found!!!",
                data: {
                    signOutVisitors: signOutVisitors
                }
            });
        });
    }
}