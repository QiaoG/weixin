// pages/user/userManage.js
const app = getApp();
const url = app.globalData.serverUrl + "/users/findByNicknameLike";
const urlapi = app.globalData.serverUrl + "/api/user";
const size = app.globalData.pageSize;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    nickname: "",
    nextPage:0,
    pageSize:0,
    users:[],
    searching:false,
    currentUser:null
  },
  init:function(){
    this.data.users.splice(0,this.data.users.length);
    this.data.nextPage = 0;
    this.data.pageSize = 0;
  },
  findUsers:function(name){
    console.info("search:"+name)
    this.setData({
      searching:true
    })
    wx.request({
      url: url,
      data:{
        name:name,
        page:this.data.nextPage,
        size:size
      },
      success:res => {
        console.info(res.data);
        var i = 0;
        res.data.forEach(value => {
          value['rolec'] = value.role.split('|')[0];
          value['rolen'] = value.role.split('|')[2];
          value['index'] = i++;
        });
        this.setData({
          users: this.data.users.concat(res.data)
        });
        this.data.nextPage = this.data.nextPage + 1
        this.data.currentPageSize = res.data.length;
      },
      complete:() => {
        this.setData({
          searching:false
        })
      }
    })
  },
  deleteUser:function(user){
    wx.request({
      url: urlapi + '/' + user.id,
      method: 'DELETE',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      success: res => {
        console.info(res);
        this.data.users.splice(user.index, 1);
        this.setData({
          users: this.data.users
        });
      }
    })
  },
  roleUser:function(user){
    this.data.users[user.index]=user;
    
    wx.request({
      url: urlapi + '/' + user.id,
      method: 'PUT',
      header: { 'Authorization': 'Bearer ' + app.globalData.topUser.token},
      data: user,
      success: res => {
        console.info(res);
        this.setData({
          users: this.data.users
        });
        // this.init();
        // this.findUsers(this.data.nickname);
      }
    })
  },
  manage:function(e){
    var that = this;
    console.info(e.target.dataset.id);
    var user = e.target.dataset.id;
    wx.showActionSheet({
      itemList: ['删除', user.rolec==2?'授权管理员':'取消管理员'],
      success: function (res) {
        if (res.cancel) {
          return;
          // console.log(res.tapIndex)
        }
        if(res.tapIndex == 0){
          wx.showModal({
            title: '提示',
            content: '确认删除用户吗？',
            success: function (res) {
              console.info(this);
              if (res.confirm) {
                that.deleteUser(user);
              }
            }
          })
        }
        if (res.tapIndex == 1) {
          var v = user.rolec;
          var content = v == 2 ? '确认授权为管理员吗？' : '确认取消管理员授权吗？';
          user.role = v == 2 ? '1|MANAGER|管理员' : '2|GENERAL|普通用户';
          user.rolec = v == 2 ? 1 : 2;
          user.rolen = v == 2 ? '管理员' : '普通用户'
          wx.showModal({
            title: '提示',
            content: content,
            success: function (res) {
              that.roleUser(user);
            }
          })
        }
      }
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
      nickname: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      nickname: e.detail.value
    });
    this.init();
  },
  search:function(){
    this.init();
    this.findUsers(this.data.nickname);
    this.hideInput();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentUser: app.globalData.topUser
    })
    this.findUsers(this.data.nickname);
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
    if (this.data.searching) {
      wx.showToast({
        title: '上次查询正在执行',
        icon:'warm',
        duration:1500
      })
      return
    }
    this.init();
    this.findUsers();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.searching || this.data.users.length==0) {
      return
    }
    if (this.data.pageSize === app.globalData.pageSize) {
      this.findUsers()
    } else {
      console.log("have no users!")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})