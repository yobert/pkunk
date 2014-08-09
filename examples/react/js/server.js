var react = require('react');
var app = require('./app.jsx');

function prerender() {
	return react.renderComponentToString(app());
}

