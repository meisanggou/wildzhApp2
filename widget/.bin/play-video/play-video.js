(function() {
	var HocHeaderBarEt = /*@__PURE__*/ (function(Component) {
		function HocHeaderBarEt(props) {
			Component.call(this, props);
			this.data = {
				title: this.props.title !== undefined ? this.props.title : "柚子英语教育",
				isBack: this.props.isBack || false,
				leftIcon: this.props.leftIcon || null,
				rightIcon: this.props.rightIcon || null
			};
		}

		if (Component) HocHeaderBarEt.__proto__ = Component;
		HocHeaderBarEt.prototype = Object.create(Component && Component.prototype);
		HocHeaderBarEt.prototype.constructor = HocHeaderBarEt;
		HocHeaderBarEt.prototype.onBack = function() {
			this.fire("onBack");
		};
		HocHeaderBarEt.prototype.onClickRight = function() {
			this.fire("onClickRight");
		};
		HocHeaderBarEt.prototype.render = function() {
			return apivm.h(
				"safe-area",
				{class: "a-header"},
				this.data.isBack
					? apivm.h(
							"view",
							{class: "a-header__icon a-header__icon--left", onClick: this.onBack},
							apivm.h("img", {
								src:
									this.data.leftIcon ||
									"http://ae8b3ee28597856d3283.qiniucdn.apicloud-system.com/apicloud/0b234caf9662d757a20a96b70f0d4eda.png",
								class: "a-header__icon--img"
							})
					  )
					: null,
				apivm.h("text", {class: "a-header--text"}, this.data.title),
				this.data.rightIcon
					? apivm.h(
							"view",
							{
								class: "a-header__icon a-header__icon--right",
								onClick: this.onClickRight
							},
							apivm.h("img", {src: this.data.rightIcon, class: "a-header__icon--img"})
					  )
					: null
			);
		};

		return HocHeaderBarEt;
	})(Component);
	HocHeaderBarEt.css = {
		".a-header": {
			background: "#fff",
			flexFlow: "row nowrap",
			borderBottom: "1px solid #f0f0f0",
			flexShrink: "0"
		},
		".a-header__icon": {padding: "15px", alignSelf: "center"},
		".a-header__icon--img": {width: "18px", height: "18px"},
		".a-header--text": {
			fontSize: "18px",
			fontWeight: "bold",
			color: "#000",
			height: "26px",
			margin: "9px 0",
			textAlign: "center",
			flex: "1"
		}
	};
	apivm.define("hoc-header-bar-et", HocHeaderBarEt);

	var PlayVideo = /*@__PURE__*/ (function(Component) {
		function PlayVideo(props) {
			Component.call(this, props);
			this.data = {
				video_path: "https://www.apicloud.com/img/new/newhome/video.mp4",
				cover: props.cover
			};
		}

		if (Component) PlayVideo.__proto__ = Component;
		PlayVideo.prototype = Object.create(Component && Component.prototype);
		PlayVideo.prototype.constructor = PlayVideo;
		PlayVideo.prototype.onBack = function() {
			api.closeWin();
		};
		PlayVideo.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("hoc-header-bar-et", {
					title: "查看公开课",
					isBack: true,
					onOnBack: this.onBack
				}),
				apivm.h(
					"view",
					{class: "main", name: "21212121"},
					apivm.h("video", {
						src: this.data.video_path,
						poster: this.data.cover,
						mode: "aspectFit",
						autoplay: "true"
					})
				)
			);
		};

		return PlayVideo;
	})(Component);
	PlayVideo.css = {
		".page": {height: "100%"},
		".main": {
			flex: "1",
			justifyContent: "center",
			alignItems: "center",
			background: "#333"
		},
		video: {
			width: "100%",
			height: "200px",
			backgroundColor: "#666",
			alignSelf: "center"
		}
	};
	apivm.define("play-video", PlayVideo);
	apivm.render(apivm.h("play-video", null), "body");
})();
