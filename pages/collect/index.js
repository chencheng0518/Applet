// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        name:"商品收藏",
        id:0,
        isActive:true
      },
      {
        name:"品牌收藏",
        id:1,
        isActive:false
      },
      {
        name:"店铺收藏",
        id:2,
        isActive:false
      },
      {
        name:"浏览器足迹",
        id:3,
        isActive:false
      }
    ],
    collect:[]
  },
  onShow() {
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    this.setData({collect})
  },
    //标题点击事件，从子组件 Tabs 传递过来的
    changeTabs(e) {
      //获取被点击的标题索引
      let index = e.detail.index
      //修改原数组中的isActive
      let { tabs } = this.data;
      tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
      //重新将tabs赋值到data中
      this.setData({
        tabs
      })
    },
})