var http = require("http");
var request = require("request");
const mongoose = require('mongoose');
var objId = new mongoose.Types.ObjectId();
var config = require("../../../../config/constant");
const connTen = require('../../../../config/connectionTenant');
var func = require('../../helpers/functions');
module.exports = {
    recognize: function (req, res, next) {
        const currentUser = req.user;
        var collection_name = req.body.collection_name;
        if (!req.body.collection_name || req.body.collection_name === null || req.body.collection_name === undefined)
            var collection_name = currentUser.company.dbName;
        var options = {method: 'POST',
            url: 'http://127.0.0.1:8000/recognition/face/recognize',
            headers:
                    {
                        'cache-control': 'no-cache',
                        'accept': 'application/json',
                        'content-type': 'application/json'},
            body:
                    {
                        "collection_name": collection_name,
                        "image": req.body.image
                    }, json: true};
        request(options, function (error, request, response) {
            if (error)
                next(error);
            else {
                var data = null
                if (response.success === true)
                    data = response.data
                res.json({success: true, statusCode: res.statusCode, message: "Face detail!!!", data: data});
            }
        });
    },
    addFace: function (req, res, next) {
        const currentUser = req.user;
        var collection_name = req.body.collection_name;
        if (!req.body.collection_name || req.body.collection_name === null || req.body.collection_name === undefined)
            var collection_name = currentUser.company.dbName;
//            var collection_name = 'my_collection5'
        var options = {method: 'POST',
            url: 'http://127.0.0.1:8000/recognition/face/add',
            headers:
                    {
                        'cache-control': 'no-cache',
                        'accept': 'application/json',
                        'content-type': 'application/json'},
            body:
                    {
                        "collection_name": collection_name,
                        "image": req.body.image
                    }, json: true};
        request(options, function (error, request, response) {
            if (error)
                next(error);
            else {
                var data = null
                if (response.success === true)
                    data = response.data
                res.json({success: true, statusCode: res.statusCode, message: "Face detail!!!", data: data});
            }
        });
    }
}