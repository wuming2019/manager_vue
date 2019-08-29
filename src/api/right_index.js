// 引入封装胶的axios
import axios from '@/utils/myaxios.js'

// 获取所有权限列表数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 获取左侧菜单权限
export const getLeftMenu = (type) => {
  return axios({
    url: `menus`
  })
}
