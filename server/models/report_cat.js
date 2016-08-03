var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Report_Cat = new Schema({
	name: String,
	parent_category: Schema.Types.ObjectId
});

module.exports = mongoose.model('Report_cat', Report_Cat);