/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// const roleModel = require('../models/rolesModel');
const mongoose = require('mongoose');
var func = require('../helpers/functions');
const config = require('../../../config/database');
const connMas = require('../../../config/connection');
const connTen = require('../../../config/connectionTenant');
connMas.connectionMasterCompany();
connMas.connectionMasterBranch();
connMas.connectionMasterUser();
connMas.connectionMasterRole();
connMas.connectionMasterResource();
connMas.connectionMasterPermission();

function subscriptions(req, res, next) {
    var currentUser = func.getCurrentUser(req.headers)
    if (currentUser) {
        var email = currentUser.email
        if (email) {
            connMas.UserMaster.findOne({email: email})
                .populate('company', ['-updatedAt', '-dbUsername', '-dbPassword', '-dbPort', '-dbHost', '-createdBy', '-__v'], connMas.CompanyMaster)
                .populate('branch', ['-company', '-updatedAt', '-createdBy', '-__v'], connMas.BranchMaster)
                .populate('role', ['-resource_permissions', '-company', '-createdBy', '-updatedAt', '-__v'], connMas.RoleMaster)
                .exec(function (err, user) {
                        // console.log(user)
                        if (err)
                            throw err;
                        if (user) {
                            var currentDate = new Date();
                            if (user.company && user.company !== null && user.company.active === false)
                                res.json({
                                    success: false,
                                    statusCode: 401,
                                    message: "Your company account has been deactivated. Please contact administrator",
                                    data: {}
                                });
                            else if (user.branch && user.branch !== null && user.branch.active === false)
                                res.json({
                                    success: false,
                                    statusCode: 401,
                                    message: "Your branch account has been deactivated. Please contact administrator",
                                    data: {}
                                });
                            else if (user.branch && user.branch !== null && (user.branch.accountExpiryDate === null || user.branch.accountExpiryDate < currentDate))
                                res.json({
                                    success: false,
                                    statusCode: 401,
                                    message: "Your branch account has been expired. Please contact administrator",
                                    data: {}
                                });
                            else if (user && user.active === false)
                                res.json({
                                    success: false,
                                    statusCode: 401,
                                    message: "Your account has been deactivated. Please contact administrator",
                                    data: {}
                                });
                            else if (user.role && user.role !== null && user.role.name !== 'companyadmin' && user.role.name !== 'superadmin' && user.company.dbName) {
                                if (user.branch.accountPlan == 'custom') {
                                    let db = config.databaseUrl + '/' + user.company.dbName
                                    let params = {};
                                    mongoose.connect(db, config.databaseOptions)
                                    var prefix = user.branch.prefix
                                    var start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                    params['start'] = start
                                    params['end'] = currentDate
                                    var query = func.getVisitorTotalMonthlyQueryCondition(user, params);
                                    connTen.tenantVisitorModel(prefix);
                                    connTen.visitorModel.countDocuments(query).exec(function (err, totalVisitors) {
                                        if (totalVisitors >= user.branch.customPlanValue) {
                                            res.json({
                                                success: false,
                                                statusCode: 401,
                                                message: "Your monthly quota exceeded, please contact administrator",
                                                data: {}
                                            });
                                        } else
                                            next()
                                    });
                                } else
                                    next()
                            } else
                                next()
                        } else
                            next()
                    }
                );
        } else
            next()
    } else
        next()
}

exports.subscriptions = subscriptions;
