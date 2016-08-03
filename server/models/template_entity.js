var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Template_Entity = new Schema({
	report_id: Schema.Types.ObjectId,
	value: String
});

module.exports = mongoose.model('Template_entity', Template_Entity);