var React = require('react');

function edit(outer_store, component) {

	var body = tag('div');
	var dialog = jsb_ui_new_dialog({'title':'Edit', 'center':true, 'onclose':function() {
		React.unmountComponentAtNode(body);
		return true;
	}}, body, ['Close', {'value':'Delete', 'onclick':function(){
		outer_store.Delete()
		return false;
	}}]);

	React.renderComponent(component, body);
	jsb_ui_center_dialog(dialog);
}


module.exports = {
	edit: edit
};
