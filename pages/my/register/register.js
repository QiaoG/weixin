// pages/my/register/register.js
const util = require('../../../utils/util');
const app = getApp();
const url = app.globalData.serverUrl + "/wx";
const userUrl = app.globalData.serverUrl + "/api/user";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    userInfo: {},
    hasUserInfo: false,
    sessionKey: null,
    iv: null,
    encData: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: 8,
    enterpriseType: [
      { id: 0, name: '挂牌企业' },
      { id: 1, name: '投资机构' },
      { id: 2, name: '财务顾问' },
      { id: 3, name: '证劵公司' },
      { id: 4, name: '分析师' },
      { id: 5, name: '上市公司' },
      { id: 6, name: '其他机构' },
      { id: 7, name: '个人用户' },
      { id: 8, name: '请选择' }
    ],
  },
  bindTypeChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  getUserInfos: function (e) {
    if (typeof (e.detail.iv) == "undefined") {
      wx.showModal({
        title: '提示',
        content: '程序需要获取用户别名，请授权！',
        showCancel: false
      })
      return
    }
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.setData({
      step: 2
    })
  },

  getPhoneNumber: function (e) {
    if (typeof (e.detail.iv) == "undefined") {
      wx.showModal({
        title: '提示',
        content: '程序需要获取用户手机号，请授权！',
        showCancel: false
      })
      return
    }
    this.setData({
      iv: e.detail.iv,
      encData: e.detail.encryptedData
    })
    this.checkSession()
  },
  checkSession: function () {
    var that = this;
    wx.checkSession({
      success: function () {
        console.info("session没有过期")
        that.bindPhone()
      },
      fail: function () {
        console.info("session已经过期，重新登陆")
        wx.login({
          success: res => {
            app.globalData.sessionCode = res.code
            that.bindPhone()
          }
        })
      }
    })
  },
  bindPhone: function () {
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: url + "/sessionKey",
      data: { 'code': app.globalData.sessionCode },
      success: res => {
        console.log(res)
        if (res.data.code != 0) {
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false
          })
        } else {
          this.data.sessionKey = res.data.data.sessionKey;
          wx.request({
            url: url + "/dcymobile",
            data: {
              'key': that.data.sessionKey,
              'encData': that.data.encData,
              'iv': that.data.iv,
              'nickname': that.data.userInfo.nickName,
              'avatarUrl': that.data.userInfo.avatarUrl
            },
            success: res => {
              console.info(res);
              if (res.data.code != 0) {
                wx.hideLoading();
                wx.showModal({
                  title: '错误',
                  content: res.data.message,
                  showCancel: false
                })
              } else {
                if (res.data.data.verifyCount > 0) {
                  wx.showTabBarRedDot({
                    index: 2
                  });
                }
                app.globalData.topUser = res.data.data;
                app.globalData.manager = res.data.data.role.split('|')[0] < 2;
                this.setData({
                  step: 3
                })
                console.info('create user success!' + this.data.step + ' ' + this.data.canIUse + ' ' + app.globalData.manager)
              }
            },
            complete: () => {
              wx.hideLoading();
            }
          })
        }
      },
      fail: res => {
        console.info(res);
        wx.hideLoading();
      }
    })
  },

  add: function (e) {
    if (this.data.index == 8) {
      wx.showModal({
        title: '错误',
        content: '请选择用户类型！',
        showCancel: false
      })
      return;
    }
    var form = e.detail.value;
    if (util.myTrim(form.email).length > 0 && !util.isEmail(form.email)) {
      wx.showModal({
        title: '错误',
        content: '电子邮箱格式不正确！',
        showCancel: false
      })
      return;
    }
    if (form.title == null || util.myTrim(form.title).length == 0 ) {
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
        return ;
      }
    }
  
    wx.showLoading({
      title: '',
    })
    var user = app.globalData.topUser;
    user['email'] = form.email;
    if (this.data.index != 7) {
      user['enterprise'] = {};
      user['enterprise']['name'] = form.title;
      user['enterprise']['category'] = this.data.index;
      user['enterprise']['securitiesCode'] = form.code;
      user['job'] = form.job;
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
        prevPage.loginComplete();
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
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        step: 2
      })
    }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        app.globalData.sessionCode = res.code
        // this.loginTop();
      }
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