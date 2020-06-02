const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
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
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
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

exports.PermissionSchema = PermissionSchema;