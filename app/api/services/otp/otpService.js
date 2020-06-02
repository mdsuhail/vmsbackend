var http = require("https");
const mongoose = require('mongoose');
var objId = new mongoose.Types.ObjectId();
var config = require("../../../../config/constant");
//const visitorModel = require('../../models/visitorsModel');
//const otpLogsModel = require('../../models/otpLogsModel');
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
            var chunks = [];
            response.on("data", function (chunk) {
                chunks.push(chunk);
            });
            response.on("end", function () {
                var responseData = JSON.parse(chunks);
                var payloadData = {
                    contact: req.body.contact,
                    otp: otp,
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
}					