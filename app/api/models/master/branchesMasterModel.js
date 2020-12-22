const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const BranchMasterSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            default: ''
        },
        email: {
            type: String,
            trim: true,
            required: true,
            default: ''
        },
        contact: {
            type: String,
            trim: true,
            default: ''
        },
        logo: {
            type: String,
            trim: true,
            default: ''
        },
        address: {
            type: String,
            trim: true,
            default: ''
        },
        city: {
            type: String,
            trim: true,
            default: ''
        },
        state: {
            type: String,
            trim: true,
            default: ''
        },
        zip: {
            type: String,
            trim: true,
            default: ''
        },
        website: {
            type: String,
            trim: true,
            default: ''
        },
        prefix: {
            type: String,
            //unique: true,
            trim: true,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        },
        accountExpiryDate: {
            type: Date,
            default: ''
        },
        accountPlan: {
            type: String,
            default: 'custom'
        },
        customPlanValue: {
            type: String,
            default: ''
        },
        isVisitorApproval: {
            type: Boolean,
            default: false
        },
        isTouchless: {
            type: Boolean,
            default: false
        },
        isGovernmentIdUpload: {
            type: Boolean,
            default: false
        },
        isItemImageUpload: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: mongoose.Types.ObjectId
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
    },
    {
        timestamps: true
    }
);
exports.BranchMasterSchema = BranchMasterSchema;
