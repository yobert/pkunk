(function(){
window.bootstrap = bootstrap;
window.register_url = register_url;
window.current_path = current_path;

var url_handlers = {};

function bootstrap() {
	var path = current_path();
	var u = url_handlers[path];
	if(!u)
		throw('no url_handler for path: '+path);

	u.handler();
}

function register_url(url, dispatcher, handler) {
	url_handlers[url] = {'dispatcher':dispatcher, 'handler':handler};
}

function current_path() {
	var path = window.location.pathname;
	if(path == "")
		path = "/";

	return path;
}

})();
