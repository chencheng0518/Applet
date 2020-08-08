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
    4、创建订单，获取订单编号
    5、已经完成了微信支付
    6、手动删除缓存中，已经被选中了的商品
    7、删除后的商品数据，重新填充回缓存中
    8、再跳转到订单页面 
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import {
  request
} from "../../request/index";
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
    try {
      const token = wx.getStorageSync("token")
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
     // const header = {Authorization: token};
      //3.2、准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address;
      const goods = [];
      const { cart } = this.data;
      
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      //4、准备发送请求，创建订单，获取订单编号
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        method: "POST",
        data: orderParams
      });
      //5、发起 预支付接口
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: "POST",
        data: {
          order_number
        }
      });
      //6、发起微信支付
      await requestPayment(pay);
      //7、查询后台，订单状态
      const res = await request({
        url: '/my/orders/chkOrde',
        method: "POST",
        data: {
          order_number
        }
      });
      await showToast({ title: '支付成功' });
      //8、手动删除缓存中，已经支付了的商品
      //8.1、从缓存中拿到新的没有被修改过的商品数据
      let newCart = wx.getStorageSync('cart');
      //8.2、过滤数组，拿到未支付的商品数据
      newCart = newCart.filter(v => !v.checked);
      //8.3、将未支付的商品数据，重新填充回cart中
      wx.setStorageSync('cart', newCart)
      //9、支付成功后，跳转到订单页面
      wx.wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      console.log(error);
      await showToast({ title: '支付失败' });
      wx.showModal({
        title: '暂无此功能 返回？',
        success: (result) => {
          if (result.confirm) {
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
          }
        },
      });
    }
  }
})