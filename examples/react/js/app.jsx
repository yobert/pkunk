
var React = require('react');
var router = require('react-router-component');

var Locations = router.Locations;
var Location = router.Location;

var Link = router.Link;
var HighlightedLink = React.createClass({

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

var todos = require('./todo_example/components/TodoApp.react');

var Menu = React.createClass({
	render: function() {
		return <div className="menu">MENYOUUUU
			<HighlightedLink href="/" activeClassName="current">home</HighlightedLink>
			<HighlightedLink href="/test" activeClassName="current">test 1</HighlightedLink>
			<HighlightedLink href="/test/global" activeClassName="current">test 2</HighlightedLink>
			<HighlightedLink href="/todos" activeClassName="current">todo test</HighlightedLink>
		</div>
	}
});

var home = React.createClass({
	render: function() {
		return <div>
			<Menu />
			hey man MAN MAN MAN
			post Menu
		</div>
	}
});

var test = React.createClass({
	render: function() {
		return <div>
			<Menu /><h3>TEST {this.props.crap}</h3>
			 </div>
	}
});

var error = React.createClass({
	render: function() {
			return <div>
				<Menu />
				<i>four oh four, not found.</i>
				<br/><br/><br/>
			</div>
	}
});

var NotFound = router.NotFound;

var app = React.createClass({
	render: function() {
		return (
		<Locations path={this.props.path}>
				<Location path="/" handler={home} />
				<Location path="/test/:crap" handler={test} />
				<Location path="/todos" handler={todos} />
				<NotFound handler={error} />
			</Locations>
		)
	}
});

module.exports = app;

