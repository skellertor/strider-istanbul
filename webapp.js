'use strict';
var request = require('request');
var fs = require('fs');
var Job = require('../../lib/models/job');
var _ = require('underscore');
var location = __dirname;

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
      var options = {
        limit: 1,
        sort: [['finished', 'desc']]
      };
      Job.find({ project: project, archived: null}, options, function(err, docs){
        var id = docs[0]._id;
        var home = process.env.HOME;
        var coverageLocation = home + '/.strider/data/'+ org + '-' + repo + '-' + branch + '/job-' + id +'/coverage';
        fs.readdir(coverageLocation, function (err, file) {
          var promises = [];
          var valid = [];
          _.each(file, function (item) {
            var index = item.indexOf('.');
            if (index !== -1) {
              var extension = item.substr(index, item.length);
              if (extension === '.js' || extension === '.html' || extension === '.css') {
                valid.push(item);
              }
            }
          });
          _.each(valid, function (item) {
            var index = item.indexOf('.');
            var extension = item.substr(index, item.length);
            var temp = (function (src) {
              return new Promise(function (resolve, reject) {
                var filePath = coverageLocation + '/' + src;
                fs.readFile(filePath, function (err, data) {
                  var returnData = '';
                  switch(extension){
                    case '.js':
                      returnData = '<script>' + data + '</script>';
                      break;
                    case '.css':
                      returnData = '<style>' + data + '</style>';
                      break;
                    default:
                      returnData = data;
                  }
                  resolve(returnData);
                });
              });
            })(item);
            promises.push(temp);
          });
          Promise.all(promises).then(function(finalStrings){
            var fileStrings = '';
            _.each(finalStrings, function (item) {
              fileStrings += item;
            });
            var anchor = /<a[\s]+[^>]*?href[\s]?=[\s\"\']*(.*?)[\"\']*.*?>([^<]+|.*?)?<\/a>/ig;
            fileStrings.replace(anchor, '<p>Test</p>');
            res.send(fileStrings);
          });
        });
      });
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
