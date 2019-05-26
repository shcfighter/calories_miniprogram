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
        _.post('/rest/user/update',{
            mobile:self.data.mobile,
            realname:self.data.realname,
            sex:self.data.sex
        },function(res){
            console.log(res)
        })
    },
    
    onLoad: function (options) {
        let self = this;
        _.post('/rest/user/get', {}, function (res) {
            console.log(res)
                self.setData({
                    info: res.data,
                    sex:res.data.sex,
                    realname:res.data.realname,
                    mobile:res.data.mobile,
                });
        })
    },
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    }
})