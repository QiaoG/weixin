const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    currentPageSize: 0,
    newses: [],
    loading:false
  },
  formatDate:function(s){
    return s.format("yyyy-MM-dd");
  },
  init:function(){
    this.data.currentPage = 0
    this.data.currentPageSize = 0
    this.data.newses.splice(0,this.data.newses.length)
  },
  getNewses: function () {
    var nextPage = this.data.currentPage + 1;
    var ns = this.data.newses;
    console.log('page:' + nextPage)
    wx.request({
      url: app.globalData.serverUrl + '/newses',
      data:{
        verify:1,
        page:nextPage,
        size:app.globalData.pageSize
      },
      success: res => {
        console.log(ns.concat(res.data))
        res.data.forEach(function(value){
          value['createDate'] = value.createDate.split(' ')[0];
        });
        this.setData({
          newses: this.data.newses.concat(res.data)
        })
        this.data.currentPage = nextPage
        this.data.currentPageSize = res.data.length;
        console.log('page:' + this.data.currentPage + ' size:' + this.data.currentPageSize)
      },
      complete:() => {
        console.info("请求结束...");
        this.setData({
          loading: false
        })
      }
    })
  },
  detail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id='+id,
    })
  },
  add:function(e){
    wx.navigateTo({
      url: 'add/add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewses()

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
   * 刷新
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    console.info("刷新....")
    this.init()
    this.getNewses()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loading){
      return
    }
    this.setData({
      loading:true
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