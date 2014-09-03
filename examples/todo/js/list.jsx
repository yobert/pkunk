var React = require('react');

var Item = require('./item');

var List = React.createClass({
	render: function() {
		return (
			<div>
				<div className="list_controls">
					<input type="button" value="Add" onClick={function() {
						var body = tag('div');
						var dialog = jsb_ui_new_dialog({'title':'Add Todo', 'center':true}, body, ['Stuff']);

						React.renderComponent(Item(), body);

						jsb_ui_center_dialog(dialog);
					}} />
				</div>
			</div>
		);
	}
});

module.exports = List;