'use strict';
var request = require('request');

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
        var returnObject = (typeof body);
        var url = './.strider/data/'+ org + '-' + repo + '-' + branch;
        res.json({params: returnObject});
      });
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
