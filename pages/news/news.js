const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login:false,
    inputShowed: false,
    searchTitle:'',
    nextPage: 0,
    pageSize: 0,
    newses: [],
    loading:false
  },
  formatDate:function(s){
    return s.format("yyyy-MM-dd");
  },
  init:function(){
    this.data.nextPage = 0
    this.data.pageSize = 0
    this.data.newses.splice(0,this.data.newses.length)
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
  },
  inputTyping: function (e) {
    this.setData({
      searchTitle: e.detail.value
    });
    this.init();
    // if (e.detail.value.length == 0) {
    //   this.hideInput();
    // }
  },
  search: function () {
    this.init();
    this.getNewses();
    this.hideInput();
  },
  getNewses: function () {
    this.setData({
      loading: true
    })
    var ns = this.data.newses;
    console.log('page:' + this.data.nextPage+' title:'+this.data.searchTitle);
    wx.request({
      url: app.globalData.serverUrl + '/newses',
      data:{
        title:this.data.searchTitle,
        verify:1,
        page:this.data.nextPage,
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
        this.data.nextPage = this.data.nextPage+1;
        this.data.pageSize = res.data.length;
        console.log('page:' + this.data.nextPage + ' size:' + this.data.pageSize)
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
      url: this.data.login?'add/add':'../my/register/register',
    })
  },

  loginComplete: function () {
    this.setData({
      login: true
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
    if (app.globalData.topUser){
     this.setData({
      login:true
     })
    }else{
      app.userInfoReadyCallback = res => {
        console.info('app ready call back: ' + JSON.stringify(res));
        this.setData({
          login: true
        })
      }
    }
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
    console.info("到底 触发 next page");
    if(this.data.loading){
      return
    }
    if (this.data.pageSize === app.globalData.pageSize) {
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