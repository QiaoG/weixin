// pages/news/verifys/verifys.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    searchTitle: '',
    currentPage: 0,
    currentPageSize: 0,
    newses: [],
    loading: false,
    bottom: false,
    selectIndex: -1
  },
  init: function () {
    this.setData({
      currentPage: 0,
      currentPageSize: 0,
      newses: [],
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
  },
  search: function () {
    this.hideInput();
    this.init();
    this.getNewses();
  },
  getNewses: function (fresh = false) {
    var ns = this.data.newses;
    console.log('page:' + this.data.currentPage);
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.serverUrl + '/newses',
      data: {
        title: this.data.searchTitle,
        verify: 0,
        page: this.data.currentPage,
        size: app.globalData.pageSize
      },
      success: res => {
        this.data.newses = this.data.newses.concat(res.data);
        this.indexArray(this.data.newses);
        this.setData({
          newses: this.data.newses
        })
        if (this.data.currentPageSize < app.globalData.pageSize) {
          this.setData({
            bottom: true
          })
        }
        this.data.currentPage = this.data.currentPage + 1;
        this.data.currentPageSize = res.data.length;

      },
      complete: () => {
        // console.info("请求结束...");
        this.setData({
          loading: false
        })
        wx.hideNavigationBarLoading();
        if (fresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  detail: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      selectIndex: e.currentTarget.dataset.index
    })
    console.info('select index:' + this.data.selectIndex);
    wx.navigateTo({
      url: '../verify/verify?id=' + id,
    })
  },
  removeItem: function () {
    if (this.data.selectIndex > -1) {
      this.data.newses.splice(this.data.selectIndex, 1);
      this.indexArray(this.data.newses);
      this.setData({
        newses: this.data.newses
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewses();
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
    if (this.data.loading) {
      return;
    }
    this.init();
    this.getNewses(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })
    if (this.data.currentPageSize === app.globalData.pageSize) {
      this.getNewses()
    } else {
      console.log("have no newses!")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})