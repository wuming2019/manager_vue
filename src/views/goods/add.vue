<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <el-card class="box-card">
      <!-- 表单 -->
      <el-form label-width="80px">
        <!-- 标签页 -->
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="cateList"
                change-on-select
                :props="cascadeProps"
                v-model="goodsForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
          <!-- token值一定要传递，并且是通过请求头进行设置，
          并且key必须是Authorization -->
            <el-upload
              class="upload-demo"
              :headers='setToken()'
              action="http://localhost:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='handleSuccess'
              :before-upload='beforeUpload'
              :file-list="fileList"
              list-type="picture"
              accept="image/gif, image/jpeg"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor v-model='goodsForm.goods_introduce'></quillEditor>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮 -->
        <el-button type="primary" @click="addGoods">添加商品</el-button>      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getAllCateList } from '@/api/cate_index.js'
export default {
  data () {
    return {
      cateList: [],
      cascadeProps: {
        label: 'cat_name',
        // 展示的数据
        value: 'cat_id',
        // 获取的数据
        children: 'children'
        // 如何查询下一级数据
      },
      activeName: '0',
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    setToken () {
      // 获取token
      var token = localStorage.getItem('manager_vue_token')
      // 2.返回对象
      return { Authorization: token }
    },
    // 文件上传前的钩子函数
    beforeUpload (file) {
      console.log(file)
      // 图片的mime类型都是以image/开头，所以我们可以获取到type数据，进行判断
      if (file.type.indexOf('image/') !== 0) {
        this.$message.warning('请选择满足格式要求的图片，如png,jpg,jpeg')
        // 取消当前上传操作，会触发handleRemove
        return false
      }
    },
    // 文件上传成功之后的钩子函数
    // 文件上传成功之后的钩子
    handleSuccess (response, file, fileList) {
      // 获取文件上传成功之后，服务器端的文件存储路径
      // console.log(response, file, fileList)
      if (response.meta.status === 200) {
        // response包含了我们需要的文件上传成功之后服务器端的存储路径
        this.goodsForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    // 移除图片--移除数据的存储
    handleRemove (file, fileList) {
      if (!file.response) {
        return
      }
      // file就是当前被你移除的图片对象
      // 我们需要获取这个被移除的图片对象，将对应名称的数据从goods_form中删除
      var temp = file.response.data.tmp_path
      for (var i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === temp) {
          this.goodsForm.pics.splice(i, 1)
          break
        }
      }
    },
    handlePreview (file) {
      console.log(file)
    },
    addGoods () {
      console.log(this.goodsForm)
    }
    // getcate (obj) {
    //   console.log(obj)
    //   this.goodsForm.goods_cat = obj.join(',')
    // }
  },
  mounted () {
    getAllCateList(3)
      .then(res => {
        console.log(res)
        this.cateList = res.data.data
      })
  }
}
</script>

<style lang="less" scoped>

</style>
