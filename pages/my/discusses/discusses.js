// pages/my/discusses/discusses.js
const app = getApp()
const url = app.globalData.serverUrl + "/discusses/byAuthor"
const api = app.globalData.serverUrl + "/api/discuss"
const pageSize = app.globalData.pageSize
var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["热点评论", "需求评论"],
    searchTitle0: '',
    searchTitle1: '',
    inputShowed0: false,
    inputShowed1: false,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    discusses0: [],
    discusses1: [],
    init0: false,
    init1: false,
    nextPage0: 0,
    nextPage1: 0,
    currentPageSize0: 0,
    currentPageSize1: 0,
    loading0: false,
    loading1: false
  },

  init: function (index) {
    if (index === 0) {
      this.setData({
        nextPage0: 0,
        currentPageSize0: 0,
        discusses0: []
      })
    }
    if (index === 1) {
      this.setData({
        nextPage1: 0,
        currentPageSize1: 0,
        discusses1: []
      })
    }
  },

  showInput0: function () {
    this.setData({
      inputShowed0: true
    });
  },
  hideInput0: function () {
    this.setData({
      inputShowed0: false
    });
  },
  clearInput0: function () {
    this.setData({
      searchTitle0: ""
    });
    this.init(0);
  },
  inputTyping0: function (e) {
    this.setData({
      searchTitle0: e.detail.value
    });
    this.init(0);
    // if (e.detail.value.length == 0) {
    //   this.hideInput0();
    // }
  },
  showInput1: function () {
    this.setData({
      inputShowed1: true
    });
  },
  hideInput1: function () {
    this.setData({
      inputShowed1: false
    });
  },
  clearInput1: function () {
    this.setData({
      searchTitle1: ""
    });
    this.init(1);
  },
  inputTyping1: function (e) {
    this.setData({
      searchTitle1: e.detail.value
    });
    this.init(1);
    // if (e.detail.value.length == 0) {
    //   this.hideInput1();
    // }
  },
  search: function () {
    if (this.data.activeIndex == 0) {
      this.hideInput0();
    } else {
      this.hideInput1();
    }
    this.init(this.data.activeIndex);
    this.findDiscusses();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (!this.data['init' + this.data.activeIndex]) {
      this.findDiscusses();
    }
  },

  findDiscusses: function (fresh = false) {
    this.data['loading' + this.data.activeIndex] = true;
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: {
        author: app.globalData.topUser.id,
        type: this.data.activeIndex,
        title: this.data['searchTitle' + this.data.activeIndex],
        offset: (this.data['nextPage' + this.data.activeIndex] * pageSize),
        size: pageSize,
      },
      success: res => {
        console.log(res.data);
        res.data.forEach(function (value) {
          value['formatDate'] = value.createDate.split(' ')[0];
        });
        if (this.data.activeIndex == 0) {
          this.data.discusses0 = this.data.discusses0.concat(res.data);
          this.indexArray(this.data.discusses0);
          this.setData({
            discusses0: this.data.discusses0,
            nextPage0: this.data.nextPage0 + 1,
            currentPageSize0: res.data.length,
            init0: true
          })
          console.log(this.data.nextPage0 + ',' + this.data.currentPageSize0);
        } else {
          this.data.discusses1 = this.data.discusses1.concat(res.data);
          this.indexArray(this.data.discusses1);
          this.setData({
            discusses1: this.data.discusses1,
            nextPage1: this.data.nextPage1 + 1,
            currentPageSize1: res.data.length,
            init1: true
          })
          console.log(this.data.nextPage1 + ',' + this.data.currentPageSize1)
        }
      },
      complete: () => {
        this.data['loading' + this.data.activeIndex] = false;
        wx.hideNavigationBarLoading();
        if (fresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  },

  deleteDis: function (e) {
    console.info(e.target);
    var u = api + '/' + e.target.dataset.id.id;
    var d = e.target.dataset.id;
    var index = e.target.dataset.id.index;
    wx.request({
      url: u,
      method: 'DELETE',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      success: res => {
        console.info(res);
        if (this.data.activeIndex == 0) {
          this.data.discusses0.splice(d.index, 1);
          this.indexArray(this.data.discusses0);
          this.setData({
            discusses0: this.data.discusses0
          });
        } else {
          this.data.discusses1.splice(d.index, 1)
          this.indexArray(this.data.discusses1);
          this.setData({
            discusses1: this.data.discusses1
          });
        }

        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  indexArray: function (arr) {
    var i = 0;
    arr.forEach(function (value) {
      value['index'] = i++;
    });
  },
  detailNews: function (e) {
    console.info(e.target);
    wx.navigateTo({
      url: '../../news/detail/detail?id=' + e.target.dataset.id,
    })
  },

  detailDemand: function (e) {
    wx.navigateTo({
      url: '../../demand/detail/detail?id=' + e.target.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });

      }
    });
    this.findDiscusses();
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
    this.findDiscusses(true)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.activeIndex===0){
      if (this.data.currentPageSize0 === pageSize){
        this.findDiscusses();
      }
    }else{
      if (this.data.currentPageSize1 === pageSize) {
        this.findDiscusses();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})