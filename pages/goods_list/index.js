import {request} from "../../request/index.js"; //引入文件
import regeneratorRuntime from '../../lib/runtime/runtime.js';
/*
  用户上滑页面，滚动条触底后，开始加载下一条数据
    1、找到滚动条触底事件 (onReachBottom)，在微信小程序官方开发文档里 框架>页面
    2、判断还有没有下一条数据
      2.1：获取到总页数，但是我们只能拿到总条数 total
        总页数= 1
        总页数 = Math.ceil(23 / 10) =3
      2.1:获取到当前的页码 pagenum
      2.3：判断一下，当前的页码是否大于或等于 总页数
        如果大于或等于则说明没有下一页数据了
    3：加入没有下一页数据，就弹出一个提示
    4：如果还有下一页数据，就继续加载下一页
        4.1：当前的页码++ pagenum++;
        4.2：重新发送请求
        4.3：数据请求回来，要对data中的数组 进行拼接，而不是全部替换
  下拉刷新页面
    1、触发下拉刷新事件，需要在页面的json文件中开启一个配置项，找到 触发下拉的事件
    2、重置 数据 数组
    3、重置 页码，设置为1
    4、重新发送请求
    5、数据请求回来，需要手动关闭等待效果
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        name:"综合",
        id:0,
        isActive:true
      },
      {
        name:"销量",
        id:1,
        isActive:false
      },
      {
        name:"价格",
        id:2,
        isActive:false
      }
    ],
    //商品列表数组数据
    GoodsList: [],
    //总页数
    totalPages:1
  },
  //发送请求时需要的参数
  QueryList: {
    query: '', //关键字
    cid: '',  //分类id
    pagenum: 1, //页码
    pagesize:10 //页容量
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options.cid里是分类id
    this.QueryList.cid=options.cid||"";
    this.QueryList.query = options.query || "";
    this.getGoodsList()
  },
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryList });
    //获取总条数
    const total = res.total
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryList.pagesize)
    this.setData({
      //拼接数组
      GoodsList:[...this.data.GoodsList, ...res.goods]
    })
    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
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
  //页面上滑，滚动条触底事件
  onReachBottom(){
    //判断还没有吗下一页数据
    if (this.QueryList.pagenum>=this.totalPages) {
      //没有下一页数据，弹出提示
      wx.showToast({title: '没有数据了'})
    } else {
      //还有下一页数据
        //当前的的页码++
        this.QueryList.pagenum++;
        //重新发送请求
        this.getGoodsList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //重置数组
    this.GoodsList = [];
    //重置页码，设置为1
    this.QueryList.pagenum = 1;
    //重新发送请求
    this.getGoodsList()
  },
  //滚动条距离顶部事件
  onPageScroll(e) {
  }
})