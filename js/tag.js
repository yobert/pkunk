var tools = require('./tools');

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
			e.className = data[x];
		else if(x == 'style')
			e.style.cssText = data[x];
		else if(data[x] !== undefined)
			e.setAttribute(x, data[x], 0);
	}

	append(e, v);

	return e;
}

function append(e, v) // copy of append.js so we dont have a circular require
{
	if(v === undefined || tools.is_null(v))
		return;

	if(!e || !e.appendChild)
		throw 'append() called on non-dom element: '+e;

	if(typeof v == 'number')
		e.appendChild(tools.text(v.toString()));
	else if(tools.is_string(v))
		e.appendChild(tools.text(v));
	else if(tools.is_dom(v))
		e.appendChild(v);
	else if(tools.is_array(v))
	{
		for(var x in v)
			append(e, v[x]);
	}
	else if(tools.is_obj(v)) // must be a hash, since we already checked for is_dom and is_array
		e.appendChild(tag(v));

	return;
}

module.exports = tag;
