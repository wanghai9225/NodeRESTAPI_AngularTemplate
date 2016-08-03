var express = require('express');
var Template_Entity = require('../../models/template_entity');
//var Documents = require('../../models/documents');
var router = express.Router();

router.post('/create', function(req, res, next) {
	var p_report_id = req.body.report_id;
	var p_value = req.body.value;

	var insert_data = new Template_Entity({
		report_id: p_report_id,
		value: p_value
	});

	insert_data.save(function(err){
		if(err){
			console.log(err);	
			return res.status(500).json('failed');
		}
		//console.log("success");
		else
			return res.status(200).json('success');
	});

});

router.post('/update', function(req, res, next) {
	var p_value = req.body.value;
	var p_uid = req.body.uid;

	Template_Entity.findById(p_uid, function (err, entity_data){
		if(p_value)
			entity_data.value = p_value;

		entity_data.save(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json('update failed');
			}
			//console.log("success");
			return res.status(200).json('update success');
		});
	});

});


router.delete('/', function(req, res, next){
	var p_uid = req.body.uid;

	Template_Entity.findById(p_uid, function (err, entity_data){
		entity_data.remove(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json("failed");
			}
			else{
				return res.status(200).json("delete success");
			}
		});
	});
});

module.exports = router;