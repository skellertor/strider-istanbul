'use strict';

module.exports = {
  routes: function(app){
    app.get('/report', function (req, res) {
      res.json({report: 'hello'});
    });
  }
};
