'use strict';

module.exports = {
  config: {},
  routes: function (app, context) {
    app.get('/report', function (app, context) {
      res.json({context: context});
    });
  },
  globalRoutes: function (app, context) {
    app.get('/report', function (req, res) {
      res.json({context: context});
    });
  }
};
