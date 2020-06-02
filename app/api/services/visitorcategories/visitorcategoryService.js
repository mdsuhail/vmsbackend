/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const fs = require('fs');
const companyModel = require('../../models/companiesModel');
const employeeModel = require('../../models/employeesModel');
const connMas = require('../../../../config/connection');
connMas.connectionMasterCompany();

const connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');

module.exports = {
    create: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorCategoryModel(prefix);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name is required!!!", data: {}});
            return;
        }
        if (req.body.image && req.body.image !== null) {
            let base64String = req.body.image;
            let base64Image = base64String.split(';base64,').pop(); //image to be store
            let compName = func.getNameWithSeparator(currentUser.company.name);  // separate company folder name
            let compFolderPath = "storage/visitorcategories/" + '/' + compName;
            let imageName = Math.random().toString(36).substring(2, 12);
            var imagePath = compFolderPath + '/' + imageName + ".jpeg";
            if (!fs.existsSync(compFolderPath)) {
                fs.mkdirSync(compFolderPath);
            }
            fs.writeFile(imagePath, base64Image, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['backgroundImagePath'] = imagePath;
        }
        delete req.body.image;
        var data = {
            name: req.body.name,
            backgroundImagePath: req.body.backgroundImagePath ? req.body.backgroundImagePath : '',
            createdBy: currentUser._id,
            active: req.body.active ? req.body.active : '',
        };
        connTen.visitorCategoryModel.create(data, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: result});
        });
    },
    getById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorCategoryModel(prefix);
        connTen.visitorCategoryModel.findById(req.params.visitorcategoryId).select(['-updatedAt', '-createdBy', '-__v']).exec(function (err, visitorCategory) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {visitorCategory: visitorCategory}});
            }
        });
    },
    getAll: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorCategoryModel(prefix);
        connTen.visitorCategoryModel.find({}).select(['-updatedAt', '-createdBy', '-__v']).sort({_id: -1}).exec(function (err, visitorCategories) {
            if (err) {
                next(err);
            } else if (!visitorCategories.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {visitorCategories: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {visitorCategories: visitorCategories}});
            }
        });
    },
    updateById: function (req, res, next) {
        var currentUser = req.user;
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorCategoryModel(prefix);
        if (!req.body.name) {
            res.json({success: false, statusCode: res.statusCode, message: "Name required!!!", data: {}});
            return;
        }
        if (req.body.image && req.body.image !== null) {
            let base64String = req.body.image;
            let base64Image = base64String.split(';base64,').pop(); //image to be store
            if (req.body.backgroundImagePath && req.body.backgroundImagePath !== null && fs.existsSync(req.body.backgroundImagePath))
                fs.unlinkSync(req.body.backgroundImagePath)

            let compName = func.getNameWithSeparator(currentUser.company.name);  // separate company folder name
            let compFolderPath = "storage/visitorcategories/" + '/' + compName;
            let imageName = Math.random().toString(36).substring(2, 12);
            var imagePath = compFolderPath + '/' + imageName + ".jpeg";
            if (!fs.existsSync(compFolderPath)) {
                fs.mkdirSync(compFolderPath);
            }
            fs.writeFile(imagePath, base64Image, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['backgroundImagePath'] = imagePath;
        }
        var data = {
            name: req.body.name,
            backgroundImagePath: req.body.backgroundImagePath ? req.body.backgroundImagePath : '',
            active: req.body.active
        };
        var id = req.params.visitorcategoryId;
        connTen.visitorCategoryModel.patchUpdate({_id: id}, data, [], '', function (err, visitorCategy) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {visitorCategy: visitorCategy}});
            }
        });
    },
    deleteById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorCategoryModel(prefix);
        connTen.visitorCategoryModel.findByIdAndRemove(req.params.visitorcategoryId, function (err, visitorCategory) {
            if (err)
                next(err);
            else {
                if (visitorCategory.backgroundImagePath && visitorCategory.backgroundImagePath !== null && fs.existsSync(visitorCategory.backgroundImagePath))
                    fs.unlinkSync(visitorCategory.backgroundImagePath)
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: {}});
            }
        });
    }
}