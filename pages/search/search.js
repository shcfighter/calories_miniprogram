var app = getApp();
var _ = require('../../utils/tools');
Page({
  data: {
    keyword: '',
    food_list:[],
    history_keyword: [],
    isfood: false
  },
  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'keyword',
      success: function (res) {
        console.log("onload:" + res.data)
        that.setData({
          history_keyword: res.data.slice(0, 20)
        });
      },
      fail: function(e){
        console.log(e)
      }
    })
  },
  toSearch: function (e) {
    var that = this
    _.post('api/food/search', {"keyword": this.data.search}, function (res) {
      that.setData({
        isfood: true,
        food_list: res.data
      }); 
    });
    wx.getStorage({
      key: 'keyword',
      success: function (res) {
        var keywords;
        if (null == res.data) {
          keywords = new Array();
        } else {
          keywords = res.data;
        }
        if (keywords.indexOf(that.data.search) < 0) {
          keywords.unshift(that.data.search)
        }
        wx.setStorageSync('keyword', keywords)
      },
      fail: function () {
        var keywords = new Array();
        keywords.unshift(that.data.search)
        wx.setStorageSync('keyword', keywords)
      }
    })
  },
  searchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  toDetailsTap: function (e){
    var foodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/heat/heat?id=' + foodId
    })
  },
  bindtapFunc: function (e) {
    var that = this;
    console.log(e.target.dataset.text)
    _.post('api/food/search', { "keyword": e.target.dataset.text }, function (res) {
      that.setData({
        isfood: true,
        food_list: res.data
      });
    });
  }
})