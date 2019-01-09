// pages/news/verify/verify.js
const app = getApp()
const newsUrl = app.globalData.serverUrl + "/api/news"
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:null,
    newsId:null,
  },

  getNews: function (id) {
    wx.request({
      url: newsUrl + '/' + id,
      success: res => {
        this.setData({
          news: res.data
        })
        this.data.newsId = id;
      }
    })
  },

  verify:function(pass=true){
    this.data.news['status']=pass?1:2;
    this.data.news['publisherId'] = app.globalData.topUser.id;
    this.data.news['action'] = pass ? 'verify' :'verify_no';
    this.data.news['verifyDate'] = Date.now();
    console.info(this.data.news);
    wx.request({
      url: newsUrl + '/' + this.data.newsId,
      method: 'PUT',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data: this.data.news,
      success: res => {
        console.info(res);
        wx.showToast({
          title: pass?'审核完成':'已经删除',
          icon: 'success',
          duration: 1500
        });
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        var pprePage = pages[pages.length - 3];
        pprePage.refreshCount();
        prevPage.removeItem();
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  verifyNo: function () {
    wx.request({
      url: newsUrl + '/' + this.data.newsId,
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      method: 'DELETE',
      success: res => {
        console.info(res);
        wx.showToast({
          title: '热点已经删除！',
          icon: 'success',
          duration: 1500
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        var pprePage = pages[pages.length - 3];
        pprePage.refreshCount();
        prevPage.removeItem();
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  manage: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['审核通过','审核不通过'],
      success: function (res) {
        if (res.cancel) {
          return;
        }
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确认审核通过吗？',
            success: function (res) {
              if (res.confirm) {
                that.verify();
              }
            }
          })
        }
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '审核不通过将删除，确认吗？',
            success: function (res) {
              console.info(this);
              if (res.confirm) {
                that.verify(false);
              }
            }
          })
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})