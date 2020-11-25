import {request} from "./request"

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    //params添加到url请求字段中get请求使用的，data请求是放入请求体中，post请求使用的
    params: {
      type,
      page
    }
  })
}
