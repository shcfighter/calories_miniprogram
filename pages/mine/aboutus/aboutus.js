var $= require('../../../utils/tools');
var WxParse = require('../../../libs/wxParse/wxParse.js');
Page({
    data: {
      aboutus: '卡路里小程序由www.healthybeauty360.com提供。'
    },
    onLoad: function (options) {
      var self=this;
      WxParse.wxParse('html', 'html', this.data.aboutus, self);
        // $.post('/rest/company',{},function(res){
        //     let html = res.data.aboutus;
        //     WxParse.wxParse('html', 'html', html, self);
        // })    
    }
})