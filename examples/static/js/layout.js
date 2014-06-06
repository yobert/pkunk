(function(){
window.main_layout = main_layout;

function main_layout(content) {
	document.body.innerHTML = '';

	document.body.appendChild(document.createTextNode(content));
	var div = document.createElement('div');
	div.innerHTML = '<a href="/">home</a> | <a href="/test/">test</a>';
	document.body.appendChild(div);
}

})();
