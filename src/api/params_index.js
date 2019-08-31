// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有商品列表数据
export const getAllParamsList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
