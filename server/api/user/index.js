'use strict';

var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');

var router = express.Router();

router.get('/', function(req, res, next) {
	Account.find(function (err, accounts_data) {
	  if(err) return console.error(err);
	  /*var returnJson = [];
	  for(var i = 0; i < accounts_data.length; i++){
	  	//console.log(i);
	  	//console.log(accounts_data[i]._id);
	  	var jsonData = {};
	  	jsonData.id = i;
	  	jsonData.username = accounts_data[i].username;
	  	jsonData.email = accounts_data[i].email;
	  	jsonData.lastname = accounts_data[i].lastname;
	  	jsonData.phonenumber = accounts_data[i].phonenumber;
	  	jsonData.company = accounts_data[i].company;
	  	jsonData.jobtitle = accounts_data[i].jobtitle;
	  	jsonData.properties = accounts_data[i].properties;
	  	jsonData.portals = accounts_data[i].portals;
	  	jsonData.uid = accounts_data[i]._id;
	  	//accounts_data[i].id = i;
	  	//console.log(accounts_data[i].id);
	  	//delete accounts_data[i]._id;
	  	returnJson.push(jsonData);
	  }*/
	  //console.log(returnJson);
	  res.json(accounts_data);

	});
});

router.post('/edit', function(req, res, next) {
	var p_uid = req.body.uid;
	var p_username = req.body.username;
	var p_email = req.body.email;
	var p_lastname = req.body.lastname;
	var p_phonenumber = req.body.phonenumber;
	var p_company = req.body.company;
	var p_jobtitle = req.body.jobtitle;
	var p_portals = req.body.portals;
	var p_properties = req.body.properties;

	// var p_portals = ['779223ef8aeb83341019b495', '579223ef8aeb83341019b492', '579223ef8aeb83341019b493'];
	// var p_properties = ['779223ef8ae113341019b495', '579223ef8aeb83341119b492', '579223ef8aeb13341019b493'];

	Account.findById(p_uid, function (err, account_data){
		if(err) return res.status(500).json(err);
		if(p_username) account_data.username = p_username;
		if(p_email) account_data.email = p_email;
		if(p_lastname) account_data.lastname = p_lastname;
		if(p_phonenumber) account_data.phonenumber = p_phonenumber;
		if(p_company) account_data.company = p_company;
		if(p_jobtitle) account_data.jobtitle = p_jobtitle;
		if(p_portals) account_data.portals = p_portals;
		if(p_properties) account_data.properties = p_properties;

		account_data.save(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json('update failed');
			}
			//console.log("success");
			return res.status(200).json('update success');
		});
	});

});

router.post('/update', function(req, res, next) {
	var p_uid = req.body.uid;
	var p_username = req.body.username;
	var p_email = req.body.email;
	var p_lastname = req.body.lastname;
	var p_phonenumber = req.body.phonenumber;
	var p_company = req.body.company;
	var p_jobtitle = req.body.jobtitle;
	var p_portals = req.body.portals;
	var p_properties = req.body.properties;
	var p_password = req.body.password;

	// var p_portals = ['879223ef8aeb83341019b495', '579223ef8aeb83341019b492', '579223ef8aeb83341019b493'];
	// var p_properties = ['879223ef8ae113341019b495', '579223ef8aeb83341119b492', '579223ef8aeb13341019b493'];

	Account.findById(p_uid, function (err, account_data){
		if(err) return res.status(500).json(err);
		if(p_username) account_data.username = p_username;
		if(p_email) account_data.email = p_email;
		if(p_lastname) account_data.lastname = p_lastname;
		if(p_phonenumber) account_data.phonenumber = p_phonenumber;
		if(p_company) account_data.company = p_company;
		if(p_jobtitle) account_data.jobtitle = p_jobtitle;
		if(p_portals) account_data.portals = p_portals;
		if(p_properties) account_data.properties = p_properties;
		if(p_password) account_data.password = p_password;

		account_data.save(function(err){
			if(err) {
				console.log(err);
				return res.status(500).json('update failed');
			}
			//console.log("success");
			return res.status(200).json('update success');
		});
	});

});


router.post('/resetpassword', function(req, res, next) {

	var p_newpassword = req.body.password;
	var p_uid = req.body.uid;

	var obj = {};
	async.waterfall([
		function(done) {
		  Account.findById(p_uid, function (err, user){
		    if (!user) {
		      	obj.err = 'User does not exist';
				return res.status(500).jsonp(obj);
		    }

		    user.password = req.body.password;
		    user.resetPasswordToken = undefined;
		    user.resetPasswordExpires = undefined;

		    user.save(function(err) {
		      req.logIn(user, function(err) {
		        done(err, user);
		      });
		    });
		  });
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'SendGrid',
			auth: {
			  user: '!!! YOUR SENDGRID USERNAME !!!',
			  pass: '!!! YOUR SENDGRID PASSWORD !!!'
			}
			});
			var mailOptions = {
			to: user.email,
			from: 'passwordreset@demo.com',
			subject: 'Your password has been changed',
			text: 'Hello,\n\n' +
			  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
			obj.status = 'Success! Your password has been changed.';
			return res.status(200).jsonp(obj);

			});
		}
	], function(err) {
    res.redirect('/');
  });

}

module.exports = router;

