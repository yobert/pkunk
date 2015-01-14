
var undb = require("github.com/yobert/undb/js/undb");

var store = new undb.Store("tododb", undb.STORES);

module.exports = store;

