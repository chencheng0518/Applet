import {
  request
} from "../../request/index.js"; //引入文件
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //分类导航数组
    sortList:[],
    //楼层数组
    floorList:[]
  },
  //页面开始加载，就会触发
  onLoad: function (options) {
    //异步请求拿轮播图数据
    //   wx.request({
    //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //     success:(res)=> {
    //       this.setData({
    //         swiperList:res.data.message
    //       })
    //     }
    //   })
    //调用getSwiperList方法
    this.getSwiperList()
    //调用getSortList方法
    this.getSortList()
    //调用getfloorList方法
    this.getfloorList()
  },
  //换成es6的Promise来拿数据 优化代码 取轮播图数组数据
  async getSwiperList() {
        const res =await request({url: '/home/swiperdata'})    
        this.setData({
          swiperList: res
        })
  },
  //取分类导航数组数据
  async getSortList() {
   const res = await request({url:'/home/catitems'})
        this.setData({
          sortList: res
        })
  },
  //取楼层数组数据
  async getfloorList() {
    const res =await request({url: '/home/floordata'})
        this.setData({
          floorList: res
        })
  }
});