// pages/setting/addset/addset.js

var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allState:true,
    onlyCreator:false,
    state:true
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
    var gAuthority= wx.getStorageSync('gAuthority');
    if (gAuthority==0){
      that.setData({
        allState:true,
        onlyCreator: false,
        state:true
      })
    } else if (gAuthority ==1){
      that.setData({
        allState: false,
        onlyCreator: true,
        state: true
      })
    }else{
      that.setData({
        allState: false,
        onlyCreator: false,
        state: false
      })
    }

  },

  changeAll:function(){
    var that=this;
    var gAuthority = wx.getStorageSync('gAuthority');
    if (gAuthority==2){
      this.setData({
        allState: !that.data.allState,
        onlyCreator: that.data.allState,
        state: true
      })
      return;
    }
    this.setData({
      allState: !that.data.allState,
      onlyCreator: !that.data.onlyCreator,
      state:true
    })
  },
  changeCreator:function(){
    var that = this;
    var gAuthority = wx.getStorageSync('gAuthority');
    if (gAuthority == 2) {
      this.setData({
        allState: that.data.onlyCreator,
        onlyCreator: !that.data.onlyCreator,
        state: true
      })
      return;
    }
    this.setData({
      allState: !that.data.allState,
      onlyCreator: !that.data.onlyCreator,
      state:true
    })
  },
  release:function(){
    var that = this;
    if (!that.data.state){
      wx.showModal({
        title: '提示',
        content: '还没有设置...',
        showCancel: false
      })
      return;
    }
    var  authorityType = this.data.allState ? "all" : "onlyCreator" ;
    util.wxreq({
      pathname: '',
      data: {
        userid: wx.getStorageSync('userid'),
        groupid: wx.getStorageSync('groupid'),
        authorityType: authorityType
      },
      reqtype:"GET"
    }).then(res=>{
      wx.navigateBack({
        delta:1
      })
    })
  }
})
