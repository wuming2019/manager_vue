// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 实现登陆验证
export const login = (data) => {
  // 看接口文档
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
