// pages/news/verify/verify.js
const app = getApp()
const newsUrl = app.globalData.serverUrl + "/api/news"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:null,
    newsId:null
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

  verify:function(){
    this.data.news['status']=1;
    this.data.news['publisherId'] = app.globalData.topUser.id;
    wx.request({
      url: newsUrl + '/' + this.data.newsId,
      method: 'PUT',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data: this.data.news,
      success: res => {
        console.info(res);
        wx.showToast({
          title: '审核完成',
          icon: 'success',
          duration: 2000
        });
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        var pprePage = pages[pages.length - 3];
        pprePage.refreshCount();
        prevPage.search();
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  verifyNo: function () {
    this.data.news['status'] = 2;
    this.data.news['publisherId'] = app.globalData.topUser.id;
    wx.request({
      url: newsUrl + '/' + this.data.newsId,
      method: 'PUT',
      data: this.data.news,
      success: res => {
        console.info(res);
        wx.showToast({
          title: '审核完成',
          icon: 'success',
          duration: 2000
        })
      }
    })
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