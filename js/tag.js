var tools = require('./tools');
var append = require('./append');

function tag()
{
	var args = arguments;
	var data = {};
	var x, y;

	for(x = 0; x < args.length; x++)
	{
		if(tools.is_hash(args[x]))
		{
			for(y in args[x])
				data[y] = args[x][y];
		}else
		{
			if(data.tag)
				data.v = args[x];
			else
				data.tag = args[x];
		}
	}

	var tag = data.tag
	var v = data.v;

	if(!tag)
		throw('no tag passed!');

	delete data.tag;
	delete data.v;

	if(tag == 'input')
	{
		if(data.type && (data.type == 'checkbox' || data.type == 'radio'))
		{
			if(!data.checked)
				delete data.checked;
			else
				data.checked = true;
		}

		// TODO XSS?
		// scrub data.name or check for " or something
		// fix this to support IE <9
		//if(data.name !== undefined && 0)
		//	tag = '<input name="'+ data.name +'">' // no critic;
	}

	var e = document.createElement(tag);

	// wish i could do this without looping twice =)
	for(x in data)
	{
		if(typeof data[x] == 'function' && x.substr(0, 2) == 'on')
			tools.listener_add(e, x.substr(2, x.length - 2), data[x]);
		else if(x == 'class')
			e.className = data[x]; // for IE6
		else if(x == 'style' && ua_is_ie)
			e.style.cssText = data[x];
		else
			// TODO fix for IE <9
			e.setAttribute(x, data[x], 0);
	}

	append(e, v);

	return e;
}

module.exports = tag;
