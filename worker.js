'use strict';

module.exports = {
  init: function (config, job, context, cb) {
    return cb(null, {
      // any extra env variables. Will be available during all phases
      env: {
        error: false
      },
      test: function (context, done) {
        var self = this;
        context.cmd({
          cmd: 'nyc --reporter=none --all _mocha -R json-cov'
        }, function (err, stdout) {
          if(err){
            self.env.error = true;
          }
          var beginOfJson = stdout.indexOf('{');
          var jsonString = stdout.substr(beginOfJson, stdout.length);
          var report;
          try {
            report = JSON.parse(jsonString);
          } catch (e) {
            return done(new Error('coverage report not json'));
          }
          job.test_results = {
            stats: report.stats
          };
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
            context.cmd({
              cmd: 'nyc report --reporter=html'
            }, function(err, stdout){
              if(self.env.error) return done(err);
              done();
            });
          });
        });
      }
    });
  }
};
