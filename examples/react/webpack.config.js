module.exports = {
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
