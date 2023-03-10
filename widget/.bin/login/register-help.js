(function() {
	var HocNavBarSgm = /*@__PURE__*/ (function(Component) {
		function HocNavBarSgm(props) {
			Component.call(this, props);
			this.data = {
				title:
					this.props.title !== undefined ? this.props.title : "专升本经济学刷题"
			};
		}

		if (Component) HocNavBarSgm.__proto__ = Component;
		HocNavBarSgm.prototype = Object.create(Component && Component.prototype);
		HocNavBarSgm.prototype.constructor = HocNavBarSgm;
		HocNavBarSgm.prototype.back = function() {
			api.navigateBack({delta: 1});
			// this.fire('backClick')
		};
		HocNavBarSgm.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "nav-bar", style: {background: this.props.bgClolor || "#ff5757"}},
				this.props.isShowBack
					? apivm.h(
							"view",
							{onClick: this.back, class: "nav-bar-back"},
							apivm.h("img", {
								src:
									"http://ae8b3ee28597856d3283.qiniucdn.apicloud-system.com/apicloud/6958c7448f8d7106d3ee273fa7430063.png",
								alt: "back",
								class: "nav-bar-back-icon"
							}),
							apivm.h(
								"text",
								{
									class: "nav-bar-back-text",
									style: {color: this.props.textColor || "#000"}
								},
								"返回"
							)
					  )
					: null,
				apivm.h(
					"text",
					{
						class: "nav-bar-title",
						style: {color: this.props.textColor || "#ffffff"}
					},
					this.data.title
				)
			);
		};

		return HocNavBarSgm;
	})(Component);
	HocNavBarSgm.css = {
		".nav-bar": {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: "0",
			height: "48px",
			borderBottom: "0.5px solid #e8e8e8"
		},
		".nav-bar-back": {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			position: "absolute",
			left: "16px"
		},
		".nav-bar-back-icon": {width: "20px", height: "20px"},
		".nav-bar-back-text": {fontSize: "17px"},
		".nav-bar-title": {fontSize: "17px", fontWeight: "500"}
	};
	apivm.define("hoc-nav-bar-sgm", HocNavBarSgm);

	var RegisterHelp = /*@__PURE__*/ (function(Component) {
		function RegisterHelp(props) {
			Component.call(this, props);
			this.data = {};
		}

		if (Component) RegisterHelp.__proto__ = Component;
		RegisterHelp.prototype = Object.create(Component && Component.prototype);
		RegisterHelp.prototype.constructor = RegisterHelp;
		RegisterHelp.prototype.apiready = function() {};
		RegisterHelp.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("safe-area", null),
				apivm.h("hoc-nav-bar-sgm", {isShowBack: "true", title: "注册方法"}),
				apivm.h(
					"view",
					{class: "title"},
					apivm.h("text", null, "当前仅允许在微信小程序注册")
				),
				apivm.h(
					"scroll-view",
					{class: "content"},
					apivm.h(
						"text",
						{class: "item"},
						"第一步：微信中搜索小程序：专升本经济学刷题，进入小程序"
					),
					apivm.h(
						"text",
						{class: "item"},
						"第二步：小程序如果弹出“未选择题库，确定进入【我的】选择题库”，点击确定。如果未弹出，小程序下方点击【我】切换页面"
					),
					apivm.h(
						"text",
						{class: "item"},
						"第三步：点击上方的“授权登录”，弹出授权框后，点击“允许”。如果以前授权过未显示“授权登录”，直接进入下一步。"
					),
					apivm.h("image", {src: "../../images/register/1.png"}),
					apivm.h(
						"text",
						{class: "item"},
						"第四步：点击“昵称”右侧的箭头，进入设置账户名"
					),
					apivm.h("image", {src: "../../images/register/2.png"}),
					apivm.h(
						"text",
						{class: "item"},
						"第五步：输入账户名和密码，确认。注意：账户名设置后不可更改！"
					),
					apivm.h("image", {src: "../../images/register/3.png"}),
					apivm.h("text", null)
				)
			);
		};

		return RegisterHelp;
	})(Component);
	RegisterHelp.css = {
		".page": {height: "100%"},
		".title": {
			alignItems: "center",
			justifyContent: "center",
			marginTop: "10px",
			marginBottom: "10px"
		},
		".content": {marginLeft: "2%", width: "96%"},
		".item": {marginBottom: "10px"}
	};
	apivm.define("register-help", RegisterHelp);
	apivm.render(apivm.h("register-help", null), "body");
})();
