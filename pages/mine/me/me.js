var app = getApp();
var _ = require('../../../utils/tools');
Page({
	data: {
    vip: false
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后
      wx.getUserInfo({
        success: function (wxInfoRes) {
          // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
          // 根据自己的需求有其他操作再补充
          // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
          wx.login({
            success: loginResult => {
              // 获取到用户的 code 之后：res.code
              console.log("login用户的code:" + loginResult.code);
              //第三步服务端获取用户openid并返回session
              //_.auth(loginResult.code, wxInfoRes.encryptedData, wxInfoRes.iv);
              var code = loginResult.code;
              var encryptedData = wxInfoRes.encryptedData;
              var iv = wxInfoRes.iv;
              //提交到后台用code换取sessionid
              var auth_url = app.globalData.domain + "api/accredit";
              //header处理
              let header = {
                'content-type': 'application/json'
              };
              wx.request({
                url: auth_url,
                data: {
                  "code": code,
                  "user_info": {
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
                      key: 'token',
                      data: res.data.items.token
                    });
                    _.exec('api/user/get', 'get', {}, function (res) {
                      that.setData({
                        me: res.data
                      });
                    });
                  }
                },
                fail: function (res) {
                  console.log('网络请求失败:', res);
                  self.showError('网络请求失败:' + res.errMsg);
                }
              });
            }
          });
        }
      });
    } else {

    }
  },
	//事件处理函数
	link_userinfo: function() {
    wx.navigateTo({
      url: '/pages/mine/userinfo/userinfo'
    })
	},
	link_userdata: function() {
		wx.navigateTo({
			url: '/pages/mine/userdata/userdata'
		})
	},
	link_aboutus: function() {
		wx.navigateTo({
			url: '/pages/mine/aboutus/aboutus'
		})
	},
	onLoad: function(options) {
		let self = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../../index/index'
          });  
        } else {
          _.exec('api/user/get', 'get', {}, function (res) {
            self.setData({
              me: res.data
            });
          });
        }
      }
    });
	},
	onPullDownRefresh: function () {
		this.onLoad();
		wx.stopPullDownRefresh();
	}
})
