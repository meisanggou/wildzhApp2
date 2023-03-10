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

	global.wx = app.wx;
	var Good = /*@__PURE__*/ (function(Component) {
		function Good(props) {
			Component.call(this, props);
			this.data = {
				vcBalance: 0,
				vcExpenses: 0,
				hiddenModal: true,
				goods: [],
				goodIndex: -1,
				// 小程序外 添加的
				titles: ["拥有积分", "已消费积分", "积分记录", "赚积分"],
				menuList2: [{title: "版本", content: app.globalData.version}]
			};
		}

		if (Component) Good.__proto__ = Component;
		Good.prototype = Object.create(Component && Component.prototype);
		Good.prototype.constructor = Good;
		Good.prototype.apiready = function() {
			//like created
			var options = api.pageParam;
			this.onLoad(options);
		};
		Good.prototype.setData = function(data) {
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		Good.prototype.onLoad = function(options) {};
		Good.prototype.onShow = function() {
			this.getVCstatus();
			this.getVCGoods();
		};
		Good.prototype.updateGoods = function(goods) {
			for (var i = 0, l = goods.length; i < l; i++) {
				goods[i]["id"] = goods[i].good_type + "-" + goods[i].good_id;
				if (goods[i].available == "conditional") {
					this.isEnableGoods(goods[i].good_type, goods[i].good_id);
				}
			}
			this.setData({
				goods: goods
			});
		};
		Good.prototype.getVCstatus = function() {
			var that = this;
			wx.request2({
				url: "/vc/status",
				method: "GET",
				success: function(res) {
					var pk = res.data;
					if (pk.status != true) {
						return;
					}
					var data = pk.data;
					var vcBalance = data.balance + data.sys_balance;
					var vcExpenses = data.expenses + data.sys_expenses;
					that.setData({
						vcBalance: vcBalance,
						vcExpenses: vcExpenses
					});
				}
			});
		};
		Good.prototype.getVCGoods = function() {
			var that = this;
			wx.request2({
				url: "/vc/goods",
				method: "GET",
				success: function(res) {
					var pk = res.data;
					app.print(pk);
					if (pk.status != true) {
						return;
					}
					var data = pk.data;
					that.updateGoods(data.goods);
				}
			});
		};
		Good.prototype.toMakeVCPage = function() {
			wx.navigateTo({
				url: "make_vc"
			});
		};
		Good.prototype.isEnableGoods = function(good_type, good_id) {
			var that = this;
			var url_args = "good_type=" + good_type + "&good_id=" + good_id;
			wx.request2({
				url: "/vc/goods/condition?" + url_args,
				method: "GET",
				success: function(res) {
					var obj;

					var pk = res.data;
					if (pk.status != true) {
						return;
					}
					var data = pk.data;
					for (var i = 0, l = that.data.goods.length; i < l; i++) {
						var good_item = that.data.goods[i];
						if (good_item.good_type == good_type && good_item.good_id == good_id) {
							good_item["available"] = data.available;
							that.setData(
								((obj = {}), (obj["goods[" + i + "].available"] = data.available), obj)
							);

							break;
						}
					}
				}
			});
		};
		Good.prototype.goodsExchange = function(g_item) {
			var that = this;
			var data = g_item;
			wx.request2({
				url: "/vc/goods/exchange",
				method: "POST",
				data: data,
				success: function(res) {
					var pk = res.data;
					if (pk.status != true) {
						wx.showModal({
							title: "兑换失败",
							content: pk.data,
							showCancel: false
						});

						that.getVCstatus();
						that.getVCGoods();
						return;
					}
					var vc = pk.data.vc;
					wx.showToast({
						title: pk.data.message
					});

					var vcBalance = vc.balance + vc.sys_balance;
					var vcExpenses = vc.expenses + vc.sys_expenses;
					that.setData({
						vcBalance: vcBalance,
						vcExpenses: vcExpenses
					});

					that.getVCGoods();
				}
			});
		};
		Good.prototype.preExchange = function(e) {
			var index = e.currentTarget.dataset.index;
			this.setData({
				hiddenModal: false,
				goodIndex: index
			});
		};
		Good.prototype.confirmExchange = function() {
			this.setData({
				hiddenModal: true
			});

			var g_item = this.data.goods[this.data.goodIndex];
			this.goodsExchange(g_item);
		};
		Good.prototype.cancelExchange = function() {
			this.setData({
				hiddenModal: true
			});
		};
		Good.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("safe-area", null, apivm.h("hoc-nav-bar-sgm", {title: "积分"})),
				apivm.h("view", {class: "top"}),
				apivm.h("statis", {
					image4: "../../images/make_vc.png",
					titles: this.data.titles,
					value1: this.data.vcBalance,
					value2: this.data.vcExpenses,
					value3: "--"
				}),

				apivm.h(
					"scroll-view",
					{class: "goods"},
					(Array.isArray(this.data.goods)
						? this.data.goods
						: Object.values(this.data.goods)
					).map(function(item$1) {
						return apivm.h(
							"view",
							{
								class: "good-item",
								"v-key": "id",
								"v-if": item$1.available == "enable" || item$1.disable_msg
							},
							apivm.h(
								"view",
								{class: "good-item-left"},
								apivm.h(
									"view",
									{class: "good-item-title"},
									apivm.h(
										"view",
										null,
										apivm.h("text", null, item$1.title),
										item$1.sub_title ? apivm.h("text", null, item$1.sub_title) : null
									)
								),

								apivm.h(
									"view",
									{class: "good-item-vc red"},
									apivm.h(
										"view",
										{class: "good-item-vc-detail"},
										apivm.h("text", {class: "red"}, item$1.vc_count, "积分"),
										item$1.attention
											? apivm.h(
													"text",
													{class: "good-item-attention red"},
													item$1.attention
											  )
											: null
									)
								)
							),
							apivm.h(
								"view",
								{class: "good-item-right"},
								item$1.available == "enable"
									? apivm.h(
											"view",
											null,
											this$1.data.vcBalance >= item$1.vc_count
												? apivm.h(
														"text",
														{
															class: "good-item-button bc-enable",
															"data-index": index,
															bindtap: "preExchange"
														},
														"立即兑换"
												  )
												: apivm.h(
														"text",
														{class: "good-item-button bc-disable"},
														"积分不足"
												  )
									  )
									: apivm.h(
											"view",
											null,
											apivm.h("text", {class: "good-item-button bc-disable"}, "立即兑换"),
											apivm.h(
												"text",
												{class: "good-item-lh red text-center"},
												item$1.disable_msg
											)
									  )
							)
						);
					})
				)
			);
		};

		return Good;
	})(Component);
	Good.css = {
		".page": {backgroundColor: "#F8F8F8", height: "100%"},
		".top": {height: "45rpx"},
		".good-item": {
			display: "flex",
			flexDirection: "row",
			borderTop: "whitesmoke solid 1px",
			backgroundColor: "white",
			borderRadius: "5px",
			marginTop: "10px",
			marginLeft: "1.5%",
			width: "97%",
			height: "125px",
			fontSize: "15px"
		},
		".good-item-title": {
			display: "flex",
			height: "75px",
			alignItems: "center",
			fontSize: "17px"
		},
		".good-item-lh": {height: "25px", lineHeight: "25px", margin: "0 auto"},
		".good-item-left": {display: "flex", width: "70%", marginLeft: "5px"},
		".red": {color: "red"},
		".good-item-vc": {display: "flex", height: "50px", alignItems: "left"},
		".good-item-vc-detail": {position: "absolute"},
		".good-item-attention": {
			paddingLeft: "7px",
			paddingRight: "7px",
			borderRadius: "2px",
			border: "red solid 1px"
		},
		".good-item-button": {
			marginTop: "30px",
			height: "45px",
			lineHeight: "45px",
			paddingLeft: "15px",
			paddingRight: "15px",
			fontSize: "16px",
			textAlign: "center",
			borderRadius: "5px",
			backgroundColor: "chocolate"
		},
		".text-center": {textAlign: "center"},
		".bc-enable": {backgroundColor: "#fae1ab"},
		".bc-disable": {backgroundColor: "#999999", color: "white"},
		".dis-flex": {display: "flex"},
		".margin-l20": {marginLeft: "10px"}
	};
	apivm.define("good", Good);
	apivm.render(apivm.h("good", null), "body");
})();
