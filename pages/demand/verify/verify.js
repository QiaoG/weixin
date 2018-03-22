// pages/demand/verify/verify.js
const app = getApp()
const demandUrl = app.globalData.serverUrl + "/api/demands"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demand: null,
    demandId: null
  },

  verify: function () {
    this.data.demand['status'] = 1;
    this.data.demand['verifyId'] = app.globalData.topUser.id;
    wx.request({
      url: demandUrl + '/' + this.data.demandId,
      method: 'PUT',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data: this.data.demand,
      success: res => {
        console.info(res);
        wx.showToast({
          title: '审核完成',
          icon: 'success',
          duration: 2000
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        var pprePage = pages[pages.length - 3];
        pprePage.refreshCount();
        prevPage.removeItem();
        wx.navigateBack({
          delta: 1
        })
      },
      complete:() =>{
        console.info(this.data.demand);
      }
    })
  },
  verifyNo: function () {
    wx.request({
      url: demandUrl + '/' + this.data.demandId,
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      method: 'DELETE',
      success: res => {
        console.info(res);
        wx.showToast({
          title: '需求已经删除！',
          icon: 'success',
          duration: 1500
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        var pprePage = pages[pages.length - 3];
        pprePage.refreshCount();
        prevPage.removeItem();
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  getDemand: function (id) {
    wx.request({
      url: demandUrl + '/' + id,
      success: res => {
        this.setData({
          demand: res.data
        })
        this.data.demandId = id;
      }
    })
  },
  manage: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['审核通过', '审核不通过'],
      success: function (res) {
        if (res.cancel) {
          return;
        }
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确认审核通过吗？',
            success: function (res) {
              if (res.confirm) {
                that.verify();
              }
            }
          })
        }
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '审核不通过将删除，确认吗？',
            success: function (res) {
              console.info(this);
              if (res.confirm) {
                that.verifyNo();
              }
            }
          })
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemand(options.id);
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