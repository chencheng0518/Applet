import {request} from "../../request/index.js"; //引入文件
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { showToast } from "../../utils/asyncWx.js"
/*
 1、点击轮播图，预览放大
    1、给轮播图绑定点击事件
    2、调用小程序的API, wx.previewImage

 2、点击  加入购物车
    1、先绑定点击事件
    2、获取缓存中的购物数据，数组格式
    3、先判断 当前的商品是否已经存在于购物车
    4、如果已经存在，修改商品数据，执行购物车数量++，重新把购物车数据 填充回缓存中
    5、如果不存在于购物车数组中，直接给购物车数组添加一个新元素 新元素 带上 购买数量属性，num 重新把购物车数组，填充回缓存中
    6、弹出提示

  3、商品收藏
    1、页面onShow的时候，加载缓存中的商品收藏的数据
    2、判断当前商品是不是被收藏
      1、是，就改变商品图标
      2、不是，就什么都不做
    3、点击商品收藏按钮
      1、判断该商品是否存在于缓存数据中
      2、如果已经存在，把该商品删除
      3、如果不存在，就把该商品添加到收藏数组中存入缓存中即可
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品详情数据
    detailList: {},
    //判断商品是否被收藏
    isCollect: false
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //获取当前页面栈
    let pages = getCurrentPages();
    //获取当前页面
    let currenPage = pages[pages.length - 1];
    let options = currenPage.options;
    //获取商品列表页面传递过来的id参数
    let id = options.id
    this.getGoodsDetail(id)
  },

  async getGoodsDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = res
    //1、获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    //2、判断 当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
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
      },
      isCollect
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
  },

  //商品收藏点击事件
 async handleCollection() {
    let isCollect = false;
    //1、获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')|| [];
    //2、判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //3、当index不等于-1,就表示已经收藏过了
    if (index!==-1) {
      //能找到。已经收藏过了，在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    } else {
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    //4、把数组存入到缓存中
    wx.setStorageSync('collect', collect);
    //5、修改data中的属性，isCollect(商品是否被收藏的状态)
    this.setData({
      isCollect
    })
  }
})