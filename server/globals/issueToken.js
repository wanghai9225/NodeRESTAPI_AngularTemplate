var saveRememberMeToken = require('./saveRememberMeToken');
var utils = require('./utils');

module.exports = function(user, done) {
  var token = utils.randomString(64);
  //console.log('issue token: ' + token);
  saveRememberMeToken(token, user._id, function(err) {
    if(err) {return done(err);}
    return done(null, token);
  });
}

