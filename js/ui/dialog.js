var tools = require('../tools');
var tag = require('../tag');
var append = require('../append');

function Dialog(title, body, buttons, options) {
	if(!options)
		options = {};

	var inner = tag('div', {'class':'dialog_inner'});

	if(title) {
		this.dom_title = tag('div', {'class':'dialog_title'}, title);
		append(inner, this.dom_title);

		// disable weird text selecty-ness
		this.dom_title.onmousedown = function() { return false; };
	}

	if(body) {
		this.dom_body = tag('div', {'class':'dialog_body'}, body);
		append(inner, this.dom_body);
	}

	if(buttons && tools.is_array(buttons) && buttons.length) {
		this.dom_buttons = this.buildButtons(buttons);
		append(inner, this.dom_buttons);
	}

	var div = tag('div', {'class':'dialog dialog_active'}, inner);
	div.style.position = 'fixed';

	this.dom = div;
	this.onclose = options.onclose;
	var that = this;

	if(options.modal) {
		this.dom_modal = _modal();
		this.modal_click_cb = function() {
			that.close();
		};
		tools.listener_add(this.dom_modal, 'click', this.modal_click_cb);
		document.body.appendChild(this.dom_modal);
	}

	document.body.appendChild(div);

	this.keydown_cb = function(e) {
		if(tools.get_key(e) == 27) {
			tools.event_stop(e);
			that.close();
		}

		return true;
	};

	tools.listener_add(window, 'keydown', this.keydown_cb);

	this.topLeft();
	this.fitToWindow();
	this.center();

	return;
}

function _modal() {

	var body = document.body,
		html = document.documentElement;

	var height = Math.max(
		body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight,
		html.offsetHeight);

	var div = tag('div', {'class':'dialog_modal'});

	div.style.position = 'absolute';
	div.style.top = 0;
	div.style.left = 0;
	div.style.right = 0;
	div.style.height = height + 'px';

	document.body.style.overflow = 'hidden';

	return div;
}
function _modal_close(div) {
	div.parentNode.removeChild(div);

	document.body.style.overflow = 'auto';
}

Dialog.prototype.buildButtons = function(buttons) {
	if(!buttons || !buttons.length)
		return;

	var div = tag('div', {'class':'dialog_buttons'});
	var t = this;

	var close = function() {
		t.close();
	};

	tools.array_each(buttons, function(b) {
		if(tools.is_string(b))
			b = {'value': b};

		var i = tag('input', {'type':'button', 'value':b.value});
		var oc = b.onclick;
		if(oc) {
			tools.listener_add(i, 'click', function() {
				if(!oc.call(t))
					t.close();
			});
		} else {
			tools.listener_add(i, 'click', close);
		}

		append(div, i);
		append(div, ' ');
	});

	return div;
}

Dialog.prototype.fitToWindow = function() {
	if(!this.dom_body)
		return;

	this.dom.style.left = '0px';
	this.dom.style.top = '0px';

	var window_xy = tools.window_size();

	var ds, bs, spare;

	ds = tools.element_size(this.dom);
	bs = tools.element_size(this.dom_body);
	spare = [
		ds[0] - bs[0],
		ds[1] - bs[1]
	];

	if(ds[0] > window_xy[0]) {
		this.dom_body.style.width = (window_xy[0] - spare[0])+'px';
		this.dom_body.style.overflowX = 'scroll';
	}

	if(ds[1] > window_xy[1]) {
		this.dom_body.style.height = (window_xy[1] - spare[1])+'px';
		this.dom_body.style.overflowY = 'scroll';
	}

	return;
}

Dialog.prototype.topLeft = function() {
	this.dom.style.left = '0px';
	this.dom.style.top = '0px';
}

Dialog.prototype.center = function() {
	var div = this.dom;
	var window_xy = tools.window_size();

	var l = Math.floor(window_xy[0]*0.5 - div.clientWidth*0.5);
	var t = Math.floor(window_xy[1]*0.5 - div.clientHeight*0.5);

	if(l < 0)
		l = 0;

	if(t < 0)
		t = 0;

	div.style.left = l+'px';
	div.style.top = t+'px';
}

Dialog.prototype.close = function() {
	if(this.onclose && !this.onclose())
		return;

	if(this.keydown_cb) {
		tools.listener_remove(window, 'keydown', this.keydown_cb);
		delete this.keydown_cb;
	}

	if(this.dom_modal) {
		if(this.modal_click_cb) {
			tools.listener_remove(this.dom_modal, 'click', this.modal_click_cb)
			delete this.modal_click_cb;
		}
		_modal_close(this.dom_modal);
		delete this.dom_modal;
	}

	if(!this.dom)
		return;

	if(!this.dom.parentNode)
		return;

	this.dom.parentNode.removeChild(this.dom);
	return;
}

module.exports = Dialog;
