/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require('express');
const mongoose = require('mongoose');
const config = require('./database');
const func = require('./../app/api/helpers/functions');

module.exports.connectionTenantUser = async function (tenantDatabase = '') {
    const db = tenantDatabase && tenantDatabase !== null ? tenantDatabase : config.masterDatabase;
    const connTenant = await mongoose.createConnection(config.databaseUrl + '/' + db, config.databaseOptions);
    var User = connTenant.model('User', require('../app/api/models/tenant/user'));
    exports.UserTenant = User;
}
module.exports.tenantDepartmentModel = async function (prefix = '') {
    var departmentSchema = require('../app/api/models/tenant/departmentSchema');
    const departmentModel = mongoose.model(prefix + '_' + 'Department', departmentSchema.DepartmentSchema)
    exports.departmentModel = departmentModel;
}
module.exports.tenantEmployeeModel = async function (prefix = '') {
    var employeeSchema = require('../app/api/models/tenant/employeeSchema');
    const employeeModel = mongoose.model(prefix + '_' + 'Employee', employeeSchema.EmployeeSchema)
    exports.employeeModel = employeeModel;
}
module.exports.tenantVisitorModel = async function (prefix = '') {
    var visitorSchema = require('../app/api/models/tenant/visitorSchema');
    const visitorModel = mongoose.model(prefix + '_' + 'Visitor', visitorSchema.VisitorSchema)
    exports.visitorModel = visitorModel;
}
module.exports.tenantVisitorCategoryModel = async function (prefix = '') {
    var visitorCategorySchema = require('../app/api/models/tenant/visitorCategorySchema');
    const visitorCategoryModel = mongoose.model(prefix + '_' + 'VisitorCategories', visitorCategorySchema.VisitorCategorySchema)
    exports.visitorCategoryModel = visitorCategoryModel;
}
module.exports.tenantOtpLogsModel = async function (prefix = '') {
    var otpLogsSchema = require('../app/api/models/tenant/otpLogsSchema');
    const otpLogsModel = mongoose.model(prefix + '_' + 'OtpLogs', otpLogsSchema.OtpLogsSchema)
    exports.otpLogsModel = otpLogsModel;
}








