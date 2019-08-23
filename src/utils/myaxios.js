import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加登陆验证方法
// export const login = () => {
//   return axios()
// }
export default axios
