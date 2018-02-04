// pages/demand/add/add.js
const app = getApp()
const url = app.globalData.serverUrl + "/api/demands"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    content: null,
    adding: false,
    date:null,
    typeArray:[
      { id: 0, name:'老股转让'},
      { id: 1, name:'约调研'},
      { id: 2, name:'约投资'},
      { id: 3, name:'股权抵押'},
      { id: 4, name:'其他'}
    ],
    index:0
  },
  bindTypeChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  confirmTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  confirmContent: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  add: function () {
    if (!this.check()) {
      console.info("有输为空");
      return;
    }
    if (this.data.adding) {
      return;
    }
    this.setData({
      adding: true
    });
    wx.request({
      url: url,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        'type':this.data.index,
        title: this.data.title,
        content: this.data.content,
        publishDate: Date.now(),
        status: 0,
        publisherId: app.globalData.topUser.id,
        verifyId:0,
        invalidDate:this.data.date,
        publisherNickName: this.globalData.userInfo.nickname
      },
      success: res => {
        console.info(res);
        wx.showToast({
          title: '添加完成',
          icon: 'success',
          duration: 2000
        })
      },
      complete: () => {
        this.setData({
          adding: false
        });
      }
    })
  },

  check: function () {
    if (this.data.title == null || this.data.content == null) {
      return false;
    }
    return true;
  },

  bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date:'2018-02-03'
    });
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