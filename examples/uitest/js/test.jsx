var tag = require('github.com/yobert/pkunk/js/tag');
var append = require('github.com/yobert/pkunk/js/append');
var tools = require('github.com/yobert/pkunk/js/tools');
var dialog = require('github.com/yobert/pkunk/js/ui/dialog');

function test() {

	append(document.body, makebody());
	append(document.body, makebody());
	append(document.body, makebody());
	append(document.body, makebody());

	new dialog('Test Dialog', makebody(), ['Button', 'Another Button'], {modal: true});
}

function makebody() {
	var d = <div />;

	for(var i =0; i < 30; i++) {
		append(d, <div style="width: 600px;">things and stuff {i}</div>);
	}
	return d;
}

module.exports = test;
