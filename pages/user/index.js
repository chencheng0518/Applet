// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //个人信息
    userInfo:{}
  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
  }
})