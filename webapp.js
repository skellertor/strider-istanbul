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
      var project = org + '/' + repo;
      var coveragLocation = '~/.strider/data/'+ org + '-' + repo + '-' + branch + '/job-' + '/coverage/index.html';
      // res.render(coveragLocation);
      res.json({yes: context});
      // var jobsEndpoint = protocol + '://' + hostName + '/' + org + '/' + repo + '/jobs';
      // console.log('BODY', body);
      // var latestJobId = JSON.parse(body)[0];
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  },
  listen: function(io, context) {
    io.on('plugin.strider-istanbul.done', function (jobId) {
      console.log('STRIDER DONE');
      context.job_id = jobId;
    });
  }
};
