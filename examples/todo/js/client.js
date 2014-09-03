var app = require('./app');
var React = require('react');

window.main = function() {
	React.renderComponent(app(), document.body);
};
