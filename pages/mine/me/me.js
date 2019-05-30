var _ = require('../../../utils/tools');
Page({
	data: {
    vip: false
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
    _.exec('api/user/get', 'get', {}, function(res) {
			console.log(res)
			self.setData({
				me: res.data
			});
		});
	},
	onPullDownRefresh: function () {
		this.onLoad();
		wx.stopPullDownRefresh();
	}
})
