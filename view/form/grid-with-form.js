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
         legend: "My Form"
       },
       schema: opts.schema
      }, function (err, result) {

        $('.grid').append(result);

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
            mschemaForms.generate({
               type: "grid",
               form: {
                 legend: "My Form"
               },
               schema: opts.schema,
               data: results
              }, function (err, re) {
                if (err) {
                  res.end(err.message);
                }
                //html += JSON.stringify(result, true, 2);
                $('.grid').append(re);
                cb(err, $.html());
             });
          });
        }

     });

}