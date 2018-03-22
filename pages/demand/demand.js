const app = getApp()
const url = app.globalData.serverUrl + "/demands"
const pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    inputShowed: false,
    searchTitle: '',
    demands: [],
    nextPage: 0,
    currentPageSize: 0,
    loading: false,
    bottom: false,
    lock:false
  },
  init: function () {
    this.data.demands.splice(0, this.data.demands.length);
    this.data.nextPage = 0;
    this.currentPageSize = 0;
    this.data.bottom = false;
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
    this.getDemands(false);
  },
  getDemands: function (fresh) {
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      data: {
        title: this.data.searchTitle,
        verify: 1,
        page: this.data.nextPage,
        size: pageSize
      },
      success: res => {
        this.data.demands = this.data.demands.concat(res.data);
        this.indexArray(this.data.demands);
        this.setData({
          demands: this.data.demands
        })
        
        this.data.nextPage = this.data.nextPage + 1
        this.data.currentPageSize = res.data.length;
        if (this.data.currentPageSize < app.globalData.pageSize) {
          this.setData({
            bottom: true
          })
        }
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
  manage: function (e) {
    if (!this.data.login || !app.globalData.manager) {
      return;
    }
    this.setData({
      lock: true
    });
    var that = this;
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ['删除需求'],
      success: function (res) {
        if (res.cancel) {
          this.setData({
            lock: false
          });
          return;
        }
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确认删除需求吗？',
            success: function (res) {
              that.setData({
                lock:false
              })
              if (res.confirm) {
                that.deleteDemand(id, index);
              }
            }
          })
        }
      }
    });
  },
  deleteDemand: function (id, index) {
    wx.request({
      url: app.globalData.serverUrl + '/api/demands/' + id,
      method: 'DELETE',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      success: res => {
        console.info(res);
        this.data.demands.splice(index, 1);
        this.indexArray(this.data.demands);
        this.setData({
          demands: this.data.demands
        });
      }
    })
  },
  loginComplete: function () {
    this.setData({
      login: true
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
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          login: true
        })
      }
    }
    wx.showNavigationBarLoading();
    this.getDemands(true);
  },

  detail: function (e) {
    if(this.data.lock){
      return;
    }
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
  },
  add: function (e) {
    wx.navigateTo({
      url: this.data.login ? 'add/add' : '../my/register/register',
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
        login: true
      })
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
      this.getDemands(false)
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