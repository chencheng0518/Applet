import {
  request
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧导航
    catLeft: [],
    //右侧内容
    catRight: [],
    //点击的索引
    active: 0,
    //滚动条距离顶部的距离
    scrollTop: 0
  },
  //接收到的数据
  Cate: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    本地缓存：
      1：web中的本地存储和小程序的本地存储的区别
        1.1：写代码的方式不一样了
          web：localStorage.setItem("key","value") 获取本地缓存数据
               localStorage.getItem("key") 设置本地缓存数据
        小程序：wx.setStorageSync('key', 'value') 获取本地缓存数据
                wx.getStorageSync('key') 设置本地缓存数据
        1.2：存的时候，有没有做数据转换
          web：不管存入的是什么类型的数据，最终都会先调用 ToString()，把数据变成字符串，再存入进去
        小程序：不存在类型转换这个操作，存什么类型的数据进去，获取的时候就是什么类型
      2：先判断一下本地存储里有没有旧的数据
          {time:Data.now(),data:[]}
      3:如果没有旧的数据，就直接发送请求
      4：如果有旧的数据，同时，旧的数据也没有过期，就使用本地存储中的旧数据即可
    */

    //获取本地存储中的数据 (小程序中也是存在本地存储技术的)
    const Cates = wx.getStorageSync('cates');
    //判断
    if (!Cates) {
      //不存在本地存储数据 直接发送请求
      this.getcatList()
    } else {
      //存在旧的数据 判断旧的数据有没有过期
      //Date.now()现在的时间
      if (Date.now() - Cates.time > 1000 * 10) {
        //时间过期了，重新发送请求
        this.getcatList()
      } else {
        //存在旧的数据，而且旧的数据没有过期
        this.Cate = Cates.data;
        
        //循环Cate，将大家电，热门推荐，海外购等左侧导航数据放入catLeft
        let catLeft = this.Cate.map(v => v.cat_name)
        //右侧的主要内容放入catRight
        let catRight = this.Cate[0].children
        this.setData({
          catLeft,
          catRight
        })
      }
    }
  },
 async getcatList() {
   /* request({
        url: '/categories'
      })
      .then(res => {
        //将接收到的数据放入Cate
        this.Cate = res.data.message;
        //将接口中的数据，放入本地存储中
        wx.setStorageSync("cates", {
          time: Date.now(),
          data: this.Cate
        })
        //循环Cate，将大家电，热门推荐，海外购等左侧导航数据放入catLeft
        let catLeft = this.Cate.map(v => v.cat_name)
        //右侧的主要内容放入catRight
        let catRight = this.Cate[0].children
        this.setData({
          catLeft,
          catRight
        })
      })*/
        //使用es7的async await 来发送请求
        const res = await request({ url: '/categories' });
        this.Cate = res;
        //将接口中的数据，放入本地存储中
        wx.setStorageSync("cates", {
          time: Date.now(),
          data: this.Cate
        })
        //循环Cate，将大家电，热门推荐，海外购等左侧导航数据放入catLeft
        let catLeft = this.Cate.map(v => v.cat_name)
        //右侧的主要内容放入catRight
        let catRight = this.Cate[0].children
        this.setData({
          catLeft,
          catRight
        })
  },
  //左侧导航栏的点击事件
  handleItemTap(e) {
    //获取被点击图标的索引
    //然后给data中的active赋值
    let {
      index
    } = e.currentTarget.dataset;
    //根据不同的索引来渲染右侧的内容
    let catRight = this.Cate[index].children;
    this.setData({
      active: index,
      catRight,
      scrollTop: 0
    });

  }
})