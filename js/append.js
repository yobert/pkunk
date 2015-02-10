var tools = require('./tools');
var tag = require('./tag');

function append(e, v)
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

module.exports = append;
