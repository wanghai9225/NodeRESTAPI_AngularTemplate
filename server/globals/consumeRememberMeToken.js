var TokenModel = require('../models/token');

module.exports = function(token, fn) {



  TokenModel
      .find({token: token})
      .exec(function(err, data) {
        console.log(data);
        var uid = data[0].uid;
        console.log(uid);
        data[0].remove(function(err){
          if(err) {
            console.log(err);
            //return res.status(500).json("failed");
          }
          else{
            //return res.status(200).json("delete success");
            console.log('return');
            return fn(null, uid);
          }
        });
        //res.json(data);
        
      })

  //var uid = tokens[token];

  //invalidate the single-use token
  //delete tokens[token];
  
}

