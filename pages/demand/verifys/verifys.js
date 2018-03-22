// pages/demand/verifys/verifys.js
const app = getApp()
const url = app.globalData.serverUrl + "/demands"
const pageSize = app.globalData.pageSize
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    searchTitle: '',
    demands: [],
    nextPage: 0,
    currentPageSize: 0,
    loading: false,
    bottom: false,
    selectIndex: -1
  },
  init: function () {
    this.setData({
      demands: [],
      nextPage: 0,
      currentPageSize: 0,
      bottom: false,
      selectIndex: -1
    })
  },
  indexArray: function (arr) {
    var i = 0;
    arr.forEach(function (value) {
      value['index'] = i++;
    });
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      searchTitle: ""
    });
    this.init();
  },
  inputTyping: function (e) {
    this.setData({
      searchTitle: e.detail.value
    });
    this.init();
    // if(e.detail.value.length == 0){
    //   this.hideInput();
    // }
  },
  search: function () {
    this.hideInput();
    this.init();
    this.getDemands();
  },
  getDemands: function (fresh = false) {
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: {
        title: this.data.searchTitle,
        verify: 0,
        page: this.data.nextPage,
        size: pageSize
      },
      success: res => {
        console.log(res.data)
        this.data.demands = this.data.demands.concat(res.data);
        this.indexArray(this.data.demands);
        this.setData({
          demands: this.data.demands
        })
        if (this.data.currentPageSize < app.globalData.pageSize) {
          this.setData({
            bottom: true
          })
        }
        this.data.nextPage = this.data.nextPage + 1
        this.data.currentPageSize = res.data.length;
        console.log('next page:' + this.data.nextPage + ' size:' + this.data.currentPageSize)
      },
      complete: () => {
        wx.hideNavigationBarLoading();
        if (fresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  removeItem: function () {
    if (this.data.selectIndex > -1) {
      this.data.demands.splice(this.data.selectIndex, 1);
      this.indexArray(this.data.demands);
      this.setData({
        demands: this.data.demands
      });
    }
  },
  detail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    this.setData({
      selectIndex: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '../verify/verify?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemands();
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
    this.init();
    this.getDemands(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loading) {
      return
    }
    if (this.data.currentPageSize === app.globalData.pageSize) {
      this.setData({
        loading: true
      })
      this.getDemands()
    } else {
      console.log("have no demands!");
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})