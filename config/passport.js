/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const connMas = require('./connection');
connMas.connectionMasterCompany()
connMas.connectionMasterBranch();
connMas.connectionMasterRole();
connMas.connectionMasterUser();
//var User = require('../app/api/models/user');
var config = require('../config/database'); // get db config file

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret;

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        var sessionData = {};
        sessionData.user = user._id;
        done(null, sessionData);
    });

    // used to deserialize the user
    passport.deserializeUser(function (sessionData, done) {
        connMas.UserMaster.findById(sessionData.user, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        connMas.UserMaster.findById(jwt_payload._id).select(['-password', '-updatedAt', '-createdBy', '-__v'])
                .populate('company', ['-updatedAt', '-dbUsername', '-dbPassword', '-dbPort', '-dbHost', '-createdBy', '-__v'], connMas.CompanyMaster)
                .populate('branch', ['-company', '-updatedAt', '-createdBy', '-__v'], connMas.BranchMaster)
                .populate('role', ['-resource_permissions', '-company', '-createdBy', '-updatedAt', '-__v'], connMas.RoleMaster)
                .exec(function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
    }));
};