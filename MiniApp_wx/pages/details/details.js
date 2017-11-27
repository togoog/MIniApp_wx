// pages/details/details.js
var app = getApp();
let unit = require('../../utils/util.js');
// let util = require('../../utils/util.js');
const api = require('../../utils/api.js');
var Promise = require('../../utils/promise.js');
var reg = require('../../utils/reg.js');
let picaddress = [];
let mainIdStr;
let formId = '';

function nosearchtimefirstcheck(){
  wx.request({
    url: '',

    data: {
      userid: wx.getStorageSync("userid"),
      groupid: wx.getStorageSync("groupid"),
      searchTime: wx.getStorageSync("checkDate"),
      orderBy:"desc",
    },
    success: function (res) {
      // console.log(res)
      // console.log(res.data.data[0].picCnt)
      var data = res.data.data[0].picList
      // console.log(data)
      // console.log(data.length)

      if (data.length > 0) {
        for (var i = 0, len = data.length; i < len; i++) {
          var pM = parseInt(Math.random() * 4);
          var emptyUrl;
          var strData = data[i].thumbnail
          // var str = strData.thumbnail
          var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
          // console.log(i,reg.test(strData));
          if (reg.test(strData)) {
            if (pM == 1) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
            } else if (pM == 2) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
            } else if (pM == 2) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
            } else {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
            }
            data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
            // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
              data[i].myMain = 4;
          } else {
            data[i].myMain = 0;
          }
        }
      }
      //把首页的选择的图片临时加载到详情页面
      //先判断有没有临时数据
      if (wx.getStorageSync("uploadchoosedpic") && (wx.getStorageSync("groupid") == app.eid) ){
        var picarr = wx.getStorageSync("uploadchoosedpic");
        console.log(picarr)
        var temparrs = [];
        picarr.forEach(val => {
          var tempobj = {};
          tempobj.thumbnail = val
          temparrs.push(tempobj)
        })
        console.log(temparrs)
        console.log(temparrs.length)
        console.log(data)
        console.log(temparrs.concat(data))
        let a = getCurrentPages();
        let curpage = a[a.length - 1];
        console.log(curpage)
      //  wx.showLoading({
      //    title: '正在上传',
      //  })
       app.status = 2
      curpage.setData({
          imgUrl: temparrs.concat(data),
          hastempcontent: picarr.length,
          totalPicNum: res.data.data[0].picCnt,
          hasPic: true,
        })
      }
      else if (wx.getStorageSync("uploadchoosedvideo")&&(wx.getStorageSync("groupid") == app.eid)){
        var uploadchoosedvideo = wx.getStorageSync("uploadchoosedvideo");
        var temparr =[]
        var tempobj={};
        tempobj.thumbnail = "http://oibl5dyji.bkt.clouddn.com/20170927095849.png";
        tempobj.myMain = 4
        temparr.push(tempobj);
        console.log(temparr);
        let a = getCurrentPages();
        let curpage = a[a.length - 1];
        // wx.showLoading({
        //   title: '正在上传',
        // })
        app.status = 2
        curpage.setData({
          imgUrl: temparr.concat(data),
          hastempcontent: temparr.length,
          totalPicNum: res.data.data[0].picCnt,
          hasPic: true,
        })
      }
      else {
        let a = getCurrentPages();
        let curpage = a[a.length - 1];
        curpage.setData({
          imgUrl: data,
          totalPicNum: res.data.data[0].picCnt,
          hasPic: true,
        })
      }
    }
  })
}
function uploadpicasync(a, b) {
  var that = this;
  if (b.length == 0) {
    //图片上传成功，开始发布动态
    let eplace = wx.getStorageSync('place');

    if (eplace == undefined || eplace == "不显示位置") eplace = '';
    wx.request({
      url: api.getUrl(""),
      data: {
        userid: wx.getStorageSync("userid"),
        groupid: app.eid,
        content: wx.getStorageSync("content"),
        picAddress: picaddress.join(','),
        storage: picaddress.length * 300,
        memorytime: unit.formatTime(new Date()),
        // mode: 'private',
        source: "精简版小程序",
        place: eplace,
        formID: formId,
        isPush: "true",
        main: 0
      },
      success: function (res) {
        // console.log(1122);
        console.log(res);
        if (res.statusCode != 200) {
          wx.removeStorageSync('uploadchoosedpic');
          wx.removeStorageSync('place');
          wx.hideToast();
          picaddress.length = 0;
          wx.showModal({
            title: '提示',
            content: '主人，动图或违规图片传不上去哦！',
            showCancel: false,
            success: function (res) {
              // if (res.confirm) {
              //   wx.navigateBack({
              //     delta: 1,
              //   })
              // }
            }
          })
          return;
        }
        wx.showToast({
          title: '上传完成',
          icon: 'success',
          duration: 1000
        })
        //解除禁止上传
        app.u = false;
        app.status = 1;
        wx.removeStorageSync('uploadchoosedpic');
        wx.removeStorageSync('uploadchoosedvideo');
        wx.removeStorageSync('place');
       //上传完成之后刷新页面
        nosearchtimefirstcheck();
        // 去掉蒙层
        let a = getCurrentPages();
        let curpage = a[a.length - 1];
        curpage.setData({
          hastempcontent:0
        })

        // console.log(res.data.data[0].picList.length, picaddress.length);
        if (res.data.data[0].picList.length == 0) {
          picaddress.length = 0;
          wx.showModal({
            title: '提示',
            content: '主人，动图或违规图片传不上去哦！',
            showCancel: false,
            success: function (res) {
              // if (res.confirm) {
              //   wx.navigateBack({
              //     delta: 1,
              //   })
              // }
            }
          })
          return;
        }
        App.photoData = res.data.data[0];
        if (res.data.data[0].picList.length < picaddress.length) {
          wx.showModal({
            title: '提示',
            content: '主人，有' + (picaddress.length - res.data.data[0].picList.length) + '张动图或违规图片传不上去哦！',
            showCancel: false,
            success: function (res) {
              picaddress.length = 0;
              if (res.confirm) {
                wx.redirectTo({
                  // url: '../commonpage/showpicAfterupload/showpicAfterupload'
                })
              }
            }
          })
        } else {
          picaddress.length = 0;
          wx.redirectTo({
            // url: '../commonpage/showpicAfterupload/showpicAfterupload'
          })
        }
      },
      fail: function () {
        //解除禁止上传
        app.u = false
        wx.showModal({
          title: '提示',
          content: '上传动态不成功，请稍后重试',
          showCancel: false
        })
        wx.removeStorageSync('uploadchoosedpic');
        wx.removeStorageSync('uploadchoosedvideo');
        wx.removeStorageSync('place');
        wx.hideToast();
        picaddress.length = 0;
        wx.navigateBack({
          delta: 1
        })
      }
    })
  } else {
    //继续上传图片
    let currentuploadpic = b.splice(0, 1);
    uppic(a, currentuploadpic, b);
  }
}

function uppic(token, uparr, totalpicarr) {
  var that =this ;
  let val = uparr[0];
  picaddress.push(val.split('//')[1]);
  const uploadTask = wx.uploadFile({
    url: 'https://upload.qiniup.com',
    filePath: val,
    name: 'file',
    formData: {
      'key': val.split('//')[1],
      'token': token
    },
    success: function (res) {
      console.log(res)
      var data = JSON.parse(res.data);
      console.log(data)
      // 照片上传的张数
      console.log(picaddress.length);
      app.status = 2
      let a = getCurrentPages();
      let curpage = a[a.length - 1];
      curpage.setData({
        uploadnum: picaddress.length
      })
      uploadpicasync(token, totalpicarr);
    },
    fail: function () {
      // console.log('1+');
      // uppic(token, uparr, totalpicarr);
    }
  })
  if (wx.canIUse("uploadTask.onProgressUpdate")) { 
    let a = getCurrentPages();
    let curpage = a[a.length - 1];
    curpage.setData({
      uploadnum: picaddress.length
    })
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress);
      //上传图片所对应的在imgUrl中的位置
      var num = picaddress.length
      // 更新该图片的下载进度，
      curpage.data.imgUrl[num].progress = parseInt(res.progress);
      //当上传进度为100时及下载完成，隐藏该图片的进度文字
      if (res.progress == 100) {
        curpage.data.imgUrl[num].mengchen = false;
      }
      curpage.setData({
        imgUrl: curpage.data.imgUrl
      })
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // multiIndex: [0, 0, 0],
    winheight: app.globalData.systemInfo.screenHeight,
    normal: true,
    type: "seebigpic",
    radioTypeText: "",
    init: true,
    disabled: false,
    sortText:"升序",
    sortType:"asc",
    order: "normal",
    canpull: "true", 
    nochecked:"http://oibl5dyji.bkt.clouddn.com/201710230927010.png",
    myid:wx.getStorageSync("userid"),
    checkData:"全部照片",
    checkFeatures:false,
    date:"2017-10",
    loading: true, 
    imgUrl:'',
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 统计需要的字段
    app.b = 1;
    console.log(app.status)
    if (options.version) {
      this.version = options.version;
    }
    if (options.port) {
      this.port = options.port;
      this.setData({
        port: options.port
      })
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
    let _this = this;
    _this.setData({
      fromlast: 0
    })
    if (wx.canIUse) {
      if (wx.canIUse('button.open-type.share')) {
        _this.setData({
          canIUse: true
        })
      }
    }
    this.groupid = options.groupid;
    this.from = options.from ;
    this.mode = options.mode;
    this.type = options.type;
    this.gname = options.gname;
    _this.setData({
      gname: this.gname
    })
    console.log(this.from)
    try {
      wx.setStorageSync('groupid', parseInt(options.groupid));
      // if (wx.getStorageSync("groupid")){
      //   wx.removeStorageSync("groupid");
      // }
      // wx.setStorageSync("from", options.from)
    } catch (e) {
      // console.log(e);
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
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '相册详情',
    })
    var that = this;
    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;
    //获取当前的日期
    var today = new Date()
    var year = today.getFullYear();
    var month = today.getMonth()+1
    var Today = year + "-" + month
    console.log(Today);
    //授权
    app.getUserInfo(function (userInfo) {
      that.setData({
        switchState: wx.getStorageSync('userInfo').uLockPass != null
      })
      if ((wx.getStorageSync('userInfo').uLockPass != null) && app.globalData.pwdState) {
        wx.navigateTo({
          url: '/pages/others/password/password?setPwd=shuru',
        })
      }
      //判断是否新用户
      let showintroduce = userInfo.isnew == "yes" ? true : false;
      // that.getgrouplist();
      //根据接口返回数据判断是否需要隐藏照片拼图入口
      app.getshowState(function (res) {
        that.setData({
          showpuzze: res,
          showintroduce: showintroduce,
          userpic: app.globalData.userInfo.avatarUrl
        })
        // if(res){
        //   unit.wxreq({ pathname: "YinianProject/activity/GetMyPhoto", data: { id: 1 } })
        //     .then(res => {
        //       let searchState = res.data[0].status == 1 ? true : false;
        //       that.setData({
        //         searchState: searchState
        //       })
        //     });
        // }
      });
      // 判断邀请关系
      var userFId = app.globalData.userInfo.userid;
      if (that.shareUserid && showintroduce) {
        unit.wxreq({
          pathname: 'YinianProject/activity/SuccessInviteFriend',
          data: {
            userid: that.shareUserid
          }
        }).then(res => {
          // console.log(res)
        })
      }
      if (that.shareUserid && that.shCode && showintroduce) {
        if (that.shCode == 'wx') {
          unit.wxreq({
            pathname: '',
            data: {
              userid: that.shareUserid,
              type: 'shareToWechatGroup'
            }
          }).then(res => {
            // console.log(res)
          })
        } else if (that.shCode == 'friend') {
          unit.wxreq({
            pathname: '',
            data: {
              userid: that.shareUserid,
              type: 'shareToMoments'
            }
          }).then(res => {
            // console.log(res)
          })
        }
      }
      /*如果页面是从查看大图返回，则不更新数据，否则调用onshow刷新数据*/
      if (that.data.fromSeeBigPic == 1) {
      that.timer = setTimeout(function () {
        that.setData({
          fromSeeBigPic: 1
        })
      }, 1000);
      return;
      }
      unit.wxreq({
        pathname: '',
        data: {
          userid: wx.getStorageSync('userid'),
          groupid: wx.getStorageSync('groupid'),
        }
      }).then(res => {
        // console.log(res)
        const groupinfo = res.data[0];
        wx.setStorageSync("groupinfo", groupinfo);
        wx.setStorageSync("gname", groupinfo.gname)
        wx.setStorageSync("createrid", groupinfo.gcreator)
        wx.setStorageSync("gnum", groupinfo.gnum)
        wx.setStorageSync("gAuthority", groupinfo.gAuthority)
        wx.setStorageSync("authorityList", groupinfo.authorityList)
        that.setData({
          ablumInfo: {
            gnum: groupinfo.gnum,
            picnum: groupinfo.picNum,
            gname: groupinfo.gname,
            list: groupinfo.memberList,
            gpic: groupinfo.gpic,
            gOrigin: groupinfo.gOrigin,
            gcreator: groupinfo.gcreator,
          },
          date: Today,
          choosepid: false,
          loading:false,
        })
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
          // var groupinfo = res.data[0];
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
          let candelete;
          if ((groupinfo.gtype == 10 || groupinfo.gtype == 11) && UserInfo.userid == groupinfo.gcreator) {
            candelete = true
          } else {
            candelete = false
          }
        }
      })
      if (app.b == 0) {
        setTimeout(function () {
          app.b = 1;
        }, 500)
        return
      }
      //加载图片
    nosearchtimefirstcheck();
    //上传临时图片
    // if(wx.getStorageSync("from")=='index'){
    //   return
    // }
    // if (wx.getStorageSync("from") == 'uploading'){
    //   that.uploadtemppic();
    // }
    if (wx.getStorageSync("uploadchoosedpic")){
      that.uploadtemppic();
    }
    if (wx.getStorageSync("uploadchoosedvideo")){
      that.uploadtempvideo();
    }
  
    }, na, nb, nc, nd, ne);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync("checkDate")
    // wx.removeStorageSync("uploadchoosedvideo")
    // wx.removeStorageSync("uploadchoosedpic")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.removeStorageSync("uploadchoosedvideo")
    // wx.removeStorageSync("uploadchoosedpic")
    wx.removeStorageSync("checkDate")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // console.log(e);
    var that = this;
    // console.log(that.data.order)
    // console.log(that.data.fromDateCheck)
    //顺序

    if (that.data.imgUrl.length > 0){
      if (that.data.order == "normal" && that.data.canpull == "true") {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
        })
        wx.request({
          url: "",
         
          data: {
            userid: wx.getStorageSync("userid"),
            groupid: wx.getStorageSync("groupid"),
            searchTime: wx.getStorageSync("checkDate"),
            pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
          },
          success: function (res) {
            wx.hideToast()
            // console.log(res.data.data[0].picCnt)
            var data = res.data.data[0].picList
            // console.log(data.length)
            if (data.length > 0) {
              for (var i = 0, len = data.length; i < len; i++) {
                var pM = parseInt(Math.random() * 4);
                var emptyUrl;
                var strData = data[i].thumbnail
                // var str = strData.thumbnail
                var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
                // console.log(i,reg.test(strData));
                if (reg.test(strData)) {
                  if (pM == 1) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
                  } else if (pM == 2) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
                  } else if (pM == 2) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
                  } else {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
                  }
                  data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
                  // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
                  data[i].myMain = 4;
                } else {
                  data[i].myMain = 0;
                }
              }
            }
            else {
              wx.showToast({ title: "已加载全部照片", duration: 2500 })
            }
            that.setData({
              imgUrl: that.data.imgUrl.concat(data)
            })
          }
        })
      }
      //倒叙
      else if (that.data.order == "reverse" && that.data.canpull == "true") {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
        })
        wx.request({
          url: "",
          
          data: {
            userid: wx.getStorageSync("userid"),
            groupid: wx.getStorageSync("groupid"),
            searchTime: wx.getStorageSync("checkDate"),
            orderBy: "asc",
            pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
          },
          success: function (res) {
            wx.hideToast()
            // console.log(res.data.data[0].picCnt)
            var data = res.data.data[0].picList
            // console.log(data.length)
            if (data.length > 0) {
              for (var i = 0, len = data.length; i < len; i++) {
                var pM = parseInt(Math.random() * 4);
                var emptyUrl;
                var strData = data[i].thumbnail
                // var str = strData.thumbnail
                var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
                // console.log(i,reg.test(strData));
                if (reg.test(strData)) {
                  if (pM == 1) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
                  } else if (pM == 2) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
                  } else if (pM == 2) {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
                  } else {
                    emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
                  }
                  data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
                  // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
                  data[i].myMain = 4;
                } else {
                  data[i].myMain = 0;
                }
              }
            }
            else {
              wx.showToast({ title: "已加载全部照片", duration: 2500 })
            }
            that.setData({
              imgUrl: that.data.imgUrl.concat(data)
            })
          }
        })
      }
    }
    //无数据 不触发上拉加载
    else{
      return
    }
  },
  onShareAppMessage: function () {
    var that =this
    return {
      title: app.globalData.userInfo.nickName + '邀请你加入“' + that.data.ablumInfo.gname +'”相册',
      desc: '这里面有几张我很喜欢的照片，快来看看你喜欢嘛？',
      path: '/pages/details/details?port=精简版小程序分享' + "&groupid=" + wx.getStorageSync("groupid")
    }
  },
// 首页进来上传图片
uploadtemppic:function(){
  var picarr = wx.getStorageSync("uploadchoosedpic");
        //禁止上传
        app.u = true;
        //正在上传2  1表示没有上传  
        console.log(app.status)
        if (app.status == 1){
          app.eid = wx.getStorageSync("groupid")
          // 获取图片上传token
          wx.request({
            url: api.getUrl(''),
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res);
              if (res.data.code === 0) {
                app.status == 2
                uploadpicasync(res.data.data[0].token, picarr);
              }
            }
          })
        }

},
//  首页进来上传视频
uploadtempvideo: function () {
  var that =this
  var picarr = wx.getStorageSync("uploadchoosedvideo");
  //禁止上传
  app.u = true
  if(app.status == 1){
    app.eid = wx.getStorageSync("groupid")
    // 获取上传token
    wx.request({
      url: api.getUrl(''),
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
       
        var token = res.data.data[0].token;
        // var val = that.data.choosevideo;
        var val = picarr
        const uploadTask = wx.uploadFile({
          url: 'https://upload.qiniup.com',
          filePath: val,
          name: 'file',
          formData: {
            'key': val.split('//')[1],
            'token': token
          },
          success: function (res) {
            that.setData({
              uploadnum: 1
            })
            var data = JSON.parse(res.data);
            var address = data.key;
            wx.request({
              url: api.getUrl(""),
              method: 'GET',
              data: {
                userid: wx.getStorageSync("userid"),
                groupid: app.eid,
                content: '',
                address: address,
                storage: 6000,
                place: ''
              },
              success: function (res) {
                app.u = false
                app.status = 1
                console.log(res);
                wx.showToast({
                  title: '上传完成',
                  icon: 'success',
                  duration: 1000
                })
                wx.removeStorageSync("uploadchoosedvideo");
                nosearchtimefirstcheck();
                that.setData({
                  hastempcontent: 0
                })
                if (res.statusCode != 200) {
                  // wx.removeStorageSync('uploadchoosedvideo');
                  // wx.removeStorageSync('place');
                  wx.hideToast();
                  wx.showModal({
                    title: '提示',
                    content: '网络忙，请重试',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx: wx.navigateBack({
                          delta: 1,
                        })
                      }
                    }
                  })
                  return;
                }
                // wx.hideToast();
                app.a = 1
                console.log("上传视频成功");
                
                return
                // wx.removeStorageSync('uploadchoosedvideo');
                // wx.removeStorageSync('place');
                // App.vedioData = res.data.data[0];
                // wx.redirectTo({
                //   url: '../commonpage/showvideoAfterupload/showvideoAfterupload'
                // })
              },
              fail: function () {
                app.u = false
              }
            })
          },
          fail: function (res) {
            app.u = false
            console.log(res);
            app.status = 1
          }
        })
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          //上传图片所对应的在imgUrl中的位置
          that.setData({
            hastempcontent: 1
          })
          // 更新该图片的下载进度，
          that.data.imgUrl[0].progress = parseInt(res.progress)
          //当上传进度为100时及下载完成，隐藏该图片的进度文字
          if (res.progress == 100) {
            that.data.imgUrl[0].mengchen = false;
          }
          that.setData({
            imgUrl: that.data.imgUrl
          })
        })
      }
    })
  }
  
},
//详情页上传图片
uploadpic: function (e) {
  var that = this;
  app.b = 0
  if (!wx.getStorageSync('userid')) {
    wx.showModal({
      title: "错误",
      content: "获取用户授权信息失败！请稍后再试",
      showCancel: false
    })
    return;
  }
  var e = e || event;
  var selPic = e.currentTarget.dataset.pic
  var typePic;
  if (selPic == 'pai') {
    typePic = 'camera';
  } else {
    typePic = 'album';
  }
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['original'],
    sourceType: [typePic],
    success: function (res) {
      var tempFilePaths = res.tempFilePaths
      wx.setStorage({
        key: 'uploadchoosedpic',
        data: tempFilePaths,
        success: function () {
          that.setData({
            pvShowModel: false
          })
          app.status = 1;
          app.eid = wx.getStorageSync("groupid")
          //选择完了之后先添加到页面然后立即上传
          var temparr = []
          tempFilePaths.forEach(val => {
            var tempobj = {};
            tempobj.thumbnail = val
            temparr.push(tempobj)
          })
          console.log(temparr)
          that.setData({
            imgUrl: temparr.concat(that.data.imgUrl),
            hastempcontent: temparr.length
          })
          // wx.showLoading({
          //   title: '正在上传',
          // })
          that.uploadtemppic();
          // wx.showLoading({
          //   title: '正在上传',
          // })
          // wx.navigateTo({
          //   url: '../../pages/uploadpic/uploadpic?from=details'
          // })
        },
        fail: function () {
          wx.showToast({
            title: '保存图片临时数据失败',
          })
        }
      })

    }
  })
},
// 详情页上传视频
uploadvideo: function (e) {
  var that = this;
  app.b = 0
  if (!wx.getStorageSync('userid')) {
    wx.showModal({
      title: '错误',
      content: '获取用户授权信息失败！请稍后再试',
      showCancel: false
    })
    return;
  }
  // that.hiddenlike();
  var e = e || event;
  var selVideo = e.currentTarget.dataset.video
  var typeVideo;
  if (selVideo == 'pai') {
    typeVideo = 'camera';
  } else {
    typeVideo = 'album';
  }
  wx.chooseVideo({
    sourceType: [typeVideo],
    maxDuration: 60,
    camera: 'back',
    success: function (res) {
      var tempFilePaths = res.tempFilePath;
      wx.setStorage({
        key: 'uploadchoosedvideo',
        data: tempFilePaths,
        success: function () {
          that.setData({
            pvShowModel: false
          })
          app.status = 1;
          app.eid = wx.getStorageSync("groupid")
          //选择完了之后先添加到页面然后立即上传
          var temparr = []
          var tempobj = {};
          tempobj.thumbnail = "http://oibl5dyji.bkt.clouddn.com/20170927095849.png";
          tempobj.myMain = 4
          temparr.push(tempobj);
          console.log(temparr)
          that.setData({
            imgUrl: temparr.concat(that.data.imgUrl),
            hastempcontent: temparr.length,
          })
          // wx.showLoading({
          //   title: '正在上传',
          // })
          that.uploadtempvideo();
          // wx.showLoading({
          //   title: '正在上传',
          // })
          that.setData({
            hastempcontent: 0
          })
          // wx.navigateTo({
          //   url: '/pages/uploadvideo/uploadvideo?from=details'
          // })
        },
        fail: function () {
          wx.showToast({
            title: '保存视频临时数据失败',
          })
        }
      })
    }
  })
},
//选择编辑照片
select: function () {
    var that = this
    that.data.editType = !that.data.editType;
    that.data.normal = !that.data.normal
    that.setData({
      normal: that.data.normal,
      type: "choose",
      disabled: true,
      editType: that.data.editType,
      checkFeatures:false,
    })
  },
  // 取消编辑照片选择
  cancel: function () {
    var that = this
    that.setData({
      normal: true,
      type: "seebigpic",
      disabled: false,
      editType: false,
      nochecked: "http://oibl5dyji.bkt.clouddn.com/201710230927010.png",
    })
  },
  // 正常模式查看大图
  /*查看大图或者查看视频*/
  seebigpic: function (e) {
    // console.log(e)
    var that = this;
    // 当前的索引
    var a = e.currentTarget.dataset.index;
    // console.log(a)
    // 当前的类型是图片还是视频
    var b = e.currentTarget.dataset.mymain
    // console.log(b)
    //图片
    if ( b == 0)   {
      var tempArr = [];
      this.data.imgUrl.forEach(val => {
        tempArr.push(val.midThumbnail)
      })
      // 查看大图删除视频
      var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
      // console.log(tempArr)
      var previewArr = [];
      for (var i = 0; i < tempArr.length; i++) {
        if (reg.test(tempArr[i])) {

        }
        else{
          previewArr.push(tempArr[i]);
        }
      }
      // console.log(previewArr)
      wx.previewImage({
        current: that.data.imgUrl[a].midThumbnail,
        urls: previewArr
      });
      that.setData({
        fromSeeBigPic: "1",
      })
    }
    //查看视屏
    else if( b == 4 ){
        // console.log("video");
        that.setData({
          toseeVideo:true,
          fromSeeBigPic: "1",
          videoUrl: that.data.imgUrl[a].poriginal,
          isScroll:true
        })
    }
  },
  //关闭视屏查看
  closeSeeVideo:function(){
      var that =this;
      console.log(that.data.scrollTop)
      that.setData({
        toseeVideo: false,
        isScroll:false,
      })
      wx.pageScrollTo({
        scrollTop: that.data.scrollTop
      })
  },
  // 选择模式
  choose: function (e) {
    var chooseArr = [];
    var choosepid = [];
    // console.log(e);
    var index = e.currentTarget.dataset.index
    // console.log(e.currentTarget.dataset.index)
    var that = this;
    
    // console.log(that.data.imgUrl)
   
    that.data.imgUrl[index].cheaked = !that.data.imgUrl[index].cheaked;
    // console.log(that.data.imgUrl[index].poriginal)
    // chooseArr.push(that.data.imgUrl[index].midThumbnail)
    // console.log(chooseArr)
    //选择的图片放在一个数组里面
    this.data.imgUrl.forEach(val => {
      if (val.cheaked == true){
        chooseArr.push(val.poriginal);
        choosepid.push(val.pid)
      }
    })
    // console.log(chooseArr);
    if (chooseArr.length > 9){
      wx.showModal({
        title: '提示',
        content: '最多选择九张',
        showCancel:false,
      })
      // wx.showToast({
      //   title: '最多选择九张',
      // })
      //短路操作
      that.data.imgUrl[index].cheaked = false;
    }
    // console.log(chooseArr);
    // console.log(choosepid);
    that.setData({
      imgUrl: that.data.imgUrl,
      chooseArr: chooseArr,
      choosepid: choosepid,
      editType:true
    })

  },
  //点击编辑相册名字
  edit: function () {
    var that = this
    that.setData({
      Mengcen: true
    })
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

  //分享
  gotoshare:function(){
    var that =this
    app.b = 0
    // console.log(that.data.choosepid)
    // console.log(that.data.choosepid.join(','))
    var shareUrl = that.data.choosepid.slice(0, 9).join(',');
    // console.log(shareUrl)
    // wx.setStorageSync("shareUrl", shareUrl)
      wx.request({
        url: "",
        data: {
          ids: shareUrl,
          userid: wx.getStorageSync("userid")
        },
        success: function (res) {
          // console.log(res)
          // console.log(res.data.data[0].shareId)
          wx.setStorageSync("shareId", res.data.data[0].shareId);
          wx.navigateTo({
            url: '../share/share?shareId=' + wx.getStorageSync("shareId") + "&groupid=" + wx.getStorageSync("groupid") +"&innerApp=yes",
          })
        }
      })
  },
  //下载图片 或者视频
  downloadRadio: function () {
    var that =this
    var shareImg = that.data.chooseArr.slice(0, 9);
    wx.setStorageSync("shareBigPic", shareImg)
    var totalnum = wx.getStorageSync("shareBigPic").length;
    var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
    var regHttps = new RegExp("https");
    var arr = wx.getStorageSync("shareBigPic");
    console.log(arr)
    var arrpic = [];
    var arrvideo = [];
    var candownpic=[];
    var candownvideo=[];
    arr.forEach(val => {
      // console.log(val)
      if (reg.test(val)) {
        arrvideo.push(val)
      }
      else {
        arrpic.push(val)
      }
    }) 
    //获取权限
    // wx.getSetting({
    //   success(res) {
    //     if (!res['scope.writePhotosAlbum']) {
    //       // 设置询问
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success(res) {
    //           console.log(res)
          
    //         },
    //         fail() { return },
    //         complete() { }
    //       })
    //     }
    //   }
    // })
    // wx.showLoading({
    //   title: '正在下载',
    // })
    // 下载图片函数
    that.downLoad()
  } ,

  //自调函数 下载图片
  downLoadingpic: function (a, arr) {
    //a表示的是第几张图片，arr表示剩下的图片数组；
    var that = this;
    //当数组的长度为0时，表示所有图片已经下载完
    if (arr.length == 0) {
      //下载完成后初始化数据
      // that.setData({
      //   picList: that.resetList
      // })
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '图片下载完成',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              normal: true,
              downloadprogressmengcen: false,
              type: "seebigpic",
              disabled: false,
              editType: false,
              nochecked: "http://oibl5dyji.bkt.clouddn.com/201710230927010.png",
            })
          }
        }
      })
      return;
    }
    console.log(a);
    const downloadTask = wx.downloadFile({
      url: arr[0], //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log(res);
        if (res.statusCode == 200) {
          //保存图片到本地相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res);
              //删除数组中已下载的图片
              arr.splice(0, 1);
              //对应数组中的下标；
              a++
              that.downLoadingpic(a, arr);
            }
          })
        }
      }
    })
    if (wx.canIUse("downloadTask.onProgressUpdate")) {
      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress);
        //下载图片所对应的在picList中的位置
        // var num = that.tempArr[a].idx;
        // 更新该图片的下载进度，
        // that.data.imgUrl[num].progress = parseInt(res.progress);
        //当下载进度为100时及下载完成，隐藏该图片的进度文字
        if (res.progress == 100) {
          // that.data.imgUrl[num].mengchen = false;
        }
        // 实时更新进度
        // that.setData({
        //   imgUrl: that.data.imgUrl
        // })
      })
    }
  },
  //自调函数 下载视频
  downLoadingvideo: function (a, arr) {
    //a表示的是第几张图片，arr表示剩下的图片数组；
    var that = this;
    //当数组的长度为0时，表示所有图片已经下载完
    if (arr.length == 0) {
      //下载完成后初始化数据
      // that.setData({
      //   picList: that.resetList
      // })
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '视频下载完成',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              normal: true,
              downloadprogressmengcen: false,
              type: "seebigpic",
              disabled: false,
              editType: false,
              nochecked: "http://oibl5dyji.bkt.clouddn.com/201710230927010.png",
            })
          }
        }
      })
      return;
    }
    console.log(a);
    const downloadTask = wx.downloadFile({
      url: arr[0], //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log(res);
        if (res.statusCode == 200) {
          //保存图片到本地相册
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res);
              //删除数组中已下载的图片
              arr.splice(0, 1);
              //对应数组中的下标；
              a++
              that.downLoadingvideo(a, arr);
            }
          })
        }
      }
    })
    if (wx.canIUse("downloadTask.onProgressUpdate")) {
      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress);
        //下载图片所对应的在picList中的位置
        // var num = that.tempArr[a].idx;
        // 更新该图片的下载进度，
        // that.data.imgUrl[num].progress = parseInt(res.progress);
        //当下载进度为100时及下载完成，隐藏该图片的进度文字
        if (res.progress == 100) {
          // that.data.imgUrl[num].mengchen = false;
        }
        // 实时更新进度
        // that.setData({
        //   imgUrl: that.data.imgUrl
        // })
      })
    }
  },
  //点击下载图片和视频
  downLoad: function () {
    var that = this;
    var tempArr = [];
    this.tempArr = [];
    var arrpic = [];
    var arrvideo = [];
    var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
    var regHttps = new RegExp("https");
    var arr = wx.getStorageSync("shareBigPic");
    wx.getStorageSync("shareBigPic").forEach(val=>{
      if (reg.test(val)){
        arrvideo.push(val)
      }
      else{
        arrpic.push(val)
      }
    })
    console.log(arrpic);
    console.log(arrvideo);
    if (arrpic.length > 0) {
        //查看授权状态；
        wx.getSetting({
          success(res) {
            console.log(res);
            if (!res.authSetting['scope.writePhotosAlbum']) {
              console.log('authSetting');
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success(res) {
                  console.log(res);
                  // 用户已经同意小程序使用保存照片到手机的功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
                  that.setData({
                         downloadprogressmengcen: true,
                      })
                },
                fail: function (res) {
                  //拒绝授权时会弹出提示框，提醒用户需要授权
                  wx.showModal({
                    title: '提示',
                    content: '下载需要授权，是否去授权',
                    success: function (res) {
                    
                      if (res.confirm) {
                    
                        wx.openSetting({
                          success: function (res) {
                            console.log(res);
                          }
                        })
                      }
                    }
                  })
                }
              })
            } else {
              console.log("已经授权过了");
              that.setData({
                downloadprogressmengcen: true,
              })
              wx.showLoading({
                title: '正在下载',
              })
              that.downLoadingpic(0, arrpic);//调用下载图片自调用函数

            }
          }
        })

      // if (wx.canIUse("downloadTask.onProgressUpdate")) {
      //   for (var i = 0; i < tempArr.length; i++) {
      //     that.data.imgUrl[tempArr[i].idx].mengchen = true;
      //   }
      //   that.setData({
      //     picList: that.data.picList
      //   })
      // }
    } 
    if (arrvideo.length > 0) {
        //查看授权状态；
        wx.getSetting({
          success(res) {
            console.log(res);
            if (!res.authSetting['scope.writePhotosAlbum']) {
              console.log('authSetting');
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success(res) {
                  console.log(res);
                  // 用户已经同意小程序使用保存照片到手机的功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
                   that.setData({
                      downloadprogressmengcen: true,
                    })
                },
                fail: function (res) {
                  //拒绝授权时会弹出提示框，提醒用户需要授权
                  wx.showModal({
                    title: '提示',
                    content: '下载需要授权，是否去授权',
                    success: function (res) {
                      if (res.confirm) {
                        
                        wx.openSetting({
                          success: function (res) {
                            console.log(res);
                          }
                        })
                      }
                    }
                  })
                }
              })
            } else {
              console.log("已经授权过了");
              that.setData({
                downloadprogressmengcen: true,
              })
              wx.showLoading({
                title: '正在下载',
              })
              that.downLoadingvideo(0, arrvideo);//调用下载视频自调用函数
            }
          }
        })
    
    }
  },

  //点击上传图片弹出遮罩
  addpicRadio: function () {
    var that = this;
    if (wx.getStorageSync('gAuthority') == 1) {
      if (wx.getStorageSync('userid') != wx.getStorageSync('createrid')) {
        wx.showModal({
          title: '提示',
          content: '只能创建者才能上传',
        })
        return;
      }

    }
    if (wx.getStorageSync('gAuthority') == 2) {
      var arrList = wx.getStorageSync('authorityList');
      if (arrList.length == 0) {
        return;
      }
      for (var i = 0; i < arrList.length; i++) {

        if (arrList[i].userid == wx.getStorageSync('userid')) {

          that.quanxian = true;
        }
      }

      if (!that.quanxian) {
        wx.showModal({
          title: '提示',
          content: '没有上传照片的权限',
          showCancel: false
        })
        return;
      }
    }
    if (app.u == true){
      // wx.showModal({
      //   title: '提示',
      //   content: '主人，正在上传中喔~',
      //   showCancel: false
      // })
      wx.showToast({
        title: '正在上传中喔',
      })
      return;
    }
    that.setData({
      pvShowModel: true
    })
  },

  // //点击上传图片弹出遮罩
  // addpicRadio: function () {
  //   // var that = this
  //   // that.setData({
  //   //   pvShowModel: true
  //   // })
  // },

  // 关闭上传按钮
  closepvModel: function () {
    var that = this
    that.setData({
      showModelHidden: false,
      pvShowModel: false
    })
  },
  //相册设置
  gotoalbumset: function () {
    app.b = 0
    wx.navigateTo({
      url: '../albumSet/albumSet',
    })
  },
  //相册排序
  // 升序
  asc:function(){
    var that =this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    wx.request({
      url: "",
   
      data: {
        userid: wx.getStorageSync("userid"),
        groupid: wx.getStorageSync("groupid"),
        searchTime: wx.getStorageSync("checkDate"),
        orderBy:"asc",
        // pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
      },
      success:function(res){
        wx.hideToast()
        // console.log(res.data.data[0].picCnt)
        // console.log(res);
        var data = res.data.data[0].picList
        // console.log(data.length)
        if (data.length > 0) {
          for (var i = 0, len = data.length; i < len; i++) {
            var pM = parseInt(Math.random() * 4);
            var emptyUrl;
            var strData = data[i].thumbnail
            // var str = strData.thumbnail
            var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
            // console.log(i,reg.test(strData));
            if (reg.test(strData)) {
              if (pM == 1) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
              } else {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
              }
              data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
              // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
              data[i].myMain = 4;
            } else {
              data[i].myMain = 0;
            }
          }
        }
        that.setData({
          imgUrl: data,
          canpull:"true",
          sortType: "desc",
          order:"reverse",
          totalPicNum: res.data.data[0].picCnt,
          sortText:"倒序"
        })
      }
    })
  },
// 降序
desc:function(){
  var that = this
  wx.showToast({
    title: '加载中',
    icon: 'loading',
  })
  // 没有查询时间时候
    wx.request({
      url: "",
     
      data: {
        userid: wx.getStorageSync("userid"),
        groupid: wx.getStorageSync("groupid"),
        searchTime: wx.getStorageSync("checkDate"),
        orderBy: "desc",
        // pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
      },
      success: function (res) {
        wx.hideToast()
        console.log(res);
        console.log(res.data.data[0].picCnt)
        var data = res.data.data[0].picList
        console.log(data.length)
        if (data.length > 0) {
          for (var i = 0, len = data.length; i < len; i++) {
            var pM = parseInt(Math.random() * 4);
            var emptyUrl;
            var strData = data[i].thumbnail
            // var str = strData.thumbnail
            var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
            // console.log(i,reg.test(strData));
            if (reg.test(strData)) {
              if (pM == 1) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
              } else {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
              }
              data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
              // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
              data[i].myMain = 4;
            } else {
              data[i].myMain = 0;
            }
          }
        }
        that.setData({
          imgUrl: data,
          canpull: "true",
          sortType: "asc",
          order: "normal",
          totalPicNum: res.data.data[0].picCnt,
          checkFeatures: false,
          sortText: "升序"
        })
      }
    })
},
//弹出日期和全部照片选择
alertCheckData:function(){
  var that = this;
    // if(that.data.type =="choose"){
    //   checkFeatures: false
    // }
    // else{
      that.setData({
        checkFeatures: true
      })
    // }
},
//取消蒙层
  cancelCheck:function(){
    var that = this;
    that.setData({
      checkFeatures: false
    })
  },

//日期查询
bindDateChange: function (e) {
  var that = this
  console.log('picker发送选择改变，携带值为', e.detail.value)
  wx.setStorageSync("checkDate", e.detail.value)
  wx.showToast({
    title: '加载中',
    icon: 'loading',
  })
  wx.request({
    url: "",
   
    data: {
        userid: wx.getStorageSync("userid"),
        groupid: wx.getStorageSync("groupid"),
        searchTime: e.detail.value,
        orderBy: "desc",
        // pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
    },
    success:function(res){
      wx.hideToast()
      console.log(res);
      console.log(res.data.data[0].picCnt)
      var data = res.data.data[0].picList
      console.log(data.length)
      if (data.length > 0) {
        for (var i = 0, len = data.length; i < len; i++) {
          var pM = parseInt(Math.random() * 4);
          var emptyUrl;
          var strData = data[i].thumbnail
          // var str = strData.thumbnail
          var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
          // console.log(i,reg.test(strData));
          if (reg.test(strData)) {
            if (pM == 1) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
            } else if (pM == 2) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
            } else if (pM == 2) {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
            } else {
              emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
            }
            data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
            // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
            data[i].myMain = 4;
          } else {
            data[i].myMain = 0;
          }
        }
      }
      that.setData({
        totalPicNum: res.data.data[0].picCnt,
        canpull:"true",
        imgUrl: data,
        order:"normal",
        fromDateCheck:"true",
        checkData: e.detail.value
      })
    }
  })
},
//所有照片
  seeallpics:function(){
    var that = this
    // 没有查询时间时候
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    wx.request({
      url: "",
   
      data: {
        userid: wx.getStorageSync("userid"),
        groupid: wx.getStorageSync("groupid"),
        searchTime: "",
        orderBy: "desc",
        // pid: that.data.imgUrl[(that.data.imgUrl.length - 1)].pid
      },
      success: function (res) {
        wx.hideToast()
        console.log(res);
        console.log(res.data.data[0].picCnt)
        var data = res.data.data[0].picList
        console.log(data.length)
        if (data.length > 0) {
          for (var i = 0, len = data.length; i < len; i++) {
            var pM = parseInt(Math.random() * 4);
            var emptyUrl;
            var strData = data[i].thumbnail
            // var str = strData.thumbnail
            var reg = new RegExp("(.mp4|.MP4|.3gp|.3GP|.avi|.AVI|.flv|.FLV|.MKV|.mkv)");
            // console.log(i,reg.test(strData));
            if (reg.test(strData)) {
              if (pM == 1) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144811.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144815.png";
              } else if (pM == 2) {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144819.png";
              } else {
                emptyUrl = "http://oibl5dyji.bkt.clouddn.com/20170927144824.png";
              }
              data[i].thumbnail = data[i].pcover ? data[i].pcover : emptyUrl;
              // data[i].thumbnail = data[i].pcover ? data[i].pcover : "http://oibl5dyji.bkt.clouddn.com/20170927095849.png",
              data[i].myMain = 4;
            } else {
              data[i].myMain = 0;
            }
          }
        }
        that.setData({
          imgUrl: data,
          canpull: "true",
          sortType: "asc",
          order: "normal",
          totalPicNum: res.data.data[0].picCnt,
          checkFeatures: false,
          checkData: "全部照片"

        })
        //移除日期查询
        wx.removeStorageSync("checkDate")
      }
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
            ablumInfo:{
              gname: grouptitle,
              gnum: wx.getStorageSync("groupinfo").gnum,
              picnum: wx.getStorageSync("groupinfo").picNum,
              list: wx.getStorageSync("groupinfo").memberList,
              gpic: wx.getStorageSync("groupinfo").gpic,
              gOrigin: wx.getStorageSync("groupinfo").gOrigin,
              gcreator: wx.getStorageSync("groupinfo").gcreator,
            }
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
//成员列表管理
gotoMemberlist:function(){
  app.b = 0
  wx.navigateTo({
    url: '../memberlist/memberlist',
  })
},
//页面滑动 固定定位导航
onPageScroll: function (obj) {
  var system = app.globalData.systemInfo.screenWidth;
  var rap = 750 / system;
  var scrollTop = obj.scrollTop;
  // console.log(scrollTop)
  wx.setStorageSync("scrollTop", scrollTop)
  if (scrollTop > (348 / rap)) {
      this.setData({
        showTop: true,
        scrollTop: scrollTop
      })
  } else {
      this.setData({
        showTop: false,
        scrollTop: scrollTop
      })
  }
},
//删除照片
del:function(){
  var that = this;
  var successarr=[];
  var succeesnum = 0;
  var delPid = that.data.choosepid.slice(0,9);
  console.log(delPid.length);
  wx.showModal({
    title: '提示',
    content: '仅可删除本人上传照片',
    success: function (res) {
      if (res.confirm) {
        wx.showToast({
          title: "正在删除",
          icon: "loading"
        })
        var num = 0
        wx.request({
          url: "",
          data:{
            userid: wx.getStorageSync("userid"),
            pid: delPid.join(",")
          }
          ,success:function(res){
            console.log(res)
            console.log(res.data.data[0].deleteCnt)
            if (res.data.code == 0){
              wx.hideLoading()
              wx.showModal({
                    title: '提示',
                    content: '已成功删除' + res.data.data[0].deleteCnt +'张本人上传照片',
                    showCancel:false,
                  })
              
            }
            nosearchtimefirstcheck()
            that.setData({
              choosepid:false,
            })
          }
        
        })
      } else if (res.cancel) {
      }
    }
  })
},
goHome: function () {
  wx.reLaunch({
      url: '/pages/index/index',
    })
},


})
