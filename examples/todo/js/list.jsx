var React = require('react');

var undbmixin = require('github.com/yobert/undb/js/react');
var Item = require('./item');

var data = require('./data');

var store = require('./store');
var undb = require('github.com/yobert/undb/js/undb');

function compare_by_title(a, b) {
	var at = a.Records.Title;
	var bt = b.Records.Title;
	if(at < bt)
		return -1;
	if(at > bt)
		return 1;
	return 0;
}

var List = React.createClass({
	mixins: [undbmixin],
	store: store,

	render: function() {
		var list = [];

		var t = this;

		var todos = this.grab('tododb.todos');

		// sort by title
		var sl = [];
		array_each(todos.Records, function(s) {
			sl.push(s);
		});

		sl.sort(compare_by_title);

		array_each(sl, function(s) {
			if(s.Deleted)
				return;

			var v = s.Records;

			var cls = "touch list_item";
			if(v.Done)
				cls += " list_item_done";

			list.push(
				<div className="touch" key={s.Id}>
					<span className={cls} onClick={function(){
						data.edit(s, Item({Id: s.Id}));
					}}>
						{v.Title ? '"' + v.Title + '"' : '(No title)' }
					</span>
				</div>
			);
		});

		return (
			<div>
				<div className="list_controls">
					<input type="button" value="Add" onClick={function() {
						var s = new undb.Store(todos.Seq(), undb.VALUES);
						var err = todos.Insert(s);
						if(err)
							throw(err);

						err = s.Update({'Title':'', 'Done':false});
						if(err)
							throw(err);

						data.edit(s, Item({Id: s.Id}));
					}} />

					<input type="button" value="Delete Done" onClick={function() {
						array_each(todos.Records, function(s, id) {
							if(s.Deleted || !s.Records.Done)
								return;
							s.Delete();
						});
					}} />

					<input type="button" value="Delete No-title items" onClick={function() {
						array_each(todos.Records, function(s, id) {
							if(s.Deleted || s.Records.Title)
								return;
							s.Delete();
						});
					}} />
				</div>
				{list}
			</div>
		);
	}
});

module.exports = List;
