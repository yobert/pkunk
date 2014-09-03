var React = require('react');

var List = require('./list');

var app = React.createClass({
	render: function() {
		return (
			<div className="list">
				<div className="list_title">Ze Todo List</div>
				<List />
			</div>
		);
	}
});

module.exports = app;

