var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var utils = require('../../globals/utils');
var nodemailer = require('nodemailer');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('register', { });
});

router.post('/', function(req, res) {
	/*Account.register(new Account({ username: req.body.email}), req.body.password, function(err, account) {
		if(err) {
			return res.status(500).json({err: err});
		}

		passport.authenticate('local')(req, res, function() {
			return res.status(200).json({
				status: 'Registration successful!'
			});
		});
	});*/


	// generate password randomly
	var p_password = utils.randomString(10);
	

	// get array from the request
	var p_portals = req.body.portals;
	var p_properties = req.body.properties;


/*	var p_portals = ['579223ef8aeb83341019b495', '579223ef8aeb83341019b492', '579223ef8aeb83341019b493'];
	var p_properties = ['579223ef8ae113341019b495', '579223ef8aeb83341119b492', '579223ef8aeb13341019b493'];
*/
	// Below is avoiding passport-local module usage
	var user = new Account({
		username: req.body.username,
		email: req.body.email,
		password: p_password,
		lastname: req.body.lastname,
		phonenumber: req.body.phonenumber,
		company: req.body.company,
		jobtitle: req.body.jobtitle,
		portals: p_portals,
		properties: p_properties
	});

	user.save(function(err) {
		if(err){
			return res.status(500).json({err: err});
		}
		console.log(p_password);
		// send welcome email to the user with password
		var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'SendGrid',
			auth: {
			  user: '!!! YOUR SENDGRID USERNAME !!!',
			  pass: '!!! YOUR SENDGRID PASSWORD !!!'
			}
		});
		var mailOptions = {
			to: user.email,
			from: 'registration@demo.com',
			subject: 'You account has been successfully registered',
			text: 'Hello,\n\n' +
			  'Your password is ' + p_password
		};
		smtpTransport.sendMail(mailOptions, function(err) {
			if(err) return res.status(500).json(err);
			var obj = {};
			obj.status = 'Success! Account has been created.';
			return res.status(200).jsonp(obj);

		});

		/*passport.authenticate('local')(req, res, function() {
			return res.status(200).json({
				status: 'Registration successful!'
			});
		});*/

	})
});

module.exports = router;