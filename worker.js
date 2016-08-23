'use strict';
module.exports = {
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
          cmd: 'nyc _mocha'
        }, function (err, stdout) {
          if(err){
            self.env.error = true;
          }
          context.cmd({
            cmd: 'nyc report --reporter=text-summary'
          }, function (err, stdout) {
            if(err){
              self.env.error = true;
            }
            var index = stdout.indexOf('=');
            var valid  = stdout.substr(index, stdout.length);
            valid = valid.replace(/=/g, '');
            job.coverage_results = valid;
            if(self.env.error) return done(err);
            done();
          });
        });
      }
    });
  }
};
