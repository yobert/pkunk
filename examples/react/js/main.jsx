(function(){

console.log("here");

var react = require('react');
var router = require('react-router-component');

console.log("now here");

var locations = router.Locations;
var location = router.Location;

var Link = router.Link;
var HighlightedLink = react.createClass({

	mixins: [router.NavigatableMixin],

	isActive: function() {
		return this.getPath() === this.props.href
	},

	render: function() {
		var className;
		if (this.props.activeClassName && this.isActive()) {
			className = this.props.activeClassName;
		}
		var link = Link({className: className}, this.props.children)
 		return this.transferPropsTo(link)
	}
});

var Menu = react.createClass({
	render: function() {
		return <div className="menu">MENYOUUUU
			<HighlightedLink href="/" activeClassName="current">home</HighlightedLink>
			<HighlightedLink href="/test" activeClassName="current">test 1</HighlightedLink>
			<HighlightedLink href="/test/stuff" activeClassName="current">test 2</HighlightedLink>
		</div>
	}
});

var home = react.createClass({
	render: function() {
		return <div>
			<Menu />
			hey man MAN MAN MAN
			post Menu
		</div>
	}
});

var test = react.createClass({
	render: function() {
		return <div>
			<Menu /><h3>TEST {this.props.crap}</h3>
			 </div>
	}
});

var error = react.createClass({
	render: function() {
			return <div>
				<Menu />
				<i>four oh four, not found.</i>
				<br/><br/><br/>
			</div>
	}
});

var app = react.createClass({
	render: function() {
		return (
			<locations>
				<location path="/" handler={home} />
				<location path="/test/:crap" handler={test} />
				<router.NotFound handler={error} />
			</locations>
		)
	}
});


stuff.main_render = function() {
	react.renderComponent(app(), document.body);
	return;
}

stuff.main_prerender = function() {
	return react.renderComponentToString(app());
}

})();
