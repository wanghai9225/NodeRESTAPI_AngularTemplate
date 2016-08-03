var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contacts = new Schema({
	contact: String
});

module.exports = mongoose.model('Contact', Contacts);