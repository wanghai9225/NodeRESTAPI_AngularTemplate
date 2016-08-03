var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Documents = new Schema({
	title: String,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'document_cat'
	},
	doc_path: String,
	doc_filename: String,
	is_parent_portal: String, // portal : portal, property: property
	parent_portal_id: {
		type: Schema.Types.ObjectId,
		ref: 'Portal'
	},
	parent_property_id: {
		type: Schema.Types.ObjectId,
		ref: 'Property'
	}
});

module.exports = mongoose.model('Document', Documents);