/**
 * Main application routes(apis)
 */

'use strict';


module.exports = function(app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'));

  app.use('/api/documents', require('./api/document'));

  app.use('/api/doc_category', require('./api/document_cat'));

  app.use('/api/portal', require('./api/portal'));

  app.use('/api/property', require('./api/property'));

  app.use('/api/report_category/', require('./api/report_cat'));

  app.use('/api/reports/', require('./api/report'));

  app.use('/api/contact', require('./api/contact'));

  app.use('/api/template_entity', require('./api/template_entity'));

  //app.use('/api/', require('./api/user'));

  app.use('/auth/register', require('./api/auth/register'));

  app.use('/auth/login', require('./api/auth/login'));

  app.use('/auth/logout', require('./api/auth/logout'));

  app.use('/ping', require('./api/auth/ping'));  

  app.use('/auth/status', require('./api/auth/status'));

  app.use('/auth/forgot', require('./api/auth/forgot'));

  app.use('/auth/reset', require('./api/auth/reset'));

  // app.use('/auth', require('./auth')); 

  // app.use('/api/clients', require('./api/client'));
  // app.use('/api/sites', require('./api/site'));
  // app.use('/api/subusers', require('./api/subuser'));
  // app.use('/api/devices', require('./api/device'));
  // app.use('/api/alerts', require('./api/alerts'));

  // All undefined asset or api routes should return a 404
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //   .get(errors[404]);

  // app.route('/bitbucket-push-hook')
  //   .post(function(req, res) {
  //     if (req.headers['x-event-key'] === 'repo:push') {
  //       console.log('Received a push notification from production, build started...');
  //       var scriptPath = path.normalize(__dirname + '/../../update-prod-dash.sh');
  //       console.log('Build script: ' + scriptPath);
  //       exec('bash ' + scriptPath, function(error, stdout, stderr) {
  //         console.log(stdout);
  //         if (error != null) {
  //           console.log('Error during the execution of redeploy: ' + stderr);
  //         }
  //         var date = new Date();
  //         var filename = 'log_' + date.toISOString() + '.log';
  //         var filepath = path.normalize(__dirname + '/../../buildlogs/');
  //         fs.writeFile(filepath + filename, stdout, function(err) {
  //           if (err) return console.log(err);
  //         });
  //         exec('/opt/bitnami/nodejs/bin/pm2 restart 0');
  //       });
  //     }
  //     res.sendStatus(200);
  //   });

  // app.route('/user')
  //   .get(function(req, res) {
  //     var path = require('path');
  //     var dashIndex = path.normalize(__dirname + '/../dashboard/index.html');
  //     res.sendfile(dashIndex);
  //   });
  // All other routes should redirect to the index.html
  // app.route('/:url(admin|logout)')
  //   .get(function(req, res) {
  //     res.sendfile(app.get('appPath') + '/index.html');
  //   });
};
