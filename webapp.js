'use strict';

module.exports = {
  routes: function(app){
    app.get('/:org/:repo/report', function (req, res) {
      res.json({report: 'hello'});
    });
  }
};
