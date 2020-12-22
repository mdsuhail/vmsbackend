const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const VisitorFaceSchema = new Schema({
    faceId: {
        type: String,
        trim: true,
        required: true
    },
    imageId: {
        type: String,
        trim: true
    },
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        required: true
    },
},
        {
            timestamps: true
        }
);
exports.VisitorFaceSchema = VisitorFaceSchema;