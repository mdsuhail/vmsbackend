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
//const employeeModel = require('../../models/employeesModel');

const connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');
module.exports = {
    create: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.contact) {
            let mess = '';
            if (!req.body.firstname)
                mess = 'Firstname';
            else if (!req.body.lastname)
                mess = 'Lastname';
            else if (!req.body.email)
                mess = 'Email';
            else if (!req.body.contact)
                mess = 'Contact';
            res.json({success: false, statusCode: res.statusCode, message: mess + " required!!!", data: {}});
            return;
        }
        var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            contact: req.body.contact,
            company: (req.body.company ? req.body.company : currentUser.company._id),
            department: req.body.department ? req.body.department : objId,
            active: req.body.active,
            createdBy: currentUser._id
        };
        connTen.employeeModel.create(data, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: result});
        });
    },
    createImport: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        var employees = req.body;
        employees.forEach(employee => {
            employee.company = (employee.company ? employee.company : currentUser.company._id);
            employee.department = employee.department ? employee.department : objId;
        })
        connTen.employeeModel.insertMany(employees, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Uploaded successfully!!!", data: result});
        });
    },
    updateById: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.contact) {
            let mess = '';
            if (!req.body.firstname)
                mess = 'Firstname';
            else if (!req.body.lastname)
                mess = 'Lastname';
            else if (!req.body.email)
                mess = 'Email';
            else if (!req.body.contact)
                mess = 'Contact';
            res.json({success: false, statusCode: res.statusCode, message: mess + " required!!!", data: {}});
            return;
        }
        var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            contact: req.body.contact,
            company: (req.body.company ? req.body.company : currentUser.company._id),
            department: req.body.department ? req.body.department : objId,
            active: req.body.active,
            createdAt: req.body.createdAt ? req.body.createdAt : new Date(),
        };
        var id = req.params.employeeId;
        connTen.employeeModel.findByIdAndUpdate(id, data, function (err, employee) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: null});
            }
        });
    },
    getById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantDepartmentModel(prefix);
        connTen.employeeModel.findById(req.params.employeeId).populate('department', ['name', 'description', 'default', 'active'], connTen.departmentModel).exec(function (err, employee) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {employee: employee}});
            }
        });
    },
    getAll: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantDepartmentModel(prefix);
        var query = func.getQueryCondition(currentUser);
        connTen.employeeModel.find(query).populate('department', ['name', 'description', 'default', 'active'], connTen.departmentModel).sort({"_id": -1}).exec(function (err, employees) {
            if (err) {
                next(err);
            } else if (!employees.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {employees: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {employees: employees}});
            }
        });
    },
    deleteById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        connTen.employeeModel.findByIdAndRemove(req.params.employeeId, function (err, employee) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: null});
            }
        });
    },
    getEmployeesForVisitor: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantEmployeeModel(prefix);
        var visitorEmployeeQueryCondition = func.getVisitorEmployeeQueryCondition();
        connTen.employeeModel.aggregate([
            {
                $match: {
                    "$and": [
                        visitorEmployeeQueryCondition
                    ]
                },
            },
            {$lookup: {from: 'departments', localField: 'department', foreignField: '_id', as: 'department'}},
            {
                $unwind: "$department"
            },
            {
                $project: {
                    name:
                            {
                                $concat: ["$firstname", " ", "$lastname", " - ", "$department.name"]
                            },
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    contact: 1,
                    createdAt: 1,
                    "department._id": 1,
                    "department.name": 1,
                    "department.description": 1,
                    "department.default": 1,
                    "department.active": 1,
                    "department.createdAt": 1,
                }
            },
            // Sort result by createdAt asc
            {
                $sort:
                        {"_id": 1}
            },
        ]).exec(function (err, employees) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {employees: employees}});
            }
        });
    },

}