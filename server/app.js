var express = require('express');
var mongoose = require('mongoose'); 
var nodemailer = require('nodemailer');
var passport = require('passport');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
var async = require('async');
var crypto = require('crypto');
//var config = require('./config/db_config');
var cors = require('cors');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();



var routes = require('./routes/index');

// Connect to database
mongoose.connect('mongodb://localhost/dms');
 
var app = express();






// app.use('/users', users);


// passport config
var Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done){
    Account.findOne({ email: email}, function(err, user) {
        if(err) return done(err);
        if(!user) return done(null, false, { message: 'Incorrect user email.'});
        user.comparePassword(password, function(err, isMatch) {
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: 'Incorrect password'});
          }
        });
    });
}));


var consumeRememberMeToken = require('./globals/consumeRememberMeToken');
var saveRememberMeToken = require('./globals/saveRememberMeToken');
var issueToken = require('./globals/issueToken');

passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      console.log(uid);
      if(err) {
        return done(err);
      }
      if(!uid) {
        return done(null, false);
      }


      Account.findById(uid, function(err, user) {
        console.log(user);
        if(err) {return done(err);}
        if(!user) {return done(null, false);}
        return done(null, user)
      })
    });
  },
  issueToken
));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});

//app.use(session({secret: 'session secret key'}));

/*// secret variable
app.set('serverSecret', config.secret);
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set access controll allow origin for the backend api
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, HEAD, PATCH, DELETE',
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
}));

/*app.use(cors());*/


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'dms-secret',
    resave: false,
    saveUninitialized: false,
    httpOnly: false,
    cookie: {
      domain: 'localhost',
      httpOnly: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(express.static(path.join(__dirname, 'public')));




app.use(multipartyMiddleware);


app.use('/', routes);
require('./routes')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





module.exports = app;
