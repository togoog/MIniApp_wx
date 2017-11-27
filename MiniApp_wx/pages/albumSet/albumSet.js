// pages/albumSet/albumSet.js
var app = getApp();
let unit = require('../../utils/util.js');
const api = require('../../utils/api.js');
var Promise = require('../../utils/promise.js');
var reg = require('../../utils/reg.js');
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
    var that = this;
    that.setData({
      createrid: wx.getStorageSync("createrid"),
      userid: wx.getStorageSync("userid"),
    })
   

  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  //点击编辑相册名字
edit: function () {
    var that = this;
    if (wx.getStorageSync("createrid") == wx.getStorageSync("userid")){
      that.setData({
        Mengcen: true
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '非相册创建者，无法修改相册名',
        showCancel:false,
      })
    }
   
  },
//动态的显示可编辑字符提示
setcolor: function (e) {
  let that = this;
  var num = e.detail.value.length;
  that.setData({
    textNum: num
  })
  let val = e.detail.value.trim();
  if (val.length > 0) {
    that.setData({
      buttonactive: true
    })
  } else {
    that.setData({
      buttonactive: false
    })
  }
},
//取消编辑
Mengcen_cancel: function () {
  var that = this
  that.setData({
    Mengcen: false,

  })
},
  //修改相册名
submitfun: function (e) {
    var that = this
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    // if (wx.getStorageSync('userid') != wx.getStorageSync('createrid')) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "非相册创建者，无法修改相册名称",
    //     showCancel: false
    //   })
    //   return;
    // }
    console.log(e)
    var grouptitle = e.detail.value.groupname;
    console.log(grouptitle)
    if (grouptitle.trim().length > 0) {
      if (reg.testStr(grouptitle)) {
        wx.showModal({
          title: '包含敏感词',
          content: '请勿使用包含敏感词汇的相册名称',
          showCancel: false
        })
        return;
      }
      wx.request({
        url: api.getUrl(''),
        data: {
          groupid: wx.getStorageSync('groupid'),
          groupName: grouptitle,
          userid: wx.getStorageSync('userid')
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 2000,
            })

            wx.setStorageSync('gname', grouptitle);
            that.setData({
              Mengcen: false,
              // ablumInfo: {
              //   gname: grouptitle,
              //   gnum: wx.getStorageSync("groupinfo").gnum,
              //   picnum: wx.getStorageSync("groupinfo").picNum,
              //   list: wx.getStorageSync("groupinfo").memberList,
              //   gpic: wx.getStorageSync("groupinfo").gpic,
              //   gOrigin: wx.getStorageSync("groupinfo").gOrigin,
              //   gcreator: wx.getStorageSync("groupinfo").gcreator,
              // }
            });
            // setTimeout(function () {
            //   wx.redirectTo({
            //     url: '../viewscoll/viewscoll?groupid=' + wx.getStorageSync('groupid')
            //   })
            // }, 1000)
          }
        }
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请输入正确的相册名称",
        showCancel: false
      })
    }
  },
  //退出相册
leavegroup: function () {
  let that = this;
  if (!wx.getStorageSync('userid')) {
    wx.showModal({
      title: "错误",
      content: "获取用户授权信息失败！请稍后再试",
      showCancel: false
    })
    return;
  }
  wx.showModal({
    title: '退出相册',
    content: '是否确定退出相册',
    showCancel: true,
    success: function (res) {
      if (res.confirm) {
        // wx.showToast({
        //   title: "请稍后"
        // });
        wx.showLoading({
          title: '正在退出',
        })
        wx.request({
          url: api.getUrl(''),
          data: {
            userid: wx.getStorageSync('userid'),
            groupid: wx.getStorageSync('groupid'),
            source: '精简版小程序'
          },
          success: function (res) {
            if (res.data.msg == "success") {
              wx.showToast({
                title: "已退出该相册",
                success: function () {
                  if (wx.reLaunch) {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  } else {
                    wx.navigateBack({
                      delta: 10
                    })
                  }

                }
              })
            }
          },
          fail:function(res){
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '网络错误,请重试',
              showCancel:false,
            })
          }
        })
      }
    }

  })

},
//删除相册
deletegroup: function () {
  let that = this;
  if (!wx.getStorageSync('userid')) {
    wx.showModal({
      title: "错误",
      content: "获取用户授权信息失败！请稍后再试",
      showCancel: false
    })
    return;
  }
  wx.showModal({
    title: '解散相册',
    content: '是否确定解散相册',
    showCancel: true,
    success: function (res) {
      if (res.confirm) {
        // wx.showToast({
        //   title: "请稍后"
        // });
        wx.showLoading({
          title: '正在删除',
        })
        wx.request({
          url: api.getUrl(''),
          data: {
            userid: wx.getStorageSync('userid'),
            groupid: wx.getStorageSync('groupid'),
            source: '精简版小程序'
          },
          success: function (res) {
            if (res.data.msg == "success") {
              wx.showToast({
                title: "相册已解散",
                success: function () {
                  if (that.from == "grouplist") {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    if (wx.reLaunch) {
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    } else {
                      wx.navigateBack({
                        delta: 10
                      })
                    }
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '网络错误,请重试',
              showCancel: false,
            })
          }
        })
      }
    }
  })
},
//上传权限设置
gotoaddset:function(){
  if(wx.getStorageSync("userid")==wx.getStorageSync("createrid")){
    wx.redirectTo({
      url: '../addset/addset',
    })
  }
  else{
    wx.showModal({
      title: '提示',
      content: '非相册创建者，没有设置权限',
      showCancel:false
    })
  }
},


})
