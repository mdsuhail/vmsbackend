/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Company: TechNEXA Technologies Private Limited
 * Author: Suhail Siddiqui
 * 
 */

//const roleModel = require('../../models/rolesModel');
var func = require('../../helpers/functions');
const connMas = require('../../../../config/connection');
connMas.connectionMasterRole();
module.exports = {
    create: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name is required!!!", data: {}});
            return;
        }
        var data = {
            name: req.body.name,
            displayName: req.body.displayName,
            description: req.body.description,
            default: req.body.default,
            active: req.body.active,
            permissions: req.body.permissions,
            resource_permissions: req.body.resource_permissions,
            company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.RoleMaster.create(data, function (err, role) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {role: role}});
        });
    },
    getById: function (req, res, next) {
        connMas.RoleMaster.findById(req.params.roleId).populate('resource_permissions.resource', ['name', 'displayName']).populate('resource_permissions.permissions', ['name', 'displayName']).exec(function (err, role) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {role: role}});
            }
        });
    },
    getAll: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var params = req.query;
        var query = func.getQueryConditionForRole(currentUser, params);
        connMas.RoleMaster.find(query).select(['-resource_permissions', '-description', '-company', '-createdBy', '-updatedAt', '-__v']).sort({"_id": 1}).exec(function (err, roles) {
            if (err) {
                next(err);
            } else if (!roles.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found", data: {roles: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {roles: roles}});
            }
        });
    },
    updateById: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name is required!!!", data: {}});
            return;
        }
        var data = {
            name: req.body.name,
            displayName: req.body.displayName,
            description: req.body.description,
            default: req.body.default,
            active: req.body.active,
            permissions: req.body.permissions,
            company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.RoleMaster.findOneAndUpdate(req.params.roleId, data, function (err, role) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {role: role}});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.RoleMaster.findByIdAndRemove(req.params.roleId, function (err, roleInfo) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    },
}