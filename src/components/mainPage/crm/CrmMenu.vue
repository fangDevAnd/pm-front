<template>
  <!--
    cur菜单设置
  -->
  <div class="container">
    <div class="inner-container">


      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称" class="itemMenu">
          <el-input v-model="form.menuName"></el-input>
        </el-form-item>

        <el-form-item label="父级菜单(可选)">
          <!--
      　　　　菜单选择
        -->

          <el-tree ref="elTree" :data="data" :props="defaultProps" node-key="id"
                   show-checkbox check-strictly="true"></el-tree>

        </el-form-item>
        <el-form-item label="html文件(可选)">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-remove="beforeRemove"
            :limit="1"
            :headers="headers"
            :on-success="fileSuccess"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传html/htm文件，且不超过500kb</div>
          </el-upload>


        </el-form-item>


        <el-form-item class="itemMenu">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

    </div>


  </div>

</template>

<script>
  import axios from "axios";
  import Urls from "../../../util/Urls";

  export default {
    name: "CrmMenu",
    data() {

      const token = window.localStorage.getItem("token");
      return {

        data: [],
        form: {
          pid: 0,
        },
        activeIndex: 0,
        defaultProps: {
          children: 'list',
          label: 'menuName',
        },

        headers: {
          "Authorization": token
        },
        fileList: [],

        uploadUrl: Urls.urlRoot + "upload/file",

      }
    },

    methods: {
      menuList() {
        axios.post(Urls.urlRoot + "crm/menu").then((res) => {
          this.disable(res.data.data);
          this.data = res.data.data;
          console.log(this.data)
        })
      },

      disable(obj) {
        var that = this;
        obj.forEach((v) => {
          if (v.url != null) {
            v.disabled = true;
          }
          if (v.list != null)
            that.disable(v.list);
        })
      },


      onSubmit() {

        let vars = this.$refs.elTree.getCheckedKeys();

        if (vars.length > 1) {
          this.$message('只能选择单节点');
          return;
        }

        if (this.form.menuName == null) {
          this.$message('请输入菜单或文件名称');
          return;
        }

        this.form.pid = vars[0];

        axios.post(Urls.urlRoot + "crm/add", this.form).then((res) => {
          this.menuList();
        })


      },

      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },


      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件`);
      },

      fileSuccess(response, file, fileList) {
        this.form.url = response.data;
      }
    },

    created() {

      this.menuList();

    },

  }
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
  }

  .inner-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    position: relative;
  }

  .itemMenu {
    max-width: 400px;
  }

</style>
