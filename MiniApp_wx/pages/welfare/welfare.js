// pages/index/welfare/welfare.js
let app=getApp();
let util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfoDetail:{},
    showWelSignModel:true
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
    var that=this;
    that.userid = wx.getStorageSync('userid');
    that.updatePage();
   
    
  },
  // 点击签到
  signBtn:function(){
    var that=this;
    util.wxreq({
      pathname: '',
      data: {
        userid: that.userid
      }
    }).then(res=>{
      that.setData({
        showWelSignModel: false
      })
      that.timer=setTimeout(function(){
        that.setData({
          showWelSignModel: true
        })
        that.updatePage();
      },2000)
      
    })
  },
// 转换函数
conversion:function(num){
  return (num/1024/1024).toFixed(2);
},
//更新页面数据
updatePage:function(){
  var that=this;
  util.wxreq({
    pathname: '',
    data: {
      userid: that.userid
    },
    reqtype:'GET'
  }).then(function (res) {
    var data = res.data[0];
    var useStorage = that.conversion(data.useStorage);
    var totalStorage = that.conversion(data.totalStorage);
    var remainStorage = (parseFloat(totalStorage) - parseFloat(useStorage)).toFixed(2);
    var userinfoDetail = {
      totalStorage: totalStorage,
      useStorage: useStorage,
      remainStorage: remainStorage,
      inviteNum: data.inviteNum,
      isTodaySign: data.isTodaySign,
      picNum: data.picNum,
      signDay: data.signDay,
      isShareMoments: data.isShareMoments,
      isShareWechatGroup: data.isShareWechatGroup
    };
    
    that.setData({
      userinfoDetail: userinfoDetail
    })
    // console.log(that.data.userinfoDetail);
  }).catch(res=>{
    // console.log(res);
    wx.showToast({
      title: '数据加载错误',
    })
  })
},

  dialogImg:function(){
    var that=this;
    clearTimeout(that.timer);
    that.updatePage();
    this.setData({
      showWelSignModel: true
    })
  },


  invitFriend:function(){
    wx.navigateTo({
      url: '/pages/welfare/invitation/invitation?num=' + this.data.userinfoDetail.inviteNum,
    })
  },
  sharewx:function(){
    wx.navigateTo({
      url:'/pages/detail/sharegroup/sharegroup?shareType=wx'
    })
  },
  shareFrd:function(){
    wx.navigateTo({
      url:'/pages/detail/sharegroup/sharegroup?shareType=friend'
    })
  },
  appLogin:function(){
    wx.navigateTo({
      url: '/pages/detail/applogin/applogin',
    })
  }

  
})
