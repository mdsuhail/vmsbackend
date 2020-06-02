const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        default: ''
    },
    displayName: {
        type: String,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    default: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    resource_permissions: [
        {
            resource: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Resource'
            },
            permissions: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Permission'
                }
            ]
        }
    ],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
        {
            timestamps: true
        }
);

//module.exports = mongoose.model('Role', RoleSchema)
exports.RoleSchema = RoleSchema;