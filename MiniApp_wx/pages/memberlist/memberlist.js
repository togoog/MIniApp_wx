// pages/others/memberlist/memberlist.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memList: [],
    state: false,
    value: '',
    closeState: false,
    closeShow: true,
    userid:wx.getStorageSync("userid"),
    createrid: wx.getStorageSync("createrid")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.systemInfo.windowHeight,
      userid: wx.getStorageSync('userid'),
      createrid: wx.getStorageSync("groupinfo").gcreator    
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(that.formPhoto){
      that.timer = setTimeout(function(){
        that.formPhoto = false
      },100);
      return;
    }
    this.userid = wx.getStorageSync('userid');
    wx.request({
      url: '',
      data: {
        userid: wx.getStorageSync('userid'),
        groupid: wx.getStorageSync('groupid'),
        lastUid: 0
      },
      success: function (res) {
        console.log(res);
        var list = res.data.data;
        that.list = list;
        that.setData({
          memList: list
        })
      }
    })
  },
  // 编辑
  compiled: function () {
    if(this.data.memList == 0){
      wx.showModal({
        title: '提示',
        content: '没有可编辑的对象',
        showCancel: false
      })
      return;
    }
    this.setData({
      state: true,
      closeShow: false
    })
  },
  // 取消
  toBack: function(){
    var tempList = this.data.memList
    for(var i=0,len=tempList.length;i<len;i++){
      tempList[i].selected = false;
    }
    this.setData({
      memList: tempList,
      state: false,
      closeShow: true
    })
  },
  // 更改选中状态
  changeSel: function (e) {
    var that = this;
    var sel = e.currentTarget.dataset.sel;
    if (this.userid != that.data.memList[sel].user.userid) {
      that.data.memList[sel].selected = !that.data.memList[sel].selected;
      this.setData({
        memList: that.data.memList
      })
    } else {
      wx.showModal({
        title: "提示",
        content: '不要踢除自己哦！',
        showCancel: false
      })
    }
  },
  // 搜索成员
  searchList: function (e) {
    var that = this;
    var e = e || event;
    var userid = wx.getStorageSync('userid');
    if (!userid) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    var searchText = e.detail.value.trim();
    if (searchText == '') {
      wx.showToast({
        title: '请输入用户名称',
      })
      return;
    }
    wx.showToast({
      title: '搜索中...',
      icon: 'loading',
      duration: 6000,
      mask: true
    })
    wx.request({
      url: 'h',
      data:{
        groupid: wx.getStorageSync('groupid'),
        name: searchText
      },
      success:function(res){
        wx.hideToast();
        console.log(res.data.data);
        that.setData({
          memList: res.data.data,
          closeState: true
        })
      }
    })
  },
  // 关闭当前搜索的内容
  closeList:function(){
    var that = this ;
    this.setData({
      memList: that.list,
      state: false,
      value: '',
      closeState: false
    })
  },
  // 删除成员
  delMember: function () {
    let that = this;
    var tempArr = [];
    var tempL = that.data.memList;
    for(var i=0,len=that.data.memList.length;i<len;i++){
      if (tempL[i].selected){
        tempArr.push(tempL[i].user.userid);
      }
    }
    if (tempArr == 0) {
      wx.showModal({
        title: "提示",
        content: '请选择需要删除的成员',
        showCancel: false
      })
    } else if (wx.getStorageSync('createrid') != wx.getStorageSync('userid')) {
      wx.showModal({
        title: "提示",
        content: '非相册创建者，无权限踢人',
        showCancel: false
      })
    } else {
      wx.showToast({
        title: '正在删除',
        icon: 'loading'
      })
      wx.request({
        url: '',
        data: {
          userid: tempArr.join(','),
          groupid: wx.getStorageSync('groupid'),
          owner: wx.getStorageSync('createrid')
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success:function(){
                wx.navigateBack();
              }
            })
            
          }
        }
      })
    }
  },
  // 去个人的照片强
  toLookPhoto: function (e) {
    var that = this;
    that.formPhoto = true;
    var sel = e.currentTarget.dataset.sel;
    var groupid = wx.getStorageSync('groupid');
    
    wx.navigateTo({
      url: '/pages/userphoto/userphoto?from=other&userid=' + that.data.memList[sel].user.userid + '&groupid=' + groupid ,
    })
  },
  loading: function () {
    if (this.data.state) {
      return;
    }
    var that = this;
    if (this.isloading) return;
    this.isloading = true;
    wx.showToast({
      title: '正在加载',
      icon: "loading",
      duration: 5000
    })
    wx.request({
      url: '',
      data: {
        userid: wx.getStorageSync('userid'),
        groupid: wx.getStorageSync('groupid'),
        lastUid: that.data.memList[that.data.memList.length - 1].user.userid
      },
      success: function (res) {
        console.log(res.data.data.length);
        wx.hideToast();
        if (res.data.data.length == 0) {
          wx.showToast({ title: "已加载全部动态！" })
        } else {
          var tempList = that.data.memList;
          res.data.data.forEach(function (val) {
            tempList.push(val);
          })
          that.setData({
            memList: tempList
          })
          that.isloading = false;
        }
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: '邀请你加入相册',
      path: '/pages/details/details?port=精简版小程序空间分享&groupid=' + wx.getStorageSync('groupid') + '&from=memberlist'
    }
  }
})
