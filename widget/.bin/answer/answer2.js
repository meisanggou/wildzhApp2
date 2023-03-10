(function() {
	var Answer = /*@__PURE__*/ (function(Component) {
		function Answer(props) {
			Component.call(this, props);
			this.data = {};
		}

		if (Component) Answer.__proto__ = Component;
		Answer.prototype = Object.create(Component && Component.prototype);
		Answer.prototype.constructor = Answer;
		Answer.prototype.apiready = function() {};
		Answer.prototype.render = function() {
			return;
		};

		return Answer;
	})(Component);
	Answer.css = {".page": {height: "100%"}};
	apivm.define("answer", Answer);
	apivm.render(apivm.h("answer", null), "body");
})();
