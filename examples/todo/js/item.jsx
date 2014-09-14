var React = require('react');

var datamixin = require('./datamixin');

var ahoyo = "wtf";

var Item = React.createClass({
	mixins: [datamixin],

	dclass: 'item',
	dpkey: 'item_id',

	itemTitle: function(event) {
		this.selfPub({item_title: event.target.value});
	},
	itemDone: function(event) {
		this.selfPub({item_done: event.target.checked});
	},

	render: function() {
		return (
			<table className="formtable">
				<tr>
					<td><input type="checkbox" checked={this.state.item_done} onChange={this.itemDone} /></td>
					<td>Done?</td>
				</tr>
				<tr>
					<td>Title:</td>
					<td><input type="text" size="30" value={this.state.item_title} onChange={this.itemTitle} autoFocus={true} /></td>
				</tr>
				<tr>
					<td>Test:</td>
					<td><input type="text" size="30" value={ahoyo} /></td>
				</tr>
			</table>
		);
	}
});

module.exports = Item;
