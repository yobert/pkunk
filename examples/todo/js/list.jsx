var React = require('react');

var undbmixin = require('./undbmixin');
var Item = require('./item');

var data = require('./data');

var store = require('./store');
var undb = require('github.com/yobert/undb/js/undb');

var List = React.createClass({
	mixins: [undbmixin],

	render: function() {
		var list = [];

		var t = this;

		var todos = this.grab('tododb.todos');

		array_each(todos.Records, function(s, id) {
			if(s.Deleted)
				return;

			var v = s.Records;

			var cls = "touch list_item";
			if(v.Done)
				cls += " list_item_done";

			list.push(
				<div className={cls} key={id} onClick={function(){
					data.edit(s, Item({Name: id}));
				}}>
				{v.Title ? '"' + v.Title + '"' : '(No title)' }
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

						data.edit(s, Item({Name: s.Name}));
					}} />

					<input type="button" value="Delete Done" onClick={function() {
						array_each(todos.Records, function(s, id) {
							if(s.Deleted || !s.Records.Done)
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
