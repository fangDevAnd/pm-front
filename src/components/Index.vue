<template>

  <!--
    项目的主页
  -->
  <el-container>
    <el-aside width="200px">

      <div style="position: absolute;height: 100%;background-color:#545c64; width: 199px"/>


      <el-menu default-active="1"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <el-menu-item index="1" @click="changeRouter($event)" data-route="/pm">软件包管理</el-menu-item>
        <el-menu-item index="2" @click="changeRouter($event)" data-route="/routeChange">路由控制</el-menu-item>
        <el-menu-item index="3" @click="changeRouter($event)" data-route="/LogcatQuery">日志分析</el-menu-item>
        <el-menu-item index="4" @click="changeRouter($event)" data-route="/UserBehavior">Lint代码检查</el-menu-item>
        <el-menu-item index="5" @click="changeRouter($event)" data-route="/CheckReport">依赖检查报告</el-menu-item>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>Crm内容管理</span>
          </template>
          <el-menu-item index="6-1" @click="changeRouter($event)" data-route="/CrmMenu">Crm菜单设置</el-menu-item>
          <el-menu-item index="6-2" @click="changeRouter($event)" data-route="/CrmPreViewer">Crm内容预览</el-menu-item>
        </el-submenu>

        <el-menu-item @click="logout" type="danger">退出登录</el-menu-item>

      </el-menu>
    </el-aside>

    <el-container>
      <!--
       路由的主页面
      -->
      <router-view/>

    </el-container>
  </el-container>


</template>

<script>

  import Urls from "../util/Urls";
  import axios from "axios";

  export default {
    name: "Index",
    data() {
      return {
        index: 1,
      }
    },

    methods: {

      changeRouter(event) {
        this.$router.push(event.$el.dataset['route']);
      },

      logout() {

        axios.post(Urls.urlRoot + "logout").then(res => {
          this.$router.replace("/Login");
        })


      }

    },

    created() {
      this.$router.push("/pm");
    }


  }
</script>

<style scoped>

  .el-menu {
    border-right: none;
  }

</style>
