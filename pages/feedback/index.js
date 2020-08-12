// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  handleButton() {
    wx.chooseLocation({
      success: function(res){
        // success
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          scale: 10, // 缩放比例
          // name: 'name', // 位置名
          // address: 'address', // 地址的详细说明
          success: function(res){
            // success
            console.log(res);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }
    })
  }
})