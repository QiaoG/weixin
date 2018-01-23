// pages/demand/detail/detail.js
const app = getApp()
const demandUrl = app.globalData.serverUrl + "/api/demands"
const disUrl = app.globalData.serverUrl + "/api/discuss/search/sourceAndType"
const pageSize = app.globalData.pageSize
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demand: null,
    demandId: null,
    discussNextPage: 0,
    discussCurrentPageSize: 0,
    discusses: []
  },
  getDemand: function (id) {
    wx.request({
      url: demandUrl + '/' + id,
      success: res => {
        this.setData({
          demand: res.data
        })
        this.data.demandId = id;
        this.getDiscusses(id)
      }
    })
  },
  getDiscusses: function (newsId) {
    wx.request({
      url: disUrl + '?source=' + newsId + '&type=1&offset=' + (this.data.discussNextPage * pageSize) + '&size=' + pageSize,
      success: res => {
        console.log(res.data._embedded.discusses)
        this.setData({
          discusses: this.data.discusses.concat(res.data._embedded.discusses)
        })
        this.data.discussNextPage = this.data.discussNextPage + 1
        this.data.discussCurrentPageSize = this.data.discusses.length
        console.log(this.data.discussNextPage + ',' + this.data.discussCurrentPageSize)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemand(options.id)
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