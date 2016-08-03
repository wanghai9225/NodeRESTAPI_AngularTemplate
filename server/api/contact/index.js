'use strict';

var express = require('express');
var mongoose = require('mongoose'); 
var contact = require('../../models/contact');
var authJwt = require('../../globals/authJwt');
//var controller = require('./user.controller');
//var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(authJwt);

router.get('/', function(req, res, next) {
	contact.find(function (err, contact_data) {
	  if(err) return console.error(err);
	  res.json(contact_data);
	});
});

router.post('/edit', function(req, res, next) {
	var p_contact = req.body.contact;
	contact.find(function (err, contact_data) {
	  if(err) return console.error(err);
	  contact_data[0].contact = p_contact;

	  contact_data[0].save(function(err) {
	  	if(err) res.status(500).json("failed");
	  	res.status(200).json("Success");
	  });
	});
});


module.exports = router;

