<template>
  <div class="roleList">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮添加 -->
    <el-button type="success">角色列表</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" border style="width: 100%;margin-top: 15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这个内容在我们的项目中需要我们自己来生成 -->
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:15px;border-bottom:1px dashed #f00;">
            <el-col :span="4">
              <el-tag closable :type="'success'" @close='delRight(scope.row,first.id)'>{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px;">
                <el-col :span="4">
                  <el-tag closable :type="'info'" @close='delRight(scope.row,second.id)'>{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag closable :type="'error'" v-for='third in second.children' :key='third.id' style="margin-right:5px;margin-bottom:5px" @close='delRight(scope.row,third.id)'>{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span='24' v-show='scope.row.children.length === 0'>还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRoleList, delRightByRoleId } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    delRight (row, rightId) {
      console.log(row.id, rightId)
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res)
          //   刷新，不要使用init,因为init会刷新这个表格，造成展开行合并
          //   this.init()
          // res.data.data就是实现当前权限删除操作后该角色还拥有的权限数据
          // 为了避免刷新整个表格，我们可以将这个数据重置当前角色的展开行数据
          // 展开行数据：scope.row.children
          row.children = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
    //   角色列表
      getAllRoleList().then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>
