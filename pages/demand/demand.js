const app = getApp()
const url = app.globalData.serverUrl + "/demands"
const pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    searchTitle:'',
    demands:[],
    nextPage:0,
    currentPageSize:0,
    loading:false
  },
  init:function(){
    this.data.demands.splice(0,this.data.demands.length);
    this.data.nextPage = 0;
    this.currentPageSize = 0;
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      searchTitle: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      searchTitle: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      searchTitle: e.detail.value
    });
  },
  getDemands:function(){
    wx.request({
      url: url,
      data:{
        title: this.data.searchTitle,
        verify: 1,
        page: this.data.nextPage,
        size: pageSize
      },
      success: res => {
        console.log(res.data)
        this.setData({
          demands: this.data.demands.concat(res.data)
        })
        this.data.nextPage = this.data.nextPage + 1
        this.data.currentPageSize = res.data.length;
        console.log('next page:' + this.data.nextPage + ' size:' + this.data.currentPageSize)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemands();
  },

  detail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
  },
  add: function (e) {
    wx.navigateTo({
      url: 'add/add',
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
    this.init();
    this.getDemands();
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