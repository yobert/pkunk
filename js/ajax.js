var tools = require('./tools');

function Ajax(url, send, cb, opts) {
	if(!opts)
		opts = {};

	var ht = _new_ht();

	this.ht = ht;

	var closer;

	var post;
	var mime = opts.mime;
	var mode = 'GET';

	if(send && tools.is_hash(send) && !(send instanceof File))
	{
		var cgi = _pack_cgi(send);
		if(cgi.length)
		{
			if(url.length+cgi.length > 900)
			{
				mode = 'POST';
				post = cgi;
				mime = 'application/x-www-form-urlencoded';
			}else
			{
				url += '?'+cgi;
			}
		}
	}else if(send)
	{
		// our own raw custom data.  set opts.mime for the mime type.
		mode = 'POST';
		post = send;
	}

	ht.onreadystatechange = function() {
		if(ht.readyState != 4)
			return;

		if(closer)
			closer();

		var p_id = ht.getResponseHeader('X-Page-Load-ID');
		if(p_id && window.dev_add_page_load_id)
			dev_add_page_load_id(p_id);

		if(ht.status != 200) {
			if(opts.error_cb) {
				opts.error_cb(ht, this);
			} else {
				console.log("ajax request failed", ht);
			}
			return;
		}

		cb(ht.responseText, this);
		return;
	};

	//ht.upload.onerror
	//ht.upload.onload
	ht.upload.onprogress = function(rpe) {
		//twig('loaded '+rpe.loaded+' total '+rpe.total);
	};

	ht.open(mode, url, true);
	if(mime)
		ht.setRequestHeader('Content-Type', mime);

	//this should be in a hook or something i guess =)
	var e = document.getElementsByName('page_load_id');
	if(e && e.length && e.length == 1) {
		var p_id = e[0].value;
		if(p_id) {
			if(!opts.headers)
				opts.headers = {};

			opts.headers['X-Parent-Page-Load-ID'] = p_id;
		}
	}

	if(opts.headers)
		for(var header in opts.headers)
			ht.setRequestHeader(header, opts.headers[header]);

	ht.send(post);

	if(opts.wait) {
		closer = opts.wait(aj);
	}

	return;
}

Ajax.prototype.cancel = function() {
	this.cancelled = true;
	this.ht.abort();
};

function _new_ht() {
	var ht;

	if(window.XMLHttpRequest) {
		ht = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
			ht = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				ht = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	}

	if(!ht)
		throw('could not create XMLHTTP request!');

	return ht;
}

function _pack_cgi(ref) {
	var r = '';
	var k;
	for(k in ref) {
		if(r.length)
			r += '&';

		r += encodeURIComponent(k)+'='+encodeURIComponent(ref[k]);
	}

	return r;
}

module.exports = Ajax;
