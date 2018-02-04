//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        this.globalData.sessionCode=res.code
        this.getWxUser()
      }
    })
    //"Q0j4TwGTfTIA8LGHsBaYFXdArAbvBVn53YicC6F66hcnMpu9aickCarRnIdP9nu6VrzJ0lZ0UQ7vdJbTlw7m3cgw"
  },
  getWxUser: function () {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (true){//res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            //withCredentials: true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              console.info('###################');
              wx.request({
                url: this.globalData.serverUrl+"/api/user/search/findByNickname",
                data:{name:res.userInfo.nickName},
                success:res => {
                  console.info(res);
                  var users = res.data._embedded.users;
                  if(users.length > 0){
                    this.globalData.topUser = users[0];
                    var link = users[0]._links.self.href;
                    //console.info(link)
                    this.globalData.topUser["id"]=link.substring(link.lastIndexOf("/")+1);
                    this.globalData.manager=users[0].role.split('|')[0]<2;
                    this.globalData.register=true;
                    console.info(this.globalData.topUser)
                  }
                  
                },
                complete:(e) => {
                  console.info(e);
                }
              })
            }
          })
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  globalData: {
    sessionCode:null,
    userInfo: null,
    topUser: null,
    serverUrl: 'http://localhost:8088',
    manager:false,
    register:false,
    pageSize: 5
  }
})