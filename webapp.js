'use strict';

module.exports = {
  config: {},
  globalRoutes: function (app) {
    app.get('/report', function (req, res) {
      res.json({dir: __dirname});
    });
  }
};
