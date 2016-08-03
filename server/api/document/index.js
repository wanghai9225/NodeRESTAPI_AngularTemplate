var express = require('express');
var Documents = require('../../models/documents');
var router = express.Router();

var fs = require('fs');
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
var AWS = require('aws-sdk');
AWS.config.accessKeyId = 'AKIAJ3I6PJ55UPCLJZDA';
AWS.config.secretAccessKey = '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';
var s3 = new AWS.S3();

var s3fsImpl = new S3FS('ais-dms-document', {
  accessKeyId: 'AKIAJ3I6PJ55UPCLJZDA',
  secretAccessKey: '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'
});

s3fsImpl.create();

var aws_url_prefix = "https://s3.amazonaws.com/ais-dms-document/";

router.get('/:parent_type/:uid', function(req, res, next) {
	
	var p_parent_type = req.params.parent_type; 	// portal, property, category
	var p_uid = req.params.uid;

	if(p_parent_type == "portal"){

		Documents
		.find({ parent_portal_id: p_uid, category: {$exists: false}})
		.populate('parent_portal_id category')
		.exec(function(err, documents_list){
			if(err) return res.status(500).json(err);
			res.json(documents_list);
		});
	}
	else if(p_parent_type == "property"){
		Documents
		.find({ parent_property_id: p_uid,  category: {$exists: false}})
		.populate('parent_property_id category')
		.exec(function(err, documents_list){
			if(err) return res.status(500).json(err);
			res.json(documents_list);
		});
	}
	else if(p_parent_type == "category"){
		Documents
		.find({ category: p_uid})
		.populate('parent_property_id parent_portal_id category')
		.exec(function(err, documents_list){
			if(err) return res.status(500).json(err);
			res.json(documents_list);
		});
	}
	else{
		return res.status(500).json("type error");
	}

});

router.post('/create', function(req, res, next) {

	var p_doc_category = req.body.category;
	var p_title = req.body.name;
	var p_doc_file = req.files.file;

	// portal: portal, property: property
	var p_is_parent_portal = req.body.is_parent_portal;
	var p_parent_id = req.body.parent_id;

	var doc_filepath = "";
	var doc_filename = "";
	var params_file;

	if(p_doc_file != null){
		var stream = fs.createReadStream(p_doc_file.path);
		s3fsImpl.writeFile(p_doc_file.originalFilename, stream).then(function() {
			fs.unlink(p_doc_file.path, function(err) {
				if(err)
					console.log(err);
			});

		});

		/*params_file = {Bucket: 'ais-dms-document', Key: p_doc_file.originalFilename};
		s3.getSignedUrl('getObject', params_file, function(err, url){
			console.log('The URL is ', url);
			doc_filepath = url;
		});*/
		doc_filepath = aws_url_prefix + p_doc_file.originalFilename;
		doc_filename = p_doc_file.originalFilename;
		//console.log(background_filename);

	}

	var insert_data;
	if(p_is_parent_portal == "portal"){
		insert_data = new Documents({
			title: p_title,
			category: p_doc_category,
			doc_path: doc_filepath,
			doc_filename: doc_filename,
			is_parent_portal: p_is_parent_portal,
			parent_portal_id: p_parent_id
		});
	}
	else if(p_is_parent_portal == "property") {
		insert_data = new Documents({
			title: p_title,
			category: p_doc_category,
			doc_path: doc_filepath,
			doc_filename: doc_filename,
			is_parent_portal: p_is_parent_portal,
			parent_property_id: p_parent_id
		});
	}
	else
	{
		return res.status(500).json('parent error');
	}

	insert_data.save(function(err, inserted_data){
		if(err) return err;
		
	});

	var opts = [
		{path: 'parent_portal_id'},
		{path: 'parent_property_id'},
		{path: 'category'}
	]

	Documents.populate(insert_data, opts, function(err, doc_data) {
		//console.log(doc_data);
		return res.status(200).json(doc_data);
	});

});


router.post('/update', function(req, res, next) {

	var p_doc_file = req.files.file;
	var p_uid = req.body.uid;

	var p_is_parent_portal = req.body.is_parent_portal;
	var p_parent_id = req.body.parent_id;

	var doc_filepath = "";
	var doc_filename = "";
	var params_file;

	Documents.findById(p_uid, function (err, document_data){
		if(typeof p_doc_file !== 'undefined' && p_doc_file !== null){ 
			if(typeof document_data.doc_filename !== 'undefined' && document_data.doc_filename !== null && document_data.doc_filename !== ""){
				var deleteParam = {
					Bucket: 'ais-dms-document',
					Key: document_data.doc_filename
				}
				s3.deleteObject(deleteParam, function(err, data){
					if(err) console.log(err);
					else
						console.log('delete document file on s3');
				});
			}
			// upload new file to s3
			var stream = fs.createReadStream(p_doc_file.path);
			s3fsImpl.writeFile(p_doc_file.originalFilename, stream).then(function() {
				fs.unlink(p_doc_file.path, function(err) {
					if(err)
						console.log(err);
					
				});
			});

			// update db
			/*params_file = {Bucket: 'ais-dms-document', Key: p_doc_file.originalFilename};
			s3.getSignedUrl('getObject', params_file, function(err, url){
				console.log('The URL is ', url);
				doc_filepath = url;
			});*/
			doc_filepath = aws_url_prefix + p_doc_file.originalFilename;
			doc_filename = p_doc_file.originalFilename;
			//console.log(logo_filename);
			document_data.doc_path = doc_filepath;
			document_data.doc_filename = doc_filename;
		}

		if(req.body.category != null)
			document_data.category = req.body.category;
		if(req.body.name != null)
			document_data.title = req.body.name;
		if(p_is_parent_portal != null && (p_is_parent_portal == 'portal' || p_is_parent_portal == 'property')){
			if(p_is_parent_portal == 'portal'){
				document_data.parent_portal_id = p_parent_id;
				document_data.parent_property_id = undefined;
			}
			else
			{
				document_data.parent_property_id = p_parent_id;	
				document_data.parent_portal_id = undefined;
			}
			document_data.is_parent_portal = p_is_parent_portal;
		}
		document_data.save(function (err) {
			if(err) res.json('save_error');

			res.json('update success');
		});
	});

});


router.delete('/', function(req, res, next) {
	var uid = req.body.uid;

	var p_is_parent_portal = req.body.is_parent_portal;
	var p_parent_id = req.body.parent_id;

	Documents.findById(uid, function (err, document_data){
		if(typeof document_data.doc_filename !== 'undefined' && document_data.doc_filename !== null && document_data.doc_filename != ""){
			var deleteParam = {
				Bucket: 'ais-dms-document',
				Key: document_data.doc_filename
			}
			s3.deleteObject(deleteParam, function(err, data){
				if(err) console.log(err);
				else
					console.log('delete file');
			});
		}
		document_data.remove(function(err) {
			if(err) res.json('remove failed');

			res.json('remove success');
		});
	});

});

module.exports = router;
