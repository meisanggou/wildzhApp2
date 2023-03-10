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
	var SE$1 = {
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
		SE: SE$1,
		dt: dt$1
	};

	var _app = app;

	global.dt = app.dt;
	global.TIMER_USE = null;
	global.basicSecond = 0;
	global.startTime = 0;
	var AnswerTopProcess = /*@__PURE__*/ (function(Component) {
		function AnswerTopProcess(props) {
			Component.call(this, props);
			this.data = {
				answerTime: "00:00:00",
				nowQuestionIndex:
					this.props.nowQuestionIndex !== undefined
						? this.props.nowQuestionIndex
						: "--",
				totalQuestionNumber:
					this.props.totalQuestionNumber !== undefined
						? this.props.totalQuestionNumber
						: "--"
			};
			this.compute = {
				totalQuestionNumber: function() {
					if (this.props.totalQuestionNumber == undefined) {
						return "--";
					}
					return this.props.totalQuestionNumber;
				},
				nowQuestionIndex: function() {
					if (this.props.nowQuestionIndex == undefined) {
						return "--";
					}
					return this.props.nowQuestionIndex;
				}
			};
		}

		if (Component) AnswerTopProcess.__proto__ = Component;
		AnswerTopProcess.prototype = Object.create(Component && Component.prototype);
		AnswerTopProcess.prototype.constructor = AnswerTopProcess;
		AnswerTopProcess.prototype.apiready = function() {};
		AnswerTopProcess.prototype.installed = function() {
			console.info("init time installed");
			this.initTimePro();
		};
		AnswerTopProcess.prototype.setData = function(data) {
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		AnswerTopProcess.prototype.initTimePro = function() {
			startTime = dt.get_timestamp();
			this.runTimer();
		};
		AnswerTopProcess.prototype.runTimer = function() {
			var that = this;
			TIMER_USE = setInterval(function() {
				var useTime = (dt.get_timestamp() - startTime) / 1000;
				var s = dt.duration_str(parseInt(useTime + basicSecond));
				that.setData({
					answerTime: s
				});

				var detail = {answerTime: s};
				r = that.fire("reportTime", detail);
			}, 1000);
		};
		AnswerTopProcess.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "top"},
				apivm.h(
					"view",
					{class: "topName"},
					apivm.h("text", {class: "topTime"}, this.data.answerTime)
				),
				apivm.h(
					"view",
					{class: "topProgress"},

					apivm.h(
						"text",
						{class: "topNum"},
						this.nowQuestionIndex + 1,
						" / ",
						this.totalQuestionNumber
					)
				)
			);
		};

		return AnswerTopProcess;
	})(Component);
	AnswerTopProcess.css = {
		".page": {height: "100%"},
		".top": {
			height: "40px",
			width: "100%",
			position: "fixed",
			top: "0px",
			display: "flex",
			flexDirection: "row",
			backgroundColor: "white",
			zIndex: "10000"
		},
		".topName": {
			fontSize: "13px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			width: "55%",
			height: "100%"
		},
		".topProgress": {
			display: "flex",
			alignItems: "center",
			width: "45%",
			height: "100%",
			fontSize: "15px",
			justifyContent: "center"
		},
		".topTime": {fontSize: "15px"},
		".topNum": {fontStyle: "italic"}
	};
	apivm.define("answer-top-process", AnswerTopProcess);

	global.wx = app.wx;
	global.SE = app.SE;
	global.that = null;
	global.questionItems = [];
	global.touchTime = 0;
	global.touchStartX = 0;
	global.touchStartY = 0;
	global.touchInterval = null;
	global.brushList = new Array();
	global.brushDetail = new Array();
	global.STATE_WRONG = "wrong";
	global.STATE_RIGHT = "right";
	global.STATE_SKIP = "skip";
	global.firstEnter = true;
	global.week_delta = 60 * 60 * 24 * 7;
	var Training = /*@__PURE__*/ (function(Component) {
		function Training(props) {
			Component.call(this, props);
			this.data = {
				remote_host: props.remote_host,
				allExams: [],
				skipNums: [1],
				skipIndex: 0,
				optionChar: props.optionChar,
				examNo: null,
				examName: "",
				mode: "traning", // 模式 traning 练习模式  wrong 错题模式 answer 测试模式
				questionNum: 0,
				nowQuestionIndex: 0,
				nowQuestion: null,
				isShowAnswer: false,
				showRemove: false, // mode=wrong 是否显示移除按钮
				isShowSubject: false,
				isReq: false,
				progressStorageKey: "",
				nosStorageKey: "",
				hiddenFeedback: true,
				fbTypes: ["题目错误", "答案错误", "解析错误", "其他"],
				fbTypeIndex: 1,
				feedbackDesc: "",
				showAD: false, // 是否显示推广信息
				richAD: [], // 推广信息
				ignoreTip: "",
				ignoreInterval: 0, // 不再提醒的间隔 小时数
				ignoreAd: false, // 一定时间内不再提醒
				// 原有mp-question 定义变量
				isShowSubject: false,
				optionChar: props.optionChar,
				videoDesc: false, //question_desc_url是否是视频
				options: [], // 题目选项
				multiOpts: false, //是否多选
				rightOpts: [], //正确的选项 下标
				selectedOpts: [], // 选择的选项 下标
				showConfirm: false, // 是否显示 选好了 按钮
				questionAnswer: [], // 答案解析,
				rightOption: "", // 正确答案
				selectedOption: "", // 选择的答案
				erroChoseCls: "errorChose",
				tags: [], // 题目标签
				// 测试模式使用
				question_subject: null, // 测试模式 使用
				score: 0,
				totalScore: 0,
				showSurvey: false, // 显示测试情况
				titles: ["正确题数", "用时", "跳过题数", "题目解析"],
				rightNum: 0,
				answerTime: "00:00:00",
				skipNum: 0,
				allQuestionIndexs: [],
				refreshTime: false
			};
		}

		if (Component) Training.__proto__ = Component;
		Training.prototype = Object.create(Component && Component.prototype);
		Training.prototype.constructor = Training;
		Training.prototype.apiready = function() {
			//like created
			var options = api.pageParam;
			this.onLoad(options);
		};
		Training.prototype.setData = function(data) {
			// app.print(data);
			if (data.options !== undefined) {
				this.data.options = [];
			}
			if (data.mode !== undefined) {
				if (data.mode == "answer") {
					data["erroChoseCls"] = "chose";
				} else {
					data["erroChoseCls"] = "errorChose";
				}
			}
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		Training.prototype.getQuestionNos = function(options) {
			that = this;
			var args_url = "";
			var progressStorageKey = "training";
			if ("select_mode" in options) {
				args_url += "select_mode=" + options["select_mode"] + "&";
				progressStorageKey += "_" + options["select_mode"];
			} else {
				progressStorageKey += "_" + 0;
			}
			if ("question_subject" in options) {
				args_url += "question_subject=" + options["question_subject"] + "&";
				progressStorageKey += "_" + options["question_subject"];
				that.setData({
					isShowSubject: false
				});

				if ("question_chapter" in options) {
					args_url += "question_chapter=" + options["question_chapter"] + "&";
					progressStorageKey += "_" + options["question_chapter"];
				}
			} else {
				progressStorageKey += "_" + 0;
			}
			if ("question_source" in options) {
				args_url += "question_source=" + options["question_source"] + "&";
				progressStorageKey += "_" + options["question_source"];
			}
			var nosStorageKey = progressStorageKey + "_nos";
			this.setData({
				progressStorageKey: progressStorageKey,
				nosStorageKey: nosStorageKey
			});

			var cacheNos = app.getOrSetExamCacheData(nosStorageKey);
			// var cache_questions = that.extractQuestionNos(cacheNos);

			if (cacheNos == null || cacheNos == "" || true) {
				wx.showLoading({
					title: "试题加载中"
				});
			}
			args_url += "exam_no=" + that.data.examNo;
			args_url += "&compress=true";
			wx.request2({
				url: "/exam/questions/no/?" + args_url,
				method: "GET",
				success: function(res) {
					if (res.data.status != true) {
						wx.hideLoading();
						wx.showModal({
							title: "无法访问题库",
							content: "题库已删除，或无权访问。确定进入【我的】更换题库",
							showCancel: false,
							success: function(res) {
								wx.switchTab({
									url: "/pages/me/me"
								});
							}
						});

						return;
					}
					var _questions = that.extractQuestionNos(res.data.data["nos"]);
					// for(var q_index=0;q_index<_questions.length;q_index++){
					//     cache_questions.push(_questions[q_index]);
					// }
					// app.getOrSetExamCacheData(nosStorageKey, cache_questions);
					questionItems = _questions;
					that.setData({
						questionNum: _questions.length
					});

					if (_questions.length <= 0) {
						wx.hideLoading();
						wx.showModal({
							title: "无题目",
							content: "无相关题目，确定返回",
							showCancel: false,
							success: function(res) {
								wx.switchTab({
									url: "/pages/me/me"
								});
							}
						});
					} else {
						// 请求questionItems
						var progressIndex = app.getOrSetExamCacheData(
							that.data.progressStorageKey
						);
						if (
							progressIndex == null ||
							typeof progressIndex != "number" ||
							progressIndex <= 0
						) {
							progressIndex = 0;
						}
						that.reqQuestion(progressIndex, true);
					}
				}
			});
		};
		Training.prototype.success = function(res) {
			if (res.confirm) {
				var timestamp = new Date().valueOf();
				var test_id =
					app.globalData.testIdPrefix + that.data.examNo + "_" + timestamp;
				wx.setStorageSync(test_id, questionItems);
				var allTestIds = wx.getStorageSync(app.globalData.allTestIdKey);
				if (allTestIds) {
					allTestIds = allTestIds + "," + test_id;
				} else {
					allTestIds = test_id;
				}
				wx.setStorage({
					key: app.globalData.allTestIdKey,
					data: allTestIds
				});

				that.setResult();
			}
		};
		Training.prototype.onLoad = function(options) {
			brushList = [];
			brushDetail = [];
			questionItems = [];
			app.getDefaultExam();
			this.setData({
				examNo: app.globalData.defaultExamNo,
				examName: app.globalData.defaultExamName
			});
			that = this;
			SE.startSecurityMonitor();
			if (that.data.examNo != null) {
				var questionNo = null;
				if ("question_no" in options) {
					questionNo = parseInt(options["question_no"]);
					if (isNaN(questionNo)) {
						questionNo = null;
					} else {
						questionItems = [{question_no: questionNo}];
						that.setData({questionNum: 1});
						this.reqQuestion(0, true);
						return true;
					}
				} else if ("wrong_question" in options) {
					this.enterWrongMode();
					return true;
				} else if ("answer" in options) {
					this.enterAnswerMode(options);
					return true;
				}
				that.getQuestionNos(options);
			} else {
				wx.showModal({
					title: "未选择题库",
					content: "未选择题库,确定进入【我的】选择题库",
					showCancel: false,
					success: function(res) {
						wx.switchTab({url: "/pages/me/me"});
					}
				});
			}
		};
		Training.prototype.onShow = function() {};
		Training.prototype.extractQuestionNos = function(nos_l) {
			if (typeof nos_l == "string" || nos_l == null) {
				return [];
			}
			var items = [];
			var ll = nos_l.length;
			for (var i = 0; i < ll; i++) {
				var ll_item = nos_l[i];
				for (var j = 0; j < ll_item[1]; j++) {
					var q_item = {question_no: ll_item[0] + j};
					items.push(q_item);
				}
			}
			return items;
		};
		Training.prototype.reqQuestion = function(startIndex, updateShow, stepNum) {
			if (updateShow === void 0) updateShow = false;
			if (stepNum === void 0) stepNum = 13;
			that = this;
			var exam_no = that.data.examNo;
			if (that.data.examNo == null) {
				console.info("Can not req, examNo is null");
				return false;
			}
			var isReq = that.data.isReq;
			if (isReq == true) {
				return false;
			} else {
				that.setData({isReq: true});
			}
			var nos = "";
			var _start = -1;
			var _end = -1; // startIndex 可能超出最大题目长度
			if (startIndex >= questionItems.length) {
				startIndex = questionItems.length - 1;
			}
			if (stepNum < 0) {
				_start = startIndex + stepNum;
				_end = startIndex + 1;
			} else {
				_start = startIndex;
				_end = startIndex + stepNum;
			}
			if (_end > questionItems.length) {
				_end = questionItems.length;
			}
			if (_start < 0) {
				_start = 0;
			}
			for (var i = _start; i < _end; i++) {
				if ("options" in questionItems[i] && questionItems[i].forceUpdate != true) {
					continue;
				}
				nos += "," + questionItems[i].question_no;
			}
			wx.request2({
				url: "/exam/questions/?fmt_version=2&exam_no=" + exam_no + "&nos=" + nos,
				method: "GET",
				success: function(res) {
					wx.hideLoading();
					if (res.data.status != true) {
						// TODO show
						return;
					}
					if ("se" in res.data) {
						var r = SE.showSecurityMesg(res.data.se.action, res.data.se.message);
						if (r) {
							return false;
						}
					}
					var canUpdate = false;
					if ("exam" in res.data) {
						var exam_item = res.data.exam;
						if (exam_item.exam_role <= 3) {
							canUpdate = true;
						}
					}
					var newItems = res.data.data;
					for (var i = _end - 1; i >= _start; i--) {
						for (var j = 0; j < newItems.length; j++) {
							if (questionItems[i].question_no == newItems[j].question_no) {
								questionItems[i]["question_desc"] = newItems[j]["question_desc"];
								questionItems[i]["question_desc_rich"] =
									newItems[j]["question_desc_rich"];
								questionItems[i]["question_desc_url"] =
									newItems[j]["question_desc_url"];
								questionItems[i]["options"] = newItems[j]["options"];
								questionItems[i]["answer_rich"] = newItems[j]["answer_rich"];
								questionItems[i]["question_source"] = newItems[j]["question_source"];
								questionItems[i].multi = newItems[j].multi;
								questionItems[i].forceUpdate = false;
								questionItems[i].canUpdate = canUpdate;
								break;
							}
						}
					} // 判断 是否questionItems有题
					if (questionItems.length <= 0);
					if (updateShow) {
						that.setData({questionNum: questionItems.length});
						that.changeNowQuestion(startIndex);
					} else if (startIndex == that.data.nowQuestionIndex) {
						// 如果当前请求的内容正好是当前显示的，需要重新更新一下答案显示。答案显示是拼出来的没和变量关联
						if (that.data.isShowAnswer) {
							that.showAnswer();
						}
					}
					that.setData({isReq: false});
				},
				fail: function(ref) {
					var errMsg = ref.errMsg;
					wx.hideLoading();
					console.log("request fail", errMsg);
					that.setData({isReq: false});
				}
			});
		};
		Training.prototype.after = function(afterNum) {
			var nowQuestion = that.data.nowQuestion;
			var nowQuestionIndex = that.data.nowQuestionIndex;
			var questionLen = questionItems.length;
			var nextIndex = nowQuestionIndex + afterNum;
			if (nowQuestionIndex >= questionItems.length - 1) {
				if (this.data.mode == "answer") {
					this.submit();
					return;
				} // 判断是否当前是否是最后一题
				wx.showModal({
					title: "已是最后一题",
					content: "是否从头开始练习？",
					showCancel: true,
					icon: "none",
					success: function(res) {
						if (res.confirm) {
							that.reqQuestion(0, true);
						}
					}
				});
				return true;
			}
			if (nextIndex >= questionItems.length) {
				nextIndex = questionItems.length - 1;
			}
			if ("options" in questionItems[nextIndex]) {
				//已经获取内容
				that.changeNowQuestion(nextIndex); // 判断紧接着10条是否都已预获取数据
				for (var i = 1; i < 11 && nextIndex + i < questionLen; i++) {
					if (!("options" in questionItems[nextIndex + i])) {
						that.reqQuestion(nextIndex + i);
						break;
					}
				}
			} else {
				// 没有获取内容
				wx.showLoading({title: "加载中...", mask: true});
				that.reqQuestion(nextIndex, true);
			}
		};
		Training.prototype.after1 = function() {
			that.after(1);
		};
		Training.prototype.after10 = function() {
			that.after(10);
		};
		Training.prototype.before = function(preNum) {
			var nowQuestion = that.data.nowQuestion;
			var nowQuestionIndex = that.data.nowQuestionIndex;
			var preIndex = nowQuestionIndex - preNum;
			if (nowQuestionIndex <= 0) {
				// 判断是否当前是否是第一题
				wx.showToast({title: "已是第一题", icon: "none", duration: 1000});
				return true;
			}
			if (preIndex <= 0) {
				preIndex = 0;
			}
			if ("options" in questionItems[preIndex]) {
				//已经获取内容
				that.changeNowQuestion(preIndex);
			} else {
				// 没有获取内容
				wx.showLoading({title: "加载中...", mask: true});
				that.reqQuestion(preIndex, true, -13);
			}
		};
		Training.prototype.before1 = function() {
			that.before(1);
		};
		Training.prototype.before10 = function() {
			that.before(10);
		};
		Training.prototype.setSkipNums = function(num, end_num) {
			var max_times = 5;
			var skipIndex = 0;
			var _num = num;
			var interval = 10;
			var r = [];
			var times = 0;
			var p_num = 0;
			while (num > 1) {
				p_num = num - interval;
				if (p_num > 1) {
					r.push(p_num);
				} else {
					r.push(1);
					break;
				}
				times += 1;
				if (times >= max_times) {
					interval *= 10;
					times = 0;
				}
				num = p_num;
			}
			r.sort(function(a, b) {
				return a - b;
			});
			r.push(_num);
			skipIndex = r.length - 1;
			num = _num;
			interval = 10;
			times = 0;
			while (num < end_num) {
				p_num = num + interval;
				if (p_num >= end_num) {
					r.push(end_num);
					break;
				} else {
					r.push(p_num);
				}
				times += 1;
				if (times >= max_times) {
					interval *= 10;
					times = 0;
				}
				num = p_num;
			}
			this.setData({skipNums: r, skipIndex: skipIndex});
			return r;
		};
		Training.prototype.skipAction = function(e) {
			var index = e.detail.value;
			this.changeNowQuestion(this.data.skipNums[index] - 1);
		};
		Training.prototype.changeNowQuestion = function(index) {
			var nowQuestion = questionItems[index];
			if ("options" in nowQuestion);
			else {
				// 没有获取内容
				wx.showLoading({title: "加载中...", mask: true});
				that.reqQuestion(index, true);
				return;
			}
			nowQuestion.index = index;
			var isShowAnswer = false;
			if (this.data.mode == "answer-show") {
				isShowAnswer = true;
			}
			this.setData({
				nowQuestion: nowQuestion,
				nowQuestionIndex: index,
				isShowAnswer: isShowAnswer,
				showRemove: false,
				feedbackDesc: ""
			});
			this.calcNowQuestion(nowQuestion);
			this.setSkipNums(index + 1, questionItems.length);
			this.saveTrainingProcess();
		};
		Training.prototype.showAnswer = function(e) {
			var nowQuestion = this.data.nowQuestion;
			if (nowQuestion == null) {
				return false;
			}
			this.addBrushNum(nowQuestion.question_no, STATE_SKIP);
			this.setData({isShowAnswer: true});
			this.showAnswerAction();
		};
		Training.prototype.toUpdate = function(e) {
			var nowQuestion = that.data.nowQuestion;
			if (nowQuestion == null) {
				return false;
			}
			var question_no = nowQuestion.question_no;
			wx.navigateTo({
				url: "../questions/question?select_mode=-1&question_no=" + question_no
			});
		};
		Training.prototype.choseOption = function(e) {
			var choseRight = e.detail.choseRight;
			var selectedOpts = e.detail.selectedOpts;
			var nowQuestion = that.data.nowQuestion;
			var showRemove = false;
			if (this.data.mode == "wrong") {
				if (choseRight) {
					this.addBrushNum(nowQuestion.question_no, STATE_RIGHT);
					showRemove = true;
				} else {
					this.addBrushNum(nowQuestion.question_no, STATE_WRONG);
				}
				this.setData({showRemove: showRemove}); // 显示答案
				this.showAnswer();
				return;
			}
			if (this.data.mode == "answer") {
				var nowQuestionIndex = this.data.nowQuestionIndex;
				var nextQuestionNumber = nowQuestionIndex + 1;
				questionItems[nowQuestionIndex]["right"] = choseRight;
				questionItems[nowQuestionIndex]["selectedOpts"] = selectedOpts;
				if (nextQuestionNumber == questionItems.length) {
					this.submit();
				} else {
					var interval = setInterval(function() {
						clearInterval(interval);
						that.after1();
					}, 1000);
				}
				return;
			}
			if (choseRight) {
				this.addBrushNum(nowQuestion.question_no, STATE_RIGHT); // 自动进入下一题
				if (this.data.isShowAnswer == false) {
					// 当前显示答案 不进入下一题
					var interval = setInterval(function() {
						clearInterval(interval);
						that.after1();
					}, 1000);
				} else {
					this.showAnswer();
				}
			} else {
				// 记录错题
				this.addBrushNum(nowQuestion.question_no, STATE_WRONG); // 显示答案
				this.showAnswer();
			}
		};
		Training.prototype.previewImage = function(event) {
			var src = event.currentTarget.dataset.src; //获取data-src
			src += "?r=" + Math.random();
			//图片预览
			wx.previewImage({
				current: src, // 当前显示图片的http链接
				urls: [src], // 需要预览的图片http链接列表
				fail: function(e) {
					console.info("preview fail");
				},
				complete: function(e) {
					console.info("preview complete");
				}
			});
		};
		Training.prototype.addBrushNum = function(q_no, state) {
			if (brushList.indexOf(q_no) >= 0) {
				return false;
			}
			brushList.push(q_no);
			brushDetail.push({no: q_no, state: state});
			this.saveBrushNum();
		};
		Training.prototype.saveBrushNum = function() {
			if (brushDetail.length <= 0) {
				return false;
			}
			var _num = brushDetail.length;
			var questions = new Array();
			while (brushDetail.length > 0) {
				questions.push(brushDetail.pop());
			}
			var examNo = this.data.examNo;
			brushDetail = new Array();
			var data = {exam_no: examNo, num: _num, questions: questions};
			wx.request2({
				url: "/exam/usage?exam_no=" + examNo,
				method: "POST",
				data: data,
				success: function(res) {},
				fail: function() {
					brushDetail = brushDetail.concat(questions);
				}
			});
		};
		Training.prototype.getFeedback = function() {
			var question_no = this.data.nowQuestion.question_no;
			var url = "/exam/question/feedback?exam_no=" + this.data.examNo;
			url += "&question_no=" + question_no;
			url += "&max_state=0&user=";
			var that = this;
			wx.request2({
				url: url,
				method: "GET",
				success: function(res) {
					if (res.data.status != true);
					else {
						var items = res.data.data;
						if (items.length > 0) {
							var fbTypeIndex = that.data.fbTypes.indexOf(items[0].fb_type);
							if (fbTypeIndex < 0) {
								fbTypeIndex = 0;
							}
							that.setData({
								fbTypeIndex: fbTypeIndex,
								feedbackDesc: items[0].description
							});
						}
					}
				}
			});
		};
		Training.prototype.feedbackClick = function() {
			this.setData({hiddenFeedback: false});
			$("#fb_dialog").showModal();
			this.getFeedback();
		};
		Training.prototype.feedbackTypeChange = function(e) {
			this.setData({fbTypeIndex: e.detail.value});
		};
		Training.prototype.feedbackDescInput = function(e) {
			this.setData({feedbackDesc: e.detail.value});
		};
		Training.prototype.cancelFeedback = function() {
			this.setData({hiddenFeedback: true});
		};
		Training.prototype.confirmFeedback = function(e) {
			this.setData({hiddenFeedback: true});
			var fb_type = this.data.fbTypes[this.data.fbTypeIndex];
			var questionNo = this.data.nowQuestion.question_no;
			var data = {
				description: this.data.feedbackDesc,
				fb_type: fb_type,
				question_no: questionNo
			};
			wx.request2({
				url: "/exam/question/feedback?exam_no=" + this.data.examNo,
				method: "POST",
				data: data,
				success: function(res) {
					if (res.data.status != true) {
						wx.showModal({
							title: "反馈失败",
							content: "反馈失败，请稍后重试！",
							showCancel: false,
							success: function(res) {}
						});
						return;
					} else {
						wx.showToast({title: "反馈成功"});
					}
				}
			});
		};
		Training.prototype.saveTrainingProcess = function() {
			if (that.data.examNo == null || that.data.nowQuestion == null) {
				return false;
			}
			if (this.data.progressStorageKey == "" || this.data.nowQuestionIndex <= 0) {
				return false;
			}
			app.getOrSetExamCacheData(
				this.data.progressStorageKey,
				this.data.nowQuestionIndex
			);
		};
		Training.prototype.getExamAD = function() {
			if (this.data.examNo == null) {
				return false;
			}
			var now_time = dt.get_timestamp2();
			var cache_key = "ignore_ad_time";
			var ignore_time = app.getOrSetExamCacheData(cache_key);
			if (ignore_time > now_time) {
				return false;
			}
			var that = this;
			wx.request2({
				url: "/exam/ad?exam_no=" + this.data.examNo,
				success: function(ret) {
					var r_data = ret.data;
					if (!r_data.status) {
						return false;
					}
					if (r_data.data.enabled == false) {
						return false;
					}
					var ignoreTip = "";
					if (r_data.data.ignore_interval > 0) {
						var days = Math.floor(r_data.data.ignore_interval / 24);
						if (days > 0) {
							ignoreTip = days + "天内不再提醒";
						} else {
							ignoreTip = r_data.data.ignore_interval + "小时内不再提醒";
						}
					}
					that.setData({
						showAD: true,
						richAD: r_data.data.ad_desc_rich,
						ignoreTip: ignoreTip,
						ignoreInterval: r_data.data.ignore_interval
					});
				}
			});
		};
		Training.prototype.ignoreAction = function(e) {
			var ignoreAd = false;
			for (var i = 0, l = e.detail.value.length; i < l; ++i) {
				if (e.detail.value[i] == "ignore") {
					ignoreAd = true;
					break;
				}
			}
			this.setData({ignoreAd: ignoreAd});
		};
		Training.prototype.knowAd = function() {
			if (this.data.ignoreAd) {
				var now_time = dt.get_timestamp2();
				var cache_key = "ignore_ad_time";
				var ignore_time = now_time + this.data.ignoreInterval * 3600;
				app.getOrSetExamCacheData(cache_key, ignore_time);
			}
			this.setData({showAD: false});
		};
		Training.prototype.enterWrongMode = function() {
			this.setData({mode: "wrong"});
			this.reqWrongAnswer();
		};
		Training.prototype.reqWrongAnswer = function() {
			that = this;
			var examNo = this.data.examNo;
			if (examNo == null) {
				return false;
			}
			var questionLen = questionItems.length;
			var minWrongTime = 0;
			if (questionLen <= 0) {
				wx.showLoading({title: "加载错题中..."});
			} else {
				minWrongTime = questionItems[questionLen - 1].wrong_time;
			}
			wx.request2({
				url: "/exam/wrong/?exam_no=" + examNo + "&min_wrong_time=" + minWrongTime,
				methods: "GET",
				success: function(res) {
					if (res.data.status != true) {
						wx.hideLoading();
						wx.showModal({
							title: "无法访问题库",
							content: "题库已删除，或无权访问。确定进入【我的】更换题库",
							showCancel: false,
							success: function(res) {
								wx.switchTab({url: "/pages/me/me"});
							}
						});
						return false;
					}
					var addQuestionItems = res.data.data; // 如果有新的错题，显示第一个，没有保持原来的显示
					var showIndex = that.data.nowQuestionIndex;
					var latestQuestionItems = questionItems;
					if (addQuestionItems.length > 0) {
						// 按照错误时间排序 最新错题排到前面
						addQuestionItems.sort(function(a, b) {
							return a.wrong_time - b.wrong_time;
						});
						latestQuestionItems = addQuestionItems.concat(questionItems);
						showIndex = 0;
					} // 判定最新的试题是否在
					questionItems = latestQuestionItems;
					wx.hideLoading();
					if (questionItems.length <= 0 && firstEnter) {
						wx.showModal({
							title: "无错题",
							content: "没有发现错题",
							showCancel: false,
							success: function(res) {
								// wx.navigateBack({
								//     delta: 1
								// })
							}
						});
						firstEnter = false;
						return false;
					}
					if (addQuestionItems.length > 0) {
						// 请求questionItems
						that.reqQuestion(0, true);
					}
				},
				fail: function(ref) {
					var errMsg = ref.errMsg;
					wx.hideLoading();
					wx.showModal({
						title: "页面请求失败",
						content: "无法连接远程主机获取错题信息，确定返回首页",
						showCancel: false,
						success: function(res) {
							wx.navigateBack({delta: 1});
						}
					});
				}
			});
		};
		Training.prototype.remove = function() {
			var nowQuestion = that.data.nowQuestion;
			var nowQuestionIndex = that.data.nowQuestionIndex;
			var questionLen = questionItems.length;
			wx.request2({
				url: "/exam/wrong/?exam_no=" + that.data.examNo,
				method: "DELETE",
				data: {question_no: nowQuestion.question_no},
				success: function(res) {}
			});
			questionItems.splice(nowQuestionIndex, 1);
			questionLen = questionItems.length;
			that.setData({questionNum: questionLen});
			if (questionLen <= 0) {
				questionItems = [];
				wx.showModal({
					title: "无错题",
					content: "已经没有错题",
					showCancel: false,
					success: function(res) {
						wx.navigateBack({delta: 1});
					}
				});
				return true;
			}
			if (nowQuestionIndex >= questionLen) {
				nowQuestionIndex = questionLen - 1;
			}
			this.changeNowQuestion(nowQuestionIndex);
		};
		Training.prototype.enterAnswerMode = function(options) {
			var question_subject = null;
			if ("question_subject" in options) {
				question_subject = options["question_subject"];
			}
			this.setData({mode: "answer", question_subject: question_subject});
			if ("strategy_id" in options) {
				this.getStrategy(this.data.examNo, options["strategy_id"]);
			} else {
				var strategy_items = [{num: 20, value: -1}];
				if ("select_mode" in options) {
					strategy_items[0]["value"] = options["select_mode"];
				}
				this.getQuestionbyStrategy(strategy_items);
			}
		};
		Training.prototype.getStrategy = function(examNo, strategy_id) {
			var that = this;
			wx.request2({
				url: "/exam/strategy/" + examNo,
				method: "GET",
				success: function(res) {
					wx.hideLoading();
					var resData = res.data.data;
					var strategies = resData["strategies"];
					for (var i = 0; i < strategies.length; i++) {
						if (strategies[i].strategy_id == strategy_id) {
							var strategy_items = strategies[i]["strategy_items"];
							var questionNum = 0;
							for (var j = 0; j < strategy_items.length; j++) {
								questionNum += strategy_items[j]["num"];
							}
							that.setData({questionNum: questionNum});
							that.getQuestionbyStrategy(strategy_items);
							wx.showLoading({title: "组卷中..."});
							return;
						}
					}
					wx.showModal({
						title: "组卷策略不存在",
						content: "请返回重试！",
						showCancel: false,
						success: function(res) {
							wx.navigateBack({delta: 1});
						}
					});
					return;
				},
				fail: function(res) {
					wx.showModal({
						title: "访问失败",
						content: "请稍后重试！",
						showCancel: false,
						success: function(res) {
							wx.navigateBack({delta: 1});
						}
					});
					return;
				}
			});
		};
		Training.prototype.getQuestionbyStrategy = function(strategy_items) {
			var that = this;
			for (var i = 0; i < strategy_items.length; i++) {
				var item = strategy_items[i];
				if ("loaded" in item) {
					continue;
				} else {
					var exclude_nos = "";
					var existItems = questionItems;
					for (var k = 0; k < existItems.length; k++) {
						var _item = existItems[k];
						if (_item["select_mode"] == item["value"]) {
							exclude_nos += "," + _item["question_no"];
						}
					}
					var url =
						"/exam/questions/?fmt_version=2&exam_no=" +
						that.data.examNo +
						"&num=" +
						item["num"];
					console.info(url);
					if (exclude_nos != "") {
						url += "&exclude_nos=" + exclude_nos;
					}
					url += "&select_mode=" + item["value"];
					if (this.data.question_subject != null) {
						url += "&question_subject=" + this.data.question_subject;
					}
					wx.request2({
						url: url,
						method: "GET",
						success: function(res) {
							if (res.data.status == false) {
								wx.hideLoading();
								wx.showModal({
									title: "无法访问题库",
									content: "题库已删除，或无权访问。确定进入【我的】更换题库",
									showCancel: false,
									success: function(res) {
										wx.switchTab({url: "/pages/me/me"});
									}
								});
								return;
							} // var questionItems = res.data.data;
							var oldItems = questionItems;
							questionItems = oldItems.concat(res.data.data);
							var data = {};
							if (that.data.nowQuestion == null && questionItems.length > 0) {
								that.changeNowQuestion(0); // data['nowQuestion'] = questionItems[0];
								// data['nowQuestion']['displayed'] = true;
								wx.hideLoading();
							}
							that.setData(data);
							item["loaded"] = true;
							that.getQuestionbyStrategy(strategy_items);
						},
						fail: function(res) {
							setTimeout(function() {
								that.getQuestionbyStrategy(strategy_items);
							}, 10000);
						}
					});
					return;
				}
			} // var questionItems = this.data.questionItems;
			if (questionItems.length <= 0) {
				wx.hideLoading();
				wx.showModal({
					title: "无试题",
					content: "暂无相关试题，请重新选择试题类型或者更换试题库",
					showCancel: false,
					success: function(res) {
						wx.navigateBack({delta: 1});
					}
				});
				return;
			}
			if (questionItems.length != this.data.questionNum) {
				this.setData({questionNum: questionItems.length});
			}
		};
		Training.prototype.submit = function() {
			if (this.data.mode != "answer") {
				wx.showToast({title: "已是最后一题"});
				return false;
			}
			var msg = "确定要交卷吗？";
			if (questionItems.length != this.data.questionNum) {
				msg = "题目信息都没加载完，确定要交卷吗？";
			}
			wx.showModal({
				title: "交卷",
				content: msg,
				success: function(res) {
					if (res.confirm) {
						var timestamp = new Date().valueOf();
						var test_id =
							app.globalData.testIdPrefix + that.data.examNo + "_" + timestamp;
						wx.setStorageSync(test_id, questionItems);
						var allTestIds = wx.getStorageSync(app.globalData.allTestIdKey);
						if (allTestIds) {
							allTestIds = allTestIds + "," + test_id;
						} else {
							allTestIds = test_id;
						}
						wx.setStorage({key: app.globalData.allTestIdKey, data: allTestIds});
						that.setResult();
					}
				}
			});
		};
		Training.prototype.setResult = function() {
			// clearInterval(TIMER_USE);
			// var questionItems = this.data.questionItems;
			var questionNum = questionItems.length;
			var score = 0;
			var skipNum = 0;
			var showNums = []; // var wrong_question = [];
			var questions = [];
			for (var i = 0; i < questionNum; ) {
				var lineNums = [];
				for (var j = 0; j < 5 && i < questionNum; i++, j++) {
					lineNums.push(i);
					if (!("displayed" in questionItems[i])) {
						skipNum += 1;
						continue;
					}
					if (!("right" in questionItems[i])) {
						questions.push({no: questionItems[i].question_no, state: STATE_SKIP});
						skipNum += 1;
						continue;
					}
					if (questionItems[i]["right"] == true) {
						score = score + 1;
						questions.push({no: questionItems[i].question_no, state: STATE_RIGHT});
					} else if (questionItems[i]["right"] == false) {
						questions.push({no: questionItems[i].question_no, state: STATE_WRONG}); // wrong_question.push(res.data[i]["question_no"]);
					}
				}
				showNums.push(lineNums);
			}
			that.setData({
				allQuestionIndexs: showNums,
				score: score,
				totalScore: questionNum,
				mode: "answer-show",
				isShowAnswer: true,
				showSurvey: true,
				rightNum: score,
				skipNum: skipNum,
				refreshTime: true
			});
			for (var i = 0; i < questions.length; i++) {
				this.addBrushNum(questions[i].no, questions[i].state);
			}
			that.saveBrushNum();
		};
		Training.prototype.reportTime = function(e) {
			var detail = e.detail;
			if (this.data.mode == "answer") {
				this.setData(detail);
				return true;
			}
			return false;
		};
		Training.prototype.showDeatil = function(e) {
			var index = e.currentTarget.dataset.index;
			this.setData({showSurvey: false});
			this.changeNowQuestion(index);
		};
		Training.prototype.returnSurvey = function(e) {
			this.setData({showSurvey: true});
		};
		Training.prototype.onUnload = function() {
			this.saveBrushNum();
			this.saveTrainingProcess();
		};
		Training.prototype.touchStart = function(e) {
			// touchStartX = e.touches[0].pageX; // 获取触摸时的原点
			// touchStartY = e.touches[0].pageY;
			touchStartX = e.detail.x;
			touchStartY = e.detail.y; // 使用js计时器记录时间
			touchInterval = setInterval(function() {
				touchTime++;
			}, 100);
		};
		Training.prototype.touchEnd = function(e) {
			if (this.data.questionNum <= 1) {
				return false;
			} // var touchEndX = e.changedTouches[0].pageX;
			// var touchEndY = e.changedTouches[0].pageY;
			var touchEndX = e.detail.x;
			var touchEndY = e.detail.y;
			var touchMoveX = touchEndX - touchStartX;
			var touchMoveY = touchEndY - touchStartY;
			var absMoveX = Math.abs(touchMoveX);
			var absMoveY = Math.abs(touchMoveY);
			var wChange = true;
			if (absMoveY > 0.3 * absMoveX || absMoveY > 30) {
				wChange = false;
			}
			if (wChange) {
				// 向左滑动
				if (touchMoveX <= -93 && touchTime < 10) {
					//执行切换页面的方法
					that.after1();
				} // 向右滑动
				else if (touchMoveX >= 93 && touchTime < 10) {
					that.before1();
				}
			}
			clearInterval(touchInterval); // 清除setInterval
			touchTime = 0;
		};
		Training.prototype.calcNowQuestion = function(nowQuestion) {
			if (nowQuestion == undefined) {
				return false;
			}
			var question = nowQuestion;
			var options = question.options;
			var rightOpts = [];
			var multi = false;
			var rightOption = "";
			var selectedOpts = [];
			for (var index = 0; index < options.length; index++) {
				options[index].class = "noChose";
				options[index].optionChar = app.globalData.optionChar[index];
				if (parseInt(options[index]["score"]) > 0) {
					rightOpts.push(index);
					rightOption += app.globalData.optionChar[index];
				}
			}
			if (rightOption.length <= 0) {
				rightOption = "无答案";
			}
			if (rightOpts.length > 1) {
				multi = true;
			}
			if ("selectedOpts" in question) {
				selectedOpts = question.selectedOpts;
				for (var i = 0, l = selectedOpts.length; i < l; i++) {
					var choseIndex = selectedOpts[i];
					if (parseInt(options[choseIndex]["score"]) > 0) {
						options[choseIndex]["class"] = "chose";
					} else {
						options[choseIndex]["class"] = this.data.erroChoseCls;
					}
				}
			}
			if (this.data.mode == "answer-show") {
				for (var j = 0, l = rightOpts.length; j < l; j++) {
					options[rightOpts[j]]["class"] = "chose";
				}
			}
			var videoDesc = false;
			if (question.question_desc_url) {
				var _ss = question.question_desc_url.split(".");
				var extension = _ss[_ss.length - 1];
				if (VIDEO_EXTENSIONS.indexOf(extension) >= 0) {
					videoDesc = true;
				}
			}
			var data = {
				remote_host: app.globalData.remote_host,
				tags: [],
				videoDesc: videoDesc, // options: options,
				selectedOpts: selectedOpts,
				rightOption: rightOption,
				multiOpts: multi,
				rightOpts: rightOpts,
				showConfirm: false
			};
			data["options"] = options;
			this.setData(data);
			if (this.data.isShowAnswer) {
				this.showAnswerAction();
			}
			question.displayed = true;
			return true;
		};
		Training.prototype.calcTags = function(item) {
			if (item == null) {
				return ["首次遇到"];
			}
			var q_detail = item;
			var tags = [];
			var miss_num = q_detail["miss_num"];
			var num = q_detail["num"];
			var skip_num = q_detail["skip_num"];
			var right_num = num - skip_num - miss_num;
			var state_num = q_detail["state_num"];
			var last_miss = q_detail["last_miss"];
			var last_meet = q_detail["last_meet"];
			var last_meet_time = q_detail["last_meet_time"];
			if (miss_num == 0 && skip_num == 0) {
				tags.push("全部做对");
			} else if (miss_num == 0 && right_num > 0) {
				tags.push("从未错误");
			}
			if (skip_num == num && skip_num >= 3) {
				tags.push("多次跳过");
			} else if (right_num == 0) {
				tags.push("还未对过");
			} else if (state_num >= 3) {
				if (last_miss) {
					tags.push("连续错误");
				} else {
					tags.push("最近全对");
				}
			}
			if (right_num >= 1 && miss_num >= 2 * right_num) {
				tags.push("易错题");
			}
			if (last_meet_time - app.get_timestamp2() < week_delta) {
				if (last_meet == STATE_RIGHT) {
					tags.push("最近做对");
				} else if (last_meet == STATE_WRONG) {
					tags.push("最近做错");
				}
			}
			return tags;
		};
		Training.prototype.getQuestionTag = function() {
			var tags = [];
			if (this.data.examNo == null || this.data.nowQuestion == null) {
				this.setData({tags: tags});
				return false;
			}
			if (this.data.isShowAnswer == true) {
				// 查看答案情况 保持原有
				return true;
			}
			var nowQuestion = this.data.nowQuestion;
			var examNo = this.data.examNo;
			var that = this;
			wx.request2({
				url:
					"/exam/training/tags?exam_no=" +
					examNo +
					"&question_no=" +
					nowQuestion.question_no,
				method: "GET",
				success: function(res) {
					var res_data = res.data;
					if (res_data.status != true) {
						tags = [];
					} else if (res_data.data.item == undefined) {
						tags = [];
					} else {
						if (res_data.data.tags !== undefined) {
							tags = res_data.data.tags;
						} else {
							tags = that.calcTags(res_data.data.item);
						}
					}
					that.setData({tags: tags});
				},
				fail: function() {
					that.setData({tags: []});
				}
			});
		};
		Training.prototype.choseItem = function(e) {
			if (this.data.mode == "answer-show") {
				return false;
			}
			var options = this.data.nowQuestion.options;
			var choseIndex = parseInt(e.currentTarget.dataset.choseitem);
			if (this.data.multiOpts) {
				var selectedOpts = this.data.selectedOpts;
				var _i = this.data.selectedOpts.indexOf(choseIndex);
				if (_i >= 0) {
					options[choseIndex]["class"] = "noChose";
					selectedOpts.splice(_i, 1);
				} else {
					options[choseIndex]["class"] = "chose";
					selectedOpts.push(choseIndex);
				}
				var showConfirm = selectedOpts.length >= 2 ? true : false;
				this.setData({
					options: options,
					selectedOpts: selectedOpts,
					showConfirm: showConfirm
				});
				return false;
			} else {
				for (var index = 0; index < options.length; index++) {
					options[index]["class"] = "noChose";
				}
				options[choseIndex]["class"] = "chose";
				var selectedOpts = [choseIndex];
				this.setData({selectedOpts: selectedOpts, showConfirm: false});
				return this.confirmAnswer(options);
			}
		};
		Training.prototype.confirmAnswer = function(options) {
			if (options instanceof Array);
			else {
				// 可能是事件触发传过来 event 因此不能用
				options = this.data.options;
			}
			var selectedOpts = this.data.selectedOpts.sort();
			var choseRight = true;
			for (var i = 0, l = options.length; i < l; i++) {
				if (parseInt(options[i]["score"]) > 0) {
					if (options[i]["class"] != "chose") {
						if (this.data.mode != "answer") {
							options[i]["class"] = "chose";
						} // TODO 是否区分 用户是否选择
						choseRight = false;
					}
				} else if (options[i]["class"] == "chose") {
					// 用户选错了 如果是answer模式，errorChoseCls会变成chose
					options[i]["class"] = this.data.erroChoseCls;
					choseRight = false;
				}
			}
			this.setData({options: options});
			var eventDetail = {
				selectedOpts: selectedOpts,
				rightOpts: this.data.rightOpts,
				choseRight: choseRight
			};
			var event = {detail: eventDetail};
			this.choseOption(event);
		};
		Training.prototype.showAnswerAction = function() {
			var selectedOpts = this.data.selectedOpts;
			var selectedOption = "";
			for (var i = 0, l = selectedOpts.length; i < l; i++) {
				selectedOption += app.globalData.optionChar[selectedOpts[i]];
			}
			if (selectedOption.length <= 0) {
				selectedOption = "未选择";
			}
			this.setData({selectedOption: selectedOption});
		};
		Training.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"safe-area",
				null,
				apivm.h(
					"view",
					{class: "page"},
					apivm.h(
						"dialog",
						{
							id: "fb_dialog",
							class: "dialog",
							hidden: "{hiddenFeedback}",
							title: "问题反馈",
							"confirm-text": "反馈",
							"cancel-text": "取消",
							bindcancel: "cancelFeedback",
							bindconfirm: "confirmFeedback"
						},
						apivm.h(
							"view",
							{class: "feedback-type"},
							apivm.h(
								"picker",
								{
									range: this.data.fbTypes,
									value: this.data.fbTypeIndex,
									class: "fd-type-picker",
									bindchange: "feedbackTypeChange"
								},
								apivm.h("text", {class: "fb-type-k"}, "问题类型：")
							)
						),
						apivm.h("textarea", {
							class: "fb-desc",
							type: "text",
							placeholder: "",
							bindinput: "feedbackDescInput",
							maxlength: "100",
							value: this.data.feedbackDesc
						})
					),
					this.data.showSurvey
						? apivm.h(
								"view",
								null,
								apivm.h("statis", {
									image4: "../../images/wrong.png",
									titles: this.data.titles,
									value1: this.data.rightNum,
									value2: this.data.answerTime,
									value3: this.data.skipNum
								}),
								apivm.h(
									"view",
									{class: "center"},
									apivm.h(
										"text",
										{class: "score"},
										this.data.score,
										"/",
										this.data.totalScore
									),
									apivm.h("text", {class: "statis-div-desc"}, "得分")
								),
								apivm.h(
									"view",
									{class: "detail"},
									apivm.h("text", {class: "label-detail"}, "查看解析"),
									apivm.h(
										"scroll-view",
										{class: "width100p"},
										(Array.isArray(this.data.allQuestionIndexs)
											? this.data.allQuestionIndexs
											: Object.values(this.data.allQuestionIndexs)
										).map(function(lineNums) {
											return apivm.h(
												"view",
												{class: "row"},
												(Array.isArray(lineNums) ? lineNums : Object.values(lineNums)).map(
													function(item$1) {
														return apivm.h(
															"view",
															{
																onclick: function(event) {
																	if (this$1.showDeatil) {
																		this$1.showDeatil(event);
																	} else {
																		showDeatil(event);
																	}
																},
																"data-index": item$1,
																class: questionItems[item$1].right ? "bg-right" : "bg-error"
															},
															apivm.h("text", {class: "color-white"}, item$1 + 1)
														);
													}
												)
											);
										})
									)
								)
						  )
						: apivm.h(
								"view",
								{
									class: "pageContent",
									ontouchstart: function(event) {
										if (this$1.touchStart) {
											this$1.touchStart(event);
										} else {
											touchStart(event);
										}
									},
									ontouchend: function(event) {
										if (this$1.touchEnd) {
											this$1.touchEnd(event);
										} else {
											touchEnd(event);
										}
									}
								},

								apivm.h(
									"view",
									{class: "top"},
									apivm.h(
										"view",
										{class: "top-title"},
										apivm.h("text", {class: ""}, this.data.examName),
										this.data.mode == "wrong"
											? apivm.h("text", {class: ""}, "错题本")
											: null
									)
								),
								this.data.mode == "answer"
									? apivm.h("answer-top-process", {
											totalQuestionNumber: this.data.questionNum,
											nowQuestionIndex: this.data.nowQuestionIndex,
											onreportTime: function(event) {
												if (this$1.reportTime) {
													this$1.reportTime(event);
												} else {
													reportTime(event);
												}
											}
									  })
									: null,
								this.data.mode != "answer"
									? apivm.h(
											"view",
											{class: "middle"},
											this.data.questionNum > 1
												? apivm.h(
														"text",
														{
															onclick: function(event) {
																if (this$1.before10) {
																	this$1.before10(event);
																} else {
																	before10(event);
																}
															},
															class: "switch"
														},
														"‹‹"
												  )
												: null,
											apivm.h(
												"picker",
												{
													class: "switch",
													onChange: function(event) {
														if (this$1.skipAction) {
															this$1.skipAction(event);
														} else {
															skipAction(event);
														}
													},
													value: this.data.skipIndex,
													range: this.data.skipNums
												},
												apivm.h(
													"text",
													{class: "switchtext"},
													this.data.nowQuestionIndex + 1,
													"/",
													this.data.questionNum
												)
											),
											this.data.questionNum > 1
												? apivm.h(
														"text",
														{
															onclick: function(event) {
																if (this$1.after10) {
																	this$1.after10(event);
																} else {
																	after10(event);
																}
															},
															class: "switch"
														},
														"››"
												  )
												: null
									  )
									: null,

								this.data.nowQuestion != null
									? apivm.h(
											"scroll-view",
											{class: "content"},
											apivm.h("view", {id: "question_desc"}),
											apivm.h(
												"view",
												{
													class: "div",
													onclick: function(event) {
														if (this$1.getQuestionTag) {
															this$1.getQuestionTag(event);
														} else {
															getQuestionTag(event);
														}
													}
												},
												this.data.nowQuestion.index + 1
													? apivm.h("text", null, this.data.nowQuestion.index + 1, ".")
													: null,
												(Array.isArray(this.data.nowQuestion.question_desc_rich)
													? this.data.nowQuestion.question_desc_rich
													: Object.values(this.data.nowQuestion.question_desc_rich)
												).map(function(item$1, index$1) {
													return apivm.h(
														"view",
														null,
														item$1.url
															? apivm.h("image", {
																	mode: "aspectFit",
																	style:
																		"height:" +
																		item$1.height +
																		"px;width:" +
																		item$1.width +
																		"px;",
																	src: this$1.data.remote_host + item$1.url
															  })
															: null,
														!item$1.url ? apivm.h("text", null, item$1.value) : null
													);
												}),
												this.data.nowQuestion.question_source
													? apivm.h(
															"text",
															null,
															"(",
															this.data.nowQuestion.question_source,
															")"
													  )
													: null,
												this.data.isShowSubject
													? apivm.h(
															"text",
															null,
															"【",
															this.data.nowQuestion.question_subject,
															"】"
													  )
													: null,
												this.data.multiOpts ? apivm.h("text", null, "[多选]") : null
											),
											this.data.nowQuestion.question_desc_url && !this.data.videoDesc
												? apivm.h("image", {
														class: "descPic",
														mode: "aspectFit",
														src:
															this.data.remote_host + this.data.nowQuestion.question_desc_url
												  })
												: null,

											apivm.h(
												"view",
												{class: "div view-tag"},
												(Array.isArray(this.data.tags)
													? this.data.tags
													: Object.values(this.data.tags)
												).map(function(item$1) {
													return apivm.h(
														"view",
														{class: "tag"},
														apivm.h("text", null, item$1)
													);
												})
											),
											apivm.h(
												"view",
												{class: "questionOption"},
												(Array.isArray(this.data.options)
													? this.data.options
													: Object.values(this.data.options)
												).map(function(item$1, idx) {
													return apivm.h(
														"view",
														{
															class: this$1.data.options[idx].class
																? this$1.data.options[idx].class
																: "noChose",
															onclick: function(event) {
																if (this$1.choseItem) {
																	this$1.choseItem(event);
																} else {
																	choseItem(event);
																}
															},
															"data-choseitem": idx,
															key: item$1.value
														},
														apivm.h("text", null, this$1.data.options[idx].optionChar, "、"),
														(Array.isArray(item$1["desc_rich"])
															? item$1["desc_rich"]
															: Object.values(item$1["desc_rich"])
														).map(function(_item, _index) {
															return apivm.h(
																"view",
																{class: "div"},
																apivm.h("text", null),
																_item.url
																	? apivm.h("image", {
																			mode: "aspectFit",
																			style:
																				"height:" +
																				_item.height +
																				"px;width:" +
																				_item.width +
																				"px;",
																			src: this$1.data.remote_host + _item.url
																	  })
																	: null,
																!_item.url ? apivm.h("text", null, _item.value) : null
															);
														})
													);
												})
											),
											apivm.h(
												"view",
												{
													style: {display: this.data.showConfirm ? "flex" : "none"},
													class: "btn-warn",
													onclick: function(event) {
														if (this$1.confirmAnswer) {
															this$1.confirmAnswer(event);
														} else {
															confirmAnswer(event);
														}
													}
												},
												apivm.h("text", null, "选好了")
											),
											apivm.h(
												"view",
												{
													class: "deepskyblue",
													style: {display: this.data.isShowAnswer ? "flex" : "none"}
												},
												apivm.h(
													"text",
													{class: "deepskyblue"},
													"参考答案： ",
													this.data.rightOption
												),
												apivm.h(
													"text",
													{class: "deepskyblue"},
													"你的答案： ",
													this.data.selectedOption
												)
											),
											apivm.h(
												"scroll-view",
												{
													"scroll-y": "true",
													class: "analysis",
													style: {display: this.data.isShowAnswer ? "flex" : "none"}
												},
												apivm.h("text", null, "解析："),
												(Array.isArray(this.data.nowQuestion.answer_rich)
													? this.data.nowQuestion.answer_rich
													: Object.values(this.data.nowQuestion.answer_rich)
												).map(function(item$1, index$1) {
													return apivm.h(
														"view",
														null,
														item$1.url
															? apivm.h("image", {
																	mode: "aspectFit",
																	style:
																		"height:" +
																		item$1.height +
																		"px;width:" +
																		item$1.width +
																		"px;",
																	src: this$1.data.remote_host + item$1.url
															  })
															: null,
														!item$1.url ? apivm.h("text", null, item$1.value) : null
													);
												})
											)
									  )
									: null
						  ),

					this.data.mode == "traning"
						? apivm.h(
								"view",
								{class: "bottom div"},
								this.data.questionNum > 1
									? apivm.h(
											"text",
											{
												onclick: function(event) {
													if (this$1.before1) {
														this$1.before1(event);
													} else {
														before1(event);
													}
												},
												class: "switch"
											},
											"‹"
									  )
									: null,
								apivm.h(
									"text",
									{
										style: {
											display: !(this.data.isShowAnswer && this.data.nowQuestion.canUpdate)
												? "flex"
												: "none"
										},
										class: "switch",
										onclick: function(event) {
											if (this$1.showAnswer) {
												this$1.showAnswer(event);
											} else {
												showAnswer(event);
											}
										}
									},
									"显示答案"
								),
								apivm.h(
									"text",
									{
										style: {
											display:
												this.data.isShowAnswer && this.data.nowQuestion.canUpdate
													? "flex"
													: "none"
										},
										class: "switch",
										onclick: function(event) {
											if (this$1.toUpdate) {
												this$1.toUpdate(event);
											} else {
												toUpdate(event);
											}
										}
									},
									"修改"
								),
								this.data.questionNum > 1
									? apivm.h(
											"text",
											{
												onclick: function(event) {
													if (this$1.after1) {
														this$1.after1(event);
													} else {
														after1(event);
													}
												},
												class: "switch"
											},
											"›"
									  )
									: null
						  )
						: null,
					this.data.mode == "wrong"
						? apivm.h(
								"view",
								null,
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.before1) {
												this$1.before1(event);
											} else {
												before1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "‹")
								),
								apivm.h(
									"view",
									{
										style: {display: this.data.showRemove ? "flex" : "none"},
										class: "switch",
										onclick: function(event) {
											if (this$1.remove) {
												this$1.remove(event);
											} else {
												remove(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "移除该题")
								),
								apivm.h(
									"view",
									{
										style: {display: !this.data.showRemove ? "flex" : "none"},
										class: "switch",
										onclick: function(event) {
											if (this$1.showAnswer) {
												this$1.showAnswer(event);
											} else {
												showAnswer(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "显示答案")
								),
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.after1) {
												this$1.after1(event);
											} else {
												after1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "›")
								)
						  )
						: null,
					this.data.mode == "answer"
						? apivm.h(
								"view",
								{class: "bottom div"},
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.before1) {
												this$1.before1(event);
											} else {
												before1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "‹")
								),
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.submit) {
												this$1.submit(event);
											} else {
												submit(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "交卷")
								),
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.after1) {
												this$1.after1(event);
											} else {
												after1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "›")
								)
						  )
						: null,
					this.data.mode == "answer-show" && this.data.showSurvey == false
						? apivm.h(
								"view",
								{class: "bottom div"},
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.before1) {
												this$1.before1(event);
											} else {
												before1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "‹")
								),
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.returnSurvey) {
												this$1.returnSurvey(event);
											} else {
												returnSurvey(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "返回")
								),
								apivm.h(
									"view",
									{
										class: "switch",
										onclick: function(event) {
											if (this$1.after1) {
												this$1.after1(event);
											} else {
												after1(event);
											}
										}
									},
									apivm.h("text", {class: "switchtext"}, "›")
								)
						  )
						: null
				)
			);
		};

		return Training;
	})(Component);
	Training.css = {
		page: {height: "100%"},
		".pageContent": {height: "100%"},
		".page": {
			fontFamily:
				"'PingFang SC',\n\t\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\t\tHelvetica,\n\t\t\t\t\t\t'Droid Sans Fallback',\n\t\t\t\t\t\t'Microsoft Yahei',\n\t\t\t\t\t\tsans-serif",
			height: "auto",
			margin: "7px 7px 0px 7px",
			position: "relative",
			zIndex: "2",
			minHeight: "90%"
		},
		".top": {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			padding: "7px 0px 7px 50px",
			borderBottom: "0.5px solid #5d5d5d",
			fontSize: "16px"
		},
		".middle": {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			padding: "7px 0px 7px 0px"
		},
		".content": {fontSize: "16px"},
		".item": {
			marginBottom: "7px",
			fontSize: "16px",
			margin: "10px",
			width: "25px",
			height: "25px",
			color: "white",
			textAlign: "center",
			borderRadius: "100px",
			backgroundColor: "mediumturquoise",
			justifyContent: "center",
			display: "flex",
			alignItems: "center",
			marginTop: "15px"
		},
		".line": {
			marginTop: "50px",
			display: "flex",
			borderBottom: "0px solid #5d5d5d",
			alignItems: "center",
			justifyContent: "space-around",
			zIndex: "8",
			marginBottom: "30px"
		},
		".showAnswer": {
			fontSize: "16px",
			padding: "5px 10px 5px 10px",
			border: "0px solid #5d5d5d",
			borderRadius: "7px",
			marginBottom: "-16px",
			zIndex: "9",
			backgroundColor: "#fff"
		},
		".switch": {
			fontSize: "20px",
			textAlign: "center",
			width: "33%",
			lineHeight: "48px",
			height: "48px"
		},
		".switchtext": {
			fontSize: "20px",
			textAlign: "center",
			lineHeight: "48px",
			height: "48px"
		},
		".bottom": {
			width: "100%",
			fontSize: "14px",
			position: "fixed",
			bottom: "0px",
			backgroundColor: "#fff",
			height: "50px",
			minHeight: "50px",
			borderTop: "1px solid #c9c9d8",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			zIndex: "10"
		},
		".top-title": {textAlign: "center", width: "90%"},
		".icon": {cssFloat: "right", height: "25px", width: "25px"},
		".dialog": {
			height: "200px",
			width: "85%",
			border: "1px solid #ccc",
			backgroundColor: "#fff"
		},
		".feedback-type": {
			width: "100%",
			fontSize: "18px",
			backgroundColor: "white",
			marginTop: "10px",
			marginBottom: "15px"
		},
		".fd-type-picker": {width: "100%"},
		".fb-type-k": {width: "35%", fontWeight: "bold", display: "inline-block"},
		".fb-type-v": {
			width: "65%",
			textAlign: "center",
			backgroundColor: "white",
			paddingTop: "10px",
			paddingBottom: "10px",
			display: "inline-block"
		},
		".fb-desc": {fontSize: "18px", backgroundColor: "white", width: "100%"},
		".ad-modal": {
			position: "fixed",
			display: "block",
			width: "100%",
			height: "100%",
			left: "0",
			top: "0",
			backgroundColor: "rgba(0, 0, 0, 0.3)",
			zIndex: "100",
			justifyContent: "center",
			alignItems: "center"
		},
		".ad": {
			position: "fixed",
			left: "0",
			right: "0",
			top: "0",
			bottom: "0",
			margin: "auto",
			backgroundColor: "white",
			width: "90%",
			height: "90%"
		},
		".ad-content": {
			width: "94%",
			position: "absolute",
			left: "3%",
			top: "15px",
			bottom: "50px",
			borderStyle: "solid",
			borderWidth: "1px",
			borderColor: "gray",
			overflowY: "scroll"
		},
		".ad-btn-view": {
			position: "absolute",
			bottom: "0px",
			right: "0px",
			height: "50px",
			lineHeight: "50px",
			display: "flex"
		},
		".ad-btn": {marginRight: "15px"},
		".ad-btn checkbox": {transform: "scale(0.8,0.8)", width: "25px"},
		".div": {display: "flex", flexDirection: "row", flexWrap: "wrap"},
		".view-tag": {marginTop: "7px", marginBottom: "7px"},
		".tag": {
			borderRadius: "7px",
			marginLeft: "5px",
			paddingLeft: "7px",
			paddingRight: "7px",
			paddingTop: "6px",
			paddingBottom: "6px",
			backgroundColor: "#FFBB77"
		},
		".noChose": {
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			backgroundColor: "#f0f5fb",
			height: "auto",
			lineHeight: "35px",
			fontSize: "15px",
			margin: "10px 10px 10px 10px",
			paddingLeft: "10px",
			paddingTop: "5px",
			paddingBottom: "5px",
			color: "#363637",
			borderRadius: "2.5px"
		},
		".chose": {
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			backgroundColor: "#fff",
			color: "#1E90FF",
			border: "1px #1E90FF solid",
			lineHeight: "35px",
			fontSize: "15px",
			margin: "10px 10px 10px 10px",
			paddingLeft: "10px",
			paddingTop: "5px",
			paddingBottom: "5px",
			borderRadius: "2.5px"
		},
		".errorChose": {
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			backgroundColor: "#fff",
			color: "#f01212",
			border: "1px #f01212 solid",
			lineHeight: "34px",
			fontSize: "15px",
			margin: "10px 10px 10px 10px",
			paddingLeft: "10px",
			paddingTop: "5px",
			paddingBottom: "5px",
			borderRadius: "2px"
		},
		".btn-warn": {
			marginTop: "20px",
			marginBottom: "15px",
			marginLeft: "20px",
			color: "black",
			backgroundColor: "#dec674",
			textAlign: "center",
			padding: "5px",
			width: "75px"
		},
		".analysis": {marginTop: "10px"},
		".deepskyblue": {color: "#00BFFF"},
		".center": {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			height: "125px",
			textAlign: "center",
			justifyContent: "center",
			alignItems: "center",
			padding: "0",
			backgroundColor: "white"
		},
		".score": {
			height: "75px",
			lineHeight: "75px",
			fontSize: "30px",
			color: "red"
		},
		".detail": {
			display: "flex",
			flexDirection: "column",
			marginLeft: "1%",
			width: "98%",
			paddingTop: "15px",
			paddingBottom: "25px",
			backgroundColor: "white"
		},
		".label-detail": {
			fontSize: "15px",
			color: "yellowgreen",
			borderBottom: "0px solid #9ad4fc",
			paddingBottom: "10px",
			textAlign: "center"
		},
		".bg-right": {
			width: "25px",
			height: "25px",
			color: "white",
			textAlign: "center",
			borderRadius: "100px",
			justifyContent: "center",
			display: "flex",
			alignItems: "center",
			marginTop: "15px",
			backgroundColor: "#9ad4fc",
			border: "2px #9ad4fc solid"
		},
		".bg-error": {
			width: "25px",
			height: "25px",
			color: "white",
			textAlign: "center",
			borderRadius: "100px",
			justifyContent: "center",
			display: "flex",
			alignItems: "center",
			marginTop: "15px",
			backgroundColor: "#fc9a9a",
			border: "2px #fc9a9a solid"
		},
		".row": {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around"
		},
		".color-white": {color: "white"},
		".width100p": {width: "100%"},
		".bottomShow": {
			fontSize: "20px",
			textAlign: "center",
			lineHeight: "48px",
			height: "48px"
		}
	};
	apivm.define("training", Training);
	apivm.render(apivm.h("training", null), "body");
})();
