/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Company: TechNEXA Technologies Private Limited
 * Author: Suhail Siddiqui
 * 
 */
//const resourceModel = require('../../models/resourcesModel');
var func = require('../../helpers/functions');
const connMas = require('../../../../config/connection');
connMas.connectionMasterResource();
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
            path: req.body.path,
            icon: req.body.icon,
            class: req.body.class,
            company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.ResourceMaster.create(data, function (err, resource) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {resource: resource}});
        });
    },
    getById: function (req, res, next) {
        connMas.ResourceMaster.findById(req.params.resourceId).exec(function (err, resource) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {resource: resource}});
            }
        });
    },
    getAll: function (req, res, next) {
        connMas.ResourceMaster.find({}).sort({"position": 1}).exec(function (err, resources) {
            if (err) {
                next(err);
            } else if (!resources.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found", data: {resources: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {resources: resources}});
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
            path: req.body.path,
            icon: req.body.icon,
            class: req.body.class,
            company: req.body.company ? req.body.company : currentUser.company._id,
            createdBy: currentUser._id,
        };
        connMas.ResourceMaster.findOneAndUpdate(req.params.resourceId, data, function (err, resource) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {resource: resource}});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.ResourceMaster.findByIdAndRemove(req.params.resourceId, function (err, resourceInfo) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    },
}