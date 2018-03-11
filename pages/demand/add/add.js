// pages/demand/add/add.js
const app = getApp()
const url = app.globalData.serverUrl + "/api/demands"
const util = require('../../../utils/util');
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

  add: function (e) {
    var form = e.detail.value;
    if (!this.check(form)) {
      console.info("有输为空");
      return;
    }
    if (this.data.adding) {
      return;
    }
    this.setData({
      adding: true
    });
    wx.showToast({
      title: '新建需求',
      icon: 'loading'
    })
    wx.request({
      url: url,
      method: 'POST',
      header: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.topUser.token },
      data: {
        'type':this.data.index,
        title: form.title,
        content: form.content,
        publishDate: Date.now(),
        status: app.globalData.manager?1:0, 
        publisherId: app.globalData.topUser.id,
        verifyId:0,
        invalidDate:this.data.date+' 00:00:00',
        publisherNickName: app.globalData.topUser.nickname
      },
      success: res => {
        console.info(res);
        // wx.showToast({
        //   title: '添加完成',
        //   icon: 'success',
        //   duration: 2000
        // })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        prevPage.init();
        prevPage.getDemands();
        wx.navigateBack({
          delta: 1
        })
      },
      complete: () => {
        this.setData({
          adding: false
        });
        wx.hideToast();
      }
    })
  },

  check: function (form) {
    if (form.title == null || util.myTrim(form.title).length==0 || form.content == null || util.myTrim(form.content).length==0) {
      wx.showToast({
        title: '标题和内容不能为空！',
        duration: 2000
      })
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