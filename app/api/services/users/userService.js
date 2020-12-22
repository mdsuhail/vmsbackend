/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Company: TechNEXA Technologies Private Limited
 * Author: Suhail Siddiqui
 * 
 */
const mongoose = require('mongoose');
const objId = new mongoose.Types.ObjectId();
const ObjectId = mongoose.Types.ObjectId;
var func = require('../../helpers/functions');
const config = require('../../../../config/database');
const connMas = require('../../../../config/connection');
connMas.connectionMasterCompany();
connMas.connectionMasterBranch();
connMas.connectionMasterUser();
connMas.connectionMasterResource();
connMas.connectionMasterRole();
connMas.connectionMasterPermission();

//const userModel = require('../../models/user');
//const roleModel = require('../../models/rolesModel');
//const Role = require('../../models/tenant/roleInitialData');
//const connTen = require('../../../../config/connectionTenant');
//const tenUserSchema = require('../../models/tenant/user');
//const tenRoleSchema = require('../../models/tenant/rolesModel');
//var tenUser = connTenant.model('User', tenUserSchema);

module.exports = {
    register: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var errorMessage = '';
        if (!req.body.firstname) {
            errorMessage = 'Please enter firstname';
        }
        if (!req.body.lastname) {
            errorMessage = 'Please enter lastname';
        }
        if (req.body.role !== 'employee' && (!req.body.email || !req.body.password)) {
            errorMessage = 'Please enter email and password';
        }
        if (req.body.role !== 'employee' && (req.body.password !== req.body.confirmPassword)) {
            errorMessage = 'Password and confirm password mismatch';
        }
        if (errorMessage) {
            res.json({success: false, statusCode: res.statusCode, message: errorMessage, data: {}});
            return;
        } else {
            if (req.body.role === 'employee')
                var role = '5f69dc8518511e2a94452ac6'
            else
                var role = req.body.role;
            var data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                active: req.body.active,
                role: role,
                provider: req.body.provider ? req.body.provider : 'web',
                branch: req.body.branch && req.body.branch !== null ? req.body.branch : objId,
                company: req.body.company ? req.body.company : objId,
                createdBy: currentUser ? currentUser._id : objId
            }
            if (req.body.role === 'employee')
                data['_id'] = req.body._id;
            var newUser = new connMas.UserMaster(data);

            // save the user
            newUser.save(function (err) {
                if (err) {
                    res.json({success: false, statusCode: res.statusCode, message: 'Email already exists.', data: {}});
                    return;
                }
                res.json({success: true, statusCode: res.statusCode, message: 'Registered successfully', data: {}});
            });
        }
    },
    getAll: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var query = func.getUserQueryCondition(currentUser);
        connMas.UserMaster.find(query).select(['-password', '-createdBy', '-updatedAt', '-__v'])
            .populate('company', ['name', 'email', 'contact'], connMas.CompanyMaster)
            .populate('branch', ['name', 'email', 'contact'], connMas.BranchMaster)
            .populate('role', ['name', 'displayName', 'description'], connMas.RoleMaster)
            .sort({_id: -1})
            .exec(function (err, users) {
                if (err) {
                    next(err);
                } else if (!users.length) {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "No record found",
                        data: {users: []}
                    });
                } else {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "Record found!!!",
                        data: {users: users}
                    });
                }
            });
    },
    getById: function (req, res, next) {
        connMas.UserMaster.findById(req.params.userId).select("-password").select(["-createdAt", "-updatedAt", "-__v"])
            .populate('company', ['-updatedAt', '-dbUsername', '-dbPassword', '-dbPort', '-dbHost', '-createdBy', '-__v'], connMas.CompanyMaster)
            .populate('branch', ['-updatedAt', '-createdBy', '-__v'], connMas.BranchMaster)
            .populate(
                {
                    path: 'role',
                    model: connMas.RoleMaster,
                    select: ["-company", "-createdBy", "-updatedAt", "-__v"],
                    populate: [
                        {
                            path: 'resource_permissions.resource',
                            model: connMas.ResourceMaster,
                            select: ["-company", "-createdBy", "-updatedAt", "-__v"]
                        },
                        {
                            path: 'resource_permissions.permissions',
                            model: connMas.PermissionMaster,
                            select: ["-resource", "-company", "-createdBy", "-updatedAt", "-__v"]
                        }
                    ]
                }
            )
            .exec(function (err, user) {
                if (err)
                    throw err;
                if (!user) {
                    res.json({success: false, statusCode: res.statusCode, message: 'Not found.', data: {}});
                } else {
                    user = JSON.parse(JSON.stringify(user));
                    var resources = [];
                    var company = user.company && user.company !== null ? user.company : {};
                    var branch = user.branch && user.branch !== null ? user.branch : {};
                    var role = user.role ? user.role : {};
                    var userResourcePermissions = role ? role.resource_permissions : {};
                    if (company['dbName'])
                        company['collectionName'] = company['dbName'] ? company['dbName'] : ''
                    delete company['dbName']
                    if (userResourcePermissions) {
                        userResourcePermissions.forEach((resourcePermissions, key) => {
                            if (role.name != 'superadmin' && resourcePermissions.resource.name == 'companies')
                                return
                            if (role.name == 'superadmin' && (resourcePermissions.resource.name === 'dashboard'))
                                return
                            resources[(resourcePermissions.resource.position) - 1] = resourcePermissions['resource'];
                        })
                    }
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "User Found",
                        data: {
                            user: {
                                _id: user._id,
                                email: user.email,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                active: user.active,
                                createdAt: user.createdAt
                            },
                            company: company,
                            branch: branch,
                            role: {
                                _id: role._id,
                                name: role.name,
                                displayName: role.displayName,
                                active: role.active,
                                default: role.default,
                                createdAt: user.role ? user.role.createdAt : ''
                            },
                            resources: resources,
                            resourcePermissions: userResourcePermissions
                        }
                    });
                }
            });
    },
    getByEmail: function (req, res, next) {
        connMas.UserMaster.findOne({"email": req.params.userEmail}).select("-password").select(["-createdAt", "-updatedAt", "-__v"])
            .exec(function (err, user) {
                if (err)
                    throw err;
                if (!user) {
                    res.json({success: false, statusCode: res.statusCode, message: 'Not found.', data: {}});
                } else {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "User Found",
                        data: {
                            user: {
                                _id: user._id,
                                email: user.email,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                active: user.active,
                                createdAt: user.createdAt
                            }
                        }
                    });
                }
            });
    },
    updateById: function (req, res, next) {
        var data = {
            company: req.body.company,
            branch: req.body.branch && req.body.branch !== null ? req.body.branch : objId,
            role: req.body.role,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            active: req.body.active
        }
        if (req.body.password && req.body.password !== null)
            data.password = req.body.password;
        connMas.UserMaster.findByIdAndUpdate(req.params.userId, data, function (err, user) {
            //connMas.UserMaster.patchUpdate({"_id": ObjectId(id)}, data, [], '', function (err, userInfo) {
            if (err)
                next(err);
            else {
                if (req.body.password && req.body.password !== null) {
                    user.password = req.body.password;
                    user.save(function (err, user) {
                        if (err) {
                            res.json({
                                success: false,
                                statusCode: res.statusCode,
                                message: "Some problem occured. Try again!!!",
                                data: null
                            });
                        } else {
                            res.json({
                                success: true,
                                statusCode: res.statusCode,
                                message: "Saved successfully!!!",
                                data: null
                            });
                        }
                    });
                } else
                    res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: null});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.UserMaster.findByIdAndRemove(req.params.userId, function (err, userInfo) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    }
}
