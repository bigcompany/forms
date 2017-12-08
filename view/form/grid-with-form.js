var mschemaForms = require('mschema-forms');

module['exports'] = function (opts, cb) {

  var r = opts.resource;
  var html = '';
  var $ = this.$,
    self = this,
    output = '',
    params = opts.params || {},
    query = opts.query || {},
    entity = opts.resource || 'unknown';
     mschemaForms.generate({
       type: "generic",
       form: {
         submit: opts.form.create.submit,
         legend: opts.form.create.legend,
         action: opts.action
       },
       schema: opts.schema
      }, function (err, result) {

        $('.grid').append(result);

        if (params.destroy) {
          // TODO: add role check
          return entity.destroy(params.id, function (err) {
            if (err) {
              return cb(err);
            }
            finish();
          });
        }
        if (typeof params.submitted !== 'undefined') {
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

          // why is there a databind happening here? did we need this scope somewhere else for another feature?
          entity.find.call({ req: opts.req, res: opts.res }, query, function (err, results) {
            if (err) {
              return opts.res.end(err.message);
            }

            results = results.filter(function (item) {
              if (item.key_type === "internal") {
                return false;
              }
              return true;
            });

            if (opts.req.jsonResponse) {
              return opts.res.json(results);
            }
            if (results && results.length === 0) {
              cb(null, $.html());
            } else {
              mschemaForms.generate({
                 type: "grid",
                 form: opts.form.grid,
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