'use strict';
var request = require('request');
var fs = require('fs');

module.exports = {
  config: {},
  routes: function (app, context) {
    app.get('/report', function (req, res) {
      var org = req.params.org;
      var repo = req.params.repo;
      var branch = req.body.branch;
      var protocol = req.protocol;
      var hostName = req.get('Host');
      var jobsEndpoint = protocol + '://' + hostName + '/' + org + '/' + repo + '/jobs';
      console.log('JOBS',jobsEndpoint)
      request(jobsEndpoint, function (err, response, body) {
        console.log('BODY', body);
        var latestJobId = JSON.parse(body)[0];
        var coveragLocation = '~/.strider/data/'+ org + '-' + repo + '-' + branch + '/job-' + latestJobId + '/coverage/index.html';
        res.render(coveragLocation);
      });
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
