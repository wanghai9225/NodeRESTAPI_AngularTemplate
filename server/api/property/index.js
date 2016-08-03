'use strict';

var express = require('express');
var mongoose = require('mongoose'); 
var property = require('../../models/property');

var fs = require('fs');
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
var AWS = require('aws-sdk');
AWS.config.accessKeyId = 'AKIAJ3I6PJ55UPCLJZDA';
AWS.config.secretAccessKey = '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';
var s3 = new AWS.S3();

var s3fsImpl = new S3FS('ais-dms-property', {
  accessKeyId: 'AKIAJ3I6PJ55UPCLJZDA',
  secretAccessKey: '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'
});

s3fsImpl.create();

var aws_url_prefix = "https://s3.amazonaws.com/ais-dms-property/";

//var controller = require('./user.controller');
//var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
	property.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	let id = req.params.id;

	property.find({parent_portal: id}, (err, data) => {
		if(err) return next(err);
		
	  res.json(data);
	})
});

router.post('/multiple', function(req, res, next) {
	//console.log(req.query);
	var portals_data = req.body.portals_data;
	//console.log(portals_data);
	var query; 
	var queryObj = {};
	var queryOr = [];
	for(var i = 0; i < Object.keys(portals_data).length; i++){
		var item = {parent_portal: portals_data[i]._id};
		queryOr.push(item);
	}
	queryObj = {$or: queryOr};
	console.log(queryObj);

	property.find(queryObj, (err, data) => {
		if(err) return next(err);
		return res.json(data);
	});	

	
});

router.put('/', function(req, res, next) {
	property.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});
});

router.delete('/', function(req, res, next) {

	var uid = req.body.uid;

	property.findById(uid, function (err, property_data){
		if(typeof property_data.logo_img_name !== 'undefined' && property_data.logo_img_name !== null && property_data.logo_img_name != ""){
			var deleteParam = {
				Bucket: 'ais-dms-property',
				Key: property_data.logo_img_name
			}
			s3.deleteObject(deleteParam, function(err, data){
				if(err) console.log(err);
				else
					console.log('delete logo');
			});
		}
		if(typeof property_data.background_img_name !== 'undefined' && property_data.background_img_name !== null && property_data.background_img_name != ""){
			var deleteParam = {
				Bucket: 'ais-dms-property',
				Key: property_data.background_img_name
			}
			s3.deleteObject(deleteParam, function(err, data){
				if(err) console.log(err);
				else
					console.log('delete background');
			});
		}
		property_data.remove();
	});

	res.json('property deleted');

	
	/*property.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});

router.post('/create', function(req, res, next) {

	var background_img = req.files.background_img;
	var logo_img = req.files.logo_img;
	
	var params_logo;
	var logo_path = "";
	var logo_filename = "";
	
	var params_background;
	var background_path = "";
	var background_filename = "";
	
	//console.log(req.files);
	if(background_img != null){

		var stream = fs.createReadStream(background_img.path);
		s3fsImpl.writeFile(background_img.originalFilename, stream).then(function() {
			fs.unlink(background_img.path, function(err) {
				if(err)
					console.log(err);
				
			});
			
		});
		/*params_background = {Bucket: 'ais-dms-property', Key: background_img.originalFilename};
		s3.getSignedUrl('getObject', params_background, function(err, url){
			console.log('The URL is ', url);
			background_path = url;
		});*/
		background_path = aws_url_prefix + background_img.originalFilename;
		background_filename = background_img.originalFilename;
		console.log(background_filename);
	}
	
	if(logo_img != null) {

		var stream = fs.createReadStream(logo_img.path);
		s3fsImpl.writeFile(logo_img.originalFilename, stream).then(function() {
			fs.unlink(logo_img.path, function(err) {
				if(err)
					console.log(err);
				
			});
			
		});
		/*params_logo = {Bucket: 'ais-dms-property', Key: logo_img.originalFilename};
		s3.getSignedUrl('getObject', params_logo, function(err, url){
			console.log('The URL is ', url);
			logo_path = url;
		});*/
		logo_path = aws_url_prefix + logo_img.originalFilename;
		logo_filename = logo_img.originalFilename;
	}
	
	var parent_portal_id = req.body.parent_portal;

	var insert_data = new property({
		title: req.body.name,
		logo_img_path: logo_path,
		logo_img_name: logo_filename,
		color: req.body.color,
		background_img_path: background_path,
		background_img_name: background_filename,
		parent_portal: parent_portal_id
	});

	insert_data.save(function(err){
		if(err) return err;
		res.json('uploaded and saved');
	});


	/*property.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});


router.post('/update', function(req, res, next) {
	
	// id of property to be updated
	var uid = req.body.uid;
	var n_background_img = req.files.background_img;
	var n_logo_img = req.files.logo_img;

	var params_logo;
	var logo_path = "";
	var logo_filename = "";
	
	var params_background;
	var background_path = "";
	var background_filename = "";

	// delete s3 files uploaded before
	//console.log(uid);
	property.findById(uid, function (err, property_data){
		if(typeof n_logo_img !== 'undefined' && n_logo_img !== null){ 
			if(typeof property_data.logo_img_name !== 'undefined' && property_data.logo_img_name !== null && property_data.logo_img_name !== ""){
				var deleteParam = {
					Bucket: 'ais-dms-property',
					Key: property_data.logo_img_name
				}
				s3.deleteObject(deleteParam, function(err, data){
					if(err) console.log(err);
					else
						console.log('delete logo');
				});
			}
			// upload new logo to s3
			var stream = fs.createReadStream(n_logo_img.path);
			s3fsImpl.writeFile(n_logo_img.originalFilename, stream).then(function() {
				fs.unlink(n_logo_img.path, function(err) {
					if(err)
						console.log(err);
					
				});
			});

			// update document of property
			/*params_logo = {Bucket: 'ais-dms-property', Key: n_logo_img.originalFilename};
			s3.getSignedUrl('getObject', params_logo, function(err, url){
				console.log('The URL is ', url);
				logo_path = url;
			});*/
			logo_path = aws_url_prefix + n_logo_img.originalFilename;
			logo_filename = n_logo_img.originalFilename;
			//console.log(logo_filename);
			property_data.logo_img_path = logo_path;
			property_data.logo_img_name = logo_filename;
		}
		if(typeof n_background_img !== 'undefined' && n_background_img !== null) {
			if(typeof property_data.background_img_name !== 'undefined' && property_data.background_img_name !== null && property_data.background_img_name !== ""){
				var deleteParam = {
					Bucket: 'ais-dms-property',
					Key: property_data.background_img_name
				}
				s3.deleteObject(deleteParam, function(err, data){
					if(err) return(err);
					else
						console.log('delete background');
				});
			}
			// upload new background to s3
			var stream = fs.createReadStream(n_background_img.path);
			s3fsImpl.writeFile(n_background_img.originalFilename, stream).then(function() {
				fs.unlink(n_background_img.path, function(err) {
					if(err)
						console.log(err);
					
				});
				
			});

			// update document of property
			// update document of property
			/*params_background = {Bucket: 'ais-dms-property', Key: n_background_img.originalFilename};
			s3.getSignedUrl('getObject', params_background, function(err, url){
				console.log('The URL is ', url);
				background_path = url;
			});*/
			background_path = aws_url_prefix + n_background_img.originalFilename;
			background_filename = n_background_img.originalFilename;
			//console.log(logo_filename);
			property_data.background_img_path = background_path;
			property_data.background_img_name = background_filename;
		}

		if(req.body.name != null)
			property_data.title = req.body.name;
		if(req.body.color != null)
			property_data.color = req.body.color;
		if(req.body.parent_portal != null)
			property_data.parent_portal_id = req.body.parent_portal_id;
		property_data.save(function (err) {
			if(err) res.json('save_error');
			res.json('update success');
		})
	});
	//console.log('pulled_data: ' + pulled_data.logo_img_name);

	/*property.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});

module.exports = router;

