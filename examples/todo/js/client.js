var store = require('./store');
var app = require('./app');
var React = require('react');

function first_render() {
	React.renderComponent(app(), document.body);
}

window.main = function() {

	var initialized;

	var ws = new WebSocket('ws://' + window.location.host + '/ws');
	var ws_id = 'server-ws';

	var onchange = function(op) {
		if(op.changesource && op.changesource == ws_id)
			return;

		var o = {
			Method: op.Method,
			Path: op.Path,
			Name: op.Name,
			Type: op.Type,
			Values: op.Values
		};
		var msg = JSON.stringify([o]);
//		console.log('send: '+msg);
		ws.send(msg);
	};

	ws.onopen = function() {
		console.log("websocket open");
		store.addListener('CHANGE', onchange);
	};

	ws.onclose = function() {
		store.removeListener('CHANGE', onchange);
		console.log("websocket closed");
	};

	ws.onerror = function(err) {
		console.log("websocket error: "+err)
	};

	ws.onmessage = function(msg) {
//		console.log('recv: '+msg.data)

		var oplist = JSON.parse(msg.data);
		var err;
		for(var i in oplist) {
			err = store.Exec(oplist[i], ws_id);

			if(err)
				throw(err);
		}

		if(!initialized) {
			initialized = true;
			first_render();
		}
	};
};
