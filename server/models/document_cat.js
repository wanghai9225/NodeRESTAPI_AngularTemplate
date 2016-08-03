var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document_Cat = new Schema({
	name: String,
	parent_category: Schema.Types.ObjectId,
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

module.exports = mongoose.model('document_cat', Document_Cat);