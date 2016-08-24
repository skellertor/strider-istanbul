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
      request(protocol + '://' + hostName + '/' + org + '/' + repo + '/jobs', function (err, response, body) {
        var latestJobId = JSON.parse(body)[0]._id;
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
