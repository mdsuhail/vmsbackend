var http = require("https");
var request = require("request");
const mongoose = require('mongoose');
var jsdom = require('jsdom');
var jQuery = require('jquery')(new jsdom.JSDOM().window);
var objId = new mongoose.Types.ObjectId();
const otp = require('../../helpers/otp');
var config = require("../../../../config/constant");
const connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');
module.exports = {
    send: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantOtpLogsModel(prefix);
        var otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
        var options = {
            "method": "POST",
            "hostname": config.fast2sms.hostname,
            "port": config.fast2sms.port,
            "path": config.fast2sms.path,
            "headers": {
                "authorization": config.fast2sms.authorizationKey,
                "content-type": "application/json",
                "accept": "application/json",
                "cache-control": "no-cache"
            },
        };
        var request = http.request(options, function (response) {
            var chunks = '';
            response.on("data", function (chunk) {
                //chunks.push(chunk);
                chunks += chunk.toString();
            });
            response.on("end", function () {
                var responseData = JSON.parse(chunks);
                var payloadData = {
                    contact: req.body.contact,
                    otp: otp,
                    type: req.body.type && req.body.type !== '' ? req.body.type : 'checkin_contact_verification',
                    request: data,
                    response: chunks,
                    company: req.body.company ? req.body.company : objId
                };
                connTen.otpLogsModel.create(payloadData, function (err, result) {
                    if (err)
                        next(err);
                    else {
                        if (responseData.return) {
                            res.json({success: true, statusCode: res.statusCode, message: "Otp sent successfully!!!", data: {otp: responseData}});
                        } else {
                            res.json({success: false, statusCode: res.statusCode, message: responseData.message, data: {otp: responseData}});
                        }
                    }
                });
            });
        });
        var data = JSON.stringify({
            sender_id: config.fast2sms.sender_id,
            message: 'Please use ' + otp + ' as OTP to verify your phone number in ' + (req.body.companyName && req.body.companyName !== null ? req.body.companyName : config.defaultCompanyName) + ' . OTP will expire in 10 minutes. Have a nice day!',
            language: config.fast2sms.language,
            route: config.fast2sms.route,
            numbers: req.body.contact
        });
        request.write(data);
        request.end();
    },
    sendOtpForEmployeeValidation: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantOtpLogsModel(prefix);
        var otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
        var options = {
            "method": "POST",
            "hostname": config.fast2sms.hostname,
            "port": config.fast2sms.port,
            "path": config.fast2sms.path,
            "headers": {
                "authorization": config.fast2sms.authorizationKey,
                "content-type": "application/json",
                "accept": "application/json",
                "cache-control": "no-cache"
            },
        };
        var request = http.request(options, function (response) {
            var chunks = '';
            response.on("data", function (chunk) {
                chunks += chunk.toString();
            });
            response.on("end", function () {
                var responseData = JSON.parse(chunks);
                var payloadData = {
                    contact: req.query.contact,
                    otp: otp,
                    type: req.query.type && req.query.type !== '' ? req.query.type : 'checkin_contact_verification',
                    request: data,
                    response: chunks,
                    company: req.query.comp_id ? req.query.comp_id : objId
                };
                connTen.otpLogsModel.create(payloadData, function (err, result) {
                    if (err)
                        next(err);
                    else {
                        if (responseData.return) {
                            res.json({success: true, statusCode: res.statusCode, message: "Otp sent successfully!!!", data: {otp: responseData}});
                        } else {
                            res.json({success: false, statusCode: res.statusCode, message: responseData.message, data: {otp: responseData}});
                        }
                    }
                });
            });
        });
        var data = JSON.stringify({
            sender_id: config.fast2sms.sender_id,
            message: 'Please use ' + otp + ' as OTP to verify your phone number for registration. OTP will expire in 10 minutes. Have a nice day!',
            language: config.fast2sms.language,
            route: config.fast2sms.route,
            numbers: req.query.contact
        });
        request.write(data);
        request.end();
    },
    verify: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantOtpLogsModel(prefix);
        var d = new Date();
        d.setMinutes(d.getMinutes() - 10);
        connTen.otpLogsModel.findOne({contact: req.body.contact, otp: req.body.otp, createdAt: {$gte: d}}).select(['otp', 'contact']).sort({_id: -1}).exec(function (err, data) {
            if (err) {
                next(err);
            } else {
                if (data)
                    res.json({success: true, statusCode: res.statusCode, message: "Otp Verified!!!", data: data});
                else
                    res.json({success: false, statusCode: res.statusCode, message: "OTP Wrong or Expire. Please try again!!!", data: data});
            }
        });
    },
    verifyOtpForEmployeeValidation: function (req, res, next) {
        var prefix = func.getCollectionPrefix(req, res);
        connTen.tenantOtpLogsModel(prefix);
        var d = new Date();
        d.setMinutes(d.getMinutes() - 10);
        connTen.otpLogsModel.findOne({contact: req.query.contact, otp: req.query.otp, createdAt: {$gte: d}}).select(['otp', 'contact']).sort({_id: -1}).exec(function (err, data) {
            if (err) {
                next(err);
            } else {
                if (data)
                    res.json({success: true, statusCode: res.statusCode, message: "Otp Verified!!!", data: data});
                else
                    res.json({success: false, statusCode: res.statusCode, message: "OTP Wrong or Expire. Please try again!!!", data: data});
            }
        });
    },
    sendOtpToOldVisitor: function (req, res, next) {
        if (req.body.contact) {
            let sendMessageToOldVisitor = otp.getOldVisitorMessageData(req.body, req.user);
            otp.sendMessage(sendMessageToOldVisitor);
            res.json({success: true, statusCode: res.statusCode, message: "Otp sent successfully!!!", data: ''});
        } else {
            res.json({success: true, statusCode: res.statusCode, message: "Contact number required!!!", data: ''});
        }
    },
    tinyUrl: function (req, res, next) {
        var options = {method: 'POST',
            url: config.tinyUrl.url,
            headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'},
            formData:
                    {
                        "url": req.body.url
                    }
        };
        request(options, function (error, request, response) {
            if (error)
                next(error);
            else {
                var short_url = '';
                if (response)
                    short_url = jQuery(response).find('#copy_div').attr('href');
                res.json({success: true, statusCode: res.statusCode, message: "Short url!!!", data: short_url});
            }
        });
    }
}					