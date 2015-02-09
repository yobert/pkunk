
function plural(v, t) {
	if(v && v == 1)
		return v + " " + t;

	return v + " " + t + "s";
}

module.exports = {
	timestamp_to_date: function(d) {
		var r = new Date(d.getTime())
		r.setHours(0);
		r.setMinutes(0);
		r.setSeconds(0);
		r.setMilliseconds(0);
		return r;
	},

	// format_duration() turns a quantity of seconds into a text duration.
	// granularity is optional. means how many mixed units to return.
	// so:
	// undefined/0: "3 days"
	// 1: "3 days 18 hours"
	// 2: "3 days 18 hours 6 minutes"
	// etc
	// -1: maximum (might include milliseconds or something)
	format_duration: function(seconds, granularity) {
		if(!seconds)
			return "";

		var out = [];
		if(seconds > 86400 * 7) {
			var weeks = Math.floor(seconds / (86400 * 7));
			out.push(plural(weeks, "week"));
			seconds -= weeks * 86400 * 7;
		}
		if(seconds > 86400) {
			var days = Math.floor(seconds / 86400);
			out.push(plural(days, "day"));
			seconds -= days * 86400;
		}
		if(seconds > 3600) {
			var hours = Math.floor(seconds / 3600);
			out.push(plural(hours, "hour"));
			seconds -= hours * 86400;
		}
		if(seconds > 60) {
			var mins = Math.floor(seconds / 60);
			out.push(plural(mins, "minute"));
			seconds -= mins * 60;
		}
		out.push(plural(seconds, "second"));

		if(!granularity)
			granularity = 0;
		if(granularity > -1) {
			if(out.length > granularity + 1) {
				out = out.splice(0, granularity + 1)
			}
		}
		return out.join(", ");
	}

}


