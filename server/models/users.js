var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var usersSchema = new mongoose.Schema({
  name: String,
  phone: String,
  isAdmin: Boolean,
});

usersSchema.plugin(passportLocalMongoose);

var users = mongoose.model('users', usersSchema);

module.exports = users;