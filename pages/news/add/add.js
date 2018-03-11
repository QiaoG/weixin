// pages/news/add/add.js
const app = getApp();
const url = app.globalData.serverUrl + "/api/news";
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree:false,
    title: '',
    content: '',
    source:'',
    code:'',
    tip:'',
    adding:false
  },
  init:function(){
    this.setData({
      title:'',
      content:'',
      source:'',
      code:''
    })
  },
  bindAgreeChange:function(e){
    console.info(e.detail.value.length);
    this.setData({
      isAgree: e.detail.value.length
    });
  },
  confirmTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  confirmSource: function (e) {
    this.setData({
      source: e.detail.value
    });
  },

  confirmCode: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  confirmContent: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  check:function(form){
    console.info(form);
    if(form.title == null || util.myTrim(form.title).length==0){
      wx.showToast({
        title: '标题不能为空！',
        duration: 2000
      })
      return false;
    }
    // if (form.code == null || util.myTrim(form.code).length != 6) {
    //   wx.showToast({
    //     title: '证劵代码为6位数字！',
    //     duration: 2000
    //   })
    //   return false;
    // }
    if (form.content == null || util.myTrim(form.content).length == 0) {
      wx.showToast({
        title: '内容不能为空！',
        duration: 1500
      })
      return false;
    }
    return true;
  },

  add: function (e) {
    var form = e.detail.value;
    if (!this.check(e.detail.value)){
      console.info("输为不合乎要求");
      return;
    }
    if(this.data.adding){
      return;
    }
    this.setData({
      adding:true
    });
    wx.showToast({
      title: '新建热点',
      icon:'loading'
    })
    wx.request({
      url: url,
      method: 'POST',
      header: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.topUser.token  },
      data:{
        title:form.title,
        newsSource:form.source,
        code:form.code,
        content:form.content,
        createDate:Date.now(),
        publisherId:0,
        status: app.globalData.manager?1:0,
        authorId: app.globalData.topUser.id,
        authorNickName: app.globalData.topUser.nickname
      },
      success:res => {
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
        prevPage.getNewses();
        wx.navigateBack({
          delta:1
        })
      },
      complete:() => {
        this.setData({
          adding:false
        });
        wx.hideToast();
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