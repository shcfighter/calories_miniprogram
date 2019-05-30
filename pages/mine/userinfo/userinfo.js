// pages/views/userinfo/userinfo.js
var _ = require('../../../utils/tools');
Page({
    data: {
      viptype: 1
    },
    onLoad: function (options) {
        let self = this;
        wx.openCard({
            cardList: [],
        })
    },
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    }
})