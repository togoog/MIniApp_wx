// pages/share/share.js
const util = require('../../utils/util.js');
const app = getApp();
let api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: app.globalData.systemInfo.screenHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shareId = options.shareId;
    this.groupid = options.groupid;
    this.innerApp = options.innerApp;
    this.fromUserID = options.fromUserID;
    this.port = options.port;
    wx.setStorageSync("shareId", this.shareId)  
    wx.setStorageSync("groupid", this.groupid)  
    wx.setStorageSync("innerApp", this.innerApp)  
    wx.setStorageSync("fromUserID", this.fromUserID)  
    wx.setStorageSync("port", this.port)  
    if (this.innerApp == 'yes'){
      this.setData({
        innerApp:true
    })
    }
    else{
      this.setData({
        innerApp: false
      })
    }
    
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
      var na = this.version ? this.version : "";
      var nb = this.port ? this.port : "";
      var nc = this.fromUserID ? this.fromUserID : 0;
      var nd = this.fromSpaceID ? this.fromSpaceID : 0;
      var ne = this.fromEventID ? this.fromEventID : 0;

      let _this = this;
      app.getshowState(function (res) {
        _this.setData({
          showpuzze: res
        })
      });

      // 授权
      app.getUserInfo(UserInfo => {
        if ((wx.getStorageSync('userInfo').uLockPass != null) && app.globalData.pwdState) {
          wx.navigateTo({
            url: '/pages/others/password/password?setPwd=shuru',
          })
        }
        /*设置是否显示新用户引到*/
        _this.setData({
          showintroduce: UserInfo.isnew == "yes" ? true : false
        })
        _this.setData({
          winHeight: app.globalData.systemInfo.windowHeight,
          r2p: app.globalData.systemInfo.windowWidth / 750,
          from: _this.from,
          groupid: _this.groupid,
          userid: UserInfo.userid
        })

        _this.nickname = UserInfo.nickName
        util.wxreq({
          pathname: 'YinianProject/yinian/ShowSmallAppAlbumInformation',
          data: {
            userid: UserInfo.userid,
            groupid: _this.groupid,
            port: nb,
            fromUserID: nc
          }
        })
          .then(res => {
            console.log(res);

            if (res.code == 1012) {
              wx.showModal({
                title: "提示",
                content: "相册已被删除",
                showCancel: false,
                success: function (res) {
                  if (wx.reLaunch) {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  } else {
                    wx.navigateBack({
                      delta: 10
                    })
                  }
                }
              })
            } else if (res.code == 1037) {
              wx.showModal({
                title: "提示",
                content: "相册已被封",
                showCancel: false,
                success: function (res) {
                  if (wx.reLaunch) {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  } else {
                    wx.navigateBack({
                      delta: 10
                    })
                  }
                }
              })
            } else {
              var isPush = res.data[0].isPush ? res.data[0].isPush : 0;
              // console.log(isPush);
              wx.setStorageSync("msgState", isPush);
              var groupinfo = res.data[0];
              if (!groupinfo.joinStatus) wx.showToast({ title: "加入相册成功" });
              wx.setStorage({
                key: 'createrid',
                data: groupinfo.gcreator
              });
              wx.setStorage({
                key: 'gAuthority',
                data: groupinfo.gAuthority
              });
              var aArr = groupinfo.authorityList ? groupinfo.authorityList : [];
              wx.setStorage({
                key: 'authorityList',
                data: aArr
              });

              wx.setStorage({
                key: 'gnum',
                data: groupinfo.gnum
              });
              wx.setStorage({
                key: 'ganme',
                data: groupinfo.gname
              });
              _this.gname = groupinfo.gname;
              app.globalData.gtype = groupinfo.gtype;
              app.globalData.gcreator = groupinfo.gcreator;
              // wx.setNavigationBarTitle({
              //   title: groupinfo.gname
              // });
            }

            //数据渲染
            var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
            if (_this.data.fromSeeBigPic == 1) {
              _this.timer = setTimeout(function () {
                _this.setData({
                  fromSeeBigPic: 1
                })
              }, 1000);
              return;
            }
            wx.request({
              url: "https://api.zhuiyinanian.com/YinianProject/simH5/getShareValue",
              // url:"http://192.168.199.204:8080/YinianProject/simH5/getShareValue",
              data: {
                id: wx.getStorageSync("shareId")
              },
              success: function (res) {
                console.log(res)

                var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
                var data = res.data.data
                // console.log(i,reg.test(strData));
                for (var i = 0; i < data.length; i++) {
                  // var pM = parseInt(Math.random() * 4);
                  var emptyUrl;
                  var strData = data[i].thumbnail
                  if (reg.test(strData)) {
                    // if (pM == 1) {
                    //   emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
                    // } else if (pM == 2) {
                    //   emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
                    // } else if (pM == 2) {
                    //   emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
                    // } else {
                    //   emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
                    // }
                    data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170731133839.png";
                    // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
                    data[i].myMain = 4;
                  } else {
                    data[i].myMain = 0;
                  }
                }
                _this.setData({
                  longPic: res.data.data
                })
                //数据渲染结束
              }
            })

          })

      }, na, nb, nc, nd, ne)

     


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    console.log(_this)
    return {
      title: _this.nickname + '邀请你加入“' + _this.gname + '”相册',
      desc: '这里面有几张我很喜欢的照片，快来看看你喜欢嘛？',
      path: '/pages/share/share?port=精简版小程序空间分享&groupid=' + _this.groupid + '&shareId=' + _this.shareId + '&innerApp=no'
    }
  },
  gotoseeBigpic:function(e){
    console.log(e)
    var that = this;
    // 当前的索引
    var a = e.currentTarget.dataset.index;
    console.log(a)
    // 当前的类型是图片还是视频
    var b = e.currentTarget.dataset.mymain
    console.log(b)
    //图片
    if (b == 0) {
      var tempArr = [];
      that.data.longPic.forEach(val => {
        tempArr.push(val.midThumbnail)
      })
      // 查看大图删除视频
      var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
      // console.log(tempArr)
      var previewArr = [];
      for (var i = 0; i < tempArr.length; i++) {
        if (reg.test(tempArr[i])) {

        }
        else {
          previewArr.push(tempArr[i]);
        }
      }
      // console.log(previewArr)
      wx.previewImage({
        current: that.data.longPic[a].midThumbnail,
        urls: previewArr
      });
      that.setData({
        fromSeeBigPic: "1",
      })
    }
    //查看视屏
    else if (b == 4) {
      console.log("video");
      that.setData({
        toseeVideo: true,
        fromSeeBigPic: "1",
        videoUrl: that.data.longPic[a].poriginal,
        isScroll: true
      })
    }
  },
  //关闭视屏查看
  closeSeeVideo: function () {
    var that = this
    that.setData({
      toseeVideo: false,
      isScroll: false,
    })
  },
  //查看相册
  gotodetails:function(){
    wx.redirectTo({
      url: '/pages/details/details?groupid='+this.groupid,
    })
  },
  //页面滑动 固定定位导航
  // onPageScroll: function (obj) {
  //   var system = app.globalData.systemInfo.screenWidth;
  //   var rap = 750 / system;
  //   var scrollTop = obj.scrollTop;
  //   // console.log(scrollTop)
  //   if (scrollTop > (348 / rap)) {
  //     this.setData({
  //       showTop: true
  //     })
  //   } else {
  //     this.setData({
  //       showTop: false
  //     })
  //   }
  // },
  goHome: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})