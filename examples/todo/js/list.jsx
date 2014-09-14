var React = require('react');

var listmixin = require('./listmixin');
//var Item = require('./item');

var store = require('./store');
var undb = require('github.com/yobert/undb/js/undb');

var List = React.createClass({
	mixins: [listmixin],

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
				<div className={cls} key={id}>
{/*		<div className={cls} key={v._local_id} onClick={function(){

						var body = tag('div');
						var dialog = jsb_ui_new_dialog({'title':'Edit Todo', 'center':true, 'onclose':function() {
							React.unmountComponentAtNode(body);
							return true;
						}}, body, ['Close', {'value':'Delete', 'onclick':function(){
							// delete the thing!
							var payload = {'_delete':true, '_local_id':v._local_id};

							ps.pub('data_' + t.dclass + '_' + v._local_id, payload);
							ps.pub('datalist_' + t.dclass, payload);

							return false;
						}}]);

					React.renderComponent(Item({'initial':v}), body);
					jsb_ui_center_dialog(dialog);

				}}>*/}
				Item {id}: <b>"{v.Title}"</b>
				</div>
			);
		});

		return (
			<div>
				<div className="list_controls">
					<input type="button" value="Add" onClick={function() {
						var id = todos.Seq();
						var err = todos.Insert(new undb.Store(id, undb.VALUES));
						if(err)
							throw(err);

						var t = todos.FindOrThrow(todos.Name + '.' + id);

						err = t.Update({'Title':'', 'Done':false});
						if(err)
							throw(err);

/*						var body = tag('div');
						var dialog = jsb_ui_new_dialog({'title':'Add Todo', 'center':true, 'onclose':function() {
							React.unmountComponentAtNode(body);
							return true;
						}}, body, ['Close', {'value':'Delete', 'onclick':function(){
							return true;
						}}]);

						React.renderComponent(Item({}), body);
						jsb_ui_center_dialog(dialog);*/
					}} />
				</div>
				{list}
			</div>
		);
	}
});

module.exports = List;
