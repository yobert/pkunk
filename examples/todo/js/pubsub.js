var keys = {};
var handles = {};

var next_handle = 0;

function sub(key, obj, cb) {
	if(!key || !obj || !cb || !is_func(cb))
		throw('sub() requires a key, object reference, and callback function');

	var args = [].splice.call(arguments, 0);
	args.splice(0, 3);

	if(!keys[key])
		keys[key] = {};

	var handle = 'pubsub_' + (next_handle++);

	var store = {
		'key':key,
		'obj':obj,
		'cb':cb,
		'args':args // args will get passed to the callback after the payload
	};

	keys[key][handle] = store;
	handles[handle] = store;

	return handle;
}

function unsub(handle) {
	if(!handle)
		throw('unsub() requires a handle returned by sub()');

	if(!handles[handle])
		return false;

	var key = handles[handle].key;

	delete keys[key][handle];
	delete handles[handle];

	return true;
}

function pub(key, payload) {
	if(!key)
		throw('ps_call() requires a key');

	if(!keys[key])
		return;

	for(var handle in keys[key]) {
		var store = keys[key][handle];
		var args = store.args.splice(0);
		args.splice(0, 1, payload);
		store.cb.apply(store.obj, args);
	}

	return;
}

module.exports = {
	'sub': sub,
	'unsub': unsub,
	'pub': pub
};
