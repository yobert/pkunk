module.exports = {
	entry: './js/main.jsx',
	output: {
		path: __dirname + '/js',
		filename: 'bundle.js'
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
}
