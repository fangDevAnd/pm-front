<template>
  <!--
    使用嵌套的工程开发
  -->

  <div class="container">
    <div class="inner-container">


      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">

        <el-submenu :index="item.id" v-for="(item,index) in data" v-if="item.urls==null">
          <template slot="title">{{item.menuName}}</template>
          <el-menu-item :index="item_item.id" v-for="(item_item,itemIndex) in item.list" v-if="item_item.urls!=null"
                        @click="changeRouter(item_item)">
            {{item_item.menuName}}
          </el-menu-item>

          <el-submenu :index="item_item.id" v-for="(item_item,itemIndex) in item.list" v-if="item_item.urls==null">
            <template slot="title"> {{item_item.menuName}}</template>
            <el-menu-item :index="item_item_item.id" v-for="(item_item_item,itemIndex) in item_item.list"
                          v-if="item_item_item.urls!=null" @click="changeRouter(item_item_item)">
              {{item_item_item.menuName}}
            </el-menu-item>

            <el-submenu :index="item_item_item.id" v-for="(item_item_item,itemIndex) in item_item.list"
                        v-if="item_item_item.urls==null">
              <template slot="title"> {{item_item_item.menuName}}</template>
              <el-menu-item :index="item_item_item_item.id" @click="changeRouter(item_item_item_item)"
                            v-for="(item_item_item_item,itemIndex) in item_item_item.list"
                            v-if="item_item_item_item.urls!=null">
                {{item_item_item_item.menuName}}
              </el-menu-item>
            </el-submenu>
          </el-submenu>

        </el-submenu>
        <el-menu-item index="1" v-for="item in data" v-if="item.urls!=null" @click="changeRouter(item)">
          {{item.menuName}}
        </el-menu-item>
      </el-menu>


    </div>

    <HtmlInner v-bind:url="url"></HtmlInner>

  </div>


</template>

<script>
  import axios from "axios";
  import Urls from "../../../util/Urls";
  import HtmlInner from "../../generate/HtmlInner";

  export default {
    name: "CrmPreViewer",
    components: {HtmlInner},
    data() {
      return {
        activeIndex: -1,

        data: null,
        url: '',

      }
    },

    methods: {

      menuList() {
        axios.post(Urls.urlRoot + "crm/menu").then((res) => {
          this.data = res.data.data;
        })
      },

      //更改路由
      changeRouter(obj) {
        console.log(obj)
        this.url = obj.urls;
      },

      handleSelect() {


      }

    },
    created() {

      this.menuList();

    }


  }
</script>

<style scoped>


</style>
