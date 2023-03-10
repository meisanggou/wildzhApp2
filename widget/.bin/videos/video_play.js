(function() {
	var remote_host$1 = "https://wild.gene.ac";
	var version = api.appVersion;
	var session_storage_key = "wildzh_insider_session";
	var exam_storage_key = "wildzh_current_exam";
	var reqRandom = 100; // 用于某些资源防止缓存，加到请求参数中

	// remote_host = 'http://10.180.201.36:2400'

	var SERVER_ENDPOINT = remote_host$1;
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
				value.avatar_url = remote_host$1 + value.avatar_url + "?r=" + reqRandom;
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
			req.url = remote_host$1 + req.url;
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
		remote_host: remote_host$1,
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
		remote_host: remote_host$1,
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
	global.remote_host = app.globalData.remote_host;
	global.playTime = 0;
	global.lastPlayTime = 0;
	global.intervalReportTime = 5;
	var VideoPlay = /*@__PURE__*/ (function(Component) {
		function VideoPlay(props) {
			Component.call(this, props);
			this.data = {
				videoUuid: "",
				videoSrc: "",
				videoTitle: "",
				videoDesc: "",
				initialTime: 0,
				navIndex: 1
			};
		}

		if (Component) VideoPlay.__proto__ = Component;
		VideoPlay.prototype = Object.create(Component && Component.prototype);
		VideoPlay.prototype.constructor = VideoPlay;
		VideoPlay.prototype.apiready = function() {
			//like created
			var options = api.pageParam;
			this.onLoad(options);
		};
		VideoPlay.prototype.setData = function(data) {
			for (var key in data) {
				this.data[key] = data[key];
			}
		};
		VideoPlay.prototype.onLoad = function(options) {
			var video_uuid = options.video_uuid;
			this.getVideoInfo(video_uuid);
		};
		VideoPlay.prototype.onShow = function() {};
		VideoPlay.prototype.getVideoInfo = function(video_uuid) {
			var that = this;
			wx.request2({
				url: "/video/entries/" + video_uuid,
				success: function(res) {
					var resData = res.data.data;
					var videoInfo = resData["info"];
					var videoSrc = remote_host + videoInfo["video_location"];
					var videoDesc = videoInfo["video_desc"];
					var initialTime = resData["progress"]["play_seconds"];
					var videoTitle = videoInfo["video_title"];
					that.setData({
						videoUuid: videoInfo.video_uuid,
						videoSrc: videoSrc,
						videoDesc: videoDesc,
						initialTime: initialTime,
						videoTitle: videoTitle
					});
				}
			});
		};
		VideoPlay.prototype.playTimeUpdate = function(event) {
			playTime = event.detail.currentTime;
			if (playTime > lastPlayTime + intervalReportTime) {
				lastPlayTime = playTime;
				this.reportPlayTime(lastPlayTime);
			}
		};
		VideoPlay.prototype.reportPlayTime = function(playTime) {
			var data = {video_uuid: this.data.videoUuid, play_seconds: playTime};
			wx.request2({
				url: "/video/progress",
				method: "PUT",
				data: data,
				success: function(res) {}
			});
		};
		VideoPlay.prototype.changeNav = function(event) {
			var index = parseInt(event.dataset.index);
			this.setData({
				navIndex: index
			});
		};
		VideoPlay.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("safe-area", null),
				apivm.h(
					"view",
					null,
					apivm.h("video", {
						class: "video",
						src: this.data.videoSrc,
						title: this.data.videoTitle,
						"initial-time": this.data.initialTime,
						ontimeupdate: function(event) {
							if (this$1.playTimeUpdate) {
								this$1.playTimeUpdate(event);
							} else {
								playTimeUpdate(event);
							}
						}
					})
				),
				apivm.h(
					"view",
					{class: "nav"},
					apivm.h(
						"text",
						{
							class: this.data.navIndex == 1 ? "nav-item-sd" : "nav-item",
							"data-index": "1",
							onclick: function(event) {
								if (this$1.changeNav) {
									this$1.changeNav(event);
								} else {
									changeNav(event);
								}
							}
						},
						"视频介绍"
					),
					apivm.h(
						"text",
						{
							class: this.data.navIndex == 2 ? "nav-item-sd" : "nav-item",
							"data-index": "2",
							onclick: function(event) {
								if (this$1.changeNav) {
									this$1.changeNav(event);
								} else {
									changeNav(event);
								}
							}
						},
						"留言"
					)
				),
				apivm.h(
					"view",
					{class: "content"},
					this.data.navIndex == 1
						? apivm.h(
								"view",
								null,
								apivm.h("text", {class: "desc"}, this.data.videoDesc)
						  )
						: null,
					this.data.navIndex == 2
						? apivm.h("view", null, apivm.h("text", {class: "desc"}, "功能开发中"))
						: null
				),

				apivm.h("view", null)
			);
		};

		return VideoPlay;
	})(Component);
	VideoPlay.css = {
		".page": {height: "100%"},
		".nav": {
			position: "fixed",
			display: "flex",
			flexDirection: "row",
			top: "10px",
			left: "0",
			height: "50px",
			lineHeight: "50px",
			width: "100%"
		},
		".nav-item": {
			flex: "1",
			textAlign: "center",
			fontSize: "16px",
			fontWeight: "500",
			color: "black"
		},
		".nav-item-sd": {
			flex: "1",
			textAlign: "center",
			fontWeight: "500",
			fontSize: "15px",
			color: "#d8264d",
			position: "relative"
		},
		".nav-item-sd::after": {
			position: "absolute",
			bottom: "0",
			width: "40%",
			height: "2px",
			background: "#d8264d",
			borderRadius: "1px",
			left: "50%",
			content: '""',
			transform: "translateX(-50%)"
		},
		".content": {position: "fixed", display: "flex", top: "282px"},
		".desc": {color: "gray", fontSize: "14px"},
		".video": {height: "230px", width: "100%"}
	};
	apivm.define("video_play", VideoPlay);
	apivm.render(apivm.h("video_play", null), "body");
})();
