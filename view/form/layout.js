module['exports'] = function (data, callback) {
  var $ = this.$;
  callback(null, $.html());
}