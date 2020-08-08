 //同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    
    //判断url中，是否带有/my/ 请求的是私有的路径，需要带上请求头header  token
    let header = { ...params.header };
    if (params.url.includes('/my/')) {
        //拼接header 带上token
        header["Authorization"] = wx.getStorageSync('token');
    }

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
            header:header,
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