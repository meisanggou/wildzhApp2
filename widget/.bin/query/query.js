(function() {
	var AvmZySearch = /*@__PURE__*/ (function(Component) {
		function AvmZySearch(props) {
			Component.call(this, props);
			this.data = {
				id: props.id,
				value: props.value,
				placeholder: props.placeholder
			};
		}

		if (Component) AvmZySearch.__proto__ = Component;
		AvmZySearch.prototype = Object.create(Component && Component.prototype);
		AvmZySearch.prototype.constructor = AvmZySearch;
		AvmZySearch.prototype.installed = function() {};
		AvmZySearch.prototype.leftIcon = function() {
			this.fire("event", {
				type: "icon",
				value: this.data.value || ""
			});
		};
		AvmZySearch.prototype.rightIcon = function() {
			this.data.value = "";
			this.fire("event", {
				type: "clean",
				value: this.data.value || ""
			});
		};
		AvmZySearch.prototype.onfocus = function(e) {
			this.data.value = e.detail.value;
			this.fire("event", {
				type: "focus",
				value: this.data.value || ""
			});
		};
		AvmZySearch.prototype.oninput = function(e) {
			this.data.value = e.detail.value;
			this.fire("event", {
				type: "input",
				value: this.data.value || ""
			});
		};
		AvmZySearch.prototype.onconfirm = function(e) {
			$("#" + this.data.id).blur();
			this.fire("event", {
				type: "enter",
				value: this.data.value || ""
			});
		};
		AvmZySearch.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "avm-zy-search-search_box"},
				apivm.h(
					"view",
					{class: "avm-zy-search-search_warp"},
					apivm.h(
						"view",
						{
							onClick: function() {
								return this$1.leftIcon();
							},
							class: "avm-zy-search-search_icon_box"
						},
						apivm.h("image", {
							class: "avm-zy-search-search_icon",
							src: "../../images/query.png"
						})
					),
					apivm.h(
						"view",
						{class: "avm-zy-search-search_content"},
						apivm.h("input", {
							id: this.data.id,
							class: "avm-zy-search-search_content_input",
							placeholder: this.data.placeholder || "搜索",
							value: this.data.value,
							"confirm-type": "search",
							onfocus: this.onfocus,
							oninput: this.oninput,
							onconfirm: this.onconfirm
						})
					),
					this.data.value && this.data.value.length
						? apivm.h(
								"view",
								{
									onClick: function() {
										return this$1.rightIcon();
									},
									class: "avm-zy-search-search_icon_box"
								},
								apivm.h("image", {
									class: "avm-zy-search-search_icon",
									src: "../../images/clean.png"
								})
						  )
						: null
				)
			);
		};

		return AvmZySearch;
	})(Component);
	AvmZySearch.css = {
		".avm-zy-search-search_box": {
			padding: "0px 0",
			height: "38px",
			boxSizing: "border-box",
			background: "#fff"
		},
		".avm-zy-search-search_warp": {
			background: "#F8F8F8",
			borderRadius: "4px",
			height: "100%",
			position: "relative",
			display: "flex",
			flexDirection: "row"
		},
		".avm-zy-search-search_icon_box": {
			width: "48px",
			height: "38px",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		},
		".avm-zy-search-search_icon": {width: "18px", height: "18px"},
		".avm-zy-search-search_content": {
			flex: "1",
			justifyContent: "center",
			height: "38px"
		},
		".avm-zy-search-search_content_input": {
			color: "#333",
			width: "100%",
			background: "rgba(0,0,0,0)",
			height: "30px",
			flex: "1",
			border: "0px",
			padding: "0",
			fontSize: "15px"
		}
	};
	apivm.define("avm-zy-search", AvmZySearch);

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

	var Query = /*@__PURE__*/ (function(Component) {
		function Query(props) {
			Component.call(this, props);
			this.data = {
				examNo: "",
				allowSearch: true,
				noResult: false,
				queryStr: "",
				betterExams: [],
				serverMessage: "",
				items: []
			};
		}

		if (Component) Query.__proto__ = Component;
		Query.prototype = Object.create(Component && Component.prototype);
		Query.prototype.constructor = Query;
		Query.prototype.apiready = function() {
			//like created
			var options = api.pageParam;
			this.onLoad();
		};
		Query.prototype.setData = function(data) {
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		Query.prototype.onLoad = function() {
			this.setData({
				search: this.search.bind(this)
			});
		};
		Query.prototype.replaceImg = function(s) {
			var ss = s.replace(/(\[\[([/\w\.]+?):([\d\.]+?):([\d\.]+?)\]\])/g, "<img>");
			return ss;
		};
		Query.prototype.search = function(detail) {
			var value = detail.detail.value;
			var that = this;
			if (value.length <= 0) {
				return new Promise(function(resolve, reject) {
					resolve([]);
					that.setData({
						noResult: false,
						queryStr: "",
						betterExams: [],
						serverMessage: "",
						items: items
					});
				});
			}
			var data = {
				query_str: value,
				exam_no: this.data.examNo
			};

			var queryStr = value;
			return new Promise(function(resolve, reject) {
				wx.request2({
					url: "/exam/query2",
					method: "POST",
					data: data,
					success: function(res) {
						wx.hideLoading();
						if (res.statusCode != 200) {
							return false;
						}

						if (res.data.status == false) {
							return;
						}
						var betterExams = [];
						var serverMessage = "";
						var items = res.data.data;
						if ("current" in res.data.data) {
							items = res.data.data["current"];
						}
						if ("message" in res.data.data) {
							serverMessage = res.data.data["message"];
						}
						if ("better_exams" in res.data.data) {
							betterExams = res.data.data["better_exams"];
						}
						for (var i = 0; i < items.length; i++) {
							var item = items[i];
							item["text"] = that.replaceImg(item["question_desc"]);
							if ("select_mode" in item) {
								if (item["select_mode"] < sm_len) {
									item["text"] =
										"【" + select_modes[item["select_mode"]].name + "】" + item["text"];
								}
							}
							item["value"] = item["question_no"];
						}
						resolve(items);
						var noResult = false;
						if (items.length <= 0) {
							noResult = true;
						}
						if ("allow_search" in res.data.data) {
							if (res.data.data["allow_search"] == false) {
								noResult = false;
							}
						}
						that.setData({
							noResult: noResult,
							queryStr: queryStr,
							betterExams: betterExams,
							serverMessage: serverMessage,
							items: items
						});
					},
					fail: function(ref) {
						var errMsg = ref.errMsg;
					}
				});
			});
		};
		Query.prototype.selectResult = function(e) {
			// var item = e.detail.item;
			// var question_no = item['question_no'];
			var question_no = e.dataset.value;
			wx.navigateTo({
				url: "../training/training?select_mode=-1&question_no=" + question_no
			});
		};
		Query.prototype.toChangeExam = function(e) {
			var examIndex = e.currentTarget.dataset.examIndex;
			if (examIndex >= this.data.betterExams.length) {
				return false;
			}
			var examItem = this.data.betterExams[examIndex];
			if (examItem.exam_role <= app.globalData.roleMap.partDesc) {
				var msg =
					"您需要切换到题库【" +
					examItem.exam_name +
					"】再进行搜索，点击确定进入【我的】切换题库";
				wx.showModal({
					title: "需要切换题库",
					content: msg,
					showCancel: true,
					success: function(res) {
						wx.switchTab({
							url: "/pages/me/me"
						});
					}
				});
			} else {
				// 无权限
				var msg = "您暂时无访问题库【" + examItem.exam_name + "】的权限";
				wx.showModal({
					title: "无权访问题库",
					content: msg,
					showCancel: false,
					success: function(res) {}
				});
			}
			console.info(examItem);
		};
		Query.prototype.success = function(res) {
			wx.switchTab({
				url: "/pages/me/me"
			});
		};
		Query.prototype.onReady = function() {};
		Query.prototype.onShow = function() {
			var currentExam = app.getDefaultExam();
			if (currentExam) {
				select_modes = currentExam.select_modes;
				sm_len = select_modes.length;
			}
			var examNo = app.globalData.defaultExamNo;
			if (examNo);
			else {
				wx.showModal({
					title: "未选择题库",
					content: "未选择题库,确定进入【我的】选择题库",
					showCancel: false,
					success: function(res) {
						wx.switchTab({url: "/pages/me/me"});
					}
				});

				return false;
			}
			if (examNo != this.data.examNo) {
				this.setData({
					examNo: examNo
				});

				// let searchbarComponent = this.selectComponent('#searchbar'); // 页面获取自定义组件实例
				// var e = {
				// 	'detail': {
				// 	'value': this.data.queryStr
				// 	}
				// }
				// searchbarComponent.inputChange(e);
			}
		};
		Query.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("safe-area", null),
				apivm.h("hoc-nav-bar-sgm", {title: "搜索题库"}),
				apivm.h("avm-zy-search", {
					id: "zySearch",
					value: this.data.queryStr,
					placeholder: "请输入搜索内容",
					onEvent: this.search
				}),
				apivm.h(
					"scroll-view",
					null,
					(Array.isArray(this.data.items)
						? this.data.items
						: Object.values(this.data.items)
					).map(function(item$1) {
						return apivm.h(
							"view",
							{
								class: "list-item",
								onclick: function(event) {
									if (this$1.selectResult) {
										this$1.selectResult(event);
									} else {
										selectResult(event);
									}
								},
								"data-value": item$1.value
							},
							apivm.h("text", null, item$1.text)
						);
					})
				),
				this.data.noResult && this.data.allowSearch
					? apivm.h(
							"view",
							{class: "tip"},
							apivm.h("text", null, "未搜索到"),
							apivm.h("text", {class: "warn"}, this.data.queryStr),
							"相关内容"
					  )
					: null,
				(Array.isArray(this.data.betterExams)
					? this.data.betterExams
					: Object.values(this.data.betterExams)
				).map(function(item$1, index$1) {
					return apivm.h(
						"view",
						{
							bindtap: "toChangeExam",
							class: "div tip-link",
							"data-exam-index": index$1,
							"v-key": "exam_no"
						},
						apivm.h("text", null, "题库"),
						apivm.h("text", {class: "warn"}, item$1.exam_name),
						apivm.h("text", null, "包含更匹配"),
						apivm.h("text", {class: "warn"}, this$1.data.queryStr),
						apivm.h("text", null, "的内容")
					);
				}),
				this.data.serverMessage
					? apivm.h("view", {class: "server-message"}, this.data.serverMessage)
					: null
			);
		};

		return Query;
	})(Component);
	Query.css = {
		".tip": {marginTop: "25px", textAlign: "center"},
		".tip-link": {
			marginTop: "25px",
			width: "100%",
			justifyContent: "center",
			textAlign: "center",
			textDecoration: "underline"
		},
		".warn": {color: "red"},
		".server-message": {
			color: "red",
			width: "100%",
			alignItems: "center",
			textAlign: "center",
			position: "fixed",
			bottom: "25px"
		},
		".div": {display: "flex", flexDirection: "row", flexWrap: "wrap"},
		".list-item": {
			marginTop: "10px",
			backgroundColor: "#F5F5F5",
			justifyContent: "left",
			padding: "8px 5px"
		}
	};
	apivm.define("query", Query);
	apivm.render(apivm.h("query", null), "body");
})();
