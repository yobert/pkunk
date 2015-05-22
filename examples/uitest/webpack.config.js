var gopath = [];
var gopathstr = process.env.GOPATH;
if(gopathstr) {
	var chunks = gopathstr.split(':');
	for(var i = 0; i < chunks.length; i++) {
		gopath.push(chunks[i] + '/src');
	}
}


module.exports = {
	name: 'client',
	entry: './js/client.js',
	output: {
		path: __dirname + '/cache',
		filename: 'client_packed.js',
		sourceMapFilename: 'client_packed.js.map'
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'pkunk-jsx-loader'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		fallback: gopath
	}
};
