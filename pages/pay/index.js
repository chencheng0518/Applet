/*
  1、页面加载的时候
    1、从缓存中获取购物车数据，渲染到页面上
        购物车数据需要过滤 checked=true
  2、微信支付：
    1、哪些人 哪些账号 可以实现微信支付
      1、企业账号
      2、企业账号的微信小程序后台中，必须给开发者 添加白名单
        1、一个appid 可以绑定多个开发者
        2、这些开发者就可以公用这个appid 和 它的开发权限
  3、支付按钮
    1、先判断缓存中有没有token
    2、没有的话，就跳转到授权页面 进行获取token
    3、有token的话 就继续下一步操作
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from "../../request/index";
Page({
  data: {
    //地址数组
    address: [],
    //购物车数组
    cart: [],
    //总价格
    totalPrice: 0,
    //总数量
    totalNum: 0
  },

  onShow() {

    //1、获取本地存储中的地址数据
    const address = wx.getStorageSync('address');
    //2、获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    //3、过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    //4、计算 底部工具栏的数据总价格、总数量等，然后将处理好的数据放入data中
        //总价格
        let totalPrice = 0;
        //总数量
        let totalNum = 0;
        //遍历
        cart.forEach(v => {
            totalPrice += v.goods_price * v.num
            totalNum += v.num
        });
        //把购物车重新设置回data和缓存中
        this.setData({
          cart,
          totalNum,
          totalPrice,
          address
        })
    wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')

  },
  //点击支付
  async handleSettlement() {
    const token=wx.getStorageSync("token")
    //1、获取缓存中的token值
    //2、判断token存不存在
    // if (!token) {
      // wx.navigateTo({
        // url: '/pages/auth/index',
      // })
      // return
    // }
    //3、创建订单
      //3.1、准备 请求头参数
    const headers = { Authorization: token };
      //3.2、准备 请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address;
    const goods	 = [];
    const { cart } = this.data;
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }));
    const orderParams = { order_price, consignee_addr, goods }
    //4、准备发送请求，创建订单，获取订单编号
   // const res = await request({ url: '/my/orders/create', methods: "POST", data: orderParams, header });
   // console.log(res);
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/create',
      data: {orderParams},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {headers}, // 设置请求的 header
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