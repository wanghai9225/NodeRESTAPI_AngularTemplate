var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Template = new Schema({
	title: String
});

module.exports = mongoose.model('Template', Template);