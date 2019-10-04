//获取应用实例
const app = getApp()
var _ = require('../../utils/tools');

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false
    },

    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: function (wxInfoRes) {
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            wx.login({
                              success: loginResult => {
                                    // 获取到用户的 code 之后：res.code
                                console.log("用户的code:" + loginResult.code);
                                  //第三步服务端获取用户openid并返回session
                                  _.auth(loginResult.code, wxInfoRes.encryptedData, wxInfoRes.iv);
                                wx.switchTab({
                                    "url": "../searchIndex/index"
                                  });
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    that.setData({
                        isHide: true
                    });
                }
            }
        });
    },

    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            // 获取到用户的信息了，打印到控制台上看下
            console.log("用户的信息如下：");
            console.log(e.detail.userInfo);
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                isHide: false
            });
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
                    _.auth(loginResult.code, wxInfoRes.encryptedData, wxInfoRes.iv);
                    wx.switchTab({
                      "url": "../searchIndex/index"
                    });
                  }
                });
              }
            });
        } else {
          wx.switchTab({
            "url": "../searchIndex/index"
          });
            //用户按了拒绝按钮
            // wx.showModal({
            //     title: '警告',
            //     content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            //     showCancel: false,
            //     confirmText: '返回授权',
            //     success: function(res) {
            //         // 用户没有授权成功，不需要改变 isHide 的值
            //         if (res.confirm) {
            //             console.log('用户点击了“返回授权”');
            //         }
            //     }
            // });
        }
    }
})
