const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const OtpLogsSchema = new Schema({
    contact: {
        type: String,
        trim: true,
        required: true
    },
    otp: {
        type: String,
        trim: true,
        default: ''
    },
    request: {
        type: String,
        default: ''
    },
    response: {
        type: String,
        default: ''
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

module.exports = mongoose.model('OtpLogs', OtpLogsSchema)