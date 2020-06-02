const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    default: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
},
        {
            timestamps: true
        }
);
exports.DepartmentSchema = departmentSchema;