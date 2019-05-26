var $= require('../../../utils/tools');
var WxParse = require('../../../libs/wxParse/wxParse.js');
Page({
    data: {
        aboutus: '"卡路里国际健身工作室"主要为天津地区中高端人群和外籍人士提供全程教练指导的健身服务。我们针对亚健康的上午人士、白领和一直忙于生意上的老板们帮助达到减脂瘦身、苏醒增肌、腰腹控制、身体平衡能力、增强体质、改善亚健康效果的目的。倡导运动+营养饮食的养生观念。主要课程有:减脂塑形、康复矫正不良体型、增肌塑形、减脂减肥、局部塑形、新妈妈产后恢复等。'
    },
    onLoad: function (options) {
        var self=this;
        $.post('/rest/company',{},function(res){
            let html = res.data.aboutus;
            WxParse.wxParse('html', 'html', html, self);
        })    
    }
})