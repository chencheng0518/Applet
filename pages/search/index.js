/*
  1、输入框绑定 值改变事件，input事件
    1、获取到输入框的值
    2、合法性判断
    3、检验通过 把输入框中的值，发送到后台  请求数据
    4、返回的数据打印到页面上
  
  2、防抖(防止抖动) 定时器；节流
      防抖：一般用于输入框中，防止重复输入，重复发送请求
      节流：一般用于在页面下拉和上拉
      1、定义全局的定时器
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

  /**
   * 页面的初始数据
   */
  data: {
    serchList: [],
    //输入框的值
    isValue: '',
    //按钮取消显示
    isFocus:false
  },
  //全局定时器
  isTime: -1,
  
  //input事件
 handleInput(e) {
    //1、获取输入框的值
   const { value } = e.detail;
   //2、检验合法性
   if (!value.trim()) {
     this.setData({
       isFocus: false,
       serchList: []
     })
     clearTimeout(this.isTime); //清除定时器
     //值不合法
     return
   }
   this.setData({isFocus:true})
   //3、准备发送请求获取数据
   clearTimeout(this.isTime); //清除定时器
   this.isTime = setTimeout(()=> {
    this.getSerchList(value);
   },1000)
  },
 //发送请求
 async getSerchList(query) {
   const res = await request({ url: '/goods/qsearch', data: {query} });
   this.setData({
    serchList:res
   })
  },
 
 //取消事件
  handleCancel() {
    this.setData({
      isFocus: false,
      serchList: [],
      isValue:""
    })
 }
})