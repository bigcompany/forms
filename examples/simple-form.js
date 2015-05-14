var forms = require('../');

//console.log(forms)

forms.generate({ resource: {
  "foo": "string",
  "bar": "number"
}, method: "create" }, function (err, result){
  console.log(result)
})