// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //个人信息
    userInfo: {},
    //收藏的商品个数
    collectNum: 0
  },
  onShow() {
    //获取缓存中的个人信息数据
    let userInfo = wx.getStorageSync('userInfo');
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    this.setData({
      collectNum: collect.length,
      userInfo
    })
  }
})