var app = getApp();
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');
var reg = require('../../utils/reg.js');
let picaddress = [];
let mainIdStr;
let formId = '';
var upnum = 0;



Page({
  data: {
    init: false,
    radioMenu: "uploadRadion",
    methods: "creategroup",
    disabled: false,
    uploadnum: 0,
    clicktype: "nextStap",
    gname: wx.getStorageSync("gname"),
    stage: false,
    Cname: "",
    prew: true,
    model: true,
    firstmodels: true,
    // nextStapOrgotoNext: "nextStap",
    nextStapOrgotoNext: "gotoNext",
    firstmodelstext: "下一步",
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

    var that = this;
    // that.setData({
    //   fromlast: 0
    // })
    this.from = options.from
    console.log(this.from)
    try {
      wx.setStorageSync('from', options.from);
    } catch (e) {
      console.log(e);
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
      url: "",
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
    var tempImgArr = wx.getStorageSync("uploadchoosedvideo");
    console.log(tempImgArr)
    that.setData({
      choosevideo: tempImgArr,
    });
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
        gname: wx.getStorageSync("gname"),
      })
    }
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

  },
  nextStap: function () {
    var that = this;
    if (wx.getStorageSync("from") == "index") {
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


  },
  gotoNext: function () {
    var that = this;
    var tempSelectArr = []
    that.data.list.forEach(val => {
      console.log(val.stage)
      tempSelectArr.push(val.stage)
    })
    wx.setNavigationBarTitle({
      title: '正在上传',
    })
    console.log(tempSelectArr)
    if (that.data.Cname == "") {
      wx.showModal({
        title: '提示',
        content: '请选择一项',
        showCancel: false,
      })
    }
    else {
      that.setData({
        chooselist: false,
        model: true,
        init: true,
        firstmodels: false,
        models: true
      })
      // that.creategroup()
    }
 
  },



  // 创建相册表单提交
  creategroup: function (e) {
    let val = e.detail.value.groupname,
      that = this;
    that.setData({
      disabled: true,
      init:true,
    })
    var formID = e.detail.formId;
    console.log(formID);
    ////
    if (wx.getStorageSync("groupid") == "") {
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
        }
      })
    }
    else{
      wx.getStorageSync("groupid")
      app.status = 1 
        wx.redirectTo({
          url: '../details/details?groupid=' + wx.getStorageSync("groupid"),
        })
    }

  },
  gotoDetail: function () {
    if (wx.getStorageSync("from") == "index") {
      wx.redirectTo({
        url: '../details/details?groupid=' + wx.getStorageSync("groupid"),
      })
    }
    else {
      wx.navigateBack({
        url: '../details/details?groupid=' + wx.getStorageSync("groupid"),
      })
    }
  }

})
