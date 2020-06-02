/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const roleModel = require('../models/rolesModel');
var func = require('../helpers/functions');
function authorize(resource, action) {
    return [
        // authorize based on user role
        (req, res, next) => {
            var currentUser = func.getCurrentUser(req.headers)            
            if (resource.length && action.length) {
                var re = resource;
                var ac = action;
                var isAuthorize = false;
                roleModel.findById(currentUser.role._id).populate({path: 'resources', model: 'Resource'}).exec(function (err, role) {
                    if (err) {
                        next(err);
                    } else {
                        var searchedResource = role.resources.find(resource => resource.name == re) // First search the resource
                        if (searchedResource) {
                            var perm = role.resource_permissions.find(resPerm => resPerm._id == searchedResource._id)   // Second search the permissions array in the resource for the role ['create', 'read', 'update', 'delete']
                            if (perm) {
                                var act = perm.permissions.find(action => action == ac) // Final check the given action in the searched permission array
                                if (act) {
                                    isAuthorize = true;
                                }
                            }
                        }
                        if (!isAuthorize) {
                            // user's role is not authorized
                            res.json({success: false, statusCode: res.statusCode, message: 'Unauthorized access', data: null});
                        }
                    }
                });
            }
            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = authorize;