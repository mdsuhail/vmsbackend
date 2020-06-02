const mongoose = require('mongoose');
const visitorModel = require('../../models/visitorsModel');
const func = require('../../helpers/functions');
const otp = require('../../helpers/otp');
const objId = new mongoose.Types.ObjectId();
const fs = require('fs');
const connTen = require('../../../../config/connectionTenant');
const connMas = require('../../../../config/connection');
connMas.connectionMasterCompany();
var limit = '';
module.exports = {
    createOrUpdate: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.contact) {
            res.json({success: false, statusCode: res.statusCode, message: "Contact required!!!", data: {}});
            return;
        }

//        //send sms to employee or host
//        if (req.body.whomToMeet) {
//            let sendMessageToHost = otp.getHostMessageData(req.body);
//            otp.sendMessage(sendMessageToHost);
//        }

        //send sms to visitor or guest
        if (req.body) {
            let sendMessageToVisitor = otp.getVisitorMessageData(req.body);
            let messResp = otp.sendMessage(sendMessageToVisitor);
        }

        if (req.body.profileImage && !req.body.profileImagePath) {
            let name = Math.random().toString(36).substring(2, 12);
            var path = "storage/visitors/profiles/" + name + ".jpeg";
            fs.writeFile(path, req.body.profileImage, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['profileImagePath'] = path;
        }
        delete req.body.profileImage;
        var data = {
            name: req.body.name ? req.body.name : '',
            contact: req.body.contact,
            email: req.body.email ? req.body.email : '',
            companyFrom: req.body.companyFrom ? req.body.companyFrom : '',
            whomToMeet: req.body.whomToMeet ? req.body.whomToMeet._id : objId,
            signatureImagePath: req.body.signatureImagePath ? req.body.signatureImagePath : '',
            profileImagePath: req.body.profileImagePath ? req.body.profileImagePath : '',
            isLaptop: req.body.isLaptop ? req.body.isLaptop : false,
            serialNumber: req.body.serialNumber ? req.body.serialNumber : '',
            signOut: req.body.signOut ? req.body.signOut : '',
            visitorCategory: req.body.visitorCategory ? req.body.visitorCategory : objId,
            approvalStatus: req.body.approvalStatus ? req.body.approvalStatus : '',
            company: req.body.company ? req.body.company : objId
        };
        var query = {contact: req.body.contact};
        //var query = {company: req.body.company, contact: req.body.contact};
        connTen.visitorModel.findOneAndUpdate(query, data, {upsert: true, new : true}, function (err, visitor) {
            if (err)
                next(err);
            else if (!visitor)
                res.json({success: false, statusCode: res.statusCode, message: "Problem occured, try again!!!", data: {visitor: {}}});
            else {
                //send sms to employee or host
                if (req.body.whomToMeet) {
                    req.body['visitorId'] = visitor._id;
                    let sendMessageToHost = otp.getHostMessageData(req.body, req.user);
                    otp.sendMessage(sendMessageToHost);
                }
                res.json({success: true, statusCode: res.statusCode, message: "Checkin Successfully!!!", data: {visitor: visitor}});
            }
        });
    },
    getAll: function (req, res, next) {
        var params = req.query;
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantVisitorCategoryModel(prefix);
        var query = func.getQueryCondition(currentUser, params);
        if (params)
            limit = parseInt(params.limit);
        connTen.visitorModel.find(query).populate('whomToMeet', ['_id', 'contact', 'email', 'firstname', 'lastname'], connTen.employeeModel).populate('visitorCategory', ['_id', 'name'], connTen.visitorCategoryModel).limit(limit).sort({"_id": -1}).exec(function (err, visitors) {
            if (err) {
                next(err);
            } else if (!visitors.length) {
                res.json({success: true, statusCode: res.statusCode, message: "No record found!!!", data: {visitors: []}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Record found!!!", data: {visitors: visitors}});
            }
        });
    },
    getById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantVisitorCategoryModel(prefix);
        connTen.visitorModel.findById(req.params.visitorId).populate('whomToMeet', ['_id', 'contact', 'email', 'firstname', 'lastname'], connTen.employeeModel).populate('visitorCategory', ['_id', 'name'], connTen.visitorCategoryModel).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Data found!!!", data: {visitor: visitor}});
            }
        }
        );
    },
    approvalStatus: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.approvalStatus) {
            res.json({success: false, statusCode: res.statusCode, message: "Approval status required!!!", data: {}});
            return;
        }
        var id = req.params.visitorId;
        var data = {
            approvalStatus: req.body.approvalStatus
        };
        connTen.visitorModel.patchUpdate({_id: id}, data, [], '', function (err, visitorInfo) {
            if (err)
                next(err);
            else {
                //send message to visitor about approval status
                if (req.body.approvalStatus && req.body.approvalStatus !== null) {
                    let sendMessageToVisitor = otp.getVisitorApprovalStatusData(req.body);
                    otp.sendMessage(sendMessageToVisitor);
                }

                res.json({success: true, statusCode: res.statusCode, message: "Approval status updated successfully!!!", data: {}});
            }
        });
    },
    signOut: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.signOut) {
            res.json({success: false, statusCode: res.statusCode, message: "Checkout date required!!!", data: {}});
            return;
        }
        var id = req.params.visitorId;
        var data = {
            signOut: req.body.signOut
        };
        connTen.visitorModel.patchUpdate({_id: id}, data, [], '', function (err, visitorInfo) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {}});
            }
        });
    },
    getByContact: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.visitorModel.findOne({contact: req.params.contact}).select(['-updatedAt', '-__v']).sort({_id: -1}).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else if (!visitor) {
                res.json({success: false, statusCode: res.statusCode, message: "Visitor found!!!", data: {visitor: {}}});
            } else {
                res.json({success: true, statusCode: res.statusCode, message: "Visitor found!!!", data: {visitor: visitor}});
            }
        });
    },
    updateById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.name)
            res.status(401).json({success: false, message: "Visitor name is required!!!"});
        connTen.visitorModel.findOneAndUpdate(req.params.visitorId, {name: req.body.name, email: req.body.email, logo: req.body.logo, contact: req.body.contact, address: req.body.address}, function (err, visitor) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Saved successfully!!!", data: {}});
            }
        });
    },
    deleteById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.visitorModel.findByIdAndRemove(req.params.visitorId, function (err, visitorInfo) {
            if (err)
                next(err);
            else {
                res.json({success: true, statusCode: res.statusCode, message: "Deleted successfully!!!", data: {}});
            }
        });
    },
    signOutByContact: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.contact) {
            res.json({success: false, statusCode: res.statusCode, message: "Mobile number required!!!", data: {}});
            return;
        }
        if (!req.body.signOut) {
            res.json({success: false, statusCode: res.statusCode, message: "Checkout date required!!!", data: {}});
            return;
        }
        var contact = req.body.contact;
        var data = {
            signOut: req.body.signOut
        };
        connTen.visitorModel.findOne({contact: contact}).select(['-updatedAt', '-__v'])
                .populate('company', ['name', 'email', 'contact'], connMas.CompanyMaster)
                .sort({_id: -1}).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else if (!visitor) {
                res.json({success: false, statusCode: res.statusCode, message: "Number not found!!!", data: {visitor: {}}});
            } else {
                connTen.visitorModel.patchUpdate({_id: visitor._id}, data, [], '', function (err, visitorInfo) {
                    if (err)
                        next(err);
                    else {
                        //send checkout sms to visitor or guest
                        if (visitor) {
                            let sendCheckoutMessageToVisitor = otp.getVisitorCheckoutMessageData(visitor);
                            otp.sendMessage(sendCheckoutMessageToVisitor);
                        }
                        res.json({success: true, statusCode: res.statusCode, message: "Checkout successfully!!!", data: {}});
                    }
                });
            }
        });
    },
}					