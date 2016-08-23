'use strict';
var fs = require('fs');
var path = require('path');

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
          cmd: "istanbul cover -x '**/node_modules/**' _mocha --  -R json-cov"
        }, function (err, stdout) {
          if(err){
            self.env.error = true;
          }
          console.log(stdout);
          if(self.env.error) return done(err);
          done();
        });
      }
    });
  }
};
