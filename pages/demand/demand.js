const app = getApp()
const url = app.globalData.serverUrl + "/demands"
const pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    demands:[],
    nextPage:0,
    currentPageSize:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: url + '?page=' + this.data.nextPage + '&size=' + pageSize,
      success: res => {
        console.log(res.data)
        this.setData({
          demands: this.data.demands.concat(res.data)
        })
        this.data.nextPage = this.data.nextPage + 1
        this.data.currentPageSize = res.data.length;
        console.log('next page:' + this.data.nextPage + ' size:' + this.data.currentPageSize)
      }
    })
  },

  detail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
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