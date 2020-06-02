var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var connection;
exports.connectToDatabase = function () {
    var db2 = mongoose.createConnection('mongodb://localhost:27017/vcloud', {useCreateIndex: true, useNewUrlParser: true}); // database db1
    connection = db2;
    defineGlobalDatabaseSchemas();
}
exports.currentConnection = function () {
    return connection;
}

function defineGlobalDatabaseSchemas() {
    var UserSchema = mongoose.Schema(
            {
                firstname: {
                    type: String,
                    required: true,
                    default: ''
                }
            }
    );
    var User = connection.model('user', UserSchema);
    exports.User = User;
    exports.UserSchema = UserSchema;
}