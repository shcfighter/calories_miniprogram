// pages/views/userdata/userdata.js
var _ = require('../../../utils/tools');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        realname: '',
        sex: '男'
    },
    changeSex: function () {
        var self=this;
        var value = this.data.sex;
        console.log(value)
        if(value=='男'||value==''){
            self.setData({
              sex:'女'
            })
        }else{
            self.setData({
              sex: '男'
            })
        }
      
    },
    newName:function(e){
        var newName=e.detail.value;
        console.log(e.detail)
        this.setData({
            realname:newName
        })
    },
    newTel: function (e) {
        var newTel = e.detail.value;
        console.log(e.detail)
        this.setData({
            mobile: newTel
        })
    },
    change:function(e){
      var self=this;
      var sex = '2';
      if ('女' == this.data.sex) {
        sex = '1';
      }
      wx.showToast({
        title: 'loading',
        icon: 'loading',
        duration: 5000
      })
      _.exec('api/user/update', 'PUT', {
        mobile:self.data.mobile,
        real_name:self.data.realname,
        sex: sex
      },function(res){
        console.log(res)
        wx.hideToast({ success: true })
        wx.showToast({
          title: '提示',
          icon: 'success',
          duration: 5000
        })
      })
    },
    
    onLoad: function (options) {
      let self = this;
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          console.log(res.authSetting['scope.userInfo']);
          if (!res.authSetting['scope.userInfo']) {
            console.log("======================================")
            wx.redirectTo({
              "url": "/pages/loginIndex/index"
            });
          } else {
            // 用户没有授权
            // 改变 isHide 的值，显示授权页面
            console.log("---------------------------------")
            _.exec('api/user/get', 'GET', {}, function (res) {
              console.log(res)
              var sex = '男';
              if (1 == res.data.sex) {
                sex = '女';
              }
              self.setData({
                info: res.data,
                sex: sex,
                realname: res.data.real_name,
                mobile: res.data.mobile,
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