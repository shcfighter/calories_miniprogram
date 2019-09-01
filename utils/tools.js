const SESSION_KEY = 'token';
const SERVER_URL = 'https://calories.healthybeauty360.com/calories/';
//const SERVER_URL = 'http://localhost:8080/calories/';
var WxParse = require('../libs/wxParse/wxParse.js');
module.exports = {
	wxInfo: '',
	userInfo: '',
	parseHtml: function(self, html) {
		WxParse.wxParse('html', 'html', html, self);
	},

	isEmpty:function(obj) {
		if(!obj || typeof(obj) == "undefined" || obj == undefined || obj == null || obj.toString().length == 0){
			return true;
		}
		return false;
	},
	isNotEmpty:function(obj) {
		return !this.isEmpty(obj);
	},

	/**
	 * 重新获取授权并登陆方法,一般在用户没有授权或会话失效时使用
	 */
	reLogin: function() {
		var self = this;
		wx.openSetting({
			success: (res) => {
				self.login();
			}
		});
	},
	login: function() {
		var self = this;
		//!!!!!!!第一步微信登陆获取code
		wx.login({
			success: function(loginResult) {
				if(loginResult.code) {
					//!!!!!!!第二步登陆成功后获取用户微信信息
					wx.getUserInfo({
						success: function(wxInfoRes) {
							self.wxInfo = wxInfoRes.userInfo;
							//第三步服务端获取用户openid并返回session
							self.auth(loginResult.code, wxInfoRes.encryptedData, wxInfoRes.iv);
						},
						fail: function(result) {
							console.log('用户登陆成功但获取微信信息失败');
							// self.reLogin();
							self.showError('授权失败');
						}
					});
				} else {
					console.log('获取用户登录态失败！' + loginResult.errMsg);
				}
			},
			fail: function() {
				console.log('用户不允许登陆!!');
			}
		});
	},
	/**
	 * 第三步服务端授权获取sessionid
	 * @param code
	 * @param encryptedData
	 * @param iv
	 */
	auth: function(code, encryptedData, iv) {
		var self = this;
		//提交到后台用code换取sessionid
    var auth_url = SERVER_URL + "api/accredit";
    //header处理
    let header = {
      'content-type': 'application/json'
    };
    wx.request({
      url: auth_url,
      data: { 
          "code": code, 
          "user_info":{
            "encryptedData": encryptedData,
		       	"iv": iv
          }
        },
      method: 'PUT',
      header: header,
      success: function (res) {
        console.log(res.data);
        if (0 == res.data.status) {
          wx.setStorage({
            key: SESSION_KEY,
            data: res.data.items.token
          })
        }
      },
      fail: function (res) {
        console.log('网络请求失败:', res);
        self.showError('网络请求失败:' + res.errMsg);
      }
    });
    // self.post('api/accredit', {
		// 	code: code,
		// 	encryptedData: encryptedData,
		// 	iv: iv
		// }, function(res) {
		// 	console.log('授权信息返回结果=', res);
		// 	if(res.data && res.data.sessionid && res.data.sessionid.length > 0) {
		// 		console.log('接收的res.data.sessionid=' + res.data.sessionid);
		// 		wx.setStorageSync(SESSION_KEY, res.data.sessionid);
		// 		self.getUserInfo();
		// 	} else {
		// 		console.log('用户授权失败' + res.errMsg);
		// 	}
		// });
	},
	/**
	 * 从后台获取用户信息
	 */
	getUserInfo: function() {
		var self = this;
		self.post('/rest/user/get', {}, function(res) {
			if(res.data && res.data.openid) {
				self.userInfo = res.data;
			} else {
				self.showToast('获取用户信息失败');
			}
		});
	},

	/**
	 * 时间格式化输出，如3:25:19 86，支付阶段做倒计时用
	 * @param micro_second
	 * @returns {string}
	 */
	dateformat: function(micro_second) {//
		// 秒数
		var second = Math.floor(micro_second / 1000);
		// 小时位
		var hr = Math.floor(second / 3600);
		// 分钟位
		var min = Math.floor((second - hr * 3600) / 60);
		// 秒位
		var sec = (second - hr * 3600 - min * 60);
		if(sec < 10) {
			sec = '0' + sec;
		}
		return min + "分" + sec + '秒';
	},

	showToast: function(title) {
		wx.showToast({
			title: title,
			icon: 'success',
			duration: 1500
		})
	},
	showError: function(title) {
		wx.showToast({
			title: title,
			image: '/imgs/common/error.svg',
			duration: 1500
		})
	},
	showModal: function(title, content, fn, showCancel) {
		if(typeof(showCancel) == "undefined") {
			showCancel = true;
		}
		wx.showModal({
			title: title,
			content: content,
			showCancel: showCancel,
			success: function(res) {
				if(res.confirm) {
					fn();
				}
			}
		});
	},
	showLoading: function(title) {
		wx.showLoading({
			title: title || '加载中...',
			mask: true
		})
	},
	hideLoading: function() {
		wx.hideLoading();
	},

	setNavigationBarTitle: function(title) {
		wx.setNavigationBarTitle({title: title});
	},
	showNavigationBarLoading: function() {
		wx.showNavigationBarLoading();
	},
	hideNavigationBarLoading: function() {
		wx.hideNavigationBarLoading()
	},

	/**
	 * 导航处理开始--------------------------------------------------------------------------------------------
	 */
	goHome: function() {
		wx.redirectTo({
			url: '/page/list/list'
		})
	},
	navigateTo: function(url) {
		wx.navigateTo({
			url: url
		})
	},
	navigateBack: function() {
		wx.navigateBack();
	},
	redirectTo: function(url) {
		wx.redirectTo({
			url: url
		})
	},

	sendTemplate: function(formId, templateData, success, fail) {
		var app = getApp();
		this.get({
			url: '/WxAppApi/sendTemplate',
			data: {
				rd_session: app.rd_session,
				form_id: formId,
				data: templateData,
			},
			success: success,   // errorcode==0时发送成功
			fail: fail
		});
	},

	/**
	 * 网络处理开始--------------------------------------------------------------------------------------------
	 */
  exec: function (url, method, data, successCallback, completeCallback) {
    let self = this;
    //路径处理
    if (url.indexOf('https://') !== 0) {
      url = SERVER_URL + url;
    }
    //header处理
    let header = {
      'content-type': 'application/json'
    };
    let token = wx.getStorageSync(SESSION_KEY);
    console.log('[' + url + ']发出请求,token=', token);
    if (token) {
      header['token'] = token;
    }
    //提示处理
    wx.showNavigationBarLoading();
    //开始请求
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode != 200) {
          self.showError('网络请求异常:' + res.errMsg);
        } else if (res.data.status && res.data.status != 0) {//请求包含错误代码
          if (401 == res.data.status) {
            self.showModal('操作失败', '请允许小程序获取您的用户信息', function () {
              self.reLogin();
            }, false);
          } else {
            console.log('服务请求失败:', res);
            self.showError(res.data.message);
          }
        } else {//请求成功
          wx.hideLoading();
          res.data = res.data.items;
          successCallback(res);
        }
      },
      fail: function (res) {
        console.log('网络请求失败:', res);
        self.showError('网络请求失败:' + res.errMsg);
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        if (completeCallback) {
          completeCallback();
        }
      }
    });
	},
	post: function(url, data, successCallback, completeCallback) {
		let self = this;
		//路径处理
		if(url.indexOf('https://') !== 0) {
			url = SERVER_URL + url;
		}
		//header处理
		let header = {
			'content-type': 'application/json'
		};
    let token = wx.getStorageSync(SESSION_KEY);
    console.log('[' + url + ']发出请求,token=', token);
    if (token) {
      header['token'] = token;
    }
		//提示处理
		wx.showNavigationBarLoading();
		//开始请求
		wx.request({
			url: url,
			data: data,
			method: 'POST',
			header: header,
			success: function(res) {
				// console.log(res.data);
				if(res.statusCode != 200) {
					self.showError('网络请求异常:' + res.errMsg);
				} else if(res.data.status && res.data.status != 0) {//请求包含错误代码
					if(401 == res.data.status) {
						self.showModal('操作失败', '请允许小程序获取您的用户信息', function() {
							self.reLogin();
						}, false);
					} else {
						console.log('服务请求失败:', res);
						self.showError(res.data.message);
					}
				} else {//请求成功
					wx.hideLoading();
					res.data = res.data.items;
					successCallback(res);
				}
			},
			fail: function(res) {
				console.log('网络请求失败:', res);
				self.showError('网络请求失败:' + res.errMsg);
			},
			complete: function() {
				wx.hideNavigationBarLoading();
				if(completeCallback) {
					completeCallback();
				}
			}
		});
	},
}