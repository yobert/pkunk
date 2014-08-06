module.exports = [{
	name: 'client',
	entry: './js/client.js',
	output: {
		path: __dirname + '/cache',
		filename: 'client_packed.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=react.DOM'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}, {
	name: 'server',
	entry: './js/server.js',
	target: 'node',
	node: {
		process: false
	},
	output: {
		path: __dirname + '/cache',
		filename: 'server_packed.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=react.DOM'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}];
