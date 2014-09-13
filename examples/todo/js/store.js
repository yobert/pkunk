
var undb = require("github.com/yobert/undb/js/undb");

var store = undb.Init("base db");

module.exports = store;

