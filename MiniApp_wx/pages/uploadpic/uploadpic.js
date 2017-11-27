// pages/uploadpic/uploadpic.js

var app = getApp();
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');
var reg = require('../../utils/reg.js');
let picaddress = [];
let mainIdStr;
let formId = '';
var upnum = 0;
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
        groupid: wx.getStorageSync("groupid"),
        content: wx.getStorageSync("content"),
        picAddress: picaddress.join(','),
        storage: picaddress.length * 300,
        memorytime: util.formatTime(new Date()),
        // mode: 'private',
        source: "精简版小程序",
        place: eplace,
        formID: formId,
        isPush: "true",
        main: 0
      },
      success: function (res) {
        console.log(1122);
        console.log(res);
        // 上传成功 
        app.a = 1;
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
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
          return;
        }
        let a = getCurrentPages();
        let curpage = a[a.length - 1];
        wx.hideToast();
        wx.removeStorageSync('uploadchoosedpic');
        wx.removeStorageSync('place');
        wx.showToast({
          title: '上传完成',
          icon: 'success',
          duration: 1000
        })
        curpage.setData({
          radioText: "上传完成",
          methods:"gotoDetail",
          disabled: false,
      
        })
        wx.setNavigationBarTitle({
          title: '上传完成',
        })
        // console.log(res.data.data[0].picList.length, picaddress.length);
        if (res.data.data[0].picList.length == 0) {
          picaddress.length = 0;
          wx.showModal({
            title: '提示',
            content: '主人，动图或违规图片传不上去哦！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
          return;
        }
        App.photoData = res.data.data[0];
        if (res.data.data[0].picList.length < picaddress.length) {
              //刷新过滤违规图片
              // var p = getCurrentPages();
              // console.log(p)
              // var currentpage = p[p.length - 1]
              // console.log(currentpage.data)
              // console.log(res.data.data[0].picList);
              // var TempArr = []
              // res.data.data[0].picList.forEach(val=>{
              //   TempArr.push(val.thumbnail)
              // })
              // console.log(TempArr)
              // currentpage.setData({
              //       ImgArr: TempArr,
              //       radioText:"ok"
              //  })
          wx.showModal({
            title: '提示',
            content: '有' + (picaddress.length - res.data.data[0].picList.length) + '张照片被过滤！1、图片/视频涉及不健康信息；2、不支持GIF动画上传；',
            showCancel: false,
            success: function (res) {
              picaddress.length = 0;
              if (res.confirm) {
                // currentpage.setData({
                //     ImgArr: res.data.data[0].picList
                //   })
                // wx.redirectTo({
                //   url: '../commonpage/showpicAfterupload/showpicAfterupload'
                // })
              }
            }
          })
        } else {
          picaddress.length = 0;
          // wx.redirectTo({
          //   url: '../commonpage/showpicAfterupload/showpicAfterupload'
          // })
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '上传动态不成功，请稍后重试',
          showCancel: false
        })
        wx.removeStorageSync('uploadchoosedpic');
        wx.removeStorageSync('place');
        wx.hideToast();
        picaddress.length = 0;
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
   else {
    //继续上传图片
    let currentuploadpic = b.splice(0, 1);
    uppic(a, currentuploadpic, b);
  }
}

function uppic(token, uparr, totalpicarr) {
  let val = uparr[0];
  picaddress.push(val.split('//')[1]);
  wx.uploadFile({
    url: 'https://upload.qiniup.com',
    filePath: val,
    name: 'file',
    formData: {
      'key': val.split('//')[1],
      'token': token
    },
    success: function (res) {
      
      var data = JSON.parse(res.data);
      let a = getCurrentPages();
      let curpage = a[a.length - 1];
      console.log(Number(picaddress.length))
      console.log(Number(wx.getStorageSync("uploadchoosedpic").length))
      console.log(upnum)
      curpage.setData({
        uploadnum: picaddress.length,
        percent: Number(picaddress.length) / Number(wx.getStorageSync("uploadchoosedpic").length)
      })
      uploadpicasync(token, totalpicarr);
    },
    fail: function () {
      // console.log('1+');
      // uppic(token, uparr, totalpicarr);
    }
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    init:false,
    radioMenu:"uploadRadion",
    methods:"creategroup",
    disabled:false,
    uploadnum:0,
    clicktype:"nextStap",

    gname:wx.getStorageSync("gname"),
    stage: false,
    Cname: "",
    prew:true,
    model:true,
    firstmodels:true,
    // nextStapOrgotoNext:"nextStap",
    nextStapOrgotoNext: "gotoNext",
    firstmodelstext:"下一步",
    chooselist:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 统计需要的字段
    // 默认app.a = 0 不刷新 
    app.a = 0
    if (options.from) {
      this.version = options.from;
    }

    var  that  = this;

    // that.setData({
    //   fromlast: 0
    // })
    this.from = options.from 
    console.log(this.from)

    that.stamp = options.uploadtype;
    wx.setStorageSync("uploadtype", that.stamp)
    // wx.setStorageSync("from", that.from)
    console.log(that.stamp);

    that.setData({
      uploadtype: that.stamp,
      choosevideo: wx.getStorageSync("uploadchoosedvideo"),
    })
  
    try {
      wx.setStorageSync('from', options.from);
    } catch (e) {
      console.log(e);
    }
    // 详情页上传
    if (wx.getStorageSync("from") == "details") {
      console.log("details")
      that.setData({
        chooselist: false,
        model: true,
        init: false,
        firstmodels: false,
        models: true,
        radioText: "立即上传",
        gname:wx.getStorageSync("gname"),
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
    var that = this
    console.log(wx.getStorageSync("gname"))
    var that = this
    var tempImgArr = wx.getStorageSync("uploadchoosedpic");
    console.log(tempImgArr);
    that.setData({
        ImgArr: tempImgArr,
        gname: wx.getStorageSync("gname")
      });
    // if (wx.getStorageSync("from")=="index"){
    //   that.setData({
    //     ImgArr: tempImgArr,
    //     gname: wx.getStorageSync("gname")
    //   });
    // }
    // else{
    //   that.setData({
    //     ImgArr: tempImgArr,
    //     gname: wx.getStorageSync("grouptitle")
    //   });
    // }
  
    wx.request({
      url:"",
      data: {
        userid: wx.getStorageSync('userid')
      },
      success: function (res) {

        console.log(res);
        res.data.data.forEach(val => {
          val.stage = false,
            val.fromType = "group";
        })
        console.log(res.data.data);
        var arr = [{
          simAppPic: "http://oibl5dyji.bkt.clouddn.com/2017102901.png",
          gname: "创建相册",
          stage: false,
          fromType: "add"
        }];
        console.log(arr.concat(res.data.data));
        var listArr = arr.concat(res.data.data)
        that.setData({
          list: listArr
        })
      }
    })
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
  nextStap:function(){
    var that =this;
    if(wx.getStorageSync("from") == "index"){
      that.setData({
        chooselist: true,
        prew: false,
        radioText: "立即上传",
        model: false,
        clicktype: "gotoNext",
        firstmodels: true,
        models: false,
        nextStapOrgotoNext: "gotoNext"
      })
      wx.setNavigationBarTitle({
        title: '选择相册',
      })
    }
    // else{
    //   that.setData({
    //     chooselist: false,
    //     model: true,
    //     init: true,
    //     firstmodels: false,
    //     models: true,
    //     radioText:"立即上传"
    //   })
    // }
  },
 // 创建相册表单提交
  creategroup: function (e) {
    // let val = e.detail.value.groupname,
      var that = this;
      that.setData({
        disabled:true
      })
    var formID = e.detail.formId;
    console.log(formID);
    if (wx.getStorageSync("groupid")==""){
      wx.request({
        url: api.getUrl(''),
        data: {
          userid: wx.getStorageSync('userid'),
          groupType: 4,
          groupName: "未命名相册",
          url: '',
          source: '精简版小程序',
          formID: formID
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          
          wx.setStorageSync("groupid", res.data.data[0].groupid)
          app.status = 1 
          wx.redirectTo({
              url: '../details/details?groupid=' + wx.getStorageSync("groupid"),
            })
          
          // if (wx.getStorageSync("uploadchoosedpic").length <= 0) {
          //   wx.showModal({
          //     title: '提示',
          //     content: '至少有一张图片才能上传',
          //     showCancel: false
          //   })
          //   return;
          // }


          // var context = e.detail.value.text;
          // if (reg.testStr(context)) {
          //   context = "";
          // }
          // wx.setStorage({
          //   key: 'content',
          //   data: context
          // })
          var picarr = [];
          wx.getStorageSync("uploadchoosedpic").forEach(function (val) {
            picarr.push(val);
          })
          if (picarr.length > 9) {
            wx.showModal({
              title: '提示',
              content: '一次最多上传9张相片',
            })
            return;
          }
          // that.setData({
          //   init: true,
          //   hiddenprocess: false,
          //   totalnum: picarr.length,
          //   disabled: true,
          //   gname: "未命名相册"
          // })
          // 获取图片上传token
          // wx.request({
          //   url: api.getUrl(''),
          //   data: {},
          //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          //   // header: {}, // 设置请求的 header
          //   success: function (res) {
          //     console.log(res);
          //     if (res.data.code === 0) {
          //       uploadpicasync(res.data.data[0].token, picarr);
          //     }
          //   }
          // })
        }
      })
    }
    else{
      // wx.request({
      //   url: api.getUrl(''),
      //   data: {
      //     userid: wx.getStorageSync('userid'),
      //     groupType: 4,
      //     groupName: "未命名相册",
      //     url: '',
      //     source: '精简版小程序',
      //     formID: formID
      //   },
      //   method: 'GET',
      //   success: function (res) {

      //     console.log(res);
          wx.getStorageSync("groupid")
          app.status = 1 
          wx.redirectTo({
            url: '../details/details?groupid=' + wx.getStorageSync("groupid"),
          })
          if (wx.getStorageSync("uploadchoosedpic").length <= 0) {
            wx.showModal({
              title: '提示',
              content: '至少有一张图片才能上传',
              showCancel: false
            })
            return;
          }
          // var context = e.detail.value.text;
          // if (reg.testStr(context)) {
          //   context = "";
          // }
          // wx.setStorage({
          //   key: 'content',
          //   data: context
          // })
          var picarr = [];
          wx.getStorageSync("uploadchoosedpic").forEach(function (val) {
            picarr.push(val);
          })
          if (picarr.length > 9) {
            wx.showModal({
              title: '提示',
              content: '一次最多上传9张相片',
            })
            return;
          }
          // that.setData({
          //   init: true,
          //   hiddenprocess: false,
          //   totalnum: picarr.length,
          //   disabled: true,
          //   gname:wx.getStorageSync("gname")
          // })
          // 获取图片上传token
          // wx.request({
          //   url: api.getUrl(''),
          //   data: {},
          //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          //   // header: {}, // 设置请求的 header
          //   success: function (res) {
          //     console.log(res);
          //     if (res.data.code === 0) {
          //       uploadpicasync(res.data.data[0].token, picarr);
          //     }
          //   }
          // })
        // }
      // })
    }
  },
   //单选
  selsectAlumb: function (e) {
    var that = this
    console.log(e)
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var groupid = e.currentTarget.dataset.groupid;
    that.groupid = groupid;
    var fromtype = e.currentTarget.dataset.fromtype
    //更改状态
    that.data.list[index].stage = !that.data.list[index].stage
    //赋值
    that.setData({
      list: that.data.list
    });
    var tempArr = []
    //循环添加
    that.data.list.forEach(val => {
      if (val.stage == true) {
        tempArr.push(val.gname)
      }
    })
    //单选
    if (tempArr.length > 0) {
      that.data.list[index].stage = false;
    }
    console.log(tempArr)
    console.log(that.groupid)
    that.setData({
      Cname: tempArr,
      firstmodels: false,
      models: true,
    })
    console.log(that.data.Cname)

    wx.setStorageSync("groupid", groupid);
    console.log(wx.getStorageSync("groupid"));
    // wx.setStorageSync("Cname", that.data.Cname)
    console.log(that.data.Cname.join(""))
    wx.setStorageSync("gname", that.data.Cname.join(""))
    // wx.setStorageSync("gOrigin", data)
    
    
  },
  //开始上传
  gotoNext: function () {
    var that = this;
    var tempSelectArr = []
    that.data.list.forEach(val => {
      console.log(val.stage)
      tempSelectArr.push(val.stage)
    })
    // wx.setNavigationBarTitle({
    //   title: '正在上传',
    // })
    console.log(tempSelectArr)
    app.status = 1
    if (that.data.Cname == "") {
      wx.showModal({
        title: '提示',
        content: '请选择一项',
        showCancel: false,
      })
    }
    else{
      that.setData({
        chooselist:false,
        model:true,
        init:true,
        firstmodels: false,
        models: true
      })
      // that.creategroup()
    }
    
    // else if (wx.getStorageSync("uploadtype") == "pic") {
    //   wx.redirectTo({
    //     url: '../../pages/uploadpic/uploadpic'
    //   })
    // }
  }

})
