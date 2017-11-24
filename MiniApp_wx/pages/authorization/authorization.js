// pages/authorization/authorization.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (wx.getSetting) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '忆年小程序需要授权才可使用，请从小程序列表移除本小程序，再重新搜索登录.'
      })
    }

  },

  resetAu: function () {
    var that = this;
    if (wx.openSetting) {
      wx.openSetting()
    } else {
      wx.showModal({
        title: '提示',
        content: '忆年小程序需要授权才可使用，请从小程序列表移除本小程序，再重新搜索登录.'
      })
    }

  },
})