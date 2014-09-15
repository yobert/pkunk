var app = require('./app');
var React = require('react');

var ws = require('github.com/yobert/undb/js/ws');
var store = require('./store');

window.main = function() {
	React.renderComponent(app({initializing:true}), document.body);

	var undbsock = new ws.UndbSocket(store, 'ws://' + window.location.host + '/ws');

	undbsock.onFirstMessage = function() {
		React.renderComponent(app({}), document.body);
	};

	undbsock.onClose = function() {
		React.renderComponent(app({'closed':true}), document.body);
	};
};
