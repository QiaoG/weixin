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
    lock:false,
    loading:false,
    bottom:false
  },
  formatDate:function(s){
    return s.format("yyyy-MM-dd");
  },
  init:function(){
    this.setData({
      nextPage:0,
      pageSize:0,
      newses:[]
    })
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
  indexArray: function (arr) {
    var i = 0;
    arr.forEach(function (value) {
      value['index'] = i++;
    });
  },
  search: function () {
    this.init();
    this.getNewses(false);
    this.hideInput();
  },
  getNewses: function (fresh) {
    this.setData({
      loading: true
    })
    var ns = this.data.newses;
    console.log('page:' + this.data.nextPage+' title:'+this.data.searchTitle);
    wx.showNavigationBarLoading();
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
        this.data.newses = this.data.newses.concat(res.data);
        this.indexArray(this.data.newses);
        this.setData({
          newses: this.data.newses
        })
        this.data.nextPage = this.data.nextPage+1;
        this.data.pageSize = res.data.length;
        if (this.data.pageSize < app.globalData.pageSize){
          this.setData({
            bottom:true
          })
        }
        console.log('page:' + this.data.nextPage + ' size:' + this.data.pageSize)
      },
      complete:() => {
        console.info("请求结束...");
        this.setData({
          loading: false
        })
        wx.hideNavigationBarLoading();
        if(fresh){
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  detail:function(e){
    if(this.data.lock){
      return;
    }
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
  manage:function(e){
    if (!this.data.login || !app.globalData.manager){
      return;
    }
    this.setData({
      lock: true
    });
    var that = this;
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ['删除热点'],
      success: function (res){
        this.setData({
          lock: false
        })
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确认删除热点吗？',
            success: function (res) {
              that.setData({
                lock:false
              })
              if (res.confirm) {
                that.deleteNews(id,index);
              }
            }
          })
        }
      }
    });
  },

  deleteNews:function(id,index){
    wx.request({
      url: app.globalData.serverUrl + '/api/news/' + id,
      method: 'DELETE',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      success: res => {
        this.data.newses.splice(index, 1);
        this.indexArray(this.data.newses);
        this.setData({
          newses: this.data.newses
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.topUser){
      console.info("has logined");
     this.setData({
      login:true
     })
    }else{
      console.info("not logined");
      app.userInfoReadyCallback = res => {
        console.info('app ready call back: ' + JSON.stringify(res));
        this.setData({
          login: true
        })
      }
    }
    this.getNewses(false)

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
      console.info("has logined");
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
   * 刷新
   */
  onPullDownRefresh: function () {
    console.info("刷新....")
    // wx.showToast({
    //   title: 'test',
    //   duration: 500
    // })
    // wx.showNavigationBarLoading();
    this.init()
    this.getNewses(true)
    
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
      this.getNewses(false)
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