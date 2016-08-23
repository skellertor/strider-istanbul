'use strict';

module.exports = function (context, done) {
  context.app.get('/:org/:repo/report', function (req, res) {
    res.json({report: 'hello'});
  });
  done();
};
