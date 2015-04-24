// a few usage examples:
//
// var aj = new Ajax({url: "/login", cgi: {username: "test", password: "test"}});
// var aj = new Ajax({url: "/upload", method: "POST", mime: "application/octet-stream", body: blob_of_binary});
// aj.cancel();

function Ajax(opts) {
	this.url = opts.url;
	this.cb = opts.cb;
	this.error_cb = opts.error_cb;
	this.progress_cb = opts.progress_cb;
	this.method = opts.method;
	this.body = opts.body;
	this.mime = opts.mime;
	this.headers = opts.headers;

	this.ht = _new_ht();

	if(!this.error_cb)
		this.error_cb = _console_error_cb;

	if(!this.headers)
		this.headers = {};

	if(opts.cgi) {
		var cgi = _pack_cgi(opts.cgi);
		if(!this.method) {
			if(this.url.length + cgi.length > 900)
				this.method = 'POST';
			else
				this.method = 'GET';
		}

		if(cgi.length) {
			if(this.method == 'GET') {
				this.url = this.url+'?'+cgi;
			} else {
				if(this.body)
					throw('Cannot send request body as well as super long CGI parameters');

				this.body = cgi;
				this.mime = 'application/x-www-form-urlencoded';
			}
		}
	}

	var that = this;

	this.ht.onreadystatechange = function() {
		if(that.ht.readyState != 4)
			return;

		if(that.ht.status != 200) {
			if(!that.ht.status) {
				that.error_cb.call(that, 'Network Error');
				return;
			}

			var str = 'HTTP Error ' + that.ht.status;
			if(that.ht.statusText)
				str += ': '+that.ht.statusText;

			that.error_cb.call(that, str);
			return;
		}

		if(that.cb) {
			that.cb.call(that, that.ht);
			return;
		}

		return;
	};

	if(this.progress_cb && this.ht.upload) {
		this.ht.upload.onprogress = this.progress_cb;
	}

	this.ht.open(this.method, this.url, true);

	if(this.mime)
		this.headers['Content-Type'] = this.mime;

	for(var header in this.headers)
		this.ht.setRequestHeader(header, this.headers[header]);

	this.ht.send(this.body);
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

function _console_error_cb(error) {
	console.log("Ajax() call failed", error, this.ht);
}

module.exports = Ajax;
