// pages/login/index.js
Page({
  //授权点击事件
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  }
})