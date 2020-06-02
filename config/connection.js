/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require('express');
const mongoose = require('mongoose');
const config = require('./database');
const func = require('./../app/api/helpers/functions');

module.exports.connection = async function (req, res) {
    let db = '';
    let query = req.query;
    const currentUser = func.getCurrentUser(req.headers);
    if (query && query.company && query.company !== null && query.prefix && query.prefix !== null) {
        let dbName = query.company && query.company !== null ? query.company : config.masterDatabase;
        db = config.databaseUrl + '/' + dbName;
    } else if (currentUser && Object.keys(currentUser).length > 0) {
        let dbName = currentUser.company && currentUser.company !== null ? currentUser.company.dbName : config.masterDatabase;
        db = config.databaseUrl + '/' + dbName;
    } else
        db = config.databaseUrl + '/' + config.masterDatabase;
    connection = await mongoose.connect(db, config.databaseOptions);
    return connection;
}
//module.exports.connection = async function (req, res) {
//    let db = '';
//    const currentUser = func.getCurrentUser(req.headers);
//    const email = req.body && req.body !== undefined ? req.body.email : '';
//    const tenantDb = email && email != undefined ? func.getCompanyDbFromEmail(email) : '';
//    if (currentUser && Object.keys(currentUser).length > 0) {
//        let dbName = currentUser.company && currentUser.company !== null ? currentUser.company.dbName : config.masterDatabase;
//        db = config.databaseUrl + '/' + dbName;
//    } else if (tenantDb)
//        db = config.databaseUrl + '/' + tenantDb;
//    else
//        db = config.databaseUrl + '/' + config.masterDatabase;
//    connection = await mongoose.connect(db, config.databaseOptions);
//    return connection;
//}
//module.exports.connection = async function (req, res) {
//    let db = '';
//    const currentUser = func.getCurrentUser(req.headers);
//    const email = req.body && req.body !== undefined ? req.body.email : '';
//    const tenantDb = email && email != undefined ? func.getCompanyDbFromEmail(email) : '';
//    if (currentUser && Object.keys(currentUser).length > 0) {
//        if (currentUser.role && currentUser.role.name == 'superadmin' && req.body.password && req.body.company) {
//            let dbName = req.body.company && req.body.company.dbName !== null ? req.body.company.dbName : config.masterDatabase;
//            db = config.databaseUrl + '/' + dbName;
//        } else {
//            let dbName = currentUser.company && currentUser.company !== null ? currentUser.company.dbName : config.masterDatabase;
//            db = config.databaseUrl + '/' + dbName;
//        }
//    } else if (tenantDb)
//        db = config.databaseUrl + '/' + tenantDb;
//    else
//        db = config.databaseUrl + '/' + config.masterDatabase;
//    connection = await mongoose.connect(db, config.databaseOptions);
//    return connection;
//}
module.exports.connectionMasterCompany = async function () {
    const connMasCompany = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let companyMasterSch = require('../app/api/models/master/companiesMasterModel')
    let Company = connMasCompany.model('Company', companyMasterSch.CompanyMasterSchema);
    exports.CompanyMaster = Company;
}
module.exports.connectionMasterBranch = async function () {
    const connMasBranch = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let branchMasterSch = require('../app/api/models/master/branchesMasterModel')
    let Branch = connMasBranch.model('Branch', branchMasterSch.BranchMasterSchema);
    exports.BranchMaster = Branch;
}
module.exports.connectionMasterUser = async function () {
    const connMasUser = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let userMasterSch = require('../app/api/models/master/user')
    let User = connMasUser.model('User', userMasterSch.UserSchema);
    exports.UserMaster = User;
}
module.exports.connectionMasterResource = async function () {
    const connMas = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let resourceMasterSch = require('../app/api/models/master/resourcesMasterModel')
    var Resource = connMas.model('Resource', resourceMasterSch.ResourceMasterSchema);
    exports.ResourceMaster = Resource;
}
module.exports.connectionMasterRole = async function () {
    const connMas = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let roleMasterSch = require('../app/api/models/master/rolesMasterModel')
    var Role = connMas.model('Role', roleMasterSch.RoleMasterSchema);
    exports.RoleMaster = Role;
}
module.exports.connectionMasterPermission = async function () {
    const connMas = await mongoose.createConnection(config.databaseUrl + '/' + config.masterDatabase, config.databaseOptions);
    let permissionMasterSch = require('../app/api/models/master/permissionsMasterModel')
    var Permission = connMas.model('Permission', permissionMasterSch.PermissionSchema);
    exports.PermissionMaster = Permission;
}