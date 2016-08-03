var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var Account = require('../../models/account');
var config = require('../../config');
var router = express.Router();


var app = express();
// router.get('/', function(req, res) {
// 	res.render('login', { user: req.user });
// });

router.post('/', passport.authenticate('local'), function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		//console.log(user);
		/*var obj = {};*/
		if(err) {
			return next(err);
		}
		if(!user) {
			
			return res.status(401).json(info);
		}
		//console.log('login');
		var issueToken = require('../../globals/issueToken');
		//console.log(req.query);
		console.log(req.query.remember_me);
		if(req.query.remember_me == 'true') {
			//console.log(user);
			console.log('rememberme');
			issueToken(user, function(err, token) {
				if(err) { return next(err);}
				res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 604800000, domain: 'localhost'});
			});
		}

		req.logIn(user, function(err) {
			if(err) {
				//var obj = {};
				//console.log(err);
				//obj.err = 'Could not log in user';
				return res.status(500).json('Could not log in user');
			}
			var secret = config.secret;
			//create a token for authorization
			var authToken = jwt.sign(user, secret, { expiresIn: 60*60*24 });
			//console.log(authToken);
			//console.log(req);
			//obj.status = 'Login successful!';
			//var request = req;


			//var cookie_val = res.cookies['connect.sid'];
			//console.log(req);
			var returnJson = {
				success: true,
				message: 'Login successful!',
				token: authToken
			};

			//console.log(returnJson);
			res.status(200).json(returnJson);

			//console.log('json after');

			//res.json('successful');
		});
	})(req, res, next);
});

/*router.post('/', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		var obj = {};
		if(err) return next(err)
		if(!user) {
			obj.err = info;
			return res.status(401).jsonp(obj);
		}
		

		req.logIn(user, function(err) {
			if(err) {
				obj.err = err;
				return res.status(500).jsonp(obj);
			}

			// create a token for authorization
			var authToken = jwt.sign(user, app.get('serverSecret'), {
				expiresInMinutes: 1440 // expires in 24 hours
			});

			//obj.status = 'Login successful!';
			res.status(200).json({
				success: true,
				message: 'Login successful!',
				token: authToken
			});
		});
	})(req, res, next);
});*/

module.exports = router;
