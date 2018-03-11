// pages/demand/detail/detail.js
const app = getApp()
const demandUrl = app.globalData.serverUrl + "/api/demands"
const addDisUrl = app.globalData.serverUrl + "/api/discuss"
const disUrl = app.globalData.serverUrl + "/discusses/bySource"
const pageSize = app.globalData.pageSize
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demand: null,
    demandId: null,
    discussNextPage: 0,
    discussCurrentPageSize: 0,
    discusses: [],
    discnt:''
  },

  getDemand: function (id) {
    wx.request({
      url: demandUrl + '/' + id,
      success: res => {
        this.setData({
          demand: res.data
        })
        this.data.demandId = id;
        this.getDiscusses(id)
      }
    })
  },
  init:function(){
    this.data.discussNextPage=0;
    this.data.discussCurrentPageSize=0;
    this.data.discusses.splice(0, this.data.discusses.length);
  },
  getDiscusses: function (newsId) {
    var offset = this.data.discussNextPage * pageSize;
    wx.request({
      url: disUrl,
      data:{
        status:1,
        source: newsId,
        offset:offset,
        type: 1,
        size: pageSize
      },
      success: res => {
        console.log(res.data)
        this.setData({
          discusses: this.data.discusses.concat(res.data)
        })
        this.data.discussNextPage = this.data.discussNextPage + 1
        this.data.discussCurrentPageSize = this.data.discusses.length
        console.log(this.data.discussNextPage + ',' + this.data.discussCurrentPageSize)
      }
    })
  },
  addDiscuss: function(e){
    var dis = {};
    dis['discussSource']=this.data.demandId;
    dis['sourceType'] = 1;
    dis['content'] = e.detail.value.content;
    dis['createDate'] = Date.now();
    dis['authorId'] = app.globalData.topUser.id;
    dis['authorNickName'] = app.globalData.topUser.nickname;
    dis['status'] = app.globalData.manager ? 1 : 0;
    dis['sourceTitle']=this.data.demand.title;
    wx.request({
      url: addDisUrl,
      method:'POST',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data:dis,
      success:res => {
        console.info(res);
        wx.showToast({
          title: '评论提交成功',
          icon: 'success',
          duration: 2000
        });
        this.init();
        this.setData({
          discnt: ''
        });
        this.getDiscusses(this.data.demandId )
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemand(options.id)
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