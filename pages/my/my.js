// pages/my/my.js
const app = getApp();
const url = app.globalData.serverUrl + "/wx";
const urlNum = app.globalData.serverUrl + "/statistics/verifyCount";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    newsNum: 0,
    demandNum: 0,
    discussNum: 0,
    manager: false
  },
  refreshCount: function () {
    wx.request({
      url: urlNum,
      success: res => {
        console.info(res.data['newsCount']);
        this.setData({
          newsNum: res.data['newsCount'],
          demandNum: res.data['demandCount'],
          discussNum: res.data.discussCount
        });
      }
    })
  },
  verifyNews: function () {
    wx.navigateTo({
      url: '../news/verifys/verifys',
    })
  },

  verifyDemands: function () {
    wx.navigateTo({
      url: '../demand/verifys/verifys',
    })
  },
  verifyDiscuss: function () {
    wx.navigateTo({
      url: '../discuss/verify/verify',
    })
  },
  userManage: function () {
    wx.navigateTo({
      url: '../user/userManage',
    })
  },
  myDiscuss: function () {
    wx.navigateTo({
      url: 'discusses/discusses',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.topUser) {
      this.setData({
        login: true
      })
      this.setData({
        manager: app.globalData.topUser.role.split('|')[0] < 2
      });
      this.refreshCount();
    }else{
      wx.navigateTo({
        url: 'register/register',
      })
    }
  },

  loginComplete:function(){
    this.setData({
      login: true
    })
    this.setData({
      manager: app.globalData.topUser.role.split('|')[0] < 2
    });
    this.refreshCount();
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