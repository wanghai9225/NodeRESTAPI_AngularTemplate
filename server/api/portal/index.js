'use strict';

var express = require('express');
var mongoose = require('mongoose'); 
var portal = require('../../models/portals');
var fs = require('fs');
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
var AWS = require('aws-sdk');
AWS.config.accessKeyId = 'AKIAJ3I6PJ55UPCLJZDA';
AWS.config.secretAccessKey = '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';
var s3 = new AWS.S3();

var s3fsImpl = new S3FS('ais-dms-portal', {
  accessKeyId: 'AKIAJ3I6PJ55UPCLJZDA',
  secretAccessKey: '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'
});

s3fsImpl.create();

var aws_url_prefix = "https://s3.amazonaws.com/ais-dms-portal/";

//var controller = require('./user.controller');
//var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
	portal.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});
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
		/*params_background = {Bucket: 'ais-dms-portal', Key: background_img.originalFilename};
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
		/*params_logo = {Bucket: 'ais-dms-portal', Key: logo_img.originalFilename};
		s3.getSignedUrl('getObject', params_logo, function(err, url){
			console.log('The URL is ', url);
			logo_path = url;
		});*/
		logo_path = aws_url_prefix + logo_img.originalFilename;
		logo_filename = logo_img.originalFilename;
	}
	
	

	var insert_data = new portal({
		title: req.body.name,
		logo_img_path: logo_path,
		logo_img_name: logo_filename,
		color: req.body.color,
		background_img_path: background_path,
		background_img_name: background_filename
	});

	insert_data.save(function(err){
		if(err) return err;
		res.json('uploaded and saved');
	});

	//res.json('uploaded and saved');


	/*portal.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});

router.post('/update', function(req, res, next) {
	
	// id of portal to be updated
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
	portal.findById(uid, function (err, portal_data){
		if(typeof n_logo_img !== 'undefined' && n_logo_img !== null){ 
			if(typeof portal_data.logo_img_name !== 'undefined' && portal_data.logo_img_name !== null && portal_data.logo_img_name !== ""){
				var deleteParam = {
					Bucket: 'ais-dms-portal',
					Key: portal_data.logo_img_name
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

			// update document of portal
			/*params_logo = {Bucket: 'ais-dms-portal', Key: n_logo_img.originalFilename};
			s3.getSignedUrl('getObject', params_logo, function(err, url){
				console.log('The URL is ', url);
				logo_path = url;
			});*/
			logo_path = aws_url_prefix + n_logo_img.originalFilename;
			logo_filename = n_logo_img.originalFilename;
			//console.log(logo_filename);
			portal_data.logo_img_path = logo_path;
			portal_data.logo_img_name = logo_filename;
		}
		if(typeof n_background_img !== 'undefined' && n_background_img !== null) {
			if(typeof portal_data.background_img_name !== 'undefined' && portal_data.background_img_name !== null && portal_data.background_img_name !== ""){
				var deleteParam = {
					Bucket: 'ais-dms-portal',
					Key: portal_data.background_img_name
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

			// update document of portal
			// update document of portal
			/*params_background = {Bucket: 'ais-dms-portal', Key: n_background_img.originalFilename};
			s3.getSignedUrl('getObject', params_background, function(err, url){
				console.log('The URL is ', url);
				background_path = url;
			});*/
			background_path = aws_url_prefix + n_background_img.originalFilename;
			background_filename = n_background_img.originalFilename;
			//console.log(logo_filename);
			portal_data.background_img_path = background_path;
			portal_data.background_img_name = background_filename;
		}

		if(req.body.name != null)
			portal_data.title = req.body.name;
		if(req.body.color != null)
			portal_data.color = req.body.color;
		portal_data.save(function (err) {
			if(err) res.json('save_error');
			res.json('update success');
		})
	});
	//console.log('pulled_data: ' + pulled_data.logo_img_name);

	/*portal.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});

router.delete('/', function(req, res, next) {
	var uid = req.body.uid;

	portal.findById(uid, function (err, portal_data){
		if(typeof portal_data.logo_img_name !== 'undefined' && portal_data.logo_img_name !== null && portal_data.logo_img_name != ""){
			var deleteParam = {
				Bucket: 'ais-dms-portal',
				Key: portal_data.logo_img_name
			}
			s3.deleteObject(deleteParam, function(err, data){
				if(err) console.log(err);
				else
					console.log('delete logo');
			});
		}
		if(typeof portal_data.background_img_name !== 'undefined' && portal_data.background_img_name !== null && portal_data.background_img_name != ""){
			var deleteParam = {
				Bucket: 'ais-dms-portal',
				Key: portal_data.background_img_name
			}
			s3.deleteObject(deleteParam, function(err, data){
				if(err) console.log(err);
				else
					console.log('delete background');
			});
		}
		portal_data.remove();
	});

	res.json('portal deleted');
	// delete file on s3


	/*portal.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});*/
});

router.put('/', function(req, res, next) {
	portal.find(function (err, data) {
	  if(err) return console.error(err);
	  res.json(data);
	});
});

module.exports = router;

