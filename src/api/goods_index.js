// 1。引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有商品列表数据
export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
