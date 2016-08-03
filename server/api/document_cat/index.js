var express = require('express');
var Document_Cat = require('../../models/document_cat');
//var Documents = require('../../models/documents');
var router = express.Router();


router.get('/:parent_type/:uid', function(req, res, next) {
	
	var p_parent_type = req.params.parent_type; 	// portal, property, category
	var p_uid = req.params.uid;

	if(p_parent_type == "portal"){
		
		Document_Cat
		.find({ parent_portal_id: p_uid,  parent_category: {$exists: false} })
		.populate('parent_portal_id')
		.exec(function(err, category_list){
			if(err) return res.status(500).json(err);
			res.json(category_list);
		});
	}
	else if(p_parent_type == "property"){
		Document_Cat
		.find({ parent_property_id: p_uid,  parent_category: {$exists: false} })
		.populate('parent_property_id')
		.exec(function(err, category_list){
			if(err) return res.status(500).json(err);
			res.json(category_list);
		});
	}
	else if(p_parent_type == "category"){
		Document_Cat
		.find({ parent_category: p_uid })
		.populate('parent_property_id parent_portal_id')
		.exec(function(err, category_list){
			if(err) return res.status(500).json(err);
			res.json(category_list);
		});
	}
	else{
		return res.status(500).json("type error");
	}

});


router.post('/create', function(req, res, next) {

	var p_parent_category = req.body.parent_category;
	var p_name = req.body.name;


	// portal: portal, property: property
	var p_is_parent_portal = req.body.is_parent_portal;
	var p_parent_id = req.body.parent_id;

	var category_data;
	if(p_is_parent_portal == "portal"){
		category_data = new Document_Cat({
			name: p_name,
			parent_category: p_parent_category,
			is_parent_portal: p_is_parent_portal,
			parent_portal_id: p_parent_id
		});
	}
	else if(p_is_parent_portal == "property"){
		category_data = new Document_Cat({
			name: p_name,
			parent_category: p_parent_category,
			is_parent_portal: p_is_parent_portal,
			parent_property_id: p_parent_id
		});
	}
	else{
		return res.status(500).json('parent error');
	}

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

	var p_is_parent_portal = req.body.is_parent_portal;
	var p_parent_id = req.body.parent_id;

	Document_Cat.findById(p_uid, function (err, category_data){
		if(p_parent_category)
			category_data.parent_category = p_parent_category;
		if(p_name)
			category_data.name = p_name;

		if(p_is_parent_portal != null && (p_is_parent_portal == 'portal' || p_is_parent_portal == 'property')){
			if(p_is_parent_portal == 'portal'){
				category_data.parent_portal_id = p_parent_id;
				category_data.parent_property_id = undefined;
			}
			else
			{
				category_data.parent_property_id = p_parent_id;	
				category_data.parent_portal_id = undefined;
			}
			category_data.is_parent_portal = p_is_parent_portal;
		}

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

	Document_Cat.findById(p_uid, function (err, category_data){
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