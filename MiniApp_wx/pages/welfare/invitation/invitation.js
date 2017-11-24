// pages/detail/invitation/invitation.js
let util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.shareUserid) {
      that.shareUserid = options.shareUserid;
      console.log(that.shareUserid);
    }
    if (options.shCode) {
      that.shCode = options.shCode;
      console.log(that.shCode);
    }
    if (wx.canIUse) {
      if (wx.canIUse('button.open-type.share')) {
        that.setData({
          canIUse: true,
          userName: wx.getStorageSync('userInfo').nickName
        })
      }
    }

    // 统计需要的字段

    if (options.version) {
      this.version = options.version;
    }
    if (options.port) {
      this.port = options.port;
    }
    if (options.fromUserID) {
      this.fromUserID = options.fromUserID;
    }
    if (options.fromSpaceID) {
      this.fromSpaceID = options.fromSpaceID;
    }
    if (options.fromEventID) {
      this.fromEventID = options.fromEventID;
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;
    app.getUserInfo(function (userInfo) {
      that.userid = userInfo.userid;
      let showintroduce = userInfo.isnew == "yes" ? true : false;
      var userFId = app.globalData.userInfo.userid;
      if (that.shareUserid && showintroduce) {
        util.wxreq({
          pathname: 'YinianProject/activity/SuccessInviteFriend',
          data: {
            userid: that.shareUserid
          }
        }).then(res => {
          console.log(res)
        })
      }

      util.wxreq({
        pathname: 'YinianProject/activity/GetQRCode',
        data: {
          userid: that.userid,
          shCode: 'yaoqin'
        }
      }).then(res => {
        var codeUrl = res.data[0].QRCodeURL;
        that.setData({
          codeUrl: codeUrl,
          userName: wx.getStorageSync('userInfo').nickName
        })
      })
    },na,nb,nc,nd,ne)

  },
  showIntro: function () {
    
    wx.showToast({
      title: '点击右上角分享',
    })
  },
  previewCode: function () {
    var that = this;
    if (!that.userid) {
      return;
    }

    wx.previewImage({
      urls: [that.data.codeUrl],
    })

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '分享得空间奖励',
      path: '/pages/welfare/invitation/invitation?port=小程序好友邀请&shareUserid=' + that.userid + '&shCode=yaoqin'
    }
  }

})