// pages/my/opinion/opinion.js
const app = getApp();
const url = app.globalData.serverUrl + "/api/opinion";
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },
  add: function (e) {
    var form = e.detail.value;
    if (form.content == null || util.myTrim(form.content).length < 20) {
      wx.showModal({
        title: '错误',
        content: '意见说明至少20个字符！',
        showCancel: false
      })
      return;
    }
    
    var data = {
      content: form.content,
      userName: app.globalData.topUser.nickname,
      contact: app.globalData.topUser.mobile + ',' + (app.globalData.topUser.email ? app.globalData.topUser.email:'')
    }
    console.info(data);
    wx.request({
      url: url,
      method: 'POST',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      data: data,
      success: res => {
        console.info(res);
        wx.showToast({
          title: '意见提交成功！',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack({
          delta: 1
        }) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.stopPullDownRefresh();
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