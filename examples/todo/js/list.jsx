var React = require('react');

var listmixin = require('./listmixin');
var Item = require('./item');

var ps = require('./pubsub');

var List = React.createClass({
	mixins: [listmixin],

	dclass: 'item',

	render: function() {
		var list = [];

		array_each(this.state.data_list, function(v, k) {
			var cls = "list_item";
			if(v.item_done)
				cls += " list_item_done";

			list.push(
				<div className={cls} key={v._local_id} onClick={function(){

						var body = tag('div');
						var dialog = jsb_ui_new_dialog({'title':'Edit Todo', 'center':true, 'onclose':function() {
							React.unmountComponentAtNode(body);
							return true;
						}}, body, ['Close']);

						React.renderComponent(Item({'initial':v}), body);
						jsb_ui_center_dialog(dialog);


				}}>
					Item {v._local_id}: <b>"{v.item_title}"</b>
				</div>
			);
		});

		return (
			<div>
				<div className="list_controls">
					<input type="button" value="Add" onClick={function() {
						var body = tag('div');
						var dialog = jsb_ui_new_dialog({'title':'Add Todo', 'center':true, 'onclose':function() {
							React.unmountComponentAtNode(body);
							return true;
						}}, body, ['Close']);

						React.renderComponent(Item({}), body);
						jsb_ui_center_dialog(dialog);
					}} />
				</div>
				{list}
			</div>
		);
	}
});

module.exports = List;
