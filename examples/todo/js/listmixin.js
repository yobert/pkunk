var ps = require('./pubsub');
var mergeInto = require('react/lib/mergeInto');

var next_id = 0;

function dataChanged(payload) {

	if(!payload._local_id)
		throw('dataChanged() got payload without _local_id: ' + JSON.stringify(payload));

	var list = this.state.data_list;

	var idx = {};
	array_each(list, function(v, k) {
		idx[v._local_id] = k;
	});

	var i = idx[payload._local_id];

	if(i !== undefined) {
		mergeInto(list[i], payload);
	} else {
		list.push(payload);
	}

	this.setState({'data_list':list});
}

var listmixin = {
	getInitialState: function() {
		return {'data_list':[]};
	},

	pubsubKey: function() {
		return 'datalist_' + this.dclass;
	},

	componentDidMount: function() {
		this.pubsub_handle = ps.sub(this.pubsubKey(), this, dataChanged);
	},

	componentWillUnmount: function() {
		ps.unsub(this.pubsub_handle);
	},

	selfPub: function(payload) {
		ps.pub(this.pubsubKey(), payload);
	},

	'dataChanged': dataChanged
};

module.exports = listmixin;
