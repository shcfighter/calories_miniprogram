// pages/views/userinfo/userinfo.js
var _ = require('../../../utils/tools');
Page({
    data: {},
    onLoad: function (options) {
        let self = this;
        _.post('/rest/product/coupon', {}, function (res) {
            console.log(res);
            self.setData({
                order: res.data
            });
        });
        wx.openCard({
            cardList: [],
        })
    },
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    }
})