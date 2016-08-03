var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tokens = new Schema({
	token: String,
	uid: Schema.Types.ObjectId
});

module.exports = mongoose.model('Token', Tokens);