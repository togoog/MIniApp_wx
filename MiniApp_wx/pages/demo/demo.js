// pages/demo/demo.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const ctx = wx.createCanvasContext('myCanvas')
    // ctx.beginPath()
    // ctx.moveTo(10, 10)
    // ctx.lineTo(50, 10)
    // ctx.stroke()

    // ctx.beginPath()
    // ctx.moveTo(10, 20)
    // ctx.lineTo(50, 20)
    // ctx.stroke()

    // ctx.beginPath()
    // ctx.moveTo(10, 30)
    // ctx.lineTo(50, 30)
    // ctx.stroke()
    // ctx.draw()

    const ctx = wx.createCanvasContext('myCanvas')

    ctx.strokeRect(10, 10, 150, 100)
    ctx.translate(20, 20)
    ctx.strokeRect(10, 10, 150, 100)
    ctx.translate(20, 20)
    ctx.strokeRect(10, 10, 150, 100)

    ctx.draw()
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

  onPageScroll: function (obj) {
    var system = app.globalData.systemInfo.screenWidth;
    var rap = 750 / system;
    var scrollTop = obj.scrollTop;
    if (scrollTop > (462 / rap)) {
      if (this.data.showTop) {
        this.setData({
          showTop: false
        })
      }

    } else {
      if (!this.data.showTop) {
        this.setData({
          showTop: true
        })
      }

    }
  },


  save: function () {
    //获取权限
    wx.getSetting({
      success(res) {
        if (!res['scope.writePhotosAlbum']) {
          // 设置询问
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res)
            },
            fail() { },
            complete() { }
          })
        }
      }
    })
    // 下载图片
    var imgSrc = [ 
         "https://images.unsplash.com/photo-1507065938252-17f453893fc3?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1505751528562-fa2fbcc99beb?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1490094139523-6c26ddc4e518?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1499323888381-7fd102a793de?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1489072246845-18e24c2840d2?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1491102455372-4ce8d634d56e?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1486396738692-c7a72d500435?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1490150028299-bf57d78394e0?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         "https://images.unsplash.com/photo-1476089194965-888edb96d2dc?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
          ];
    // var imgSrc = "https://7xpend.com1.z0.glb.clouddn.com/tmp_92311826o6zAJswkKlmbQftxduIlbQvoqk80b7477089e72f31b12ce9d894ab24da47.jpg?e=1509762258&token=2caeYdL9QSwjhpJc2v05LLgaOrk_Mc_HterAtD28:G1t5arLUoTBOF4CtY3vmXvu20xs="
    var tempSrcArr = []
    for (var i = 0; i < imgSrc.length;i++){
      console.log(i);
      wx.downloadFile({
        url: imgSrc[i],
        success: function (res) {
          console.log(res);
          tempSrcArr.push(res)
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              var tempFilePaths = res.tempFilePaths
              wx.showModal({
                title: '分享到朋友圈',
                content: '成功保存小程序码到本地相册，请自行前往朋友圈分享',
                confirmText: "知道了",
                showCancel: false,
              })
              console.log(data);
            },
            fail: function (err) {
              console.log(err);
              if
 (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户一开始拒绝了，我们想再次发起授权")
                console.log('打开设置窗口')
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if
 (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    }
                    else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  } 
})