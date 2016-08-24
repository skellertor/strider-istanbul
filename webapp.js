'use strict';
var request = require('request');
var j = request.jar();
var fs = require('fs');


module.exports = {
  config: {},
  routes: function (app, context) {
    app.get('/report', function (req, res) {
      var org = req.params.org;
      var repo = req.params.repo;
      var branch = req.query.branch;
      var protocol = req.protocol;
      var hostName = req.get('Host');
      var project = org + '/' + repo;
      var jobsEndpoint = protocol + '://' + hostName + '/' + org + '/' + repo + '/jobs';
      var setCookieStr = '';
      for(var value in req.session.cookie);{
        setCookieStr += (value + '=' + req.session.cookie[value] + '; ');
      }
      var cookie = request.cookie(setCookieStr);
      j.setCookie(cookie, jobsEndpoint);
      request({url: jobsEndpoint, jar: j}, function () {
        request(jobsEndpoint, function(err, response, body){
          res.send(body);
        });
      });

      // var coveragLocation = '~/.strider/data/'+ org + '-' + repo + '-' + branch + '/*/coverage/index.html';
      // res.json({user: req.session});
      // fs.readFile(coveragLocation, 'utf8', function (err, data) {
      //   console.log()
      //   res.render(data);
      // });
      // res.json({yes: app});
      // var jobsEndpoint = protocol + '://' + hostName + '/' + org + '/' + repo + '/jobs';
      // console.log('BODY', body);
      // var latestJobId = JSON.parse(body)[0];
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
