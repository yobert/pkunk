var app = require('./app.jsx');
var React = require('react');

window.main = function() {
	React.renderComponent(app(), document.body);
};

