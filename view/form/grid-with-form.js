var resource = require('resource'),
    mschemaForms = require('mschema-forms');

module['exports'] = function (opts, cb) {

  var r = opts.resource;
  var html = '';
  var $ = this.$,
    self = this,
    output = '',
    params = opts.params,
    entity = opts.resource || 'unknown';
     mschemaForms.generate({
       type: "generic",
       form: {
         legend: opts.form.create.legend,
         action: opts.action
       },
       schema: opts.schema
      }, function (err, result) {

        $('.grid').append(result);

        if (params.destroy) {
          return entity.destroy(params.id, function (err) {
            if (err) {
              return cb(err);
            }
            finish();
          });
        }

        if (params.submitted) {
          // process posted form data
          entity.create(params, function (err, result){
            if (err) {
              return cb(err);
            }
            finish();
          });
        } else {
          // do nothing
          finish();
        }

        function finish () {
          entity.all(function (err, results) {
            if (err) {
              res.end(err.message);
            }
            if (results.length === 0) {
              cb(null, $.html());
            } else {
              mschemaForms.generate({
                 type: "grid",
                 form: {
                   legend: opts.form.grid.legend
                 },
                 schema: opts.schema,
                 data: results
                }, function (err, re) {
                  if (err) {
                    res.end(err.message);
                  }
                  $('.grid').append(re);
                  cb(null, $.html());
               });
            }
          });
        }

     });

}