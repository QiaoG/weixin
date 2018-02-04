// pages/discuss/verify/verify.js
const app = getApp()
const url = app.globalData.serverUrl + "/api/discuss/search/statusAndType"
const pageSize = app.globalData.pageSize
var sliderWidth = 96; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty:'          ',
    tabs: ["热点", "需求"],
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
    this.data['discusses' + index] = this.data['discusses' + index].splice(0, this.data['discusses' + index].length);
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

  findDiscusses:function(){
    this.data['loading' + this.data.activeIndex]=true;
    wx.request({
      url: url + '?status=0&type=' + this.data.activeIndex + '&offset=' + (this.data['nextPage' + this.data.activeIndex] * pageSize) + '&size=' + pageSize,
      success: res => {
        console.log(res.data._embedded.discusses);
        var i = 0;
        res.data._embedded.discusses.forEach(function (value) {
          value['formatDate'] = value.createDate.split(' ')[0];
          value['index'] = i++;
        });
        if (this.data.activeIndex == 0){
          this.setData({
            discusses0: this.data.discusses0.concat(res.data._embedded.discusses)
          })
          this.data.nextPage0 = this.data.nextPage0 + 1;
          this.data.currentPageSize0 = this.data.discusses0.length;
          this.data.init0 = true;
          console.log(this.data.nextPage0 + ',' + this.data.currentPageSize0);
        }else{
          this.setData({
            discusses1: this.data.discusses1.concat(res.data._embedded.discusses)
          })
          this.data.nextPage1 = this.data.nextPage1 + 1;
          this.data.currentPageSize1 = this.data.discusses1.length;
          this.data.init1 = true;
          console.log(this.data.nextPage1 + ',' + this.data.currentPageSize1)
        }
      },
      complete:() =>{
        this.data['loading' + this.data.activeIndex] = false;
      }
    })
  },

  verify:function(e){
    console.info(e);
    var u = e.target.dataset.id._links.self.href;
    var d = e.target.dataset.id;
    d['status'] = 1;
    wx.request({
      url: u,
      method: 'PUT',
      data: d,
      success: res => {
        console.info(res);
        if (this.data.activeIndex == 0) {
          this.data.discusses0.splice(d.index, 1);
          this.setData({
            discusses0: this.data.discusses0
          });
        }else{
          this.data.discusses1.splice(d.index, 1)
          this.setData({
            discusses1: this.data.discusses1
          });
        }
        
        wx.showToast({
          title: '审核完成',
          icon: 'success',
          duration: 2000
        })
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
    this.findDiscusses();
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