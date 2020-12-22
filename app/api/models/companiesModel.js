const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const CompanySchema = new Schema({
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
    contact: {
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
    active: {
        type: Boolean,
        default: true
    },
    dbName: {
        type: String,
        unique: true,
        trim: true,
        default: ''
    },
    dbHost: {
        type: String,
        trim: true,
        default: 'localhost'
    },
    dbUsername: {
        type: String,
        trim: true,
        default: ''
    },
    dbPassword: {
        type: String,
        trim: true,
        default: ''
    },
    dbPort: {
        type: String,
        trim: true,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: mongoose.Types.ObjectId
    }
},
        {
            timestamps: true
        }
);

module.exports = mongoose.model('Company', CompanySchema)