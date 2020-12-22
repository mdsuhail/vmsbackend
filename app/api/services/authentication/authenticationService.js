/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//const userModel = require('../../models/user');
//const roleModel = require('../../models/rolesModel');
//var bcrypt = require('bcrypt-nodejs');

var jwt = require('jsonwebtoken');
var config = require('../../../../config/database');
const connMas = require('../../../../config/connection');
connMas.connectionMasterCompany();
connMas.connectionMasterBranch();
connMas.connectionMasterUser();
connMas.connectionMasterResource();
connMas.connectionMasterPermission();
module.exports = {
    login: function (req, res) {
        connMas.UserMaster.findOne({email: req.body.email})
                .populate('company', ['-updatedAt', '-dbUsername', '-dbPassword', '-dbPort', '-dbHost', '-createdBy', '-__v'], connMas.CompanyMaster)
                .populate('branch', ['-company', '-updatedAt', '-createdBy', '-__v'], connMas.BranchMaster)
                .populate('role', ['-resource_permissions', '-company', '-createdBy', '-updatedAt', '-__v'], connMas.RoleMaster)
                .exec(function (err, user) {
                    if (err)
                        throw err;
                    if (!user) {
                        res.json({success: false, statusCode: res.statusCode, message: 'Authentication failed. User not found.', data: {}});
                    } else {
                        // check if password matches
                        user.comparePassword(req.body.password, function (err, isMatch) {
                            if (isMatch && !err) {
                                // if user is found and password is right create a token
                                var userData = user.toJSON();
                                delete userData.password;
                                var currentDate = new Date();
                                //res.cookie("auth_token", token);
                                if (user.role && user.role !== null && (user.role.name === 'companyadmin' || user.role.name === 'superadmin') && req.body.loginFrom && req.body.loginFrom !== null && req.body.loginFrom === 'visitorapp')
                                    res.json({success: false, statusCode: res.statusCode, message: "You must login from branch user", data: {}});
                                else if (user.company && user.company !== null && user.company.active === false)
                                    res.json({success: false, statusCode: res.statusCode, message: "Your company account has been deactivated. Please conatact administrator", data: {}});
                                else if (user.branch && user.branch !== null && user.branch.active === false)
                                    res.json({success: false, statusCode: res.statusCode, message: "Your branch account has been deactivated. Please conatact administrator", data: {}});
                                else if (user.branch && user.branch !== null && (user.branch.accountExpiryDate === null || user.branch.accountExpiryDate < currentDate))
                                    res.json({success: false, statusCode: res.statusCode, message: "Your branch account has been expired. Please conatact administrator", data: {}});
                                else if (user && user !== null && user.active === false)
                                    res.json({success: false, statusCode: res.statusCode, message: "Your account has been deactivated. Please conatact administrator", data: {}});
                                else if (req.body.isEmployee === false && user.role.name === 'employee')
                                    res.json({success: false, statusCode: res.statusCode, message: "You must login from employee section", data: {}});
                                else {
                                    var token = jwt.sign(userData, config.secret, {});
                                    res.json({success: true, statusCode: res.statusCode, message: "Login Successfully", data: {token: token, user: {_id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, active: user.active, createdAt: user.createdAt, updatedAt: user.updatedAt}}});
                                }
                            } else {
                                res.json({success: false, statusCode: res.statusCode, message: 'Authentication failed. Wrong password.', data: {}});
                            }
                        });
                    }
                });
    },
    loginGoogle: function (req, res) {
        connMas.UserMaster.findOne({email: req.body.email})
                .populate('company', ['-updatedAt', '-dbUsername', '-dbPassword', '-dbPort', '-dbHost', '-createdBy', '-__v'], connMas.CompanyMaster)
                .populate('branch', ['-company', '-updatedAt', '-createdBy', '-__v'], connMas.BranchMaster)
                .populate('role', ['-resource_permissions', '-company', '-createdBy', '-updatedAt', '-__v'], connMas.RoleMaster)
                .exec(function (err, user) {
                    if (err)
                        throw err;
                    if (!user) {
                        res.json({success: false, statusCode: res.statusCode, message: 'Authentication failed. User not found.', data: {}});
                    } else {
                        // if user is found is right create a token
                        var userData = user.toJSON();
                        delete userData.password;
                        var currentDate = new Date();
                        //res.cookie("auth_token", token);
                        if (user.role && user.role !== null && (user.role.name === 'companyadmin' || user.role.name === 'superadmin') && req.body.loginFrom && req.body.loginFrom !== null && req.body.loginFrom === 'visitorapp')
                            res.json({success: false, statusCode: res.statusCode, message: "You must login from branch user", data: {}});
                        else if (user.company && user.company !== null && user.company.active === false)
                            res.json({success: false, statusCode: res.statusCode, message: "Your company account has been deactivated. Please conatact administrator", data: {}});
                        else if (user.branch && user.branch !== null && user.branch.active === false)
                            res.json({success: false, statusCode: res.statusCode, message: "Your branch account has been deactivated. Please conatact administrator", data: {}});
                        else if (user.branch && user.branch !== null && (user.branch.accountExpiryDate === null || user.branch.accountExpiryDate < currentDate))
                            res.json({success: false, statusCode: res.statusCode, message: "Your branch account has been expired. Please conatact administrator", data: {}});
                        else if (user && user !== null && user.active === false)
                            res.json({success: false, statusCode: res.statusCode, message: "Your account has been deactivated. Please conatact administrator", data: {}});
                        else if (req.body.isEmployee === false && user.role.name === 'employee')
                            res.json({success: false, statusCode: res.statusCode, message: "You must login from employee section", data: {}});
                        else {
                            var token = jwt.sign(userData, config.secret, {});
                            res.json({success: true, statusCode: res.statusCode, message: "Login Successfully", data: {token: token, user: {_id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, active: user.active, createdAt: user.createdAt, updatedAt: user.updatedAt}}});
                        }
                    }
                });
    }
}
