const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const VisitorHistorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    contact: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        default: ''
    },
    whomToMeet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: mongoose.Types.ObjectId
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
        type: Date,
        default: ''
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: mongoose.Types.ObjectId
    }
},
        {
            timestamps: true
        }
);

module.exports = mongoose.model('VisitorHistory', VisitorHistorySchema)