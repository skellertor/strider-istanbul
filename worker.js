'use strict';
var fs = require('fs');

const debug = require('debug')('strider-template:worker');

module.exports = {
  // Initialize the plugin for a job
  //   config: the config for this job, made by extending the DB config
  //           with any flat-file config
  //   job:    see strider-runner-core for a description of that object
  //   context: currently only defines "dataDir"
  //   cb(err, initializedPlugin)
  init: function (config, job, context, cb) {
    return cb(null, {
      // any extra env variables. Will be available during all phases
      env: {
        test_results: {},
        error: false
      },
      listen: function (emitter, context) {
      },
      test: function (context, done) {
        var self = this;
        context.cmd({
          cmd: "istanbul cover -x '**/node_modules/**' _mocha --  -R mocha-spec-json-reporter"
        }, function (err, stdout) {
          if(err){
            self.env.error = true;
          }
          fs.readFile('./mocha-output.json', 'utf8',function (err, data) {
            console.log('DATA', data);
            var jsonObject = JSON.parse(data);
            self.env.test_results = jsonObject;
            if(self.env.error) return done(err);
            done();
          });
        });
      }
    });
  }
};
