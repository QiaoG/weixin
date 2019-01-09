// pages/my/individual/individual.js
const util = require('../../../utils/util');
const app = getApp();
const userUrl = app.globalData.serverUrl + "/api/user";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: app.globalData.topUser,
    index: 0,
    enterpriseType: [
      { id: 0, name: '挂牌企业' },
      { id: 1, name: '投资机构' },
      { id: 2, name: '财务顾问' },
      { id: 3, name: '证劵公司' },
      { id: 4, name: '分析师' },
      { id: 5, name: '上市公司' },
      { id: 6, name: '其他机构' },
      { id: 7, name: '个人用户' },
    ],
  },
  bindTypeChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  modify: function (e) {
    var form = e.detail.value;
    if (this.data.index != 7) {
      if (util.myTrim(form.email).length > 0 && !util.isEmail(form.email)) {
        wx.showModal({
          title: '错误',
          content: '电子邮箱格式不正确！',
          showCancel: false
        })
        return;
      }
      if (form.title == null || util.myTrim(form.title).length == 0) {
        wx.showModal({
          title: '错误',
          content: '企业名称输入不正确！',
          showCancel: false
        })
        return;
      }
      if (this.data.index == 0 || this.data.index == 5) {
        if (form.code == null || util.myTrim(form.code).length != 6) {
          wx.showModal({
            title: '错误',
            content: '证劵代码输入不正确！',
            showCancel: false
          })
          return;
        }
      }
    }
    // if (this.data.index != 7) {
    //   if (form.title == null || util.myTrim(form.title).length == 0 || form.code == null || util.myTrim(form.code).length != 6) {
    //     wx.showToast({
    //       title: '标题和证劵代码输入不正确！',
    //       duration: 2000
    //     })
    //     return;
    //   }
    // if (form.job == null || util.myTrim(form.job).length < 2 ) {
    //   wx.showToast({
    //     title: '职务填写不正确！',
    //     duration: 2000
    //   })
    //   return;
    // }
    // }
    wx.showLoading({
      title: '',
    })
    var user = app.globalData.topUser;
    user['email'] = form.email;
    if (this.data.index != 7) {
      if (!this.data.user.enterprise) {
        user['enterprise'] = {};
      }
      user['enterprise']['name'] = form.title;
      user['enterprise']['category'] = this.data.index;
      user['enterprise']['securitiesCode'] = form.code;
      user['job'] = form.job;
    } else {
      user['enterprise'] = null;
    }
    wx.request({
      url: userUrl + '/' + user.id,
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.topUser.token
      },
      data: user,
      success: res => {
        console.info(res);
        wx.hideLoading();
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        wx.navigateBack({
          delta: 1
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(app.globalData.topUser)
    this.setData({
      user: app.globalData.topUser
    })
    if (this.data.user.enterprise) {
      console.info(this.data.user.enterprise.category.split('|')[0]);
      this.setData({
        index: this.data.user.enterprise.category.split('|')[0]
      })
    } else {
      this.setData({
        index: 7
      })
    }
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