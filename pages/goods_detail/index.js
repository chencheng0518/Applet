import {request} from "../../request/index.js"; //引入文件
import regeneratorRuntime from '../../lib/runtime/runtime.js';

/*
  点击轮播图，预览放大
    1、给轮播图绑定点击事件
    2、调用小程序的API, wx.previewImage

  点击  加入购物车
    1、先绑定点击事件
    2、获取缓存中的购物数据，数组格式
    3、先判断 当前的商品是否已经存在于购物车
    4、如果已经存在，修改商品数据，执行购物车数量++，重新把购物车数据 填充回缓存中
    5、如果不存在于购物车数组中，直接给购物车数组添加一个新元素 新元素 带上 购买数量属性，num 重新把购物车数组，填充回缓存中
    6、弹出提示
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品详情数据
      detailList:{}
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取商品列表页面传递过来的id参数
    let id = options.id
    this.getGoodsDetail(id)
  },
  async getGoodsDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo=res
    this.setData({
      detailList: {
       pics : res.pics,
       goods_price: res.goods_price,
        goods_name: res.goods_name,
       //部分iphone手机，不识别webp图片格式
          //最好找到后台，让他进行修改
          //临时自己改，确保后台存在 1.webp格式的图片，然后修改成1.jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
                                                    //正则表达式
      }
    })
  },
  //轮播图点击事件，点击后放大预览图片
  handlePrevewImage(e) {
    //先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    //接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    //全屏预览图片API
    wx.previewImage({
      current,  // 当前显示图片的http链接
      urls      // 需要预览的图片http链接列表
    })
  },
  //加入购物车点击事件
  handleShopping() {
    //1、获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    //2、判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index===-1) {
      //3、不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked=true
      cart.push(this.GoodsInfo);
    } else {
      //4、已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    //5、把给购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //true 防止用户 手抖 疯狂点击屏幕
      mask: true
    });
  }
})