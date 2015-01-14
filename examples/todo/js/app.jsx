var React = require('react');

var List = require('./list');

var store = require('./store');

var app = React.createClass({
	render: function() {
		var sts;
		var list;

		if(this.props.closed)
			sts = <span style={{color: 'red'}}> Websocket closed</span>;

		if(this.props.initializing)
			sts = <span style={{color: 'red'}}> Initializing...</span>;
		else
			list = <List />

		return (
			<div className="list">
				<div className="list_title">
					Ze Todo List
					{sts}
				</div>
				{list}
			</div>
		);
	}
});

module.exports = app;

