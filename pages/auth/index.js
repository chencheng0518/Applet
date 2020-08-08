import {
  login
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
    //支付授权
 async handleGetUserInfo(e) {
    //1、获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    //2、获取小程序登录成功后的code
    const {code} = await login();
    const loginParams = { encryptedData, rawData, iv, signature, code };
    //3、发送请求，获取用户的token 非企业账号拿不到
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin',
      data: {loginParams},
      method: 'post',
      success: function(res){
        //const {token} = res
      }
    })
    //4、自己定义的token
    const  token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    
    //5、将token存入缓存中，同时跳转回上一个页面
    wx.setStorageSync('token', token);
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  }
})