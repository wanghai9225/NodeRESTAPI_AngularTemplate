var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Portals = new Schema({
	title: {type: String, required: true},
	logo_img_path: String,
	logo_img_name: String,
	color: String,
	background_img_path: String,
	background_img_name: String
});

module.exports = mongoose.model('Portal', Portals);
