/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const connMas = require('../../../../config/connection');
connMas.connectionMasterBranch();
var func = require('../../helpers/functions');

module.exports = {
    create: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        if (!req.body.name || !req.body.email) {
            res.json({success: false, statusCode: res.statusCode, message: "Branch name and email required!!!", data: {}});
            return;
        }
        let name = req.body && req.body !== undefined ? req.body.name : '';
        let prefix = name && name != undefined ? func.getPrefix(name) : '';
        var data = {
            name: req.body.name && req.body.name !== undefined ? req.body.name : '',
            email: req.body.email && req.body.email !== undefined ? req.body.email : '',
            contact: req.body.contact && req.body.contact !== undefined ? req.body.contact : '',
            logo: req.body.logo && req.body.logo !== undefined ? req.body.logo : '',
            address: req.body.address && req.body.address !== undefined ? req.body.address : '',
            city: req.body.city && req.body.city !== undefined ? req.body.city : '',
            state: req.body.state && req.body.state !== undefined ? req.body.state : '',
            zip: req.body.zip && req.body.zip !== undefined ? req.body.zip : '',
            website: req.body.website && req.body.website !== undefined ? req.body.website : '',
            prefix: req.body.prefix && req.body.prefix !== undefined ? req.body.prefix : prefix,
            active: req.body.active && req.body.active !== undefined ? req.body.active : false,
            accountExpiryDate: req.body.accountExpiryDate && req.body.accountExpiryDate !== undefined ? req.body.accountExpiryDate : new Date(),
            isVisitorApproval: req.body.isVisitorApproval && req.body.isVisitorApproval !== undefined ? req.body.isVisitorApproval : false,
            createdBy: req.body.createdBy && req.body.createdBy !== null ? req.body.createdBy : currentUser._id,
            company: req.body.company && req.body.company !== null ? req.body.company : currentUser.company._id,
        };
        connMas.BranchMaster.create(data, function (err, result) {
            if (err)
                next(err);
            else
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: result});
        });
    },
    getById: function (req, res, next) {
        connMas.BranchMaster.findById(req.params.branchId).exec(function (err, branch) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {branch: branch}});
            }
        });
    },
    getAll: function (req, res, next) {
        connMas.BranchMaster.find({}).select(['-updatedAt', '-createdBy', '-__v']).populate('company', ['name', 'email', 'contact']).sort({_id: -1}).exec(function (err, branches) {
            if (err) {
                next(err);
            } else if (!branches.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {branches: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {branches: branches}});
            }
        });
    },
    getByCompanyId: function (req, res, next) {
        connMas.BranchMaster.find({"company": req.params.companyId}).exec(function (err, branches) {
            if (err) {
                next(err);
            } else if (!branches.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {branches: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {branches: branches}});
            }
        });
    },
    updateById: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        if (!req.body.name || !req.body.email) {
            res.json({success: false, statusCode: res.statusCode, message: "Branch name and email required!!!", data: {}});
            return;
        }
        let name = req.body && req.body !== undefined ? req.body.name : '';
        let prefix = name && name != undefined ? func.getPrefix(name) : '';
        var data = {
            name: req.body.name && req.body.name !== undefined ? req.body.name : '',
            email: req.body.email && req.body.email !== undefined ? req.body.email : '',
            contact: req.body.contact && req.body.contact !== undefined ? req.body.contact : '',
            logo: req.body.logo && req.body.logo !== undefined ? req.body.logo : '',
            address: req.body.address && req.body.address !== undefined ? req.body.address : '',
            city: req.body.city && req.body.city !== undefined ? req.body.city : '',
            state: req.body.state && req.body.state !== undefined ? req.body.state : '',
            zip: req.body.zip && req.body.zip !== undefined ? req.body.zip : '',
            website: req.body.website && req.body.website !== undefined ? req.body.website : '',
            prefix: req.body.prefix && req.body.prefix !== undefined ? req.body.prefix : prefix,
            accountExpiryDate: req.body.accountExpiryDate && req.body.accountExpiryDate !== undefined ? req.body.accountExpiryDate : new Date(),
            active: req.body.active && req.body.active !== undefined ? req.body.active : false,
            isVisitorApproval: req.body.isVisitorApproval && req.body.isVisitorApproval !== undefined ? req.body.isVisitorApproval : false,
            createdBy: req.body.createdBy && req.body.createdBy !== null ? req.body.createdBy : currentUser._id,
            company: req.body.company && req.body.company !== null ? req.body.company : currentUser.company._id,
        };
        var id = req.params.branchId;
        connMas.BranchMaster.findByIdAndUpdate(id, data).exec(function (err, branch) {
            //connMas.BranchMaster.patchUpdate({_id: id}, data, [], '', function (err, branch) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {}});
            }
        });
    },
    deleteById: function (req, res, next) {
        connMas.BranchMaster.findByIdAndRemove(req.params.branchId, function (err, branch) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: {}});
            }
        });
    }
}