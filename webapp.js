'use strict';

module.exports = {
  config: {},
  routes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({project: req.project});
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
