var app = getApp();
var _ = require('../../utils/tools');
Page({
  data: {
    foodId: 0,
    heat_list: [],
    food: {},
    image_url: ''
  },
  onLoad: function (e) {
    var foodId = e.id;
    this.data.foodId = foodId;
    this.setData({
      foodId: foodId
    });
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'api/heat/' + that.data.foodId,
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.status != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false
          })
          return;
        }
        console.log(res.data.items)
        that.setData({
          heat_list: res.data.items
        });
      }
    });
    wx.request({
      url: app.globalData.domain + 'api/food/detail/' + that.data.foodId,
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.status != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false
          })
          return;
        }
        console.log(res.data.items)
        that.setData({
          food: res.data.items,
          image_url: res.data.items.food_url
        });
      }
    })
  },
  toSearch: function (e) {
    console.log("===============================");
    console.log(this.data.search)
    var that = this
    _.post('api/food/search', { "keyword": this.data.search }, function (res) {
      console.log(res)
      console.log(res.data)
      that.setData({
        food_list: res.data
      });
    });
  },
  searchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: '/pages/heat/heat'
    })
  },
  showImage: function (e) {
    var that = this;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [that.data.image_url] // 需要预览的图片http链接列表
    })
  }
})