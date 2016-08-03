var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var AccountSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	lastname: String,
	phonenumber: String,
	company: String,
	jobtitle: String,
	portals: [{
		type: Schema.Types.ObjectId,
		ref: 'Portal'
	}],
	properties: [{
		type: Schema.Types.ObjectId,
		ref: 'Property'
	}]
});

AccountSchema.pre('save', function(next) {
	var user = this;
	var SALT_FACTOR = 5;

	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

//AccountSchema.plugin(passportLocalMongoose);

var Account = mongoose.model('Account', AccountSchema);

module.exports = Account;