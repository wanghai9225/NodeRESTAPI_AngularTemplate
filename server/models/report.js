var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Report = new Schema({
	title: String,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Report_cat'
	},
	template: {
		type: Schema.Types.ObjectId,
		ref: 'Template'
	}
});

module.exports = mongoose.model('Report', Report);