// pages/myorder/myorder.js
var _ = require('../../../utils/tools');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabArr: {
            curHdIndex: 0,
            curBdIndex: 0
        },
    },
    tabFun: function (e) {
        //获取触发事件组件的dataset属性 
        var _datasetId = e.target.dataset.id;
        var _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        this.setData({
            tabArr: _obj
        });
    },
    ling:function(e){
	    var orderId = e.target.dataset.id;
	    if(typeof wx.addCard === 'function') {
		    let url = this.data.tabArr.curHdIndex==0?'/rest/order/coupon/draw':'/rest/order/card/draw';
		    _.post(url, {
			    order_id: orderId
		    }, function(res) {
			    let cardList = res.data.cardList;
			    wx.addCard({
				    cardList: cardList, // 需要添加的卡券列表
				    success: function(res) {
					    var cardList = res.cardList; // 添加的卡券列表信息
                        let url = this.data.tabArr.curHdIndex == 0 ? '/rest/order/coupon/draw' : '/rest/order/card/draw';
					    _.post(url, {
						    order_id: orderId,
						    cardList: cardList
					    }, function(res) {

					    });

				    }
			    });

		    });
	    } else {
		    _.showModal('领取失败', '当前微信版本过低,请升级后领取卡券');
	    }
    },
    shi:function(e){
        var orderId = e.target.dataset.id;      
        let url = this.data.tabArr.curHdIndex == 0 ? '/rest/order/coupon/open' : '/rest/order/card/open'; 
        console.log(orderId) 
        _.post(url, {order_id:orderId}, function (res) {
            let cardList = res.data.cardList;
            wx.openCard({
                cardList: cardList,
                success: function (res) {
                    console.log(res);
                }
            })
        });
    },
    yong:function(){
        wx.showToast({
            title: '已过期',
        })
    },
    onLoad: function (options) {
        let self = this;
        _.post('/rest/order/coupon', {}, function (res) {
            console.log(res);
            self.setData({
                coupon: res.data
            });
        });
        _.post('/rest/order/card', {}, function (res) {
            console.log(res);
            self.setData({
                card: res.data
            });
        });

      
    },
    onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
    }
})