// pages/others/grouplist/grouplist.js
let unit = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uCreateList:[],
    uAddList:[]
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
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    var uCreateList = [], uAddList = []
    unit.wxreq({
      pathname: 'YinianProject/yinian/ShowGroup',
      data: { userid: wx.getStorageSync('userid') }
    }).then(res=>{
      if(res.code == 0){
        var groupDetail = res.data;
        groupDetail.forEach(function (val) {
          if (wx.getStorageSync('userid') == val.gcreator) {
            uCreateList.push(val);
          } else {
            uAddList.push(val);
          }
        })
        that.setData({
          uCreateList: uCreateList,
          uAddList: uAddList
        })
      }
    })
  },
  gotodetails:function(e){
    console.log(e)
    var groupid = e.currentTarget.dataset.groupid
    wx.redirectTo({
      url: '../details/details?groupid='+groupid,
    })
  }
})