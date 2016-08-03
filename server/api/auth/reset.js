var express = require('express');
var passport = require('passport');
var User = require('../../models/account');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

router.get('/:token', function(req, res) {
	var obj = {};
	//console.log(req.params);
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires:{ $gt: Date.now()}}, function(err, user) {

		if(!user) {
			obj.err = 'Password reset token is invalid or has expired';
			return res.status(500).jsonp(obj);
		}
		obj.status = 'Valid token!';
		res.status(200).jsonp(obj);
	});
});

router.post('/:token', function(req, res) {
	var obj = {};
	async.waterfall([
		function(done) {
		  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		    if (!user) {
		      	obj.err = 'Password reset token is invalid or has expired.';
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
});


module.exports = router;
