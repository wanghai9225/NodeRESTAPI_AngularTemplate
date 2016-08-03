var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var router = express.Router();

router.get('/', function(req, res) {
	res.status(200).send("ping!");
})

module.exports = router;