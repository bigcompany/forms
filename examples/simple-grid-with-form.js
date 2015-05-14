var forms = require('../');

var http = require('resource-http');

// simple resource for managing web domains
var domain = require('./domain');
domain.persist('memory');

// console.log(domain.schema.properties);

var middle = forms.middleware({ 
  form: 'grid-with-form',
  resource: domain,
  schema: { 
    name: { 
      type: 'string',
      default: 'marak.com',
      required: true,
      minLength: 1,
      maxLength: 50 },
    owner: { 
      type: 'string', 
      required: true 
    } 
  }
});

http.listen({ bodyParser: true }, function (err, app){
  app.use('/form', middle);
});