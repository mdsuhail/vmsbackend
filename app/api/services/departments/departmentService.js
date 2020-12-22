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
//const departmentModel = require('../../models/departmentsModel');
//const departmentSchema = require('../../models/departmentsModel');
//var departmentModel = mongoose.model('Department', departmentSchema)
var connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');
module.exports = {
    getAll: function (req, res, next) {
        var currentUser = req.user;
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        var query = func.getQueryConditionWithDefault(currentUser);
        connTen.departmentModel.find(query).exec(function (err, departments) {
            if (err) {
                next(err);
            } else if (!departments.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {departments: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {departments: departments}});
            }
        });
    },
    create: function (req, res, next) {
        var currentUser = req.user;
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name required!!!", data: {}});
            return;
        }
        var data = {
            name: req.body.name,
            description: req.body.description,
            company: (req.body.company ? req.body.company : currentUser.company._id),
            default: req.body.default,
            active: req.body.active,
            createdBy: currentUser._id
        };
        connTen.departmentModel.create(data, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {}});
        });
    },
    getById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        connTen.departmentModel.findById(req.params.departmentId).exec(function (err, department) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {department: department}});
            }
        });
    },
    updateById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name required!!!", data: {}});
            return;
        }
        var data = {
            name: req.body.name,
            description: req.body.description,
            default: req.body.default,
            active: req.body.active,
        };
        var id = req.params.departmentId;
        connTen.departmentModel.patchUpdate({_id: id}, data, [], '', function (err, department) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {}});
            }
        });
    },
    deleteById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantDepartmentModel(prefix);
        connTen.departmentModel.findByIdAndRemove(req.params.departmentId, function (err, department) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    },
}