// pages/views/viparch/viparch.js
Page({
    data: {
        archinfo: {
            arch_name: "单人一对一私教3节体验套餐(1周内)",
            arch_indate: "2017-08-08",
            arch_price: "100",
            arch_img: "/img/__course_img01.jpg"
        },
        arch_detail: {
            arch_tel: "13856789560",
            arch_number: "688908",
            order_code: "359878479",
            order_creattime: "2017-06-06 20:56",
            order_img: "/img/ewm.png"
        }
    },
    onLoad: function (options) {

    },
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    }
})