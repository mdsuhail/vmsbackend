const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const VisitorSchema = new Schema({
    contact: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: ''
    },
    companyFrom: {
        type: String,
        trim: true,
        default: ''
    },
    whomToMeet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: new mongoose.Types.ObjectId()
    },
    signatureImagePath: {
        type: String,
        trim: true,
        default: ''
    },
    profileImagePath: {
        type: String,
        trim: true,
        default: ''
    },
    isLaptop: {
        type: Boolean,
        default: false
    },
    serialNumber: {
        type: String,
        trim: true,
        default: ''
    },
    signOut: {
        type: String,
        default: ''
    },
    approvalStatus: {
        type: String,
        default: ''
    },
    visitorCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitorCategory',
        default: new mongoose.Types.ObjectId()
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: new mongoose.Types.ObjectId()
    }
},
        {
            timestamps: true
        }
);

//module.exports = mongoose.model('Visitor', VisitorSchema)
exports.VisitorSchema = VisitorSchema;