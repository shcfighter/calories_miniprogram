var _ = require('../../../utils/tools');
Page({
	data: {},
	//事件处理函数
	link_userinfo: function() {
		_.post('/rest/order/card/open', {}, function(res) {
			let cardList = res.data.cardList;
			wx.openCard({
				cardList: cardList,
				success: function(res) {
					console.log(res);
				}
			})
		});
	},
	link_viparch: function() {
		_.post('/rest/order/coupon/open', {}, function(res) {
			let cardList = res.data.cardList;
			wx.openCard({
				cardList: cardList,
				success: function(res) {
					console.log(res);
				}
			})
		});
	},
	link_order: function() {
		wx.navigateTo({
			url: '/pages/mine/myorder/myorder'
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
		_.post('/rest/user/me', {}, function(res) {
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
