const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    currentPageSize: 0,
    newses: []
  },
  getNewses: function () {
    var nextPage = this.data.currentPage + 1;
    var ns = this.data.newses;
    console.log('page:' + nextPage)
    wx.request({
      url: app.globalData.serverUrl + '/newses?page=' + nextPage + '&size=' + app.globalData.pageSize,
      success: res => {
        console.log(ns.concat(res.data))

        this.setData({
          newses: this.data.newses.concat(res.data)
        })
        this.data.currentPage = nextPage
        this.data.currentPageSize = res.data.length;
        console.log('page:' + this.data.currentPage + ' size:' + this.data.currentPageSize)
      }
    })
  },
  detail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewses()

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
    if (this.data.currentPageSize === app.globalData.pageSize) {
      this.getNewses()
    } else {
      console.log("have no newses!")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})