// pages/my/opinions/opinions.js
const app = getApp();
const urlFind = app.globalData.serverUrl + "/opinions/findAll";
const urlOne = app.globalData.serverUrl + "/api/opinion";
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opinions: [],
    nextPage: 0,
    pageSize: 0,
    searching:false,
    bottom: false
  },
  init: function () {
    this.setData({
      nextPage: 0,
      pageSize: 0,
      bottom:false,
      opinions: []
    })
  },
  findOpinions: function (fresh) {
    wx.showNavigationBarLoading();
    this.data.searching = true;
    wx.request({
      url: urlFind,
      data: {
        page: this.data.nextPage,
        size: app.globalData.pageSize
      },
      success: res => {
        console.log(res.data)
        res.data.forEach(function (value) {
          value['createTime'] = value.createTime.split(' ')[0];
        });
        this.data.opinions = this.data.opinions.concat(res.data);
        util.indexArray(this.data.opinions);
        this.setData({
          opinions: this.data.opinions
        })
        this.data.nextPage = this.data.nextPage + 1;
        this.data.pageSize = res.data.length;
        if (this.data.pageSize < app.globalData.pageSize) {
          this.setData({
            bottom: true
          })
        }
      },
      complete: () => {
        this.data.searching = false;
        wx.hideNavigationBarLoading();
        if (fresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  
  deleteOpinion: function (id, index) {
    wx.showNavigationBarLoading();
    wx.request({
      url: urlOne + '/'+id,
      method: 'DELETE',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      success: res => {
        wx.showToast({
          title: '意见删除成功',
          icon: 'success',
          duration: 2000
        });
        this.data.opinions.splice(index, 1);
        util.indexArray(this.data.opinions);
        this.setData({
          opinions: this.data.opinions
        });
      },
      complete:() => {
        wx.hideNavigationBarLoading();
      }
    })
  },
  manage: function (e) {
    console.info(e.currentTarget)
    if (!app.globalData.manager) {
      return;
    }
    var that = this;
    var item = e.currentTarget.dataset.item;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确认删除所选反馈意见吗？',
            success: function (res) {
              if (res.confirm) {
                that.deleteOpinion(item.id, item.index);
              }
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findOpinions(false);
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
    if (this.data.searching){
      return;
    }
    this.init();
    this.findOpinions(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageSize === app.globalData.pageSize) {
      this.findAll(false)
    }
    this.findOpinions(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})