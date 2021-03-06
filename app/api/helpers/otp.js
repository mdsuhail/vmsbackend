/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
var http = require("https");
var config = require("../../../config/constant");

module.exports.sendMessage = function (data) {
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
    var dataSend = JSON.stringify({
        sender_id: config.fast2sms.sender_id,
        message: data.message,
        language: config.fast2sms.language,
        route: config.fast2sms.route,
        numbers: data.contact
    });
    var request = http.request(options, function (response) {
        var chunks = [];
        response.on("data", function (chunk) {
            chunks.push(chunk);
        });
        response.on("end", function () {
            var responseData = Buffer.concat(chunks);
            return responseData.toString();
        });
    });
    request.write(dataSend);
    request.end();
}

module.exports.getHostMessageData = function (data, currentUser) {
    var hostData = data.whomToMeet;
    let message = "Hi ";
    message += hostData.firstname ? hostData.firstname + ", " : ", ";
    message += data.name ? "visitor " + data.name : " someone ";
    message += data.companyFrom ? " from " + data.companyFrom : " ";
    message += " is waiting for you at reception.";
    if (currentUser.branch && currentUser.branch !== null && currentUser.branch.isVisitorApproval)
        message += " To approve or disapprove visitor click here " + config.checkinAppUrl + "/approve" + "?vid=" + data.visitorId + "&company=" + (currentUser.company.dbName && currentUser.company.dbName !== null ? currentUser.company.dbName : "") + "&prefix=" + (currentUser.branch.prefix && currentUser.branch.prefix !== null ? currentUser.branch.prefix : "");
    var hostMessageData = {
        message: message,
        contact: hostData.contact
    };
    return hostMessageData;
}
module.exports.getHostMessageDataForPreApprovedVisitor = function (data, currentUser) {
    var hostData = data.whomToMeet;
    let message = "Hi ";
    message += hostData.firstname ? hostData.firstname + ", " : ", ";
    message += data.name ? "pre-approved visitor " + data.name : "someone ";
    message += data.companyFrom ? " from " + data.companyFrom : " ";
    message += " is waiting for you at reception.";
    var hostMessageData = {
        message: message,
        contact: hostData.contact
    };
    return hostMessageData;
}
module.exports.getVisitorMessageData = function (data, currentUser) {
//    let date = new Date().toString().replace(' GMT+0530 (India Standard Time)', '');
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let message = "Hi ";
    message += data.name ? data.name + ", " : ", ";
    message += "You have successfully checked in " + (data.companyName ? data.companyName : config.defaultCompanyName) + " at " + date + '.';
    if (currentUser.branch && currentUser.branch !== null && currentUser.branch.isVisitorApproval)
        message += ' Please wait for host approval!!!';
    var visitorMessageData = {
        message: message,
        contact: data.contact
    };
    return visitorMessageData;
}
module.exports.getVisitorPreApprovedMessageData = function (data, currentUser) {
//    let date = new Date().toString().replace(' GMT+0530 (India Standard Time)', '');
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let message = "Hi ";
    message += data.name ? data.name + ", " : ", ";
    message += "You have pre approved invited by " + (currentUser.firstname ? currentUser.firstname : '') + " in the organization " + (currentUser.company.name ? currentUser.company.name : '') + " at " + data.preApprovedDate;
    var visitorMessageData = {
        message: message,
        contact: data.contact
    };
    return visitorMessageData;
}
module.exports.getVisitorPreApprovedCheckinMessageData = function (data, currentUser) {
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let message = "Hi ";
    message += data.name ? data.name + ", " : ", ";
    message += "You have successfully checked in " + (currentUser.company.name ? currentUser.company.name : config.defaultCompanyName) + " at " + date;
    var visitorMessageData = {
        message: message,
        contact: data.contact
    };
    return visitorMessageData;
}
module.exports.getVisitorApprovalStatusData = function (data) {
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let message = "Hi ";
    message += data.name ? (data.name + ", ") : ", ";
    message += "Your check in has been " + (data.approvalStatus && data.approvalStatus !== null ? data.approvalStatus : '') + " by host " + (data.whomToMeet.firstname && data.whomToMeet.firstname !== null ? data.whomToMeet.firstname : '') + ' ' + (data.whomToMeet.lastname && data.whomToMeet.lastname !== null ? data.whomToMeet.lastname : '') + " at " + date;
    var visitorMessageData = {
        message: message,
        contact: data.contact
    };
    return visitorMessageData;
}
module.exports.getVisitorCheckoutMessageData = function (data) {
//    let date = new Date().toString().replace(' GMT+0530 (India Standard Time)', '');
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let message = "Hi ";
    message += data.name ? data.name + ", " : ", ";
    message += "You have successfully checked out from " + (data.company && data.company !== null ? data.company.name : config.defaultCompanyName) + " at " + date;
    var visitorMessageData = {
        message: message,
        contact: data.contact
    };
    return visitorMessageData;
}
module.exports.getOldVisitorMessageData = function (data, currentUser) {
    let message = "Hi ";
    message += data.name ? data.name + ", " : ", ";
    message += "Please click this url " + data.shorturl + " to proceed further";
    var oldVisitorMessageData = {
        message: message,
        contact: data.contact
    };
    return oldVisitorMessageData;
}
