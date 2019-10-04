var _ = require('./utils/tools');
App({
	data: {
		winWidth: 0,
		winHeight: 0,
	},
	onLaunch: function() {
		console.log('程序开始运行')
		//_.login();
	},
	onShow: function() {
		var self = this;
		wx.getSystemInfo({
			success: function(res) {
				self.data.winWidth = res.windowWidth;
				self.data.winHeight = res.windowHeight;
			}
		});
	},
	onHide: function() {
	},
  globalData: {
    //domain: "http://localhost:8080/",
    domain: "https://calories.healthybeauty360.com/calories/"
  }
})
