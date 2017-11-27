// pages/Choosealbum/Choosealbum.js
var app = getApp();
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');
var reg = require('../../utils/reg.js');
let picaddress = [];
let mainIdStr;
let formId = '';
var upnum = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    creatorgotodetails:'gotodetails',
    init: false,
    radioMenu: "uploadRadion",
    methods: "creategroup",
    disabled: false,
    uploadnum: 0,
    // clicktype: "nextStap",
    clicktype: "gotoNext",
    gname: wx.getStorageSync("gname"),
    stage: false,
    Cname: "",
    prew: true,
    model: true,
    firstmodels: true,
    // nextStapOrgotoNext: "nextStap",
    nextStapOrgotoNext: "gotoNext",
    firstmodelstext: "下一步",
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
    var that = this
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
          list: listArr,
          loading: false,
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
  // 创建相册表单提交
  creategroup: function (e) {
    // let val = e.detail.value.groupname,
    var that = this;
    // that.setData({
    //   disabled: true
    // })
    var formID = e.detail.formId;
    console.log(formID);
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
          that.setData({
            init: true,
            hiddenprocess: false,
            totalnum: picarr.length,
            disabled: true,
            gname: "未命名相册"
          })
          // 获取图片上传token
          wx.request({
            url: api.getUrl(''),
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res);
              if (res.data.code === 0) {
                uploadpicasync(res.data.data[0].token, picarr);
              }
            }
          })
        }
      })
    }
    else {
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
      that.setData({
        init: true,
        hiddenprocess: false,
        totalnum: picarr.length,
        disabled: true,
        gname: wx.getStorageSync("gname")
      })
      // 获取图片上传token
      wx.request({
        url: api.getUrl(''),
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res);
          if (res.data.code === 0) {
            uploadpicasync(res.data.data[0].token, picarr);
          }
        }
      })
      // }
      // })
    }
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
    // else if (wx.getStorageSync("uploadtype") == "pic") {
    //   wx.redirectTo({
    //     url: '../../pages/uploadpic/uploadpic'
    //   })
    // }
  },
  // 去详情页并且上传
  gotodetails:function(){
    var that =this

  },


})
