// pages/discuss/verify/verify.js
const app = getApp()
const url = app.globalData.serverUrl + "/discusses/byStatus"
const pageSize = app.globalData.pageSize
var sliderWidth = 96; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["热点评论", "需求评论"],
    inputShowed0: false,
    inputShowed1: false,
    searchTitle0: '',
    searchTitle1: '',
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    discusses0:[],
    discusses1: [],
    init0:false,
    init1:false,
    nextPage0: 0,
    nextPage1: 0,
    currentPageSize0: 0,
    currentPageSize1: 0,
    loading0:false,
    loading1:false
  },
  init:function(index){
    this.data['nextPage'+index]=0;
    this.data['currentPageSize'+index] = 0;
    this.data['discusses' + index].splice(0, this.data['discusses' + index].length);
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (!this.data['init' + this.data.activeIndex]){
      this.findDiscusses();
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
    this.init();
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
    }else{
      this.hideInput1();
    }
    this.init(this.data.activeIndex);
    this.findDiscusses();
  },
  indexArray: function (arr) {
    var i = 0;
    arr.forEach(function (value) {
      value['index'] = i++;
    });
  },
  findDiscusses:function(fresh=false){
    this.data['loading' + this.data.activeIndex]=true;
    wx.showNavigationBarLoading();
    wx.request({
      url: url ,
      data:{
        status:0,
        type: this.data.activeIndex,
        title: this.data['searchTitle' + this.data.activeIndex],
        offset: (this.data['nextPage' + this.data.activeIndex] * pageSize),
        size:pageSize
      },
      success: res => {
        res.data.forEach(function (value) {
          value['formatDate'] = value.createDate.split(' ')[0];
        });
        if (this.data.activeIndex == 0){
          this.data.discusses0 = this.data.discusses0.concat(res.data);
          this.indexArray(this.data.discusses0);
          this.setData({
            discusses0: this.data.discusses0
          })
          this.data.nextPage0 = this.data.nextPage0 + 1;
          this.data.currentPageSize0 = res.data.length;
          this.data.init0 = true;
          console.log(this.data.nextPage0 + ',' + this.data.currentPageSize0);
        }else{
          this.data.discusses1 = this.data.discusses1.concat(res.data);
          this.indexArray(this.data.discusses1);
          this.setData({
            discusses1: this.data.discusses1
          })
          this.data.nextPage1 = this.data.nextPage1 + 1;
          this.data.currentPageSize1 = res.data.length;
          this.data.init1 = true;
          console.log(this.data.nextPage1 + ',' + this.data.currentPageSize1)
        }
      },
      complete:() =>{
        this.data['loading' + this.data.activeIndex] = false;
        wx.hideNavigationBarLoading();
        if(fresh){
          wx.stopPullDownRefresh();
        }
      }
    })
  },

  verify:function(dis){
    var u = app.globalData.serverUrl + '/api/discuss/'+dis.id
    dis['status'] = 1;
    wx.request({
      url: u,
      method: 'PUT',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data: dis,
      success: res => {
        console.info(res);
        if (this.data.activeIndex == 0) {
          this.data.discusses0.splice(dis.index, 1);
          this.indexArray(this.data.discusses0);
          this.setData({
            discusses0: this.data.discusses0
          });
        }else{
          this.data.discusses1.splice(dis.index, 1)
          this.indexArray(this.data.discusses1);
          this.setData({
            discusses1: this.data.discusses1
          });
        }
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prePage = pages[pages.length - 2];
        prePage.refreshCount();

        wx.showToast({
          title: '审核完成',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  verifyNo: function (dis) {
    wx.request({
      url: app.globalData.serverUrl + '/api/discuss/' + dis.id,
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token },
      method: 'DELETE',
      success: res => {
        console.info(res);
        if (this.data.activeIndex == 0) {
          this.data.discusses0.splice(dis.index, 1);
          this.indexArray(this.data.discusses0);
          this.setData({
            discusses0: this.data.discusses0
          });
        } else {
          this.data.discusses1.splice(dis.index, 1)
          this.indexArray(this.data.discusses1);
          this.setData({
            discusses1: this.data.discusses1
          });
        }
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prePage = pages[pages.length - 2];
        prePage.refreshCount();

        wx.showToast({
          title: '评论已经删除！',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  manage: function (e) {
    var that = this;
    var dis = e.target.dataset.id;
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
                that.verify(dis);
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
                that.verifyNo(dis);
              }
            }
          })
        }
      },
    });
  },
  deleteDiscuss: function (id, index) {
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
    this.findDiscusses(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data['loading' + this.data.activeIndex]) {
      return
    }
    if (this.data['currentPageSize' + this.data.activeIndex] === app.globalData.pageSize) {
      if (this.data.activeIndex === 0){
        this.setData({
          loading0: true
        })
      }else{
        this.setData({
          loading1: true
        })
      }
      this.findDiscusses()
    } else {
      console.log("have no discusses...");
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})