// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeActive(e) {
      //获取点击的索引值
      let index = e.currentTarget.dataset.index
      //触发父组件中的事件，子给父传值 事件名自定义
      this.triggerEvent("tabsItemChange",{index})
    }
  }
})
