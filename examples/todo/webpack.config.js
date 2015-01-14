//var mergeInto = require('react/lib/mergeInto');
//var local = require('./webpack.local');

// behave like GAS so we can just require javascript from a gopath directory
// i.e.  require("github.com/yobert/undb/js/undb.js");
var gopath = [];
var gopathstr = process.env.GOPATH;
if(gopathstr) {
	var chunks = gopathstr.split(':');
	for(var i = 0; i < chunks.length; i++) {
		gopath.push(chunks[i] + '/src');
	}
}

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
		extensions: ['', '.js', '.jsx'],
		fallback: gopath
	}
};

//config.resolve = mergeInto(config.resolve, local.resolve);

module.exports = config;
