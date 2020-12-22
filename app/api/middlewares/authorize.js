/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// const roleModel = require('../models/rolesModel');
var func = require('../helpers/functions');
const config = require('../../../config/database');
const connMas = require('../../../config/connection');
connMas.connectionMasterRole();
connMas.connectionMasterResource();
connMas.connectionMasterPermission();

function authorize(resource, action) {
    return [
        // authorize based on user role
        (req, res, next) => {
            var currentUser = func.getCurrentUser(req.headers)
            var isAuthorize = false;
            if (resource.length && action.length) {
                var re = resource;
                var ac = action;
                connMas.RoleMaster.findById(currentUser.role._id).populate([
                    {
                        path: 'resource_permissions.resource',
                        model: connMas.ResourceMaster,
                        select: ["-company", "-createdBy", "-updatedAt", "-__v"]
                    },
                    {
                        path: 'resource_permissions.permissions',
                        model: connMas.PermissionMaster,
                        select: ["-resource", "-company", "-createdBy", "-updatedAt", "-__v"]
                    }
                ]).exec(function (err, role) {
                    if (err) {
                        next(err);
                    } else {
                        var resource_permissions = role.resource_permissions
                        var searchedResource = resource_permissions.find(resource => resource.resource.name == re) // First search the resource
                        // console.log(searchedResource)
                        if (searchedResource) {
                            var perm = searchedResource.permissions.find(resPerm => resPerm.name == ac)   // Second search the permissions array in the resource for the role ['create', 'read', 'update', 'delete']
                            // console.log(perm)
                            if (perm) {
                                // console.log(perm)
                                // var act = perm.find(action => action.name == ac) // Final check the given action in the searched permission array
                                // if (perm.name == ac) {
                                isAuthorize = true;
                                // }
                            }
                        }
                        if (!isAuthorize) {
                            // user's role is not authorized
                            res.json({
                                success: false,
                                statusCode: 401,
                                message: 'Unauthorized access',
                                data: null
                            });
                            return;
                        } else {
                            next()
                        }
                    }
                });
            }
        }
    ];
}

exports.authorize = authorize;
