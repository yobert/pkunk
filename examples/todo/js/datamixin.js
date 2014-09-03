var ps = require('./pubsub');

var next_id = 0;

function dataChanged(payload) {
	this.setState(payload);
}

var datamixin = {
	getInitialState: function() {
		var state = {};

		//if(!this.props[this.dpkey])

		if(!state._local_id) {
			state._local_id = 'lk' + (next_id++);
			this.notify_list_after_mount = true;
		}

		return state;
	},

	pubsubKey: function() {
		return 'data_' + this.dclass + '_' + this.state._local_id;
	},

	componentDidMount: function() {
		this.pubsub_handle = ps.sub(this.pubsubKey(), this, dataChanged);
		if(this.notify_list_after_mount) {
			ps.pub('datalist_' + this.dclass, {'_local_id': this.state._local_id});
			delete this.notify_list_after_mount;
		}
	},

	componentWillUnmount: function() {
		ps.unsub(this.pubsub_handle);
	},

	selfPub: function(payload) {
		payload._local_id = this.state._local_id;

		//console.log(payload);

		ps.pub(this.pubsubKey(), payload);
		ps.pub('datalist_' + this.dclass, payload);
	},

	'dataChanged': dataChanged
};

module.exports = datamixin;
