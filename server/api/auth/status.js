var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var router = express.Router();

router.get('/', function(req, res) {
	/*var obj = {};*/
	//console.log(req);
	if(!req.isAuthenticated()) {
		return res.status(200).json({
			status: false
		});
	}
	res.status(200).json({
		status: true
	});
});

module.exports = router;