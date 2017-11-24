// pages/setting/addmember/addmember.js

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    createList: [],
    selectList: [],
    restList: [],
    searchList: [],
    start: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var gnum = wx.getStorageSync('gnum');
    that.setData({
      gnum: gnum
    })
    if (gnum > 100) {
      // 大于100人
      var createList = [], selectList = [], restList = [], searchList = [];
      util.wxreq({
        pathname: 'YinianProject/yinian/ShowInfo',
        data: {
          userid: wx.getStorageSync('createrid'),
        }
      }).then(res => {
        createList.push({
          unickname: res.data[0].unickname,
          upic: res.data[0].upic,
          userid: wx.getStorageSync('createrid'),
          select: true
        })
        that.setData({
          createList: createList
        })
      })
      util.wxreq({
        pathname: 'YinianProject/space/GetSpaceMemberAuthorityList',
        data: {
          groupid: wx.getStorageSync('groupid'),
          type: 'bigger'
        }
      }).then(res => {
        // console.log(res);
        var greatorList = res.data;
        if (greatorList.length > 0) {
          greatorList.forEach(function (val) {
            // if (val.userid == wx.getStorageSync('createrid')) {
            //   createList.push({
            //     gmauthority: val.gmauthority,
            //     unickname: val.unickname,
            //     upic: val.upic,
            //     userid: val.userid,
            //     select: true
            //   });
            // }
            if (val.gmauthority == 1 && val.userid != wx.getStorageSync('createrid')) {
              selectList.push({
                gmauthority: val.gmauthority,
                unickname: val.unickname,
                upic: val.upic,
                userid: val.userid,
                select: true
              });
            }
          })
        }
        that.setData({
          selectList: selectList,
          restList: restList,
          searchList: searchList
        })

      })
    } else {
      // 小于100人
      var createList = [], selectList = [], restList = [];
      util.wxreq({
        pathname: 'YinianProject/space/GetSpaceMemberAuthorityList',
        data: {
          groupid: wx.getStorageSync('groupid'),
          type: 'smaller'
        }
      }).then(res => {
        // console.log(res);
        var lessList = res.data;
        if (lessList.length > 0) {
          lessList.forEach(function (val) {
            if (val.userid == wx.getStorageSync('userid')) {
              createList.push({
                gmauthority: val.gmauthority,
                unickname: val.unickname,
                upic: val.upic,
                userid: val.userid,
                select: true
              });
            }
            if (val.gmauthority == 1 && val.userid != wx.getStorageSync('userid')) {
              selectList.push({
                gmauthority: val.gmauthority,
                unickname: val.unickname,
                upic: val.upic,
                userid: val.userid,
                select: true
              });
            }
            if (val.gmauthority == 0 && val.userid != wx.getStorageSync('userid')) {
              restList.push({
                gmauthority: val.gmauthority,
                unickname: val.unickname,
                upic: val.upic,
                userid: val.userid,
                select: false
              });
            }
          })

        }
        that.setData({
          createList: createList,
          selectList: selectList,
          restList: restList
        })
      })
    }
  },
  // 超过100人时

  searchList: function (e) {
    var that = this;
    var e = e || event;
    var userid = wx.getStorageSync('userid');
    if (!userid) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    var searchText = e.detail.value.trim();
    if (searchText == '') {
      wx.showToast({
        title: '请输入用户名称',
      })
      return;
    }
    wx.showToast({
      title: '搜索中...',
      icon: 'loading',
      duration: 6000,
      mask: true
    })
    util.wxreq({
      pathname: 'YinianProject/space/SearchSpaceMembers',
      data: {
        groupid: wx.getStorageSync('groupid'),
        name: searchText
      },
      reqtype: 'GET'
    }).then(res => {
      // console.log(res);
      var a = that.data.selectList;
      var b = [];
      that.data.restList.forEach(function(val){
          b.push(val);
      })
      var c = res.data;
      var tempArr = res.data;
      for(var k=0;k<a.length;k++){
        b.push(a[k]);
      }
      // console.log(c);
      // res.data.forEach(function (val) {
      //   if (val.userid != wx.getStorageSync('createrid')) {
      //     tempArr.push({
      //       unickname: val.unickname,
      //       upic: val.upic,
      //       userid: val.userid,
      //       select: false
      //     })
      //   }
      // })
      for(var i=c.length-1; i >= 0; i--) {
      
        for(var j = 0; j < b.length; j++) {
        
          if (b[j].userid == c[i].userid) {
            tempArr.splice(i, 1);
          }
        }
      }
      // console.log(tempArr)
      that.setData({
        start: true,
        searchList: tempArr,
      })

      wx.hideToast();
    })
  },

  addRest: function (e) {
    var that = this;
    var arr4 = [];
    var arr5 = [];
    var searchList = that.data.searchList;
    var add = e.currentTarget.dataset.add;
    var restList = that.data.restList;
    that.data.searchList[add].select = !that.data.searchList[add].select;
    that.setData({
      searchList: that.data.searchList
    })
    if (that.data.searchList[add].select){
      restList.push(that.data.searchList[add]);
    }else{
      for (var i = 0; i < restList.length;i++){
        if (restList[i].userid == that.data.searchList[add].userid){
          restList.splice(i,1);
        }
      }
    }
    // if (that.data.restList.length == 0) {
    //   that.data.selectList.forEach(function (val) {
    //     if (val.userid != that.data.searchList[add].userid) {
    //       arr5.push(val);
    //     }
    //   })
    //   if (arr5.length == that.data.selectList.length) {
    //     restList.push(that.data.searchList[add]);
    //   }
    //   restList.push(that.data.searchList[add]);
    // } else {
    //   that.data.restList.forEach(function (val) {
    //     if (val.userid != that.data.searchList[add].userid) {
    //       arr4.push(val);
    //     }
    //   })
    //   that.data.selectList.forEach(function (val) {
    //     if (val.userid != that.data.searchList[add].userid) {
    //       arr4.push(val);
    //     }
    //   })
    //   if (arr4.length == (restList.length + that.data.selectList.length) && that.data.searchList[add].select) {
    //     restList.push(that.data.searchList[add]);
    //   } else {
    //     wx.showToast({
    //       title: '已经添加过',
    //     })
    //   }
    // }
    // console.log(restList)
    that.setData({
      restList: restList
    })
  },

  closeReset: function () {
    this.setData({
      start: false,
      searchList: [],
      value: ""
    })
  },

  // 有权限人员列表改变状态
  changeSelList: function (e) {
    var that = this;
    var sel = e.currentTarget.dataset.sel;
    that.data.selectList[sel].select = !that.data.selectList[sel].select;
    that.setData({
      selectList: that.data.selectList
    })
  },
  // 无权限人员列表改变状态
  changeRestList: function (e) {
    var that = this;
    var rest = e.currentTarget.dataset.rest;
    that.data.restList[rest].select = !that.data.restList[rest].select;
    that.setData({
      restList: that.data.restList
    })
  },

  // 确认提交
  release: function () {
    var that = this;
    // 删除
    if (that.data.selectList.length > 0) {
      var arr2 = [];
      that.data.selectList.forEach(function (val) {
        if (!val.select) {
          arr2.push(val.userid);
        }
      })
      if (arr2.length > 0) {
        util.wxreq({
          pathname: 'YinianProject/space/SetUploadAuthority',
          data: {
            groupid: wx.getStorageSync('groupid'),
            userid: arr2.join(','),
            authorityType: 'part',
            type: 'remove'
          }
        }).then(res => {
          // console.log(res);
        })
      }

    }
    // 添加
    if (that.data.restList.length > 0) {
      var arr1 = [];
      // console.log(that.data.restList);
      that.data.restList.forEach(function (val) {
        if (val.select) {
          arr1.push(val.userid);
        }
      })
      arr1.push(that.data.createList[0].userid);
      arr1.push(wx.getStorageSync('createrid'));
      if (arr1.length > 0) {
        util.wxreq({
          pathname: 'YinianProject/space/SetUploadAuthority',
          data: {
            groupid: wx.getStorageSync('groupid'),
            userid: arr1.join(','),
            authorityType: 'part',
            type: 'add'
          }
        }).then(res => {
          // console.log(res);

        })
      }
    }
    wx.navigateBack({
      delta:1
    })
  }

})