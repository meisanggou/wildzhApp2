(function() {
	var Statis = /*@__PURE__*/ (function(Component) {
		function Statis(props) {
			Component.call(this, props);
			this.data = {
				title1: this.props.titles !== undefined ? this.props.titles[0] : "标题",
				title2: this.props.titles !== undefined ? this.props.titles[1] : "标题",
				title3: this.props.titles !== undefined ? this.props.titles[2] : "标题",
				title4: this.props.titles !== undefined ? this.props.titles[3] : "标题",
				image4: this.props.image4 !== undefined ? this.props.image4 : "",
				ranking: 14,
				brushNum: 5,
				accuracy: "100%"
			};
			this.compute = {
				value1: function() {
					return this.props.value1 !== undefined ? this.props.value1 : "--";
				},
				value2: function() {
					return this.props.value2 !== undefined ? this.props.value2 : "--";
				},
				value3: function() {
					return this.props.value3 !== undefined ? this.props.value3 : "--";
				}
			};
		}

		if (Component) Statis.__proto__ = Component;
		Statis.prototype = Object.create(Component && Component.prototype);
		Statis.prototype.constructor = Statis;
		Statis.prototype.apiready = function() {};
		Statis.prototype.clickImg4 = function(e) {
			this.fire("clickImg4", e.detail);
		};
		Statis.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "statis"},
				apivm.h(
					"view",
					{class: "statis-div"},
					apivm.h("text", {class: "statis-div-v"}, this.value1),
					apivm.h("text", {class: "statis-div-desc"}, this.data.title1)
				),
				apivm.h("text", {class: "statis-division"}, "|"),
				apivm.h(
					"view",
					{class: "statis-div"},
					apivm.h("text", {class: "statis-div-v"}, this.value2),
					apivm.h("text", {class: "statis-div-desc"}, this.data.title2)
				),
				apivm.h("text", {class: "statis-division"}, "|"),
				apivm.h(
					"view",
					{class: "statis-div"},
					apivm.h("text", {class: "statis-div-v"}, this.value3),
					apivm.h("text", {class: "statis-div-desc"}, this.data.title3)
				),
				apivm.h("text", {class: "statis-division"}, "|"),
				apivm.h(
					"view",
					{
						class: "statis-div",
						onclick: function(event) {
							if (this$1.clickImg4) {
								this$1.clickImg4(event);
							} else {
								clickImg4(event);
							}
						}
					},
					apivm.h("image", {
						class: "statis-div-v",
						src: this.data.image4,
						mode: "aspectFit"
					}),
					apivm.h("text", {class: "statis-div-desc"}, this.data.title4)
				)
			);
		};

		return Statis;
	})(Component);
	Statis.css = {
		".statis": {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			marginTop: "10px",
			marginLeft: "3%",
			marginBottom: "20px",
			borderRadius: "2px",
			backgroundColor: "white",
			width: "94%",
			height: "90px",
			textAlign: "center"
		},
		".statis-div": {height: "100%", width: "24%"},
		".statis-div-v": {
			fontSize: "18px",
			height: "45px",
			lineHeight: "45px",
			width: "100%",
			textAlign: "center"
		},
		".statis-div-v image": {marginTop: "15px", height: "30px", width: "100%"},
		".statis-div-desc": {
			fontSize: "15px",
			color: "gray",
			margin: "0 auto",
			width: "100%",
			lineHeight: "45px",
			textAlign: "center"
		},
		".statis-division": {
			textAlign: "center",
			marginTop: "auto",
			marginBottom: "auto",
			height: "90px",
			display: "inline-block",
			lineHeight: "90px"
		}
	};
	apivm.define("statis", Statis);
	apivm.render(apivm.h("statis", null), "body");
})();
