var React = require('react');

var datamixin = require('./datamixin');

var Item = React.createClass({
	mixins: [datamixin],

	dclass: 'item',
	dpkey: 'item_id',

	itemTitle: function(event) {
		//this.setState({item_title: event.target.value});
		this.selfPub({item_title: event.target.value});
	},

	getInitialState: function() {
		return {'item_title': ''};
	},

	render: function() {
		return (
			<div>
				Item Title: <input type="text" size="30" value={this.state.item_title} onChange={this.itemTitle} autoFocus={true} />
			</div>
		);
	}
});

module.exports = Item;
