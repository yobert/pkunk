var React = require('react');

var undbmixin = require('github.com/yobert/undb/js/react');
var store = require('./store');

var Item = React.createClass({
	mixins: [undbmixin],

	store: store,

	itemTitle: function(event) {
		var todo = this.grab('tododb.todos.' + this.props.Name);
		todo.Merge({Title: event.target.value});
	},
	itemDone: function(event) {
		var todo = this.grab('tododb.todos.' + this.props.Name);
		todo.Merge({Done: event.target.checked});
	},

	render: function() {
		var todo = this.grab('tododb.todos.' + this.props.Name);

		return (
			<table className="formtable">
				<tr>
					<td><input type="checkbox" checked={todo.Records.Done} onChange={this.itemDone} /></td>
					<td>Done?</td>
				</tr>
				<tr>
					<td>Title:</td>
					<td><input type="text" size="30" value={todo.Records.Title} onChange={this.itemTitle} /></td>
				</tr>
				<tr>
					<td >Deleted:</td>
					<td>{todo.Deleted ? 'true' : 'false'}</td>
				</tr>
			</table>
		);
	}
});

module.exports = Item;
