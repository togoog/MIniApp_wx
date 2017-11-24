// pages/others/userphoto/userphoto.js
let util = require('../../utils/util.js');
let app = getApp();
function timeRest(stringTime) {
  var stringTime = stringTime.replace(/-/g, "/");
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp2 = timestamp2 / 1000;
  var nowTime = new Date().getTime();
  var resultTime = parseInt(nowTime / 1000) - parseInt(timestamp2);
  if (resultTime == 0) {
    return "刚刚"
  } else if (resultTime > 0 && resultTime < 60 * 60) {
    return "" + Math.ceil(resultTime / 60) + "分钟前";
  } else if (resultTime >= 60 * 60 && resultTime < 60 * 60 * 24) {
    return "" + Math.ceil(resultTime / (60 * 60)) + "小时前";
  } else if (resultTime >= 60 * 60 * 24 && resultTime < 60 * 60 * 24 * 3) {
    return "" + Math.ceil(resultTime / (60 * 60 * 24)) + "天前";
  } else {
    return stringTime.slice(0, 4) + "." + stringTime.slice(5, 7) + "." + stringTime.slice(8, 10);
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: app.globalData.systemInfo.screenHeight,
    r2p: app.globalData.systemInfo.windowWidth / 750,
    photopagedata_day: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userid = options.userid;
    this.from = options.from;
    this.groupid = options.groupid;
    this.setData({
      from: this.from
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (that.fromState) {
      return;
    }
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    if (that.from == 'personal') {
      console.log('personal')
      that.getuserphotowall();
      that.getUserInfo();
    } else {
      wx.setNavigationBarTitle({
        title: 'TA的照片'
      })
      that.getOtherPhotoWall();
      that.getOtherInfo();
      that.getUserInfo();
    }
    // ;



  },
  // 从我的页面过来获取自己的信息
  getUserInfo: function () {
    var that = this;
    util.wxreq({
      pathname: 'YinianProject/yinian/GetUserData',
      data: { userid: that.userid }
    }).then(res => {
      console.log(res)
      that.setData({
        avatarData: res.data[0]
      })
    })
  },
  //获取他人信息
  getOtherInfo: function () {
    var that = this;
    util.wxreq({
      pathname: 'YinianProject/event/GetSpaceMemberPhotoNum',
      data: {
        userid: that.userid,
        groupid : that.groupid
      }
    }).then(res => {
      console.log(res);
      that.setData({
        Pnum: res.data[0].num
      })
    })
  },

  //获取他人在某个相册的动态
  getOtherPhotoWall: function () {
    var that = this;
    util.wxreq({
      pathname: 'YinianProject/event/ShowSpaceMemberEvents',
      data: {
        userid: that.userid,
        groupid: that.groupid,
        minID: 0
      },
      reqtype: 'GET'
    }).then(res => {
      var data = res.data;
      console.log(data);
      var tempArr = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].picList.length > 0) {
            data[i].showTime = timeRest(data[i].euploadtime);
            if (data[i].eMain == 4) {
              var pM = parseInt(Math.random() * 4);
              var emptyUrl;
              if (pM == 0) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edc8ad.png";
              } else if (pM == 1) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/79dca2.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edadad.png";
              } else {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/6ecdf0.png";
              }
              data[i].picList[0].thumbnail = data[i].picList[0].pcover ? data[i].picList[0].pcover : emptyUrl;
            }
            tempArr.push(data[i]);
          }

        }
      }
      that.setData({
        photopagedata_day: tempArr
      })
    })
  },
  //从我的页面过来
  getuserphotowall: function () {
    var that = this;
    util.wxreq({
      pathname: 'YinianProject/event/ShowMe2ndVersion',
      data: {
        userid: that.userid,
        minID: 0,
        source: 'smallApp'
      },
      reqtype: 'GET'
    }).then(res => {
      console.log(res)
      var data = res.data;
      var tempArr = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].picList.length > 0) {
            data[i].showTime = timeRest(data[i].euploadtime);
            if (data[i].eMain == 4) {
              var pM = parseInt(Math.random() * 4);
              var emptyUrl;
              if (pM == 0) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edc8ad.png";
              } else if (pM == 1) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/79dca2.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edadad.png";
              } else {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/6ecdf0.png";
              }
              data[i].picList[0].thumbnail = data[i].picList[0].pcover ? data[i].picList[0].pcover : emptyUrl;
            }
            tempArr.push(data[i]);
          }

        }
      }
      that.setData({
        photopagedata_day: tempArr
      })
    })
  },
  loadingOther: function () {
    console.log('other');
    if (this.loadingDataByDay) return;
    this.loadingDataByDay = true;
    var that = this;
    wx.showToast({
      title: "加载中",
      icon: "loading"
    })
    util.wxreq({
      pathname: "YinianProject/event/ShowSpaceMemberEvents",
      data: {
        userid: that.userid,
        groupid: that.groupid,
        minID: that.data.photopagedata_day[that.data.photopagedata_day.length - 1].eid,
      }
    }).then(res => {
      wx.hideToast();
      that.loadingDataByDay = false;
      if (res.data.length == 0) {
        wx.showToast({ title: "已加载全部照片", duration: 2500 })
      } else {
        var data = res.data;
        var tempArr = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].picList.length > 0) {
              data[i].showTime = timeRest(data[i].euploadtime);
              if (data[i].eMain == 4) {
                var pM = parseInt(Math.random() * 4);
                var emptyUrl;

                if (pM == 0) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edc8ad.png";
                } else if (pM == 1) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/79dca2.png";
                } else if (pM == 2) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edadad.png";
                } else {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/6ecdf0.png";
                }
                data[i].picList[0].thumbnail = data[i].picList[0].pcover ? data[i].picList[0].pcover : emptyUrl;
              }
              tempArr.push(data[i]);
            }
          }
        }
        that.setData({
          photopagedata_day: that.data.photopagedata_day.concat(tempArr)
        })
      }
    })
  },
  loading: function () {
    if (this.loadingDataByDay) return;
    this.loadingDataByDay = true;
    var that = this;
    wx.showToast({
      title: "加载中",
      icon: "loading"
    })
    util.wxreq({
      pathname: "YinianProject/event/ShowMe2ndVersion",
      data: {
        userid: that.userid,
        minID: that.data.photopagedata_day[that.data.photopagedata_day.length - 1].eid,
        source: "smallApp"
      }
    }).then(res => {
      console.log(res)
      wx.hideToast();
      that.loadingDataByDay = false;
      if (res.data.length == 0) {
        wx.showToast({ title: "已加载全部照片", duration: 2500 })
      } else {
        var data = res.data;
        var tempArr = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].picList.length > 0) {
              data[i].showTime = timeRest(data[i].euploadtime);
              if (data[i].eMain == 4) {
                var pM = parseInt(Math.random() * 4);
                var emptyUrl;

                if (pM == 0) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edc8ad.png";
                } else if (pM == 1) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/79dca2.png";
                } else if (pM == 2) {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/edadad.png";
                } else {
                  emptyUrl = "http://oibl5dyji.bkt.clouddn.com/6ecdf0.png";
                }
                data[i].picList[0].thumbnail = data[i].picList[0].pcover ? data[i].picList[0].pcover : emptyUrl;
              }
              tempArr.push(data[i]);
            }
          }
        }
        that.setData({
          photopagedata_day: that.data.photopagedata_day.concat(tempArr)
        })
      }
    })
  },

  // 跳转查看视频
  seeBigVideo: function (e) {
    var that = this;
    that.fromState = 1;
    var url = e.currentTarget.dataset.url;
    that.setData({
      toseeVideo:true,
      videoUrl: url
    })
    // wx.navigateTo({
    //   url: '/pages/viewscoll/bigvideo/bigvideo',
    // })
  },
  //关闭视屏查看
  closeSeeVideo: function () {
    var that = this
    that.setData({
      toseeVideo: false,
      isScroll: false,
    })
  },
  lookbigpic: function (e) {
    var that = this;
    that.fromState = 1;

    var a = e.currentTarget.dataset.picitemindex;
    var b = e.currentTarget.dataset.picindex;
    var arrT = [];
    that.data.photopagedata_day[a].picList.forEach(val => {
      if (val.eMain != 4) {
        arrT.push(val.midThumbnail);
      }
    })
    wx.previewImage({
      urls: arrT,
      current: that.data.photopagedata_day[a].picList[b].midThumbnail
    })
  }
})