var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Property = new Schema({
	title: {type: String, required: true},
	logo_img_path: String,
	logo_img_name: String,
	color: String,
	background_img_path: String,
	background_img_name: String,
	parent_portal: {
		type: Schema.Types.ObjectId,
		ref: 'Portal'
	}
});

module.exports = mongoose.model('Property', Property);