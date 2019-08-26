// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有用户数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除指定角色的权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
