'use strict';

module.exports = {
  globalRoutes: function (app) {
    app.get('/report', function (req, res) {
      res.json({report: 'hello'});
    });
  }
};
