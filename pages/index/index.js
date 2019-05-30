var app = getApp();
var _ = require('../../utils/tools');
Page({
	data: {
		indexBgSrc: '/img/home_top_bg.jpg',
		index2ndBg: '/img/home_content2-80.jpg',
		slogan: "TO BE THE BEST YOURSELF",
		title: '专业定制属于您的饮食计划',
		subTitle: '全程一对一',
    keyword: '',
		tiYanTitle: '体验券',
		tiYanLogo: '/img/__home_icon_05.png',
		slider: [],
		swiperCurrent: 0,
		slider2: [],
		swiperCurrent2: 0,
	},
	start: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
	},
	swiperChange: function(e) {
		this.setData({
			swiperCurrent: e.detail.current
		})
	},
	changeEvent: function(e) {
		var index = e.currentTarget.id;
		this.setData({
			swiperCurrent: index
		})
	},
	swiperChange2: function(e) {
		this.setData({
			swiperCurrent2: e.detail.current
		})
	},
	changeEvent2: function(e) {
		var index2 = e.currentTarget.id;
		this.setData({
			swiperCurrent2: index2
		})
	},
	linkTo: function(e) {
		wx.navigateTo({
      url: '/pages/search/search'
		})
	},
  toSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
	tiyanDetail: function(e) {
		var id = e.currentTarget.id;
		var list = this.data.tiyan_list;
		wx.navigateTo({
			url: '/pages/experience/detail/detail?productId=' + list[id]._id,
		})
	},
	VIPDetail: function(e) {
		var id = e.currentTarget.id;
		var list = this.data.VIP_list;
		console.log(list, id)
		wx.navigateTo({
			url: '/pages/experience/detail/detail?productId=' + list[id]._id+'&vip=VIP',
		})
	},
    callTap: function () {
        wx.makePhoneCall({
            phoneNumber: '15522488061',
        })
    },
	onLoad: function(options) {
		let self = this;
	},
	onPullDownRefresh: function() {
		this.onLoad();
		wx.stopPullDownRefresh();
	}
})