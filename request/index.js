 //同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    ajaxTimes++;
    //显示正在加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    //定义公共的URL，优化代码，方便日后维护
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            //拼接url
            url:baseUrl+params.url,
            success: (res)=>{
                resolve(res.data.message)
            },
            fail: (err)=> {
                reject(err)
            },
            complete:()=>{
                ajaxTimes--;
                if (ajaxTimes===0) {
                    //关闭正在等待的图标
                    wx.hideLoading();
                }
            }
        })
    })
}