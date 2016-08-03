var TokenModel = require('../models/token');



module.exports = function(token, uid, fn) {
  var tk = new TokenModel({token: token, uid: uid});
  tk.save(function(err) {
    if(err) throw err;
  })
  //tokens[token] = uid;
  return fn();
}