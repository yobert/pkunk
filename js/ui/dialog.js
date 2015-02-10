var tools = require('../tools');
var tag = require('../tag');
var append = require('../append');

var _dialog_id_seq = 0;

function Dialog(title, body, buttons, options) {
	if(!options)
		options = {};

	var titlediv = tag('div', {'class':'dialog_title'}, title);

	var bodydiv = tag('div', {'class':'dialog_body'}, body);

	var div = tag('div', {'class':'dialog dialog_active'});
	div.style.position = 'fixed';

	if(title)
		div.appendChild(titlediv);

	if(body)
		div.appendChild(bodydiv);

	this.id = 'dialog_' + (_dialog_id_seq++);
	this.dom = div;
	this.onclose = options.onclose;

	// disable weird text selecty-ness
	titlediv.onmousedown = function() { return false; };

	if(buttons && tools.is_array(buttons) && buttons.length)
		bodydiv.appendChild(this.buildButtons(buttons));

	document.body.appendChild(div);

	this.fitToWindow();
	this.center();

	return;
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

	if(!this.dom)
		return;

	if(!this.dom.parentNode)
		return;

	this.dom.parentNode.removeChild(this.dom);
	return;
}

module.exports = Dialog;
