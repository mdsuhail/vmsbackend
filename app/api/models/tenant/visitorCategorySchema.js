const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const VisitorCategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    backgroundImagePath: {
        type: String,
        trim: true,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

exports.VisitorCategorySchema = VisitorCategorySchema;