<template>
  <div class="users">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keydown.enter.native="init"
        @input.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
    </div>
    <!-- 表格展示区域 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share"  @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="deluser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'60px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'60px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled style='width:100px'></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 分配角色对话框 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'">
        <el-form-item label="用户名：">
          <!-- <el-input v-model="grantForm.username" autocomplete="off" disabled style='width:100px'></el-input> -->
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色：">
          <!-- <el-select v-model="grantForm.rid" clearable placeholder="请选择" @change="getrid"> -->
            <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers, addUser, editUser, grantUserRole, delUserById, updateUserState } from '@/api/user_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogFormVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 角色列表
      roleList: [],
      grantDialogFormVisible: false,
      grantForm: {
        username: '',
        // 用户id
        id: '',
        // 角色id
        rid: ''
      },
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            // 添加正则表达式
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            // 添加正则表达式
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 当切换sizes下拉列表时触发
    handleSizeChange (val) {
      this.userobj.pagesize = val
      this.init()
    },
    // 当切换当前页码时触发
    handleCurrentChange (val) {
      // 1.修改参数
      this.userobj.pagenum = val
      // 2.重新请求
      this.init()
    },
    //   数据获取
    init () {
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取记录总数
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          } else if (res.data.meta.status === 401) {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增用户
    add () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('添加用户成功')
                this.init()
                this.addDialogFormVisible = false
                // 清空表单元素的数据 -- 重置表单元素
                this.$refs.addForm.resetFields()
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.success('用户新增失败')
            })
        } else {
          this.$message.warning('请输入所有必填数据')
        }
      })
    },
    // 实现用户编辑
    edituser () {
      editUser(this.editForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('编辑用户成功')
            this.init()
            this.editDialogFormVisible = false
            // 清空表单元素的数据 -- 重置表单元素
            this.$refs.editForm.resetFields()
          }
        })
        .catch(() => {
          this.$message.success('用户编辑失败')
        })
    },
    // 弹出编辑对话框
    showEditDialog (row) {
      this.editDialogFormVisible = true
      console.log(row)
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 打开分配角色对话框
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      // 修改后台代码，增加rid数据的返回
      this.grantForm.rid = row.rid
    },
    // getrid (obj) {
    //   console.log('-----------')
    //   console.log(obj)
    //   this.grantForm.rid = obj
    //   console.log('-----------')
    // },
    // 为用户分配角色
    grantUser () {
      console.log(this.grantForm)
      // 先判断用户是否选择的角色
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.grantDialogFormVisible = false
              // 清空表单元素的数据--重置表单元素
              // this.$refs.editForm.resetFields()
              this.init()
            }
          })
          .catch(() => {
            this.$message.success('用户编辑失败')
          })
      } else {
        this.$message.error('请选择角色')
      }
    },
    // 根据id删除用户数据
    deluser (id) {
      this.$confirm('此操作将永久删除该用户，是否继续？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // this.init()
              // 需求：如果当前页经过这一次删除，没有任何数据了，那么应该自动跳转到上一页
              // 业务：先删除再刷新，意味着如果这页真的只有一条数据，那么经过这一次
              // 删除操作，在刷新之前，这一页还是有1条数据的
              this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagenum) < this.userobj.pagenum ? --this.userobj.pagenum : this.userobj.pagenum
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改用户状态
    changeState (id, type) {
      console.log(111)
      updateUserState(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '修改状态成功'
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: 'res.data.meta.msg'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '修改状态失败'
          })
        })
    }
  },
  mounted () {
    this.init()
    // 加载角色列表数据
    getAllRoleList()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>
