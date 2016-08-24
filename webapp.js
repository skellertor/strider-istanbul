'use strict';
var request = require('request');
var fs = require('fs');
var Job = require('../../lib/models/job');


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
      Job.find({project: project}).sort({finished: -1},function (err, docs) {
        var id = docs[0]._id;
        var coveragLocation = '~/.strider/data/'+ org + '-' + repo + '-' + branch + '/job-' + id +'/coverage/index.html';
        fs.readFile(coveragLocation, 'utf8', function (err, data) {
          console.log(data, err);
          res.send(data);
        });
      });
      // request({url: jobsEndpoint}, function (er, response, body) {
      //   var myCookie = request.cookie(response.headers['set-cookie'][0]);
      //   var cookieJar = request.jar();
      //   cookieJar.setCookie(myCookie, jobsEndpoint);
      //   request({url: jobsEndpoint, jar: cookieJar}, function(err, response, body){
      //     res.send(body);
      //   });
      // });

      // res.json({user: req.session});

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
