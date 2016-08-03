var express = require('express');
var Report_Cat = require('../../models/report_cat');
//var Documents = require('../../models/documents');
var router = express.Router();

router.post('/create', function(req, res, next) {

	var p_parent_category = req.body.parent_category;
	var p_name = req.body.name;

	var category_data = new Report_Cat({
		name: p_name,
		parent_category: p_parent_category
	});

	category_data.save(function(err){
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

	var p_parent_category = req.body.parent_category;
	var p_name = req.body.name;
	var p_uid = req.body.uid;

	Report_Cat.findById(p_uid, function (err, category_data){
		if(p_parent_category)
			category_data.parent_category = p_parent_category;
		if(p_name)
			category_data.name = p_name;

		category_data.save(function(err){
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

	Report_Cat.findById(p_uid, function (err, category_data){
		category_data.remove(function(err){
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