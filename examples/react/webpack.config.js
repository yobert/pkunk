module.exports = {
	name: 'client',
	entry: './js/main.jsx',
	output: {
		path: __dirname + '/js',
		filename: 'client.js'
	},
	module: {
		loaders: [
//			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=react.DOM'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}

};/*, {
	name: 'server',
	entry: './js/main.jsx',
	target: 'node',
	output: {
		path: __dirname + '/js',
		filename: 'server.js'
	},
	module: {
		loaders: [
//			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.jsx$/, loader: 'jsx-loader?insertPragma=react.DOM'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}];*/
