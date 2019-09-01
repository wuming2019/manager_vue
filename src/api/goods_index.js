// 1。引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有商品列表数据
export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}

// 2.实现商品的添加
export const addGoods = (data) => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
