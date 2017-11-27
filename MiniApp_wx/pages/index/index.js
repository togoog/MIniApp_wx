//index.js
//获取应用实例
var app = getApp();
let unit = require('../../utils/util.js');
const api = require('../../utils/api.js');
var Promise = require('../../utils/promise.js');
var reg = require('../../utils/reg.js');
var startX = 0, startY = 0, endX = 0, endY = 0;
let picaddress = [];
let mainIdStr;
let formId = '';
var reload ;

Page({
  data: {
    Carousel:true,
    pvShowModel: false,
    showModelHidden:false,
    pvShowModel:false,
    dianzan:false,
    textNum: 0,
    Mengcen: false,
    imgArr:"",
    myid:wx.getStorageSync("userid"),
    gotopersonal:false,
    loading:true
  },
  onLoad: function () {
    app.a = 1;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
         
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
        
          })
        }
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
    var that = this;
    //个人中心
    if (wx.getStorageSync("NetworkType") == "justwifi") {
      that.setData({
        checked: "checked"
      })
    }
    else {
      that.setData({
        checked: ""
      })
    }
   


    console.log(wx.getStorageSync("Carousel"));
    console.log(String(wx.getStorageSync("Carousel")))
    if (String(wx.getStorageSync("Carousel"))== 'true'){
      that.setData({
        Carousel: true,
      })
    }
    else if (String(wx.getStorageSync("Carousel")) == 'false'){
      that.setData({
        Carousel: false,
      })
    }
      
    
    /*如果页面是从设置页返回，则不更新数据，如果是从后台进入前台，则调用onshow刷新数据*/
    // if (this.data.fromIndex == "0" ) {
    //   // that.timer = setTimeout(function () {
    //   //   that.setData({
    //   //     fromIndex: 0
    //   //   })
    //   // }, 1000);
    //   return;
    // }
    // if (wx.getStorageSync("creatandreload")=='true'){
    //   wx.setStorageSync("creatandreload", "false")
    //   that.getgrouplist();
    // }
    // else if (wx.getStorageSync("creatandreload") == 'false'){
    //   return
    // }

  if( app.a == 0){
    setTimeout(function(){
      app.a = 1;
    },500)
    return
  }


    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;
    //授权
    app.getUserInfo(function (userInfo) {
      that.setData({
        switchState: wx.getStorageSync('userInfo').uLockPass != null,
        myid: wx.getStorageSync("userid")
      })
      if ((wx.getStorageSync('userInfo').uLockPass != null) && app.globalData.pwdState) {
        wx.navigateTo({
          url: '/pages/others/password/password?setPwd=shuru',
        })
      }
      //判断是否新用户
      let showintroduce = userInfo.isnew == "yes" ? true : false;
      that.getgrouplist();
      //根据接口返回数据判断是否需要隐藏照片拼图入口
      app.getshowState(function (res) {
        that.setData({
          showpuzze: res,
          showintroduce: showintroduce,
          userpic: app.globalData.userInfo.avatarUrl,
          myid: wx.getStorageSync("userid")
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
          console.log(res)
        })
      }
      if (that.shareUserid && that.shCode && showintroduce) {
        if (that.shCode == 'wx') {
          unit.wxreq({
            pathname: 'YinianProject/activity/ReceiveEncourageReward',
            data: {
              userid: that.shareUserid,
              type: 'shareToWechatGroup'
            }
          }).then(res => {
            console.log(res)
          })
        } else if (that.shCode == 'friend') {
          unit.wxreq({
            pathname: 'YinianProject/activity/ReceiveEncourageReward',
            data: {
              userid: that.shareUserid,
              type: 'shareToMoments'
            }
          }).then(res => {
            console.log(res)
          })
        }
      }

      wx.request({
        url: "https://api.zhuiyinanian.com/YinianProject/yinian/GetUserData",
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
      
    }, na, nb, nc, nd, ne);
  },
  changestart: function (e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
  },
  changemove: function (e) {

  },
  changend: function (e) {
    var that = this;
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;
    if (startX - endX > 30) {
      that.data.classArr.unshift(that.data.classArr[that.data.classArr.length - 1]);
      that.data.classArr.pop(that.data.classArr[that.data.classArr.length - 1]);
      that.setData({
        classArr: that.data.classArr
      })
    } else if (endX - startX > 30) {
      that.data.classArr.push(that.data.classArr[0]);
      that.data.classArr.shift(that.data.classArr[0]);
      that.setData({
        classArr: that.data.classArr
      })
    }

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
    return {
      title: app.globalData.userInfo.nickName + '和你分享了几段时光',
      desc: '这里面有几张我很喜欢的照片，快来看看你喜欢嘛？',
      path: '/pages/index/index?port=精简版小程序分享'
    }
  },
  //获取相册列表数据
  getgrouplist() {
    var that = this;
    if (this.toastState) {
      wx.showToast({
        title: "数据加载中",
        icon: "loading",
        duration: 3000,
        success: function () {
          that.toastState = false;
        }
      })
    }
    var that = this;
    unit.wxreq({
      pathname: 'YinianProject/simH5/ShowGroupWithTop',
      data: { userid: app.globalData.userInfo.userid }
    }).then(res => {
      console.log(res)
      let totalpeoNum = 0;
      let totalpicNum = 0;
      res.data.forEach(res => {
        totalpeoNum += 1;
        totalpicNum += res.gpicnum;
      })
      // 轮播动画
      var indexImg = 0;
      console.log(indexImg,11);
      var tempArr = [];
      for (var i = 0; i < res.data.length; i++) {
        if (i == indexImg) {
          tempArr.push({ pic: 'pic1', title: 'title1' });
        } else if (i == (indexImg+1)) {
          tempArr.push({ pic: 'pic2', title: 'title2' });
        } else if (i == (indexImg+2)) {
          tempArr.push({ pic: 'pic3', title: 'title3' });
        } else {
          tempArr.push({ pic: 'pic4', title: 'title3' });
        }
      }
      that.setData({
        classArr: tempArr,
        imgArr: res.data,
        loading: false,
      })
      // wx.setStorage({
      //   key: 'groupListDetail',
      //   data: res.data
      // })
      wx.hideToast()
    })
  },

  gotodetails:function(e){
    var that =this;
    app.a = 0
    that.indexImg = e.currentTarget.dataset.index;
    console.log(that.indexImg,22);
    that.setData({
      fromIndex:"0"
    })
    console.log(e)
    app.status = 2
    // if (app.u == true) {
    //   wx.showToast({
    //     title: '正在上传中喔',
    //     icon: 'loading'
    //   })
    // }
    // else {
      // wx.setStorageSync("groupid", e.currentTarget.dataset.groupid)
      wx.navigateTo({
        url: '../details/details?groupid=' + e.currentTarget.dataset.groupid + "&from=index",
      })
    // }
    
     
    
  },
  //切换首页显示模式
  switchModel:function(){
    var that = this;
    that.data.Carousel = !that.data.Carousel
    
    wx.setStorageSync("Carousel", that.data.Carousel)
    that.setData({
      Carousel: that.data.Carousel
    })
    if (reload && that.data.Carousel == false){
      that.getgrouplist();
      reload = !reload
    }
    else{

    }
    // 不刷新
    // that.getgrouplist()
  },
  //点击上传图片弹出遮罩
  addpicRadio:function(){
    var that = this 
    if(app.u == true ){
        // wx.showModal({
        //   title: '提示',
        //   content: '主人，正在上传中喔~',
        //   showCancel:false,
        // })
      wx.showToast({
        title: '正在上传中喔',
      })
    }
    else{
      that.setData({
        pvShowModel: true
      })
    }
    // console.log(wx.getStorageSync("NetworkType"))
    // if (wx.getStorageSync("NetworkType")=="all"){
    //   that.setData({
    //     pvShowModel: true
    //   })
    // }
    // else{
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前网络状态是4G,确定要传输么',
    //   })
    // }
  },
  //上传图片
  uploadpic: function (e) {
    var that = this;
    app.a = 0;
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
            wx.setStorageSync("from", "index")
            wx.navigateTo({
              url: '../../pages/uploadpic/uploadpic?uploadtype=pic&from=index'
              // url:"../../pages/choosealbum/choosealbum?uploadtype=pic&from=index"
            })
            // wx.navigateTo({
            //   url: '../../pages/uploadpic/uploadpic?from=index'
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
  // 上传视频
  uploadvideo: function (e) {
    var that = this;
    app.a = 0;
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
            wx.navigateTo({
              url: '../../pages/uploadvideo/uploadvideo?uploadtype=video&from=index'
              // url: "../../pages/choosealbum/choosealbum?uploadtype=pic&from=index"
            })
            // wx.navigateTo({
            //   url: '../../pages/uploadvideo/uploadvideo?from=index'
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
  // 关闭上传按钮
  closepvModel:function(){
    var that = this
    that.setData({
      showModelHidden: false,
      pvShowModel: false
    })
  },
  // //点击编辑相册名字
  edit: function (e) {
    console.log(e);
    wx.setStorageSync("groupid", e.currentTarget.dataset.groupid)
    wx.setStorageSync("editindex", e.currentTarget.dataset.editindex)
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
  cancel:function(){
    var that =this
    that.setData({
      Mengcen:false
    })
  },
  // 跳转到我的个人中心
  gotopersonal:function(){
    var that = this;
    that.data.gotopersonal = !that.data.gotopersonal
    that.setData({
      fromIndextopersonal: "1",
      gotopersonal: that.data.gotopersonal
    })
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
  },

  //切换选项 设置网络传输类型
  switchChange: function (e) {
    // console.log(e.detail.value);
    var value = String(e.detail.value)
    console.log(value)
    value = value == "true" ? "justwifi" : "all"
    wx.setStorageSync("NetworkType", value)
  },
  //回到首页
  gotoindex: function () {
      var that =this 
      that.setData({
        gotopersonal:false
      })
      wx.setNavigationBarTitle({
        title: '小影相',
      })
  },
  // 跳转另一个小程序
  toAnotherApp: function () {
    wx.navigateToMiniProgram({
      appId: 'wx48b3b26e45ad2e2e',
      path: 'pages/index/index',
      success(res) {
        // 打开成功
        console.log(res);
      }
    })
  },
  // 扩容
  gotoWalfare: function () {
    wx.navigateTo({
      url: '../welfare/welfare',
    })
  },

  // 内存转换函数
  conversion: function (num) {
    return (num / 1024 / 1024).toFixed(2);
  },
  // 跳转我的相册列表
  gotogrouplist: function () {
    wx.navigateTo({
      url: '../grouplist/grouplist',
    })
  },
  //跳转到我的所有照片
  gotophotowall: function () {
    wx.navigateTo({
      url: '../userphoto/userphoto?from=personal&userid=' + wx.getStorageSync("userid"),
    })
  },


  //修改相册名
  submitfun: function (e) {
    var  that  = this
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
        url: api.getUrl('YinianProject/yinian/ModifyGroupName'),
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
              duration:2000,
            })
            wx.setStorageSync('ganme', grouptitle);
            that.setData({
              Mengcen: false,
            })
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

  // 置顶相册
  makeTop: function (e) {
    var that = this;
    var sel = e.currentTarget.dataset.index;
    var tempList = that.data.imgArr[sel];
    console.log(sel);
    var isTopState = tempList.isTop;
    that.text = isTopState ? "取消置顶" : "置顶";
    wx.showModal({
      title: '提示',
      content: '是否' + that.text + '该相册',
      success: function (res) {
        if (!res.confirm) return;
        var isTopStr = isTopState ? "no" : "yes";
        wx.request({
          url: 'https://api.zhuiyinanian.com/YinianProject/yinian/SetGroupIsTop',
          data: {
            userid: wx.getStorageSync('userid'),
            groupid: tempList.groupid,
            isTop: isTopStr
          },
          success: function (res) {
            if (res.data.code == 0) {
              wx.showToast({
                title: that.text + "成功",
                icon: "success",
                success: function (res) {
                  reload = true ;
                  console.log(reload)
                  // that.getgrouplist();
                  if (that.data.Carousel){
                    tempList.isTop = !tempList.isTop;
                    that.setData({
                      imgArr: that.data.imgArr
                    })
                  }
                  else{
                    tempList.isTop = !tempList.isTop;
                    that.setData({
                      imgArr: that.data.imgArr
                    })
                      that.getgrouplist();
                  }
                  // tempList.isTop = !tempList.isTop;
                  // that.setData({
                  //   imgArr: that.data.imgArr
                  // })
                  // that.getgrouplist()
                }
              })
            }
          }
        })
      }
    })

  },


})
