<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <img src="../assets/logo.png" alt="" class="logo" />
        <el-menu
          :collapse="iscollapse"
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
        <!-- :default-active="'1-3'" -->
        <!-- index需要的是字符串格式，而item.id是数值，
        所以会有警告错误，那么我们应该将item.id转换为字符串 -->
          <el-submenu :index="''+item.id" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="myicon myicon-menu toggle-btn" @click="iscollapse = !iscollapse"></span>
          <h2 class="system-title">电商后台管理系统</h2>
          <a href="javascript" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getLeftMenu } from '@/api/right_index.js'
export default {
  data () {
    return {
      iscollapse: false,
      menuList: []
    }
  },
  mounted () {
    getLeftMenu()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.menuList = res.data.data
          console.log(this.menuList)
        }
      })
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  // .el-menu {
  //   width: auto;
  // }
  // 如果是展开状态,那么宽度就是200px,如果是合并状态,宽度:auto
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
