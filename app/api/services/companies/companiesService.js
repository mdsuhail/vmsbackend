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
var func = require('../../helpers/functions');

module.exports = {
    create: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        if (!req.body.name || !req.body.email) {
            res.json({success: false, statusCode: res.statusCode, message: "Name and email required!!!", data: {}});
            return;
        }
        if (req.body.image && req.body.image !== null) {
            let base64String = req.body.image;
            let base64Image = base64String.split(';base64,').pop(); //image to be store
            let compName = func.getNameWithSeparator(req.body.name);  // separate company folder name
            let logoName = Math.random().toString(36).substring(2, 12);
            var logoPath = "storage/companies/" + '/' + compName + '-' + logoName + ".jpeg";
//            if (!fs.existsSync(compFolderPath)) {
//                fs.mkdirSync(compFolderPath);
//            }
            fs.writeFile(logoPath, base64Image, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['logo'] = logoPath;
        }
        delete req.body.image;
        let name = req.body && req.body !== undefined ? req.body.name : '';
        let dbName = name && name != undefined ? func.getDbName(name) : '';
        var data = {
            name: req.body.name,
            email: req.body.email,
            emailDomain: req.body.emailDomain,
            contact: req.body.contact ? req.body.contact : '',
            address: req.body.address ? req.body.address : '',
            city: req.body.city ? req.body.city : '',
            state: req.body.state ? req.body.state : '',
            zip: req.body.zip ? req.body.zip : '',
            logo: req.body.logo ? req.body.logo : '',
            website: req.body.website ? req.body.website : '',
            createdBy: currentUser._id,
            dbHost: req.body.dbHost ? req.body.dbHost : '',
            dbName: req.body.dbName && req.body.dbName !== undefined ? req.body.dbName : dbName,
            dbUsername: req.body.dbUsername ? req.body.dbUsername : '',
            dbPassword: req.body.dbPassword ? req.body.dbPassword : '',
            dbPort: req.body.dbPort ? req.body.dbPort : '',
            active: req.body.active ? req.body.active : '',
        };
        connMas.CompanyMaster.create(data, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: result});
        });
    },
    getById: function (req, res, next) {
        connMas.CompanyMaster.findById(req.params.companyId).select(['-updatedAt', '-dbName', '-dbHost', '-dbPort', '-dbUsername', '-dbPassword', '-createdBy', '-__v']).exec(function (err, company) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {company: company}});
            }
        });
    },
    getAll: function (req, res, next) {
        connMas.CompanyMaster.find({}).select(['-updatedAt', '-dbName', '-dbHost', '-dbPort', '-dbUsername', '-dbPassword', '-createdBy', '-__v']).sort({_id: -1}).exec(function (err, companies) {
            if (err) {
                next(err);
            } else if (!companies.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {companies: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {companies: companies}});
            }
        });
    },
    updateById: function (req, res, next) {
        if (!req.body.name || !req.body.email) {
            res.json({success: false, statusCode: res.statusCode, message: "Company name and email required!!!", data: {}});
            return;
        }
        if (req.body.image && req.body.image !== null) {
            let base64String = req.body.image;
            let base64Image = base64String.split(';base64,').pop(); //image to be store
            if (req.body.logo && req.body.logo !== null && fs.existsSync(req.body.logo))
                fs.unlinkSync(req.body.logo)

            let compName = func.getNameWithSeparator(req.body.name);  // separate company folder name
            let logoName = Math.random().toString(36).substring(2, 12);
            var logoPath = "storage/companies/" + '/' + compName + '-' + logoName + ".jpeg";
            fs.writeFile(logoPath, base64Image, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['logo'] = logoPath;
        }
        var data = {
            name: req.body.name,
            email: req.body.email,
            emailDomain: req.body.emailDomain,
            contact: req.body.contact,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            logo: req.body.logo,
            website: req.body.website,
            active: req.body.active,
        };
        var id = req.params.companyId;
        //connMas.CompanyMaster.findByIdAndUpdate(id, data).exec(function (err, company) {
        connMas.CompanyMaster.patchUpdate({_id: id}, data, [], '', function (err, company) {
            if (err)
                next(err);
            else {
                var comp = {"_id": company._id, "name": company.name, "email": company.email, "emailDomain": company.emailDomain, "logo": company.logo, "address": company.address, "contact": company.contact, "city": company.city, "state": company.state, "zip": company.zip, "website": company.website, "active": company.active, "createdAt": company.createdAt}
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {company: comp}});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.CompanyMaster.findByIdAndRemove(req.params.companyId, function (err, company) {
            if (err)
                next(err);
            else {
                if (company.logo && company.logo !== null && fs.existsSync(company.logo))
                    fs.unlinkSync(company.logo)
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: {}});
            }
        });
    },
    getCompanyEmployeesById: function (req, res, next) {
        let employeesList = [];
        employeeModel.find({"company": req.params.companyId}).populate('department').exec(function (err, employees) {
            if (err) {
                next(err);
            } else {
                companyModel.findById(req.params.companyId).exec(function (err, company) {
                    for (let employee of employees) {
                        let dept = {};
                        if (employee.department) {
                            dept = {id: employee.department._id, name: employee.department.name, createdAt: employee.department.createdAt, updatedAt: employee.department.updatedAt};
                        }
                        employeesList.push({id: employee._id, firstname: employee.firstname, lastname: employee.lastname, email: employee.email, contact: employee.contact, createdAt: employee.createdAt, updatedAt: employee.updatedAt, department: dept});
                    }
                    res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {company: company, employees: employeesList}});
                });
            }
        });
    },
    getDetailById: function (req, res, next) {
        connMas.CompanyMaster.findById(req.params.companyId).exec(function (err, companyInfo) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {company: companyInfo}});
            }
        });
    },
    validateDomain: function (req, res, next) {
        var domain = func.getCompanyDomain(req)
        connMas.CompanyMaster.findOne({"emailDomain": domain}).select(['-updatedAt', '-dbHost', '-dbPort', '-dbUsername', '-dbPassword', '-createdBy', '-__v']).exec(function (err, company) {
            if (err) {
                next(err);
            } else {
                if (!company)
                    res.json({success: true, statusCode: res.statusCode, message: "Record not found!!!", data: {valid: false, company: company}});
                else
                    res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {valid: true, company: company}});
            }
        });
    }
}