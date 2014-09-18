
module.exports = {
	get: get,
	set: set
};

// return a map of cookie key:values
function get() {
	var r = {};
	var c = document.cookie;
	var pairs = c.split(/\s*;\s*/);
	var eq, p, i;
	for(i = 0; i < pairs.length; i++) {
		p = pairs[i];
		eq = p.indexOf('=');
		if(eq != -1)
			r[decodeURIComponent(p.substr(0, eq))] = decodeURIComponent(p.substr(eq + 1, p.length - eq));
	}
	return r; 
}

// set a cookie with a value. defaults to path "/" and 1 week expire
// opts can be:
//		maxage (# of seconds, overrides the 1 week)
//		expires: date object for expiration date, overrides year 3000
function set(k, v, opts) {
	if(!k || /^(?:expires|max\-age|path|domain|secure)$/i.test(k))
		throw("Invalid cookie name: '" + k + "'");

	if(!opts)
		opts = {};

	var is_ssl = window.location.protocol == 'https:';

	var secure = is_ssl ? '; secure' : '';
	var path = '; path=' + (opts.path || '/');
	var maxage = opts.maxage ? '; max-age=' + opts.maxage : '; max-age=' + (60*60*24*7);
	var expires = opts.expires ? '; expires=' + opts.expires.toUTCString() : '; expires=Fri, 31 Dec 9999 23:59:59 GMT';

	var str = encodeURIComponent(k) + '=' + encodeURIComponent(v) + expires + maxage + path + secure;
	document.cookie = str;
	return;
}

