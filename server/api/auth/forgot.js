var express = require('express');
var passport = require('passport');
var User = require('../../models/account');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
	var obj = {};
	//console.log(req.query);
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({email: req.query.email}, function(err, user) {

				if(!user) {
					obj.err = 'No account with that email address exists.';
					return res.status(500).jsonp(obj);
				}
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				console.log(token);
				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
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
		        subject: 'Node.js Password Reset',
		        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
		          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	        };
	        smtpTransport.sendMail(mailOptions, function(err) {
	            //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
	            obj.status = 'An e-mail has been sent to ' + user.email + ' with further instructions.';
				return res.status(200).jsonp(obj);

	        });
		}
	], function(err) {
		if(err) return next(err);
	});
});

router.get('/')

module.exports = router;
