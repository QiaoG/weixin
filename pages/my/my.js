// pages/my/my.js
const app = getApp()
const url = app.globalData.serverUrl + "/wx"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionKey:null,
    iv:null,
    encData:null
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    if(typeof(e.detail.iv) == "undefined"){
      return
    }
    console.log(e.detail.iv)
    this.data.iv = e.detail.iv
    console.log(e.detail.encryptedData)
    this.data.encData = e.detail.encryptedData
    this.checkSession()
  },
  checkSession:function(){
    wx.checkSession({
      success:function() {
        console.info("session没有过期")
        this.bindPhone()
      },
      fail:function(){
        console.info("session已经过期，重新登陆")
        wx.login({
          success:res => {
            app.globalData.sessionCode = res.code
            this.bindPhone()
          }
        })
      }
    })
  },
  bindPhone:function(){
    wx.request({
      url: url+"/login",
      data: { 'code': app.globalData.sessionCode},
      success:res =>{
        console.log(res)
        // this.data.sessionKey = res.data
        // wx.request({
        //   url: url +"/dcymobile",
        //   data: { 'key': this.data.sessionKey, 'encData': this.data.endData, 'iv': this.data.iv },
        //   success:res => {

        //   }
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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