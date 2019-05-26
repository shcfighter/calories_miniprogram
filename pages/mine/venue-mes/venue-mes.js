// pages/venue-mes/venue-mes.js
var _ = require('../../../utils/tools');
var WxParse = require('../../../libs/wxParse/wxParse.js');
Page({
    data: {
        curr: 1
    },
    swiperChange: function (e) {
        var index = e.detail.current;
        this.setData({
            curr: e.detail.current+1
        });
    },
    callmeTap: function () {
        var num = this.data.msg.service_phone;
        wx.makePhoneCall({
            phoneNumber: num,
        })
    },
    showNav: function () {
        var str = this.data.msg.location;
        var arr=str.split(',');
        wx.openLocation({
            latitude: arr[0],
            longitude: arr[1],
            name: this.data.msg.name,
            address: this.data.msg.address,
            scale: 16
        })
    },
    onLoad: function (options) {
        let self = this;
        _.post('/rest/company', {}, function (res) {
            let html = res.data.aboutus;
            WxParse.wxParse('html', 'html', html, self);
            console.log(res);
            self.setData({
                msg: res.data
            });
        });
    }
})