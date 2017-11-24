var Promise = require('./promise.js');

function wxpromise(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

function reqest({pathname, data, reqtype}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.zhuiyinanian.com/' + pathname,
      // url: 'http://192.168.31.59:8080/' + pathname,
      data: data,
      method: reqtype || 'GET',
      success: function (res) {
        // if (res.statusCode != 200) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '网络忙，请重试',
        //     success: function (res) {
        //       if (res.confirm) {
        //         wx: wx.navigateBack({
        //           delta: 1,
        //         })
        //       }
        //     }
        //   })
        //   return;
        // }
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}
//数组去重
function unique1(array) {
  /*var n = [];
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) n.push(array[i]);
  }
  return n;*/

  return Array.from(new Set(array));
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')/* + ' ' + [hour, minute, second].map(formatNumber).join(':')*/
}

function formatTimeWithSecond(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTimeWithSecond: formatTimeWithSecond,
  formatTime: formatTime,
  wxpromise: wxpromise,
  wxreq: reqest,
  unique1
}
