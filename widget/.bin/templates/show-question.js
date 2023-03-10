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

	global.wx = app.wx;
	global.week_delta = 60 * 60 * 24 * 7;
	global.globalQuestionNo = -1;
	global.globalNowQuestion = {};
	var MpQuestion = /*@__PURE__*/ (function(Component) {
		function MpQuestion(props) {
			Component.call(this, props);
			this.data = {
				// remote_host: "",
				isShowSubject: false,
				// optionChar: app.globalData.optionChar,
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
				tags: ["测试"] // 题目标签
				// 非小程序 有的
				// 非小程序有的 结束
			};
			this.compute = {
				nowQuestion: function() {
					if (this.props.nowQuestion == undefined) {
						return {};
					}
					var question = this.props.nowQuestion;
					// console.info('-------- update nowQuestion')
					if (question.question_no == globalQuestionNo) {
						return question;
					}

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

					// for (var index in options) {
					//     options[index]["class"] = "noChose";
					// }

					if ("selectedOpts" in question) {
						selectedOpts = question.selectedOpts;

						for (var i = 0, l = selectedOpts.length; i < l; i++) {
							var choseIndex = selectedOpts[i];
							if (parseInt(options[choseIndex]["score"]) > 0) {
								optionItems[choseIndex]["class"] = "chose";
							} else {
								optionItems[choseIndex]["class"] = this.data.erroChoseCls;
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
					// return question;

					// var data = {};
					// data['tags'] = [];
					var data = {
						tags: [],
						videoDesc: videoDesc,
						// options: options,
						selectedOpts: selectedOpts,
						rightOption: rightOption,
						multiOpts: multi,
						rightOpts: rightOpts,
						showConfirm: false
					};

					data["options"] = options;
					this.setData(data);
					if (this.data.showAnswer) {
						this.showAnswerAction();
					}

					globalQuestionNo = question.question_no;
					return question;
				},
				tags: function() {},
				videoDesc: function() {},
				selectedOpts: function() {},
				rightOption: function() {},
				multiOpts: function() {},
				rightOpts: function() {},
				showConfirm: function() {},
				examNo: function() {
					return this.props.examNo;
				},
				remote_host: function() {
					return app.globalData.remote_host;
				},
				showAnswer: function() {
					if (this.props.showAnswer == undefined) {
						return false;
					}
					if (this.props.showAnswer) {
						this.showAnswerAction();
					}
					return this.props.showAnswer;
				}
			};
		}

		if (Component) MpQuestion.__proto__ = Component;
		MpQuestion.prototype = Object.create(Component && Component.prototype);
		MpQuestion.prototype.constructor = MpQuestion;
		MpQuestion.prototype.setData = function(data) {
			// app.print(data);
			for (var key in data) {
				// app.print('-------------------------------' + key)
				this.data[key] = data[key];
			}
		};
		MpQuestion.prototype.calcTags = function(item) {
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
			app.print(tags);
			return tags;
		};
		MpQuestion.prototype.getQuestionTag = function() {
			var tags = [];
			if (this.examNo == null || this.nowQuestion == null) {
				this.setData({
					tags: tags
				});

				return false;
			}
			if (this.data.showAnswer == true) {
				// 查看答案情况 保持原有
				return true;
			}
			var nowQuestion = this.nowQuestion;
			var examNo = this.examNo;
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
					app.print(res_data);
					if (res_data.status != true) {
						tags = [];
					} else if (res_data.data.item == undefined) {
						tags = [];
					} else {
						if (res_data.data.tags !== undefined) {
							tags = res_data.data.tags;
						} else {
							app.print("---------null");

							tags = that.calcTags(res_data.data.item);
						}
					}
					app.print(tags);
					that.tags = tags;
					// that.setData({
					//     tags: tags
					// });
					console.info(that.options);
				},
				fail: function() {
					that.setData({
						tags: []
					});
				}
			});
		};
		MpQuestion.prototype.choseItem = function(e) {
			if (this.data.mode == "answer-show") {
				return false;
			}
			var options = this.nowQuestion.options;
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
				this.setData({
					selectedOpts: selectedOpts,
					showConfirm: false
				});

				return this.confirmAnswer(options);
			}
		};
		MpQuestion.prototype.confirmAnswer = function(options) {
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
						}
						// TODO 是否区分 用户是否选择
						choseRight = false;
					}
				} else if (options[i]["class"] == "chose") {
					// 用户选错了
					options[i]["class"] = this.data.erroChoseCls;
					choseRight = false;
				}
			}
			this.setData({
				options: options
			});
			var eventDetail = {
				selectedOpts: selectedOpts,
				rightOpts: this.data.rightOpts,
				choseRight: choseRight
			};

			this.fire("choseOption", eventDetail);
		};
		MpQuestion.prototype.showAnswerAction = function() {
			var selectedOpts = this.data.selectedOpts;
			var selectedOption = "";
			for (var i = 0, l = selectedOpts.length; i < l; i++) {
				selectedOption += app.globalData.optionChar[selectedOpts[i]];
			}
			if (selectedOption.length <= 0) {
				selectedOption = "未选择";
			}
			this.setData({
				selectedOption: selectedOption
			});
		};
		MpQuestion.prototype.previewImage = function(event) {
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
		MpQuestion.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"safe-area",
				null,
				this.nowQuestion.index !== undefined
					? apivm.h(
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
							this.nowQuestion.index + 1
								? apivm.h("text", null, this.nowQuestion.index + 1, ".")
								: null,
							(Array.isArray(this.nowQuestion.question_desc_rich)
								? this.nowQuestion.question_desc_rich
								: Object.values(this.nowQuestion.question_desc_rich)
							).map(function(item$1, index$1) {
								return apivm.h(
									"view",
									null,
									item$1.url
										? apivm.h("image", {
												mode: "aspectFit",
												style:
													"height:" + item$1.height + "px;width:" + item$1.width + "px;",
												src: this$1.remote_host + item$1.url
										  })
										: apivm.h("text", null, item$1.value)
								);
							}),
							this.nowQuestion.question_source
								? apivm.h("text", null, "(", this.nowQuestion.question_source, ")")
								: null,
							this.data.isShowSubject
								? apivm.h("text", null, "【", this.nowQuestion.question_subject, "】")
								: null,
							this.data.multiOpts ? apivm.h("text", null, "[多选]") : null
					  )
					: null,

				this.tags !== undefined
					? apivm.h(
							"view",
							{class: "view-tag"},
							apivm.h("view", {class: "tag"}, apivm.h("text", null, "测试2")),
							(Array.isArray(this.tags) ? this.tags : Object.values(this.tags)).map(
								function(item$1) {
									return apivm.h("view", {class: "tag"}, apivm.h("text", null, item$1));
								}
							)
					  )
					: null,
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
								class: this$1.data.options[idx].class,
								onclick: function(event) {
									if (this$1.choseItem) {
										this$1.choseItem(event);
									} else {
										choseItem(event);
									}
								},
								"data-choseitem": idx
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
												style: "height:" + _item.height + "px;width:" + _item.width + "px;",
												src: this$1.remote_host + _item.url
										  })
										: apivm.h("text", null, _item.value)
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
				this.showAnswer
					? apivm.h(
							"view",
							null,
							apivm.h(
								"view",
								{class: "deepskyblue"},
								apivm.h("text", null, "参考答案： ", this.data.rightOption),
								apivm.h("text", null, "你的答案： ", this.data.selectedOption)
							),
							apivm.h(
								"scroll-view",
								{"scroll-y": "true", class: "analysis"},
								apivm.h("text", null, "解析："),
								(Array.isArray(this.nowQuestion.answer_rich)
									? this.nowQuestion.answer_rich
									: Object.values(this.nowQuestion.answer_rich)
								).map(function(item$1, index$1) {
									return apivm.h(
										"view",
										null,
										item$1.url
											? apivm.h("image", {
													mode: "aspectFit",
													style:
														"height:" + item$1.height + "px;width:" + item$1.width + "px;",
													src: this$1.remote_host + item$1.url
											  })
											: apivm.h("text", null, item$1.value)
									);
								})
							)
					  )
					: null
			);
		};

		return MpQuestion;
	})(Component);
	MpQuestion.css = {
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
			lineHeight: "70px",
			fontSize: "15px",
			margin: "10px 10px 10px 10px",
			paddingLeft: "10px",
			borderRadius: "2.5px"
		},
		".errorChose": {
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
			backgroundColor: "#fff",
			color: "#f01212",
			border: "0px #f01212 solid",
			lineHeight: "34px",
			fontSize: "15px",
			margin: "10px 10px 10px 10px",
			paddingLeft: "10px",
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
		".deepskyblue": {color: "#00BFFF"}
	};
	apivm.define("mp-question", MpQuestion);
	apivm.render(apivm.h("mp-question", null), "body");
})();
