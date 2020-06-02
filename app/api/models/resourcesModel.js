const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
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
    path: {
        type: String,
        trim: true,
        default: '/'
    },
    icon: {
        type: String,
        trim: true,
        default: ''
    },
    class: {
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
    position: {
        type: Number,
        default: 0
    },
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

module.exports = mongoose.model('Resource', ResourceSchema)