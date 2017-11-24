//app.js
// var aldstat = require("./utils/ald-stat.js");

const systeminfo = wx.getSystemInfoSync();
let unit = require('./utils/util.js');
//var hotapp = require('utils/hotapp.js');
App({
  onLaunch: function () {
    this.globalData.userInfo = wx.getStorageSync('userInfo') || null;
  },
  // onError: function (msg) {
  //   var that = this;
  //   console.log(msg);
  //   wx.request({
  //     url: 'https://api.zhuiyinanian.com/YinianProject/h5/RecordSmallAppFaultMsg',
  //     data: {
  //       msg: msg,
  //       device: that.globalData.systemInfo.model
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //     },
  //     fail: function () {
  //       console.log('保存错误信息失败');
  //     }
  //   })
  // },
  // 根据后台判断是否隐藏
  getshowState: function (cb) {
    unit.wxreq({ pathname: "YinianProject/activity/GetMyPhoto", data: { id: 38 } })
      .then(res => {
        let puzzleState = res.data[0].status == 1 ? true : false;
        typeof cb == "function" && cb(puzzleState);
      });
  },
  // 获取用户信息
  getUserInfo: function (cb, na, nb, nc, nd, ne) {
    var that = this;
    if (this.globalData.userInfo && this.globalData.userInfo.openIdFlag) {
      that.globalData.userInfo.isnew = "no";
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      let login = unit.wxpromise(wx.login);
      let getUserInfo = unit.wxpromise(wx.getUserInfo);
      login().then(res => {
        // console.log(res);
        getUserInfo().then(info => {
          // console.log(info);
          unit.wxreq({
            pathname: 'YinianProject/h5/SmallAppLoginAndRegister',
            data: {
              iv: info.iv,
              code: res.code,
              encodeData: info.encryptedData,
              source: "精简版小程序",
              version: na,
              port: nb,
              fromUserID: nc,
              fromSpaceID: nd,
              fromEventID: ne
            }
          }).then(response => {
            console.log(response);
            wx.setStorage({ key: 'userid', data: response.data[0].userid });
            that.globalData.userInfo = Object.assign(info.userInfo, {
              userid: response.data[0].userid,
              isnew: response.data[0].isNewUser,
              uLockPass: response.data[0].uLockPass,
              openIdFlag: response.data[0].openIdFlag
            });
            that.globalData.userInfo.nickName = response.data[0].unickname;
            wx.setStorage({ key: 'userInfo', data: info.userInfo })
            // wx.setStorageSync("NetworkType", "all")
            typeof cb == "function" && cb(that.globalData.userInfo);
          })
        }).catch(rejected => {
          // console.log('jujue');
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        })
      })
    }
  },
  globalData: {
    userInfo: null,
    systemInfo: systeminfo,
    pwdState: true
  }
})
