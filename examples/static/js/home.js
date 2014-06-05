register_url("/", undefined, url_home);

function url_home() {
	document.body.innerHTML = '';
	document.body.appendChild(document.createTextNode('hi, you are at home'));
	var div = document.createElement('div');
	div.innerHTML = '<a href="/">home</a> | <a href="/test/">test</a>';
	document.body.appendChild(div);
}

