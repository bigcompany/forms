var resource = require('resource'),
    forms = resource.define('forms'),
    mschemaForms = require('mschema-forms');


var view = require('view');

forms.schema.description = "for generating HTML forms";

forms.method("generate", generate, { 
  "resource": {
    "type": "object",
    "required": true,
    "default": {}
  },
  "data": {
    "type": "object",
    "required": false
  }
});

forms.method('middleware', middleware);

function middleware (opts) {

  opts = opts || {};

  return function (req, res, next) {
    var entity = opts.resource || 'unknown';
     opts.method = opts.method || opts.view;
     opts.params = req.resource.params;
     view.create({ path: __dirname + '/view', input: "html" }, function (err, view) {
       var str = '', form;
       form = view.form[opts.method] || view.form['method'];
       opts.action = opts.action || "/form";
       form.present(opts, function (err, html) {
         if (err) {
           res.end(err.message);
           return;
         }
         res.setHeader('Content-Type', 'text/html');
         res.end(html);
       });
     });
   };

};

function generate (options, callback) {
  view.create({ path: __dirname + '/view', input: "html"  }, function (err, view) {
    var str = '', form;
    form = view.form[options.method] || view.form[options.view];
    if (typeof form === "undefined") {
      return callback(new Error('no form found'));
    }
    form.present(options, function(err, res){
      return callback(err, res);
    });
  });
};

module['exports'] = forms;