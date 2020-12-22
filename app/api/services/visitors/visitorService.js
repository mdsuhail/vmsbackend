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
        var currentUser = req.user
        var prefix = func.getCollectionPrefix(req, res);
        var date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
        connTen.tenantVisitorModel(prefix);
        connTen.tenantVisitorFaceModel(prefix)
        if (!req.body.contact) {
            res.json({success: false, statusCode: res.statusCode, message: "Contact required!!!", data: {}});
            return;
        }

        //send sms to visitor or guest
        if (req.body) {
            let sendMessageToVisitor = otp.getVisitorMessageData(req.body, currentUser);
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
        if (req.body.governmentIdUploadedImage && !req.body.governmentIdUploadedImagePath) {
            let name = Math.random().toString(36).substring(2, 12);
            var path = "storage/visitors/governmentids/" + name + ".jpeg";
            fs.writeFile(path, req.body.governmentIdUploadedImage, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['governmentIdUploadedImagePath'] = path;
        }
        if (req.body.itemUploadedImage && !req.body.itemImageUploadedPath) {
            let name = Math.random().toString(36).substring(2, 12);
            var path = "storage/visitors/items/" + name + ".jpeg";
            fs.writeFile(path, req.body.itemUploadedImage, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['itemImageUploadedPath'] = path;
        }
        //        delete req.body.profileImage;
        //        delete req.body.governmentIdUploadedImage;
        //        delete req.body.itemUploadedImage;
        var data = {
            name: req.body.name ? req.body.name : '',
            contact: req.body.contact,
            email: req.body.email ? req.body.email : '',
            companyFrom: req.body.companyFrom ? req.body.companyFrom : '',
            whomToMeet: req.body.whomToMeet ? req.body.whomToMeet._id : objId,
            department: req.body.whomToMeet.department ? req.body.whomToMeet.department._id : objId,
            signatureImagePath: req.body.signatureImagePath ? req.body.signatureImagePath : '',
            profileImagePath: req.body.profileImagePath ? req.body.profileImagePath : '',
            governmentIdUploadedImagePath: req.body.governmentIdUploadedImagePath ? req.body.governmentIdUploadedImagePath : '',
            itemImageUploadedPath: req.body.itemImageUploadedPath ? req.body.itemImageUploadedPath : '',
            isLaptop: req.body.isLaptop ? req.body.isLaptop : false,
            serialNumber: req.body.serialNumber ? req.body.serialNumber : '',
            signIn: req.body.signIn ? req.body.signIn : date,
            signOut: req.body.signOut ? req.body.signOut : '',
            visitorCategory: req.body.visitorCategory ? req.body.visitorCategory : objId,
            approvalStatus: req.body.approvalStatus ? req.body.approvalStatus : '',
            company: req.body.company ? req.body.company : objId
        };
        var query = {contact: req.body.contact};
        //connTen.visitorModel.findOneAndUpdate(query, data, {upsert: true, new : true}, function (err, visitor) {
        connTen.visitorModel.create(data, function (err, visitor) {
            if (err)
                next(err);
            else if (!visitor)
                res.json({
                    success: false,
                    statusCode: res.statusCode,
                    message: "Problem occured, try again!!!",
                    data: {visitor: {}}
                });
            else {
                var resMsg = 'Check-in Successfully!!!';
                //create message
                if (currentUser.branch && currentUser.branch !== null && currentUser.branch.isVisitorApproval)
                    resMsg = 'Check-in Successfully, Please wait for host approval!!!';

                //send sms to employee or host
                if (req.body.whomToMeet) {
                    req.body['visitorId'] = visitor._id;
                    let sendMessageToHost = otp.getHostMessageData(req.body, req.user);
                    otp.sendMessage(sendMessageToHost);
                }
                if (req.body.visitorVisit !== '' && req.body.visitorVisit !== undefined && req.body.visitorVisit === 'new') {
                    var data = {
                        faceId: req.body.faceData ? req.body.faceData.Face.FaceId : '',
                        imageId: req.body.faceData ? req.body.faceData.Face.ImageId : '',
                        visitorId: visitor._id
                    };
                    connTen.visitorFaceModel.create(data, function (err, result) {
                        res.json({
                            success: true,
                            statusCode: res.statusCode,
                            message: resMsg,
                            data: {visitor: visitor}
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: resMsg,
                        data: {visitor: visitor}
                    });
                }

            }
        });
    },
    createOrUpdatePreApproved: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.tenantVisitorFaceModel(prefix)
        if (!req.body.contact) {
            res.json({success: false, statusCode: res.statusCode, message: "Contact required!!!", data: {}});
            return;
        }
        //send sms to visitor or guest
        if (req.body && req.body.type === 'create') {
            let sendMessageToPreApprovedVisitor = otp.getVisitorPreApprovedMessageData(req.body, req.user);
            let messResp = otp.sendMessage(sendMessageToPreApprovedVisitor);
        }
        if (req.body.profileImage && !req.body.profileImagePath) {
            let name = Math.random().toString(36).substring(2, 12);
            var path = "storage/visitors/profiles/" + name + ".jpeg";
            fs.writeFile(path, req.body.profileImage, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            req.body['profileImagePath'] = path;
        }
        //        delete req.body.profileImage;
        var data = {
            name: req.body.name ? req.body.name : '',
            contact: req.body.contact,
            email: req.body.email ? req.body.email : '',
            companyFrom: req.body.companyFrom ? req.body.companyFrom : '',
            whomToMeet: req.body.whomToMeet ? req.body.whomToMeet : objId,
            department: req.body.department ? req.body.department : objId,
            profileImagePath: req.body.profileImagePath ? req.body.profileImagePath : '',
            signIn: req.body.signIn ? req.body.signIn : '',
            signOut: req.body.signOut ? req.body.signOut : '',
            visitorCategory: req.body.visitorCategory ? req.body.visitorCategory : objId,
            approvalStatus: req.body.approvalStatus ? req.body.approvalStatus : '',
            isPreApproved: req.body.isPreApproved ? req.body.isPreApproved : false,
            preApprovedDate: req.body.preApprovedDate ? req.body.preApprovedDate : '',
            isVisitorVisited: req.body.isVisitorVisited ? req.body.isVisitorVisited : false,
            company: req.body.company ? req.body.company : objId
        };
        var query = {contact: req.body.contact};
        //var query = {company: req.body.company, contact: req.body.contact};
        //        connTen.visitorModel.findOneAndUpdate(query, data, {upsert: true, new : true}, function (err, visitor) {
        connTen.visitorModel.create(data, function (err, visitor) {
            if (err)
                next(err);
            else if (!visitor)
                res.json({
                    success: false,
                    statusCode: res.statusCode,
                    message: "Problem occured, try again!!!",
                    data: {visitor: {}}
                });
            else {
                //send sms to employee or host
                //                if (req.body.whomToMeet) {
                //                    req.body['visitorId'] = visitor._id;
                //                    let sendMessageToHost = otp.getHostMessageData(req.body, req.user);
                //                    otp.sendMessage(sendMessageToHost);
                //                }
                if (req.body.isProfileImageDetailFound === false) {
                    var data = {
                        faceId: req.body.faceData ? req.body.faceData.Face.FaceId : '',
                        imageId: req.body.faceData ? req.body.faceData.Face.ImageId : '',
                        visitorId: visitor._id
                    };
                    connTen.visitorFaceModel.create(data, function (err, result) {
                        res.json({
                            success: true,
                            statusCode: res.statusCode,
                            message: "Pre-approved check-in created Successfully!!!",
                            data: {visitor: visitor}
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "Pre-approved check-in created Successfully!!!",
                        data: {visitor: visitor}
                    });
                }
            }
        });
    },
    preApprovedCheckin: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.contact) {
            res.json({success: false, statusCode: res.statusCode, message: "Contact required!!!", data: {}});
            return;
        }
        //send sms to visitor or guest
        if (req.body) {
            let sendMessageToPreApprovedVisitor = otp.getVisitorPreApprovedCheckinMessageData(req.body, req.user);
            let messResp = otp.sendMessage(sendMessageToPreApprovedVisitor);
        }
        var date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
        var data = {
            signIn: date,
            isVisitorVisited: true,
        };
        var query = {_id: req.body._id, contact: req.body.contact};
        connTen.visitorModel.patchUpdate(query, data, [], '', function (err, visitor) {
            if (err)
                next(err);
            else if (!visitor)
                res.json({
                    success: false,
                    statusCode: res.statusCode,
                    message: "Problem occured, try again!!!",
                    data: {visitor: {}}
                });
            else {
                //send sms to employee or host
                if (req.body.whomToMeet) {
                    req.body['visitorId'] = visitor._id;
                    let sendMessageToHost = otp.getHostMessageDataForPreApprovedVisitor(req.body, req.user);
                    otp.sendMessage(sendMessageToHost);
                }
                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Pre-approved visitor check-in Successfully!!!",
                    data: {visitor: {}}
                });
            }
        });
    },
    profileAvatar: function (req, res, next) {
        if (req.body.avatar) {
            let name = Math.random().toString(36).substring(2, 12);
            var path = "storage/visitors/profiles/" + name + ".jpeg";
            fs.writeFile(path, req.body.avatar, {encoding: 'base64'}, function (err) {
                //console.log(err);
            });
            res.json({success: true, statusCode: res.statusCode, message: "Saved Successfully!!!", data: path});
        } else {
            res.json({success: true, statusCode: res.statusCode, message: "No avatar found!!!", data: null});
        }
    },
    getAll: function (req, res, next) {
        var params = req.query;
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantVisitorCategoryModel(prefix);
        var query = func.getQueryCondition(currentUser, params);
        // console.log(query)
        if (params)
            limit = parseInt(params.limit);
        connTen.visitorModel.find(query)
            .populate('whomToMeet', ['_id', 'contact', 'email', 'firstname', 'lastname', 'department'], connTen.employeeModel)
            .populate('visitorCategory', ['_id', 'name'], connTen.visitorCategoryModel)
            .sort({"_id": -1})
            .exec(function (err, visitors) {
                if (err) {
                    next(err);
                } else if (!visitors.length) {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "No record found!!!",
                        data: {visitors: []}
                    });
                } else {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "Record found!!!",
                        data: {visitors: visitors}
                    });
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
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "Data found!!!",
                        data: {visitor: visitor}
                    });
                }
            }
        );
    },
    getByFaceData: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        var faceId = req.body.Face ? req.body.Face.FaceId : '';
        connTen.tenantVisitorFaceModel(prefix)
        connTen.tenantVisitorModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.tenantVisitorCategoryModel(prefix);
        connTen.visitorFaceModel.findOne({"faceId": faceId}, null, {sort: {_id: -1}}).exec(function (err, result) {
            if (err) {
                next(err);
            } else {
                if (result !== null && result.visitorId) {
                    connTen.visitorModel.findById(result.visitorId).populate('whomToMeet', ['_id', 'contact', 'email', 'firstname', 'lastname'], connTen.employeeModel).populate('visitorCategory', ['_id', 'name'], connTen.visitorCategoryModel).exec(function (err, visitor) {
                        if (err) {
                            next(err);
                        } else {
                            if (visitor && visitor !== null)
                                res.json({
                                    success: true,
                                    statusCode: res.statusCode,
                                    message: "Data found!!!",
                                    data: {visitor: visitor}
                                });
                            else
                                res.json({
                                    success: true,
                                    statusCode: res.statusCode,
                                    message: "No data found!!!",
                                    data: null
                                });
                        }
                    });
                } else {
                    res.json({success: true, statusCode: res.statusCode, message: "No data found!!!", data: null});
                }
            }
        });
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

                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Approval status updated successfully!!!",
                    data: {}
                });
            }
        });
    },
    signOut: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.signOut) {
            res.json({success: false, statusCode: res.statusCode, message: "Check-out date required!!!", data: {}});
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
    checkVisitorCheckedin: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        var params = req.params;
        var query = func.getVisitorCheckinQueryCondition(currentUser, params);
        // console.log(query);
        connTen.tenantVisitorModel(prefix);
        connTen.visitorModel.findOne(query).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else if (visitor) {
                if (visitor.isPreApproved && visitor.preApprovedDate && visitor.isVisitorVisited == false) {
                    res.json({
                        success: true,
                        statusCode: res.statusCode,
                        message: "Pre-approved visitor!!!",
                        data: {visitor: visitor}
                    });
                } else {
                    res.json({
                        success: false,
                        statusCode: res.statusCode,
                        message: "Visitor already check-in!!!",
                        data: {visitor: visitor}
                    });
                }
            } else {
                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Visitor not check-in!!!",
                    data: {visitor: null}
                });
            }
        });
    },
    checkVisitorCheckedout: function (req, res, next) {
        var currentUser = func.getCurrentUser(req.headers);
        var prefix = func.getCollectionPrefix(req, res);
        var params = req.params;
        var query = func.getVisitorCheckoutQueryCondition(currentUser, params);
        // console.log(query);
        connTen.tenantVisitorModel(prefix);
        connTen.visitorModel.findOne(query).sort({"_id": -1}).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else if (visitor) {
                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Visitor checked in!!!",
                    data: {visitor: visitor}
                });
            } else {
                res.json({
                    success: false,
                    statusCode: res.statusCode,
                    message: "Visitor not check-in!!!",
                    data: {visitor: null}
                });
            }
        });
    },
    getByContact: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        connTen.tenantEmployeeModel(prefix);
        connTen.visitorModel.findOne({contact: req.params.contact}).select(['-updatedAt', '-__v']).populate('whomToMeet', ['_id', 'contact', 'email', 'firstname', 'lastname'], connTen.employeeModel).sort({_id: -1}).exec(function (err, visitor) {
            if (err) {
                next(err);
            } else if (!visitor) {
                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Visitor found!!!",
                    data: {visitor: null}
                });
            } else {
                res.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: "Visitor found!!!",
                    data: {visitor: visitor}
                });
            }
        });
    },
    updateById: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantVisitorModel(prefix);
        if (!req.body.name)
            res.status(401).json({success: false, message: "Visitor name is required!!!"});
        connTen.visitorModel.findOneAndUpdate(req.params.visitorId, {
            name: req.body.name,
            email: req.body.email,
            logo: req.body.logo,
            contact: req.body.contact,
            address: req.body.address
        }, function (err, visitor) {
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
            res.json({success: false, statusCode: res.statusCode, message: "Check-out date required!!!", data: {}});
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
                res.json({
                    success: false,
                    statusCode: res.statusCode,
                    message: "Number not found!!!",
                    data: {visitor: {}}
                });
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
                        res.json({
                            success: true,
                            statusCode: res.statusCode,
                            message: "Check-out successfully!!!",
                            data: {}
                        });
                    }
                });
            }
        });
    },
}
