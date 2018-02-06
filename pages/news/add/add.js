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
    adding:false
  },
  init:function(){
    this.setData({
      title:'',
      content:'',
      source:''
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

  confirmContent: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  check:function(){
    if(this.data.title == null || this.data.content == null){
      return false;
    }
    return true;
  },

  add: function () {
    if(!this.check()){
      console.info("有输为空");
      return;
    }
    if(this.data.adding){
      return;
    }
    this.setData({
      adding:true
    });
    wx.request({
      url: url,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data:{
        title:this.data.title,
        newsSource:this.data.source,
        content:this.data.content,
        createDate:Date.now(),
        publisherId:0,
        status: app.globalData.manager?1:0,
        authorId: app.globalData.topUser.id,
        authorNickName: app.globalData.userInfo.nickname
      },
      success:res => {
        console.info(res);
        wx.showToast({
          title: '添加完成',
          icon: 'success',
          duration: 2000
        })
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