// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 实现用户数据的新增
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 实现用户数据的编辑
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 实现用户角色的分配
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

// 实现用户数据的删除
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 实现用户状态的设置
export const updateUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
