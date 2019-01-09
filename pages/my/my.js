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
    opinionNum:0,
    manager: false,
    total:0
  },
  refreshCount: function (fresh=false) {
    wx.showNavigationBarLoading();
    wx.request({
      url: urlNum,
      success: res => {
        this.data.total = res.data.newsCount + res.data.demandCount + res.data.discussCount + res.data.opinionCount;
        console.info(res.data);
        if (this.data.total > 0) {
          wx.showTabBarRedDot({
            index: 2
          });
        } else {
          wx.hideTabBarRedDot({
            index: 2
          });
        }
        this.setData({
          newsNum: res.data['newsCount'],
          demandNum: res.data['demandCount'],
          discussNum: res.data['discussCount'],
          opinionNum: res.data['opinionCount']
        });
      },
      complete:() => {
        wx.hideNavigationBarLoading();
        if(fresh){
          wx.stopPullDownRefresh();
        }
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
  registe:function(){
    wx.navigateTo({
      url: 'register/register',
    })
  },
  /**
   * 个人信息
   */
  individual:function(){
    wx.navigateTo({
      url: 'individual/individual',
    })
  },
  /**
   * 意见反馈
   */
  opinion:function(){
    wx.navigateTo({
      url: this.data.manager?'opinions/opinions':'opinion/opinion',
    })
  },
  /**
   * 关于我们
   */
  about:function(){
    wx.navigateTo({
      url: 'about/about',
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
      if (this.data.manager) {
        this.refreshCount();
      }
    } 
  },

  loginComplete: function () {
    this.setData({
      login: true
    })
    this.setData({
      manager: app.globalData.topUser.role.split('|')[0] < 2
    });
    if (this.data.manager) {
      this.refreshCount();
    }
  },

  loginTop: function () {
    wx.showLoading({
      title: '登陆',
    })
    wx.request({
      url: app.globalData.serverUrl + '/wx/login',
      data: {
        'code': app.globalData.sessionCode
      },
      success: res => {
        console.info(res.data);
        if (res.data.data) {
          this.globalData.topUser = res.data.data;
          this.globalData.manager = res.data.data.role.split('|')[0] < 2;
          if (res.data.data.verifyCount > 0) {
            wx.showTabBarRedDot({
              index: 2,
              success: res => {
                console.info(res);
              },
              fail: res => {
                console.info(res)
              }
            });
          }
        } else {
          console.info('用户不存在！');
        }
        if (app.globalData.topUser) {
          this.setData({
            login: true
          })
          this.setData({
            manager: app.globalData.topUser.role.split('|')[0] < 2
          });
          if (this.data.manager) {
            this.refreshCount(true);
          }
        } 
      },
      complete: () => {
        wx.hideLoading();
        console.info(this.globalData.topUser ? 'logined' : 'no logined');
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
    if (app.globalData.topUser) {
      this.setData({
        login:true
      });
    }
    if (this.data.total > 0) {
      wx.showTabBarRedDot({
        index: 2
      });
    } else {
      wx.hideTabBarRedDot({
        index: 2
      });
    }
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
    if (app.globalData.topUser) {
      this.setData({
        login: true
      })
      this.setData({
        manager: app.globalData.topUser.role.split('|')[0] < 2
      });
      if (this.data.manager) {
        this.refreshCount(true);
      }else{
        wx.stopPullDownRefresh();
      }
    }else{
      //wx.stopPullDownRefresh();
    }
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