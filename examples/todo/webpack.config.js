//var mergeInto = require('react/lib/mergeInto');
//var local = require('./webpack.local');

var config = {
	name: 'client',
	entry: './js/client.js',
	output: {
		path: __dirname + '/cache',
		filename: 'client_packed.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};

//config.resolve = mergeInto(config.resolve, local.resolve);

module.exports = config;
