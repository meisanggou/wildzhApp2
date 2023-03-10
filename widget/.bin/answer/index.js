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
	var dt$1 = {
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
		dt: dt$1
	};

	var _app = app;

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
	global.dt = app.dt;
	global.lastExamNo = null;
	global.lastUpdateSource = 0;
	var AnswerIndex = /*@__PURE__*/ (function(Component) {
		function AnswerIndex(props) {
			Component.call(this, props);
			this.data = {
				subjects_array: [], // 选择科目
				subjects_modes: [[], []],
				// 选择科目 和 题型
				strategies_array: [], // 策略列表
				stragety_index: -1,
				errorMsg: "题库信息加载中...",
				cacheSelectedKey: "selectedAnswerOptions"
			};
		}

		if (Component) AnswerIndex.__proto__ = Component;
		AnswerIndex.prototype = Object.create(Component && Component.prototype);
		AnswerIndex.prototype.constructor = AnswerIndex;
		AnswerIndex.prototype.apiready = function() {
			//like created
			api.setStatusBarStyle({style: "dark", color: "#ff5757"});
			var options = api.pageParam;
			this.onLoad(options);
		};
		AnswerIndex.prototype.setData = function(data) {
			// app.print(data);
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		AnswerIndex.prototype.onLoad = function(options) {
			var canUpdate = false;
			var currentUser = app.getOrSetCurrentUserData();
			if (currentUser != null && typeof currentUser == "object") {
				if ("role" in currentUser) {
					if ((currentUser.role & 2) == 2) {
						canUpdate = true;
					}
				}
			}
			this.setData({
				canUpdate: canUpdate
			});

			if ("to" in options) {
				this.setData({
					to: options["to"]
				});
			}
		};
		AnswerIndex.prototype.onShow = function() {
			app.getDefaultExam();
			this.refreshExam(false);
		};
		AnswerIndex.prototype.refreshExam = function(force) {
			var examNo = app.globalData.defaultExamNo;
			if (examNo);
			else {
				wx.showModal({
					title: "未选择题库",
					content: "未选择题库,确定进入【我的】选择题库",
					showCancel: false,
					success: function(res) {
						wx.switchTab({
							url: "/pages/me/me"
						});
					}
				});

				this.setData({
					errorMsg: "请先选择一个题库"
				});

				return false;
			}
			var nowT = dt.get_timestamp2();
			var intervalT = nowT - lastUpdateSource;
			if (intervalT < 300 && lastExamNo == examNo && force == false) {
				return false;
			}
			this.getExam(examNo);
			this.getExamStrategies(examNo);
		};
		AnswerIndex.prototype.success = function(res) {
			wx.switchTab({url: "/pages/me/me"});
		};
		AnswerIndex.prototype.getExam = function(examNo) {
			var that = this;
			wx.request2({
				url: "/exam/info/?exam_no=" + examNo,
				method: "GET",
				success: function(res) {
					var resData = res.data.data;
					var errorMsg = "";
					if (res.data.status == false || resData.length <= 0) {
						errorMsg = "未查询到题库详情，切换题库";
						that.setData({
							errorMsg: errorMsg
						});

						return false;
					}
					var examItem = resData[0];
					if (examItem["exam_role"] > 10) {
						errorMsg = "无权限进行操作，请先升级成会员！";
					}
					var select_modes = [
						{
							name: "全部题型",
							value: -1
						}
					];

					if ("select_modes" in examItem) {
						var _select_modes = examItem["select_modes"];
						for (var i = 0; i < _select_modes.length; i++) {
							var _item = _select_modes[i];
							if (_item.enable == true) {
								_item["value"] = i;
								select_modes.push(_item);
							}
						}
					}
					var subjects_array = [
						{
							value: -1,
							name: "全部科目"
						}
					];

					if ("subjects" in examItem) {
						var _subjects = examItem["subjects"];
						for (var i = 0; i < _subjects.length; i++) {
							var _item = _subjects[i];
							if (_item.enable == true) {
								_item["value"] = i;
								subjects_array.push(_item);
							}
						}
					}
					that.setData({
						errorMsg: errorMsg,
						subjects_array: subjects_array,
						subjects_modes: [subjects_array, select_modes]
					});

					wx.hideLoading();
				},
				fail: function(res) {
					that.setData({
						errorMsg: "未能成功加载题库信息，检查网络或重试！"
					});
				}
			});
		};
		AnswerIndex.prototype.getExamStrategies = function(examNo) {
			var that = this;
			wx.request2({
				url: "/exam/strategy/" + examNo,
				method: "GET",
				success: function(res) {
					lastUpdateSource = dt.get_timestamp2();
					lastExamNo = examNo;
					var resData = res.data.data;
					var strategies = resData["strategies"];
					that.setData({
						strategies_array: strategies
					});

					wx.hideLoading();
				},
				fail: function(res) {}
			});
		};
		AnswerIndex.prototype.randomAnswer = function(e) {
			var indexs = e.detail.value;
			var subject_value = this.data.subjects_modes[0][indexs[0]].value;
			var mode_value = this.data.subjects_modes[1][indexs[1]].value;
			this.startAnswer(mode_value, subject_value, null);
		};
		AnswerIndex.prototype.strategySubjectChange = function(e) {
			var index = e.detail.value;
			var strategy_id = e.currentTarget.attributes["strategy-id"];
			var subject_value = this.data.subjects_array[index].value;
			this.startAnswer(null, subject_value, strategy_id);
		};
		AnswerIndex.prototype.startAnswer = function(
			sm_value,
			sj_value,
			strategy_id
		) {
			// app.getOrSetCacheData(this.data.cacheSelectedKey, this.data);
			var url = "../training/training.stml?from=answer&answer=true";
			if (strategy_id != null) {
				url += "&strategy_id=" + strategy_id;
			} else {
				if (sm_value >= -1) {
					url += "&select_mode=" + sm_value;
				}
			}
			if (sj_value >= 0) {
				url += "&question_subject=" + sj_value;
			}
			wx.navigateTo({
				url: url
			});
		};
		AnswerIndex.prototype.onPullDownRefresh = function() {
			this.refreshExam(true);
			wx.stopPullDownRefresh({
				complete: function(res) {}
			});
		};
		AnswerIndex.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"safe-area",
				null,
				apivm.h("hoc-nav-bar-sgm", {title: "测试"}),
				apivm.h(
					"view",
					{class: "page"},
					this.data.errorMsg
						? apivm.h(
								"view",
								null,
								apivm.h(
									"view",
									null,
									apivm.h("text", {class: "error-tip"}, this.data.errorMsg)
								)
						  )
						: apivm.h(
								"view",
								null,
								apivm.h(
									"view",
									{class: "button-menu"},
									apivm.h(
										"picker",
										{
											mode: "multiSelector",
											onchange: function(event) {
												if (this$1.randomAnswer) {
													this$1.randomAnswer(event);
												} else {
													randomAnswer(event);
												}
											},
											class: "picker",
											range: this.data.subjects_modes,
											"range-key": "name"
										},
										apivm.h("text", {class: "button button-color1"}, "随便测测")
									)
								),
								(Array.isArray(this.data.strategies_array)
									? this.data.strategies_array
									: Object.values(this.data.strategies_array)
								).map(function(strategy_item) {
									return apivm.h(
										"view",
										{class: "button-menu", "v-key": "strategy_id"},
										apivm.h(
											"picker",
											{
												onchange: function(event) {
													if (this$1.strategySubjectChange) {
														this$1.strategySubjectChange(event);
													} else {
														strategySubjectChange(event);
													}
												},
												class: "picker",
												range: this$1.data.subjects_array,
												"range-key": "name",
												"strategy-id": strategy_item.strategy_id,
												"data-id": strategy_item.strategy_id
											},
											apivm.h(
												"text",
												{class: "button button-color1"},
												strategy_item.strategy_name
											)
										)
									);
								})
						  )
				)
			);
		};

		return AnswerIndex;
	})(Component);
	AnswerIndex.css = {
		".page": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "90vh"
		},
		".button": {
			width: "100%",
			height: "50px",
			lineHeight: "50px",
			textAlign: "center",
			color: "#ffffff",
			fontSize: "22px"
		},
		".button-menu": {
			display: "flex",
			width: "300px",
			marginLeft: "auto",
			marginRight: "auto",
			backgroundColor: "rgb(155, 145, 145)",
			marginBottom: "10px"
		},
		".picker": {
			width: "80%",
			height: "50px",
			color: "#fcf5f9",
			fontSize: "22px",
			lineHeight: "50px",
			textAlign: "center",
			marginLeft: "auto",
			marginRight: "auto",
			marginTop: "7px",
			marginBottom: "7px"
		},
		".button-color1": {borderRadius: "7px"},
		".error-tip": {color: "red", textAlign: "center"}
	};
	apivm.define("answer-index", AnswerIndex);
	apivm.render(apivm.h("answer-index", null), "body");
})();
