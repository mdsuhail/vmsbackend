const mongoose = require('mongoose');
var func = require('../helpers/functions');
//Define a schema
const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
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

//function dinamycSchema(aaaa){
//    return mongoose.model('aaa_Department', DepartmentSchema);
//}

exports.DepartmentSchema = DepartmentSchema;
//module.exports = mongoose.model('Department', DepartmentSchema)
//module.exports = function () {
//    return mongoose.model('branch1_Department', DepartmentSchema);
//};

//module.exports = dinamycSchema;