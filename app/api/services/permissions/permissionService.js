/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Company: TechNEXA Technologies Private Limited
 * Author: Suhail Siddiqui
 * 
 */

//const PermissionModel = require('../../models/permissionsModel');
var func = require('../../helpers/functions');
const connMas = require('../../../../config/connection');
connMas.connectionMasterPermission();
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
            resource: req.body.resource,
            //company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.PermissionMaster.create(data, function (err, permission) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {permission: permission}});
        });
    },
    getById: function (req, res, next) {
        connMas.PermissionMaster.findById(req.params.permissionId).populate('resource').exec(function (err, permission) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {permission: permission}});
            }
        });
    },
    getAll: function (req, res, next) {
        connMas.PermissionMaster.find({}).populate('resource', ['name', 'displayName']).exec(function (err, permissions) {
            if (err) {
                next(err);
            } else if (!permissions.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {permissions: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {permissions: permissions}});
            }
        });
    },
    updateById: function (req, res, next) {
        var currentUser = func.getCurrentUserNew();
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
            resource: req.body.resource,
            //company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.PermissionMaster.findByIdAndUpdate(req.params.permissionId, data, function (err, permission) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {permission: permission}});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.PermissionMaster.findByIdAndRemove(req.params.permissionId, function (err, permission) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    }
}