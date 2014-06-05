register_url("/test/", undefined, url_test);

function url_test() {
	document.body.innerHTML = '';
	document.body.appendChild(document.createTextNode('hi, you are at test'));
	var div = document.createElement('div');
	div.innerHTML = '<a href="/">home</a> | <a href="/test/">test</a>';
	document.body.appendChild(div);
}

