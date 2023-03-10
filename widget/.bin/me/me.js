(function() {
	var remote_host = "https://wild.gene.ac";
	var version = api.appVersion;
	var session_storage_key = "wildzh_insider_session";
	var exam_storage_key = "wildzh_current_exam";
	var reqRandom = 100; // 用于某些资源防止缓存，加到请求参数中

	// remote_host = 'http://10.180.201.36:2400'

	var SERVER_ENDPOINT = remote_host;
	var urls = {
		password: "/user/token/password"
	};

	function getOrSetCacheData(key, value) {
		if (value === void 0) {
			value = null;
		}
		// 同步存储数据
		var g_key = "wildzh_cache_" + key;
		if (value == null || value == undefined) {
			// value = wx.getStorageSync(g_key);
			value = api.getStorageSync(g_key);
			// value = api.getPrefs({
			//     sync: true,
			//     key: g_key
			// });
			if (value == "" || value == undefined) {
				value = null;
			} else {
				value = JSON.parse(value);
			}
			return value;
		}
		api.setStorage({
			data: JSON.stringify(value),
			key: g_key
		});

		// api.setPrefs({
		//     key: g_key,
		//     value: value
		// });
		// wx.setStorageSync(g_key, value);
		return value;
	}

	function getOrSetCacheData2(key, value) {
		// 异步存储数据
		return getOrSetCacheData(key, value);
	}

	function getOrSetCurrentUserData(value) {
		if (value === void 0) {
			value = null;
		}
		var userInfoStorageKey = "user.data";
		if (value && value.avatar_url) {
			reqRandom = reqRandom + 1;
			if (value.avatar_url.substr(0, 1) == "/") {
				value.avatar_url = remote_host + value.avatar_url + "?r=" + reqRandom;
			}
		}
		return getOrSetCacheData(userInfoStorageKey, value);
	}

	function getOrSetTokenData(value) {
		if (value === void 0) {
			value = null;
		}
		var userInfoStorageKey = "user.token";
		return getOrSetCacheData(userInfoStorageKey, value);
	}

	function clearTokenData() {
		return getOrSetTokenData("");
	}

	function getOrSetCacheVersion(value) {
		var key = "version";
		var cacheVersion = getOrSetCacheData2(key, value);
		return cacheVersion;
	}

	function getDefaultExam() {
		var key = "default.exam";
		var currentExam = getOrSetCacheData(key);
		if (currentExam != null && currentExam != undefined) {
			globalData.defaultExamNo = currentExam["exam_no"];
			globalData.defaultExamName = currentExam["exam_name"];
		}
		return currentExam;
	}

	function copy(value) {
		var s = JSON.stringify(value);
		var o = JSON.parse(s);
		return o;
	}

	function print(r) {
		if (typeof r == "string") {
			console.info(r);
		} else {
			console.info(JSON.stringify(r));
		}
	}

	function str_format(s, args) {
		var ss = s.split("%s");
		if (ss.length != args.length + 1) {
			throw new Error("Can not format " + s);
		}
		var ns = ss[0];
		for (var i = 1; i < ss.length; i++) {
			ns += args[i - 1];
			ns += ss[i];
		}
		return ns;
	}
	// dt 时间相关
	function get_timestamp() {
		return new Date().valueOf();
	}

	function get_timestamp2() {
		return parseInt(get_timestamp() / 1000);
	}

	function duration_str(interval) {
		var hs = parseInt(interval / 3600);
		interval = interval % 3600;
		var ms = parseInt(interval / 60);
		var ss = interval % 60;
		if (hs < 10) {
			hs = "0" + hs;
		}
		if (hs > 99) {
			hs = 99;
		}
		if (ms < 10) {
			ms = "0" + ms;
		}
		if (ss < 10) {
			ss = "0" + ss;
		}
		var s = hs + ":" + ms + ":" + ss;
		return s;
	}
	var dt = {
		get_timestamp: get_timestamp,
		get_timestamp2: get_timestamp2,
		duration_str: duration_str
	};

	// dt对象 时间相关结束
	// 网络请求相关
	function my_request(url_name, method, data, success_func) {
		var r_url = SERVER_ENDPOINT + urls[url_name];
		api.ajax(
			{
				url: r_url,
				method: method,
				headers: {
					"X-APP-Version": api.version,
					"X-REQ-API": "v1",
					"Content-Type": "application/json;charset=utf-8"
				},

				data: {
					body: data
				}
			},

			function(ret, err) {
				if (ret) {
					success_func(ret);
				} else {
					api.alert({
						msg: JSON.stringify(err)
					});
				}
			}
		);
	}

	function my_auth_request(url, method, data, successFunc, failFunc) {
		var r_url = SERVER_ENDPOINT + url;
		var token_data = getOrSetTokenData();
		if (token_data == null) {
			return false;
		}
		if (!"access_token" in token_data) {
			return false;
		}

		var auth_token =
			token_data["access_token"] + ":" + get_timestamp2() + ":sha2:" + "sign";
		var req_data = null;
		if (method != "GET" && data != null) {
			req_data = {
				body: data
			};
		}
		api.ajax(
			{
				url: r_url,
				method: method,
				headers: {
					"X-APP-Version": api.version,
					"X-REQ-API": "v1",
					"Content-Type": "application/json;charset=utf-8",
					"X-OAuth-Token": auth_token
				},

				data: req_data
			},
			function(ret, err) {
				if (ret) {
					if (successFunc) {
						successFunc(ret);
					}
				} else {
					if (err.statusCode == 401) {
						var body = err.body;
						if (body == "token_not_storage" || body == "token_bad_format") {
							api.openWin({
								name: "重新登录",
								url: "widget://pages/login/login.shtml",
								pageParam: {
									name: "re_login"
								}
							});

							return false;
						}
					} else if (failFunc) {
						failFunc(console.err);
					} else {
						api.alert({
							msg: JSON.stringify(err)
						});
					}
				}
			}
		);
	}

	function _get_auth_token() {
		var token_data = getOrSetTokenData();
		if (token_data == null) {
			return "";
		}
		if (!token_data["access_token"]) {
			return "";
		}

		var auth_token =
			token_data["access_token"] + ":" + get_timestamp2() + ":sha2:" + "sign";
		return auth_token;
	}

	// wx 对象

	function request2(req) {
		// var screenData = that.getScreenInfo();
		if (req["headers"]);
		else {
			req.headers = {};
		}
		req.headers["rf"] = "async";
		req.headers["X-OAuth-Token"] = _get_auth_token();
		req.headers["X-Device-Screen-Width"] = api.winWidth;
		req.headers["X-VMP-Version"] = version;
		req.headers["X-REQ-API"] = "v1";
		var cacheVersion = getOrSetCacheVersion();
		var newVersion = false;
		if (cacheVersion != version) {
			req.headers["X-VMP-Version-N"] = version;
			print("new version");
			newVersion = true;
		}
		if (req.url[0] == "/") {
			req.url = remote_host + req.url;
		}
		var retry = 0;
		if ("retry" in req) {
			retry = req.retry;
		}
		if (req.data) {
			req.headers["Content-Type"] = "application/json;charset=utf-8";
			req.data = {body: req.data};
			if (req.method == "DELETE") {
				req.method = "POST";
				req.headers["X-Request-Method"] = "DELETE";
			}
		}
		if (req.success) {
			var origin_success = req.success;
			req.success = function(res) {
				if (newVersion) {
					getOrSetCacheVersion(version);
				}
				// 当前statusCode是没赋值的 所以不会在这触发重新登录
				if (res.statusCode != 302 && res.statusCode != 401) {
					var data = {data: res, statusCode: 200};
					origin_success(data);
				} else {
					api.openWin({
						name: "重新登录",
						url: "widget://pages/login/login.shtml",
						pageParam: {
							name: "re_login"
						}
					});
				}
			};
		}
		// if(failFunc != null){
		//   return wx.request(req).catch(failFunc);
		// }
		var success_func = req.success;
		return api.ajax(req, function(ret, err) {
			if (ret) {
				success_func(ret);
			} else {
				// 未登录 当前会进入这里
				print("request " + req.url + " fail " + err.statusCode);
				if (err.statusCode == 401) {
					// api.redirectTo({
					//     url: 'widget://pages/login/login.stml',
					// })
					api.openWin({
						name: "重新登录",
						url: "widget://pages/login/login.stml",
						pageParam: {
							name: "re_login"
						}
					});

					return false;
				}
				if (req.fail) {
					print(err);
					return req.fail(err);
				}
				api.alert({
					msg: JSON.stringify(err)
				});
			}
		});
	}

	function user_ping(callback) {
		request2({
			url: "/user/ping",
			success: function success(res) {
				callback(res);
			},
			fail: function fail(res) {
				callback(res);
			}
		});
	}

	function showModal(params) {
		var showCancel = params.showCancel;
		if (showCancel == undefined) {
			showCancel = true;
		}
		var cancelText = "取消";
		var confirmText = "确定";
		if (params.cancelText != undefined) {
			cancelText = params.cancelText;
		}
		var confirmIndex = 1;
		var buttons = [];
		if (showCancel) {
			buttons.push(cancelText);
			confirmIndex = 2;
		}
		buttons.push(confirmText);
		var n_params = {buttons: buttons};
		if (params.title) {
			n_params["title"] = params.title;
		}
		if (params.content) {
			n_params["msg"] = params.content;
		}
		if (buttons.length > 1) {
			api.confirm(n_params, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == confirmIndex && params.success) {
					ret.confirm = true;
					params.success(ret);
				}
			});
		} else {
			api.alert(n_params, function(ret, err) {
				if (params.success) {
					params.success(ret);
				}
			});
		}
	}

	function switchTab(params) {
		if (params.url.indexOf("me") >= 0) {
			api.setTabBarAttr({
				index: 4
			});
		} else {
			api.alert({
				title: "不支持的切换",
				msg: JSON.stringify(params)
			});
		}
	}

	function navigateTo(params) {
		var url = params.url;
		var items = url.split("?");
		var reg = /(html|stml)$/;

		var path = items[0];
		var tr = reg.test(path);
		if (!tr) {
			path = path + ".stml";
		}
		if (items.length > 1) {
			path = path + "?";
			for (var i = 1; i < items.length; i++) {
				path = path + items[i];
			}
		}
		params.url = path;
		print(path);
		// api.openWin({
		//     name: 'test',
		//     url: 'training.stml'
		// })
		api.navigateTo(params);
	}

	function showToast(params) {
		var n_params = {};
		if (params.title !== undefined) {
			n_params.msg = params.title;
		}
		if (params.duration !== undefined) {
			n_params.duration = params.duration;
		}
		n_params.location = "middle";
		api.toast(n_params);
	}
	// wx 对象 end

	// 安全对象
	var captureScreenNumKey = "capture_screen_num";
	var _currentAction = "";

	function startSecurityMonitor() {
		api.onUserCaptureScreen(function(res) {
			var _cacheNum = _app.getOrSetCacheData(captureScreenNumKey);
			if (_cacheNum == null) {
				_cacheNum = 0;
			}
			_cacheNum = _cacheNum + 1;
			recordCaptureScreen(_cacheNum);
		});
		// 进入检查有没有 未提交的截屏记录
		var cacheNum = _app.getOrSetCacheData(captureScreenNumKey);
		if (cacheNum != null && cacheNum >= 1) {
			recordCaptureScreen(cacheNum);
		}
	}

	function showSecurityMesg(action, message) {
		// return true 调用方应终止活动
		// return false 可继续
		if (_currentAction == "exit") {
			return true;
		}
		if (action == "normal") {
			return false;
		}
		if (action == "exit") {
			_currentAction = action;
			wx.showModal({
				content: message,
				showCancel: false,
				success: function success(res) {
					wx.navigateBack({
						delta: 1
					});

					_currentAction = "";
				}
			});

			return true;
		} else {
			wx.showModal({
				content: message,
				showCancel: false
			});
		}
		return false;
	}

	function recordCaptureScreen(num) {
		var cPages = getCurrentPages();
		var data = {
			times: num,
			path: cPages[cPages.length - 1].route
		};

		function _error(num) {
			getOrSetCacheData(captureScreenNumKey, num);
			if (num > 3) {
				showSecurityMesg("exit", "当前网络异常【S-CS】，返回上一级");
			}
		}
		wx.request2({
			url: "/security/capture/screen",
			method: "POST",
			data: data,
			success: function success(res) {
				if (res.statusCode == 200) {
					if (res.data.status == false) {
						_error(num);
					} else {
						_app.getOrSetCacheData(captureScreenNumKey, 0);
						showSecurityMesg(res.data.se["action"], res.data.se["message"]);
					}
				} else {
					_error(num);
				}
			},
			fail: function fail() {
				_error(num);
			}
		});

		// wx.showToast({
		//     title: '发现截屏',
		// })
	}
	var SE = {
		startSecurityMonitor: startSecurityMonitor,
		recordCaptureScreen: recordCaptureScreen,
		showSecurityMesg: showSecurityMesg
	};

	// 安全对象 结束

	globalData = {
		version: version,
		userInfo: null,
		nowQuestionList: [],
		nowAnswerResultList: [],
		wrongAnswerList: [],
		allTestIdKey: "wildzh_testids",
		testIdPrefix: "wildzh_test_",
		sessionStorageKey: session_storage_key,
		myProjectStorageKey: "wildzh_my_projects",
		examStorageKey: exam_storage_key,
		remote_host: remote_host,
		userItem: {},
		optionChar: ["A", "B", "C", "D", "E", "F", "G", "H"],
		defaultExamNo: null,
		defaultExamName: "",
		screenData: null,
		roleMap: {
			owner: 1,
			superAdmin: 2,
			admin: 3,
			member: 5,
			partDesc: 25
		}
	};

	wx = {
		request2: request2,
		user_ping: user_ping,
		showModal: showModal,
		switchTab: switchTab,
		navigateTo: navigateTo,
		showToast: showToast,
		showLoading: function showLoading() {},
		hideLoading: function hideLoading() {},
		setStorageSync: api.setStorageSync,
		setStorage: api.setStorage,
		getStorageSync: api.getStorageSync,
		getStorage: api.getStorage
	};

	// init
	// getDefaultExam();

	var app = {
		remote_host: remote_host,
		identity: api.deviceId,
		getOrSetCacheData: getOrSetCacheData,
		getOrSetCurrentUserData: getOrSetCurrentUserData,
		getOrSetTokenData: getOrSetTokenData,
		clearTokenData: clearTokenData,
		setDefaultExam: function setDefaultExam(examItem) {
			var key = "default.exam";
			globalData.defaultExamNo = examItem["exam_no"];
			globalData.defaultExamName = examItem["exam_name"];
			getOrSetCacheData(key, examItem);
		},
		getDefaultExam: getDefaultExam,
		getOrSetExamCacheData: function getOrSetExamCacheData(key, value) {
			if (globalData.defaultExamNo == null) {
				return null;
			}
			var g_key = globalData.defaultExamNo + "_" + key;
			return getOrSetCacheData2(g_key, value);
		},
		print: print,
		copy: copy,
		my_request: my_request,
		my_auth_request: my_auth_request,
		get_timestamp2: get_timestamp2,
		str_format: str_format,
		globalData: globalData,
		wx: wx,
		SE: SE,
		dt: dt
	};

	var _app = app;

	var HocMenuListSgm = /*@__PURE__*/ (function(Component) {
		function HocMenuListSgm(props) {
			Component.call(this, props);
			this.data = {};
			this.compute = {
				menuList: function() {
					return (
						this.props.menuList || [
							{
								title: "收货地址",
								link: null
							},

							{
								title: "关于我们",
								link: null
							}
						]
					);
				},
				title: function() {},
				link: function() {}
			};
		}

		if (Component) HocMenuListSgm.__proto__ = Component;
		HocMenuListSgm.prototype = Object.create(Component && Component.prototype);
		HocMenuListSgm.prototype.constructor = HocMenuListSgm;
		HocMenuListSgm.prototype.apiready = function() {};
		HocMenuListSgm.prototype.itemClick = function(item) {
			this.fire("itemClick", item);
		};
		HocMenuListSgm.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "hoc-menu-list"},
				(Array.isArray(this.menuList)
					? this.menuList
					: Object.values(this.menuList)
				).map(function(item$1, index$1) {
					return apivm.h(
						"view",
						{
							class: "hoc-menu-list-item",
							key: item$1.title + index$1,
							onClick: function() {
								return this$1.itemClick(item$1);
							}
						},
						apivm.h("text", {class: "hoc-menu-list-item-title"}, item$1.title),
						item$1.content
							? apivm.h("text", {class: "hoc-menu-list-item-title"}, item$1.content)
							: null,
						item$1.href
							? apivm.h("img", {
									class: "hoc-menu-list-item-gor",
									src: "../../images/right_slip.png"
							  })
							: apivm.h("img", {class: "hoc-menu-list-item-gor"})
					);
				})
			);
		};

		return HocMenuListSgm;
	})(Component);
	HocMenuListSgm.css = {
		".hoc-menu-list": {
			borderRadius: "4px",
			backgroundColor: "white",
			marginBottom: "10px",
			padding: "0 10px"
		},
		".hoc-menu-list-item": {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			borderBottom: "1px solid #f8f8f8",
			height: "49px"
		},
		".hoc-menu-list-item:active": {opacity: "0.7"},
		".hoc-menu-list-item-title": {fontSize: "14px", color: "#333"},
		".hoc-menu-list-item-gor": {width: "10px", height: "10px"}
	};
	apivm.define("hoc-menu-list-sgm", HocMenuListSgm);

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

	var HocUserPanelSgm = /*@__PURE__*/ (function(Component) {
		function HocUserPanelSgm(props) {
			Component.call(this, props);
			this.data = {
				id: this.props.id !== undefined ? this.props.id : "111"
				// examName: this.props.examName !== undefined ? this.props.examName : "--"
			};
			this.compute = {
				nickname: function() {
					return this.props.nickname !== undefined ? this.props.nickname : "未登录";
				},
				avatar: function() {
					return this.props.avatar !== undefined
						? this.props.avatar
						: "../../images/unregister.png";
				},
				allExams: function() {
					return this.props.allExams !== undefined ? this.props.allExams : [];
				},
				examName: function() {
					return this.props.examName !== undefined ? this.props.examName : "--";
				}
			};
		}

		if (Component) HocUserPanelSgm.__proto__ = Component;
		HocUserPanelSgm.prototype = Object.create(Component && Component.prototype);
		HocUserPanelSgm.prototype.constructor = HocUserPanelSgm;
		HocUserPanelSgm.prototype.apiready = function() {};
		HocUserPanelSgm.prototype.handleClick = function() {
			this.fire("handleClick");
		};
		HocUserPanelSgm.prototype.selectChange = function(e) {
			// var index = e.detail.value;
			// this.data.examName = this.props.allExams[index].exam_name;
			this.fire("selectChange", e.detail);
		};
		HocUserPanelSgm.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "hoc-user-panel-sgm"},
				apivm.h(
					"view",
					{class: "hoc-user-panel-sgm-wrap"},
					apivm.h("img", {
						class: "hoc-user-panel-sgm-logo",
						src: this.avatar,
						mode: "aspectFill"
					}),
					apivm.h(
						"view",
						{class: "hoc-user-panel-sgm-name"},
						apivm.h(
							"view",
							{class: "hoc-user-panel-sgm-name-1"},
							apivm.h("text", {class: "hoc-user-panel-sgm-name-1"}, this.nickname)
						),
						apivm.h(
							"view",
							{class: "hoc-user-panel-sgm-name-2"},
							apivm.h(
								"picker",
								{
									class: "hoc-user-panel-sgm-name-2-text",
									onchange: function(event) {
										if (this$1.selectChange) {
											this$1.selectChange(event);
										} else {
											selectChange(event);
										}
									},
									mode: "selector",
									range: this.allExams,
									"range-key": "exam_name"
								},
								apivm.h(
									"view",
									{class: "hoc-user-panel-sgm-name-2-text"},
									apivm.h(
										"text",
										{
											class:
												"hoc-user-panel-sgm-name-2-center hoc-user-panel-sgm-name-2-color"
										},
										this.examName
									)
								)
							)
						)
					),
					apivm.h("image", {
						class: "hoc-user-panel-sgm-gol",
						mode: "aspectFit",
						src: "../../images/right_slip.png",
						onClick: this.handleClick
					})
				)
			);
		};

		return HocUserPanelSgm;
	})(Component);
	HocUserPanelSgm.css = {
		".hoc-user-panel-sgm": {height: "126px", backgroundColor: "transparent"},
		".hoc-user-panel-sgm_bg": {
			position: "absolute",
			width: "100%",
			height: "100%"
		},
		".hoc-user-panel-sgm-wrap": {
			flexDirection: "row",
			alignItems: "center",
			height: "100%"
		},
		".hoc-user-panel-sgm-logo": {
			width: "60px",
			height: "60px",
			borderRadius: "50%",
			marginLeft: "20px",
			backgroundColor: "#f8f8f8"
		},
		".hoc-user-panel-sgm-name": {
			flex: "1",
			fontSize: "17px",
			color: "black",
			margin: "0 15px"
		},
		".hoc-user-panel-sgm-name-1": {fontSize: "20px", color: "black"},
		".hoc-user-panel-sgm-name-2": {
			marginTop: "5px",
			flexDirection: "row",
			height: "35px",
			lineHeight: "35px"
		},
		".hoc-user-panel-sgm-name-2-color": {color: "#20b2aa"},
		".bg1": {backgroundColor: "brown", flexShrink: "0"},
		".hoc-user-panel-sgm-name-2-center": {
			height: "35px",
			lineHeight: "35px",
			fontSize: "12px"
		},
		".hoc-user-panel-sgm-name-2-text": {
			color: "#20b2aa",
			paddingLeft: "5px",
			paddingRight: "5px",
			backgroundColor: "white"
		},
		".hoc-user-panel-sgm-gol": {
			width: "36px",
			height: "100%",
			paddingLeft: "10px",
			paddingRight: "10px",
			marginRight: "20px"
		}
	};
	apivm.define("hoc-user-panel-sgm", HocUserPanelSgm);

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

	global.wx = app.wx;
	global.noExamName = "未选择 -- 点击选择";
	global.lastUpdateUserKey = "updateUserTime";
	global.that = undefined;
	global.KEY_DATA = "user.me";
	var HocMinePageSgm = /*@__PURE__*/ (function(Component) {
		function HocMinePageSgm(props) {
			Component.call(this, props);
			this.data = {
				register: false,
				userNo: "",
				userAvatar: "",
				nickName: "专升本用户",
				hiddenUnickName: true,
				allExams: [],
				examName: noExamName,
				examNo: 0,
				examEndTime: null,
				examTip: "未拥有当前题库所有操作权限",
				currentTip: null,
				brushNum: 0, // 刷题数
				ranking: 0, // 排名
				accuracy: "100%",
				version: props.version,
				useProfile: true,
				// 小程序外 添加的
				titles: ["刷题排名", "刷题数", "正确率", "错题本"],
				menuList2: [{title: "版本", content: app.globalData.version}]
			};
			this.compute = {
				menuList1: function() {
					return this.getMenuList1();
				}
			};
		}

		if (Component) HocMinePageSgm.__proto__ = Component;
		HocMinePageSgm.prototype = Object.create(Component && Component.prototype);
		HocMinePageSgm.prototype.constructor = HocMinePageSgm;
		HocMinePageSgm.prototype.apiready = function() {
			this.onLoad();
		};
		HocMinePageSgm.prototype.setData = function(data) {
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		HocMinePageSgm.prototype.getMenuList1 = function() {
			return [
				{title: "昵称", content: this.data.nickName},
				{title: "编号", content: this.data.userNo},
				// { 'title': '积分', 'content': '' },
				{title: "题库", content: this.data.examName},
				{title: "题库有效期", content: this.data.examEndTime}
			];
		};
		HocMinePageSgm.prototype.getMenuList2 = function() {
			return [{title: "版本", content: this.data.version}];
		};
		HocMinePageSgm.prototype.loadCacheData = function() {
			this.data.menuList = [
				{title: "昵称", content: "未选择"},
				{title: "编号", content: ""},
				{title: "积分", content: ""},
				{title: "题库", content: ""},
				{title: "题库有效期", content: ""}
			];
		};
		HocMinePageSgm.prototype.toLogin = function() {
			wx.showModal({
				title: "退出登录",
				content: "确定要退出当前登录账户吗？",
				success: function() {
					api.openWin({
						name: "logout",
						url: "../login/login.stml",
						pageParam: {logout: true}
					});
				}
			});
		};
		HocMinePageSgm.prototype.onLoad = function() {
			app.getDefaultExam();
			if (app.globalData.defaultExamNo != null) {
				this.setData({
					examName: app.globalData.defaultExamName,
					examNo: app.globalData.defaultExamNo
				});
			}
			//  非小程序有的方法 加上为了登录成功后，返回能刷新页面
			var that = this;
			api.addEventListener(
				{
					name: "viewappear"
				},
				function(ret, err) {
					that.onShow();
				}
			);
			// var useProfile = wx.canIUse('getUserProfile');
			// this.setData({
			//     useProfile: useProfile
			// })

			// this.loadCacheUserInfo()

			// if ('share_token' in options) {
			//     var st = options['share_token'];
			//     this.receiveShare(st);
			// }
		};
		HocMinePageSgm.prototype.onShow = function() {
			this.setData({
				examTip: ""
			});

			this.getExams();
			this.loadCacheUserInfo();
		};
		HocMinePageSgm.prototype.loadCacheUserInfo = function(data) {
			if (data == null) {
				this.getUserData();
				return;
			} else {
				var currentUser = data;
			}
			if (currentUser != null) {
				if (currentUser["user_no"]) {
					this.setData({
						userNo: currentUser.user_no
					});
				}
				if (currentUser.avatar_url) {
					this.setData({
						userAvatar: currentUser.avatar_url,
						nickName: currentUser.nick_name
					});
				}
			} else {
				this.getUserData();
			}
		};
		HocMinePageSgm.prototype.getUserInfo = function(e) {
			var userInfo = e.detail.userInfo;
			var data = {
				avatar_url: userInfo.avatarUrl,
				nick_name: userInfo.nickName
			};

			wx.showLoading({
				title: "登录中...",
				mask: true
			});

			this.updateUserInfoAction(data);
		};
		HocMinePageSgm.prototype.getUserData = function() {
			that = this;
			wx.request2({
				url: "/user/info/",
				method: "GET",
				success: function(res) {
					var data = res["data"];
					app.getOrSetCurrentUserData(data["data"][0]);
					that.loadCacheUserInfo(data["data"][0]);
				},
				fail: function(res) {
					that.setData({
						examTip: "网络连接错误，请检查网络"
					});
				}
			});
		};
		HocMinePageSgm.prototype.getExams = function() {
			that = this;
			wx.request2({
				url: "/exam/info/",
				method: "GET",
				success: function(res) {
					var allExams = [];
					var resData = res.data.data;
					for (var index in resData) {
						if (resData[index]["question_num"] > 0) {
							allExams.push(resData[index]);
						}
					}
					that.setData({
						allExams: allExams
					});

					that.examChange();
					wx.hideLoading();
				},
				fail: function(res) {
					that.setData({
						examTip: "网络连接错误，请检查网络"
					});
				}
			});
		};
		HocMinePageSgm.prototype.getBrushNum = function() {
			var examNo = this.data.examNo;
			var examEndTime = null;
			var allExams = this.data.allExams;
			var examTip = "";
			for (var i = 0; i < allExams.length; i++) {
				if (allExams[i].exam_no == examNo) {
					if (allExams[i].exam_role > 10) {
						examTip = "未拥有当前题库所有操作权限";
					}
					if (allExams[i].end_time !== undefined) {
						var end_time = allExams[i]["end_time"];
						if (end_time == null) {
							examEndTime = "无期限";
						} else if (end_time <= 0) {
							// 不显示 有效期
							examEndTime = "--";
							break;
						} else {
							examEndTime = app.timestamp_2_date(end_time);
						}
					}
					break;
				}
			}
			this.setData({
				examEndTime: examEndTime,
				examTip: examTip
			});

			if (examNo == 0) {
				that.setData({
					brushNum: 0
				});

				return false;
			}
			that = this;
			wx.request2({
				url: "/exam/usage?period_no=-1&exam_no=" + examNo,
				method: "GET",
				success: function(res) {
					if (res.data.status == false) {
						return false;
					}
					var resData = res.data.data;
					var brushNum = resData["num"];
					var rightNum = resData["right_num"];
					var accuracy = "0%";
					if (rightNum > 0) {
						accuracy = parseInt((rightNum * 100) / brushNum) + "%";
					}
					that.setData({
						brushNum: brushNum,
						accuracy: accuracy
					});

					that.getRanking(brushNum);
				}
			});
		};
		HocMinePageSgm.prototype.getRanking = function(brushNum) {
			if (brushNum <= 0) {
				return false;
			}
			var examNo = this.data.examNo;
			var that = this;
			wx.request2({
				url: "/exam/usage/ranking?exam_no=" + examNo + "&num=" + brushNum,
				method: "GET",
				success: function(res) {
					if (res.data.status == false) {
						return false;
					}
					var resData = res.data.data;
					var ranking = resData["ranking"];
					that.setData({
						ranking: ranking
					});
				}
			});
		};
		HocMinePageSgm.prototype.getTips = function() {
			var examNo = this.data.examNo;
			var examTip = "";
			var currentTip = null;
			this.setData({
				currentTip: null
			});

			that = this;
			wx.request2({
				url: "/exam/tips?exam_no=" + examNo,
				method: "GET",
				success: function(res) {
					if (res.data.status == false) {
						return false;
					}
					var resData = res.data.data;
					if (resData.length <= 0) {
						return;
					}
					currentTip = resData[0];
					examTip = currentTip.tip;
					that.setData({
						examTip: examTip,
						currentTip: currentTip
					});
				}
			});
		};
		HocMinePageSgm.prototype.examChange = function(e) {
			var examIndex = -1;
			var currentExam = {
				exam_no: 0,
				exam_name: noExamName,
				enable_share: false
			};

			if (e == null) {
				var allExams = this.data.allExams;
				for (var l = allExams.length, i = 0; i < l; i++) {
					if (allExams[i].exam_no == this.data.examNo) {
						examIndex = i;
					}
				}
			} else {
				examIndex = e.detail.value;
			}
			if (examIndex >= 0) {
				currentExam = this.data.allExams[examIndex];
			}
			this.setData({
				examNo: currentExam.exam_no,
				examName: currentExam.exam_name,
				enableShare: currentExam.enable_share,
				examIndex: examIndex
			});

			if (examIndex >= 0) {
				app.setDefaultExam(currentExam);
				this.getBrushNum();
				if (currentExam.exam_role <= 3) {
					this.getTips();
				}
			} else {
				this.setData({
					examTip: "请选择题库！"
				});
			}
		};
		HocMinePageSgm.prototype.toWrongPage = function(e) {
			wx.navigateTo({
				url: "../training/training?wrong_question=true"
			});
		};
		HocMinePageSgm.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"safe-area",
				{class: "hoc-mine-page-wrapper"},
				apivm.h("hoc-nav-bar-sgm", {title: "我的"}),
				apivm.h("hoc-user-panel-sgm", {
					nickname: this.data.nickName,
					avatar: this.data.userAvatar,
					allExams: this.data.allExams,
					examName: this.data.examName,
					onselectChange: function(event) {
						if (this$1.examChange) {
							this$1.examChange(event);
						} else {
							examChange(event);
						}
					},
					onhandleClick: function(event) {
						if (this$1.toLogin) {
							this$1.toLogin(event);
						} else {
							toLogin(event);
						}
					}
				}),
				apivm.h("statis", {
					image4: "../../images/wrong.png",
					onclickImg4: function(event) {
						if (this$1.toWrongPage) {
							this$1.toWrongPage(event);
						} else {
							toWrongPage(event);
						}
					},
					titles: this.data.titles,
					value1: this.data.ranking,
					value2: this.data.brushNum,
					value3: this.data.accuracy
				}),
				apivm.h("hoc-menu-list-sgm", {menuList: this.menuList1}),
				apivm.h("hoc-menu-list-sgm", {menuList: this.data.menuList2})
			);
		};

		return HocMinePageSgm;
	})(Component);
	HocMinePageSgm.css = {
		".hoc-mine-page-wrapper": {
			display: "flex",
			flexDirection: "column",
			background: "#f8f8f8",
			width: "100%",
			height: "100%",
			position: "relative"
		}
	};
	apivm.define("hoc-mine-page-sgm", HocMinePageSgm);
	apivm.render(apivm.h("hoc-mine-page-sgm", null), "body");
})();
