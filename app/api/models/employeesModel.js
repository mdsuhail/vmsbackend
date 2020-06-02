const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const EmployeeSchema = new Schema({
    firstname: {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    contact: {
        type: String,
        trim: true,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }
},
        {
            timestamps: true
        }
);

module.exports = mongoose.model('Employee', EmployeeSchema)