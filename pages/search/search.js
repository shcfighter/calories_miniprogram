var app = getApp();
var _ = require('../../utils/tools');
Page({
  data: {
    keyword: '',
    food_list:[],
    hot_keyword: ['苹果', '香蕉', '青菜', '鸡蛋', '西瓜'],
    history_keyword: [],
    isfood: false,
    loadingMoreHidden: true,
    search: '',
    curPage: 1
  },
  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'keyword',
      success: function (res) {
        console.log("onload:" + res.data)
        that.setData({
          history_keyword: res.data.slice(0, 10),
          isfood: false
        });
      },
      fail: function(e){
        that.setData({
          isfood: true
        });
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });
    this.searchFood(this.data.search);
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.searchFood(this.data.search);
  },
  toSearch: function (e) {
    var that = this
    this.setData({
      food_list: [],
      curPage: 1
    });
    that.searchFood(this.data.search)
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
    this.setData({
      search: e.target.dataset.text
    });
    this.searchFood(e.target.dataset.text)
  },
  searchFood: function(keyword) {
    wx.showToast({ 
      title: 'loading',
      icon: 'loading',
      duration: 5000
    })
    this.setData({
      loadingMoreHidden: true,
      isSearch: true
    });
    var that = this;
    _.post('api/food/search', {"keyword": keyword, "curPage":that.data.curPage}, function (res) {
      if (null == res.data || res.data.length <= 0) {
        that.setData({
          loadingMoreHidden: false,
          isSearch: true
        });
      }
      var lists = that.data.food_list;
      for (var d in res.data) {
        lists.push(res.data[d]);
      }
      that.setData({
        isfood: true,
        food_list: lists
      });
      wx.hideToast({ success: true })
      wx.getStorage({
        key: 'keyword',
        success: function (res) {
          var keywords;
          if (null == res.data) {
            keywords = new Array();
          } else {
            keywords = res.data;
          }
          if (!keyword) {
            return ;
          }
          if (keywords.indexOf(that.data.search) < 0) {
            keywords.unshift(that.data.search)
          }
          if (keywords) {
            keywords = keywords.slice(0, 5);
            console.log("keywords:" + keywords);
            wx.setStorageSync('keyword', keywords)
          }
        },
        fail: function () {
          var keywords = new Array();
          keywords.unshift(that.data.search)
          console.log(keywords)
          if ("" != keywords) {
            wx.setStorageSync('keyword', keywords)
          }
        }
      })
    });
  },
  clearHistory: function () {
    var that = this;
    wx.removeStorage({
      key: 'keyword',
      success(res) {
        that.setData({
          history_keyword: []
        });
      }
    })
  }
})