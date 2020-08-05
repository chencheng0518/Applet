/*
  1、获取用户的收货地址
    1.1、绑定点击事件
    212、调用小程序中内置的API 获取用户的收货地址  wx.chooseAddress

  2、获取用户对小程序 所授予 获取地址的权限状态(wx.getSetting) scope = authSetting['scope.address']
    2.1、假设用户 点击获取收货地址的提示框 点的是确定 
      scope 值为true 直接调用 获取收货地址
    2.2、假设用户从来没有 调用过 收货地址的API
      scope 值为 undefined 直接调用 获取收货地址的API
    2.3、假设 用户点击 获取收货地址的提示框 点的是 取消
      scope 值为 false
      2.3.1、诱导用户 自己打开 授权设置页面() 当用户重新给予 获取收货地址权限的时候
      2.3.2、调用收货地址API

  3、 把获取到的收货地址 存入到 本地存储中

  4、页面加载完毕
    onLoad => onShow
    1、获取本地存储中的地址数据
    2、把数据 设置给data中的一个变量
  
  5、渲染购物车数组
    0、回到了 商品详情页面 第一次添加商品的时候，手动添加了属性
        1、num=1;
        2、checked=true;
    1、获取缓存中的购物车数组
    2、把购物车数据，填充到data中

  6、全选的实现 数据的展示
    1、onShow 获取缓存中的购物车数组
    2、根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中

  7、总价格和总数量
    1、都需要商品被选中，我们才拿他来做计算
    2、获取购物车数组
    3、遍历
    4、判断商品是否被选中
    5、总价格 += 商品单价 * 商品的数量
    6、总数量 += 商品的数量
    7、把计算后的价格和数量，设置回data中即可
  
  8、商品的选中
    1、绑定change事件
    2、获取到被修改的商品对象
    3、商品对象的选中状态，取反
    4、重新填充回data中和缓存中
    5、重新计算全选、总价格、总数量

  9、全选和反选
    1、全选复选框绑定事件 change
    2、获取 data中的全选变量 allChecked
    3、直接取反 allChecked=!allChecked;
    4、遍历购物车数组，让里面的商品选中状态跟随 allChecked 改变
    5、把购物车数组和 allChecked 重新设置回data中，把购物车重新设置回缓存中

  10、商品数量的编辑
    1、"+" "-" 按钮绑定同一个点击事件 区分的关键，自定义属性
      1、点击 "+" 时 传入的是 "+1"
      2、点击 "-" 时 传入的是 "-1
    2、传递被点击的商品id goods_id
    3、获取data中的购物车数组，来获取需要被点击的商品对象
    4、当商品数量num = 1，同时 用户点击的是 "-"；
        弹窗提示，询问用户 是否要删除该商品
          1、确定：直接执行删除
          2、取消：什么都不做
    4、直接修改商品对象的数量 num
    5、把cart数组，重新设置回缓存中和data中，setCart()
  
  11、点击结算
    1、判断有没有收货地址信息
    2、判断用户有没有选购商品
    3、经过以上的验证过后，就可以直接跳转到支付页面了
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  data: {
    //地址数组
    address: [],
    //购物车数组
    cart: [],
    //全选状态
    allChecked: false,
    //总价格
    totalPrice: 0,
    //总数量
    totalNum: 0
  },

  onShow() {

    //1、获取本地存储中的地址数据
    const address = wx.getStorageSync('address');
    //2、将地址数据放入data中
    this.setData({
      address
    })
    //３、获取缓存中的购物车数组
    const cart = wx.getStorageSync('cart') || [];
    //４、调用setCart方法，计算全选、总价格、总数量等，并重新设置回data和缓存中 
    this.setCart(cart)
  },

  //获取收货地址的点击事件
  /*
  handleaddress() {
    //获取地址的权限状态
    wx.getSetting({
      success: (result) => {
        //获取权限状态
        const scope = result.authSetting['scope.address'];   
        if (scope === undefined || scope === true) {
          //scope 的值为undefined或者true 可以直接调用 获取收货地址的API
          wx.chooseAddress({
            success: (result)=>{
              console.log(result);
            }
          });
        } else if (scope === false) {
          //scope 的值为false   
          //说明用户 以前拒绝过授予权限，先诱导用户打开授权页面 
          wx.openSetting({
            success: (result)=>{
              //可以调用 获取收货地址的API
              wx.chooseAddress({
                success: (result)=>{
                  console.log(result);
                }
              });
            },
          });
        }
      }
    });
  },*/

  //handleaddress事件优化一：
  /*
  async handleaddress() {
      //1 获取 权限状态
      const res = await getSetting();
      const scope = res.authSetting['scope.address'];
      //2 判断权限状态
      if (scope === undefined || scope === true) {
        //3 调用 获取收货地址的 API 
        const res = await chooseAddress();
        console.log(res);
      } else if (scope === false) {
        //4 先诱导 用户打开 授权页面
        await openSetting();
        //5 调用 获取收货地址的API 
        const res = await chooseAddress();
        console.log(res);
      }
  }
  */

  //handleaddress事件优化二：
  async handleaddress() {
    try {
      //1 获取 权限状态
      const res = await getSetting();
      const scope = res.authSetting['scope.address'];
      //2 判断权限状态
      if (scope === false) {
        //3 先诱导 用户打开 授权页面
        await openSetting();
      }
      //4 调用 获取收货地址的API 
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      //5 将收获地址 存入本地存储
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },

  //商品的选中事件
  handleItemChange(e) {
    //1、获取被修改的商品的id
    let goods_id = e.currentTarget.dataset.goods_id;
    //2、获取购物车数组
    let {
      cart
    } = this.data;
    //3、找到被修改的商品的对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //4、选中状态取反 
    cart[index].checked = !cart[index].checked;
    //5、调用setCart方法，计算全选、总价格、总数量等，并重新设置回data和缓存中 
    this.setCart(cart)
  },

  //设置 购物车状态的同时，重新计算 底部工具栏的数据 全选、总价格、总数量等
  setCart(cart) {
    //1、计算全选
    //every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数 都返回true 那么every的方法返回值为true
    //只要 有一个回调函数 返回了false 那么不再循环执行，直接返回 false
    //空数组调用 every,返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    let allChecked = true;
    //总价格
    let totalPrice = 0;
    //总数量
    let totalNum = 0;
    //遍历
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    //把购物车重新设置回data和缓存中
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart);
  },

  //商品的全选功能
  handleAllChecked() {
    //1、获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    //2、修改allChecked的值
    allChecked = !allChecked;
    //3、循环修改cart数组中的商品选中状态 checked
    cart.forEach(v => {
      v.checked = allChecked
    });
    //4、把修改后的值，填充回data和缓存中
    this.setCart(cart);
  },

  //商品数量的 + - 事件
  async handleItemClick(e) {
    //1、获取自定义属性
    let sub = e.currentTarget.dataset.sub;
    //2、获取被点击的商品id
    let goods_id = e.currentTarget.dataset.goods_id;
    //3、获取购物车数组
    let {
      cart
    } = this.data;
    //4、找到被修改的商品的对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //5、如果商品数量num = 1，同时 用户点击的是 "-"
    if (cart[index].num === 1 && sub === -1) {
      //5.1、弹窗提示 询问用户是否删除
      /* wx.showModal({
         title: '提示',
         content: '是否删除该商品',
         success: (res) => {
           //5.2点击确定
           if (res.confirm) {
             //5.3、删除该商品
             cart.splice(index, 1);
             //5.4、将修改过的cart数组重新设置回data和缓存中
             this.setCart(cart)
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })*/

      //5.1、弹窗提示 询问用户是否删除
      const res = await showModal({
        content: '是否删除该商品'
      });
      //5.2、判断
      if (res.confirm) { //点击确定
        //5.3、删除该商品
        cart.splice(index, 1);
        //5.4、将修改过的cart数组重新设置回data和缓存中
        this.setCart(cart)
      } else if (res.cancel) { //点击取消
        console.log('用户点击取消')
      }
    } else {
      //6、直接修改被点击的商品对象的数量
      cart[index].num += sub;
      //7、将修改过的cart数组重新设置回data和缓存中
      this.setCart(cart)
    }
  },

  //点击结算
  async handleSettlement() {
    //从data中拿到收货地址信息和 商品数量
    let { address, totalNum } = this.data;

    //1、判断有没有收货地址信息
    if (!address.userName) {
      await showToast({title:'你还没有选择收货地址'})
      return
    }
    //2、判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({title:'你还没有选购商品'})
      return
    }
    //3、跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})