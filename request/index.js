export const request = (params) => {
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
            }
        })
    })
}