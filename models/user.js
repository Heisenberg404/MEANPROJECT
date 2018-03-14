
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.schema;

var UserSchema = Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);