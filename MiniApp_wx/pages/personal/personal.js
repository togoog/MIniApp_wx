// pages/personal/personal.js
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this
    if (wx.getStorageSync("NetworkType") =="justwifi"){
      that.setData({
        checked: "checked"
      })
    }
    else{
      that.setData({
        checked: ""
      })
    }
   
    wx.request({
      url: "",
      data: {
        userid: wx.getStorageSync("userid")
      },
      success: function (res) {
        console.log(res.data.data[0])
        console.log(res.data.data[0].unickname)

        var useStorage = that.conversion(res.data.data[0].uusespace);
        var totalStorage = that.conversion(res.data.data[0].utotalspace);
        that.setData({
          useStorage: useStorage,
          totalStorage: totalStorage,
          unickname: wx.getStorageSync("userInfo").nickName,
          upic: res.data.data[0].upic,

        })
      }
    })
  },
  //切换选项 设置网络传输类型
  switchChange: function (e) {
    // console.log(e.detail.value);
    var value = String(e.detail.value) 
    console.log(value)
    value = value == "true"?"justwifi":"all"
    wx.setStorageSync("NetworkType", value)
  },
  //回到首页
  gotoindex:function(){
    wx.navigateBack({
      url: '../index/index',
    })
  },
    // 跳转另一个小程序
  toAnotherApp: function () {
    wx.navigateToMiniProgram({
      appId: '',
      path: 'pages/index/index',
      success(res) {
        // 打开成功
        console.log(res);
      }
    })
  },
  // 扩容
  gotoWalfare:function(){
    wx.redirectTo({
      url: '../welfare/welfare',
    })
  },

  // 内存转换函数
  conversion: function (num) {
    return (num / 1024 / 1024).toFixed(2);
  },
  // 跳转我的相册列表
  gotogrouplist:function(){
    wx.redirectTo({
      url: '../grouplist/grouplist',
    })
  },
  //跳转到我的所有照片
  gotophotowall:function(){
    wx.redirectTo({
      url: '../userphoto/userphoto?from=personal&userid=' + wx.getStorageSync("userid"),
    })
  }
})
