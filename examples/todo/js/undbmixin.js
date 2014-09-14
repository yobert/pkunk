
var store = require('./store');

var undbmixin = {
	componentWillMount: function() {
		this._grabs = {};
	},
	componentWillUnmount: function() {
		var s;
		for(var path in this._grabs) {
			s = this._grabs[path];
			s.removeListener('CHANGE', this.storeUpdated);
		}
		delete this._grabs;
	},
	storeUpdated: function() {
		this.forceUpdate();
	},
	grab: function(path) {
		var s = this._grabs[path];
		if(!s) {
			s = store.Find(path);
			if(!s)
				throw("Grab failed: Unable to find path '" + path + "' in store '" + store.Name + "'");

			s.addListener('CHANGE', this.storeUpdated);
			this._grabs[path] = s;
		}

		return s;
	}
};

module.exports = undbmixin;
