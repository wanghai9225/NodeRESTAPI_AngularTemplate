var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var router = express.Router();

router.get('/', function(req, res) {
	res.clearCookie('remember_me');
	req.logout();
	res.status(200).json({
		status: 'Bye!'
	});
});

module.exports = router;