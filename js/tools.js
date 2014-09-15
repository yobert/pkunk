"use strict";

module.exports = {
// javascript helpers
	array_each: array_each,
	deep_copy: deep_copy,
	shallow_copy: shallow_copy,
	ucfirst: ucfirst,
	ucfirst_title: ucfirst_title,
	keys: keys,
	has_keys: has_keys,

	is_func: is_func,
	is_hash: is_hash,
	is_obj: is_obj,
	is_array: is_array,
	is_string: is_string,
	is_null: is_null,
	is_undefined: is_undefined,
	is_defined: is_defined,
	is_dom: is_dom,

// dom helpers
	get_name: get_name,
	get_id: get_id,
	text: text,	// create a text element from string
	empty: empty,	// remove all children from node
	contains: contains,	// return true if element B is child of element A

// event handling helpers
	listener_add: listener_add,
	listener_remove: listener_remove,
	listener_onreturn: listener_onreturn,
	event_stop_prop: event_stop_prop,
	event_stop: event_stop,
	get_key: get_key,
	get_mouse_xy: get_mouse_xy,
	get_mouse_target: get_mouse_target,

// size and position helpers
	document_size: document_size,
	window_size: window_size,
	window_scroll: window_scroll,
	element_xy: element_xy,
	element_size: element_size,

// some heavyweight helpers
	focus_first_input: focus_first_input,
	add_value_watcher: add_value_watcher,
	dom_form_collect: dom_form_collect,
	dom_form_populate: dom_form_populate
};

function array_each(array, cb) {
	var ret;
	for (var x in array) {
		if (array.hasOwnProperty(x)) {
			ret = cb(array[x], x);
			if (!is_undefined(ret)) {
				return ret;
			}
		}
	}
	return ret;
}

function deep_copy(ref) {
	var r;
	var i;

	if (is_hash(ref)) {
		r = {};
		for (i in ref)
			r[i] = deep_copy(ref[i]);
	} else if (is_array(ref)) {
		r = [];
		for (i = 0; i < ref.length; i++)
			r[i] = deep_copy(ref[i]);
	} else if (is_string(ref)) {
		r = String(ref);
	} else {
		r = ref;
	}

	return r;
}

function shallow_copy(ref) { // maybe later make this take a depth parameter?
	var r;
	var i;

	if (is_hash(ref)) {
		r = {};
		for (i in ref)
			r[i] = ref[i];
	} else if (is_array(ref)) {
		r = [];
		for (i = 0; i < ref.length; i++)
			r[i] = ref[i];
	} else if (is_string(ref)) {
		r = String(ref);
	} else {
		r = ref;
	}

	return r;
}

function get_name(i) {
	var e = document.getElementsByName(i);

	if (!e || !e.length)
		throw ('get_name(\'' + i + '\') failed');

	if (e.length > 1)
		throw ('get_name(\'' + i + '\') returned ' + e.length + ' elements');

	return e[0];
}

function get_id(i) {
	var e = document.getElementById(i);

	if (!e)
		throw ('get_id(\'' + i + '\') failed');

	return e;
}

function listener_add(el, ev, cb) {
	if (el.addEventListener)
		el.addEventListener(ev, cb, false);
	else
		el.attachEvent('on' + ev, cb);
}

function listener_remove(el, ev, cb) {
	if (el.removeEventListener)
		el.removeEventListener(ev, cb, false);
	else
		el.detachEvent('on' + ev, cb);
}

function listener_onreturn(el, cb) {
	listener_add(el, 'keydown', function (e) {
		if (get_key(e) == 13)
			return cb.apply(el);

		return true;
	});
}

function event_stop_prop(e) {
	e = e || window.event;
	e.cancelBubble = true;

	if (e.stopPropagation)
		e.stopPropagation();

	return true;
}

function event_stop(e) {
	event_stop_prop(e);

	e = e || window.event;

	if(e.preventDefault)
		e.preventDefault();
	else
		e.returnValue = false;

	return false;
}

function get_key(ev) {
	ev = ev ? ev : this.event;
	return ev.keyCode ? ev.keyCode : ev.which;
}

function get_mouse_xy(e) {
	if (!e) e = window.event;

	var x = 0;
	var y = 0;

	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else if (e.clientX || e.clientY) {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	return [x, y];
}

function get_mouse_target(e) {
	var t;

	if (!e) e = window.event;
	if (e.target) t = e.target;
	else if (e.srcElement) t = e.srcElement;

	// if a text node got it, go up one parent
	if (t.nodeType == 3)
		t = t.parentNode;

	return t;
}

function document_size() {
	return [
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	];
}
function window_size() {
	var wx, wy;
	if (window.innerWidth) {
		wx = window.innerWidth;
		wy = window.innerHeight
	}
	if (!wx && document.documentElement) {
		wx = document.documentElement.clientWidth;
		wy = document.documentElement.clientHeight;
	}
	if (!wx) {
		var body = document.body || document.getElementsByTagName('body')[0];
		if (body) {
			if (body.clientWidth) {
				wx = body.clientWidth;
				wy = body.clientHeight;
			} else if (body.offsetWidth) {
				wx = body.offsetWidth;
				wy = body.offsetHeight;
			}
		}
	}

	return [wx, wy];
}

function window_scroll() {
	var x = 0;
	var y = 0;

	if (self.pageYOffset) {
		x = self.pageXOffset;
		y = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		x = document.documentElement.scrollLeft;
		y = document.documentElement.scrollTop;
	} else if (document.body) {
		x = document.body.scrollLeft;
		y = document.body.scrollTop;
	}

	return [x, y];
}

function is_func(a) {
	return typeof a === 'function';
}

function is_hash(a) {
	return is_obj(a) && !is_array(a) && !is_dom(a);
}

function is_obj(a) {
	return typeof a === 'object' && !! a;
}

function is_array(a) {
	return Object.prototype.toString.apply(a) === '[object Array]';
}

function is_string(a) {
	return Object.prototype.toString.apply(a) === '[object String]';
}

function is_null(a) {
	return typeof a === 'object' && !a;
}

function is_undefined(a) {
	return typeof a === 'undefined';
}

function is_defined(a) {
	if(!is_null(a) && !is_undefined(a))
		return true;

	return false;
}

function is_dom(a) {
	if (a) {
		if (typeof a == 'object' &&
			(a.nodeType !== undefined &&
			(a.nodeType == 3 || a.nodeType == 1))) {
			return true;
		}
	}

	return false;
}

function text(t) {
	return document.createTextNode(t);
}

function empty(e) {
	while (e.firstChild)
		e.removeChild(e.firstChild);
}

function keys(hash) {
	if (!hash || !is_hash(hash))
		return [];

	var ks = [];
	for (var i in hash)
		ks.push(i);

	return ks;
}
function has_keys(hash) {
	if(!hash || !is_hash(hash)) {
		return false;
	}
	for(var i in hash) {
		return true;
	}
	return false;
}

function ucfirst(s) {
	return s.substr(0, 1).toUpperCase() + s.substr(1);
}

function ucfirst_title(s) {
	var u = s.toUpperCase();
	var o = "";
	for (var i = 0; i < s.length; i++) {
		if (!i || s.substr(i - 1, 1) == ' ' || s.substr(i - 1, 1) == '-')
			o += u.substr(i, 1);
		else
			o += s.substr(i, 1);
	}
	return o;
}

function focus_first_input(elm) {
	// i used to use getElementsByTagName('input') but then
	// it wouldn't get textareas.
	// i would do two getElementsByTagName() calls, but then it would be
	// hard to tell which was actually "first" :)
	var list = elm.getElementsByTagName('*');
	var i = 0;

	while (i < list.length) {
		if (((list[i].tagName == 'INPUT' && (!list[i].type || list[i].type == 'text' || list[i].type == 'password')) || (list[i].tagName == 'TEXTAREA')) && !list[i].disabled) {
			list[i].focus();
			return;
		}
		i++;
	}
}

function add_value_watcher(i, cb, change_delay, still_delay) {
	if (!change_delay)
		change_delay = 200;
	if (!still_delay)
		still_delay = change_delay * 2;

	var val1 = i.value;
	var val2 = i.value;

	var w1 = function (dont_repeat) {
		if (i.value == val1) {
			val2 = val1;

			if (!dont_repeat)
				setTimeout(w1, change_delay);

			return;
		}

		val2 = i.value;

		if (!dont_repeat)
			setTimeout(w2, still_delay);

		return;
	};

	var w2 = function (dont_repeat) {
		if (i.value == val2) {
			val1 = val2;
			cb.apply(i);

			if (!dont_repeat)
				setTimeout(w1, change_delay);

			return;
		}

		val2 = i.value;

		if (!dont_repeat)
			setTimeout(w2, still_delay);

		return;
	};

	setTimeout(w1, change_delay);

	// this *doesn't* work right, needs more debugging.
	//listener_add(i, 'blur', function(){ w1(1); w2(1); });

	return;
}

function dom_form_collect(elm) {
	var r = {};

	var inputs = elm.getElementsByTagName('input');
	array_each(inputs, function(i) {
		if(!i.name)
			return;

		if(i.type && i.type == 'checkbox' && !i.checked) {
			r[i.name] = '';
			return;
		}

		r[i.name] = i.value;
	});

	var selects = elm.getElementsByTagName('select');
	array_each(selects, function(i) {
		if(!i.name)
			return;

		r[i.name] = i.options[i.selectedIndex].value;
	});

	var textareas = elm.getElementsByTagName('textarea');
	array_each(textareas, function(i) {
		if(!i.name)
			return;

		r[i.name] = i.value;
	});

	return r;
}

function dom_form_populate(elm, data) {
	var inputs = elm.getElementsByTagName('input');
	array_each(inputs, function(i) {
		if(!i.name)
			return;

		if(!is_defined(data[i.name]))
			return;

		if(i.type && i.type == 'checkbox') {
			if(data[i.name] && data[i.name] != "0") {
				i.checked = true;
			} else {
				i.checked = false;
			}
		} else {
			i.value = data[i.name];
		}
	});

	var selects = elm.getElementsByTagName('select');
	array_each(selects, function(i) {
		if(!i.name)
			return;

		if(!is_defined(data[i.name]))
			return;

		array_each(i.options, function(o, oi) {
			if(o.value == data[i.name])
				i.selectedIndex = oi;
		});
	});

	var textareas = elm.getElementsByTagName('textarea');
	array_each(textareas, function(i) {
		if(!i.name)
			return;

		if(!is_defined(data[i.name]))
			return;

		i.value = data[i.name];
	});

}

// returns top left corner position of an element.
// must be on the dom before you can expect this to work.
function element_xy(e) {
	var x = 0;
	var y = 0;
	if(e.offsetParent) {
		do {
			x += e.offsetLeft;
			y += e.offsetTop;
		} while(e = e.offsetParent);
	}
	return [x, y];
}
function element_size(e) {
	while(e.parentNode && !(e.offsetHeight || e.clientHeight))
		e = e.parentNode;

	var x = e.offsetWidth || e.clientWidth;
	var y = e.offsetHeight || e.clientHeight;

	return [x, y];
}

// return true if element a contains element b
function contains(a, b) {
  return a.contains ?
    a != b && a.contains(b) :
    !!(a.compareDocumentPosition(b) & 16);
}

