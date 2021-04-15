<template>

  <!--
    自动测试的实现
  -->
  <div class="container">
    <el-row>
      <el-col :span="12">
        <!--左边操作部分-->
        <el-card class="box-card" v-for="i in initCount">
          <div slot="header" class="clearfix">
            <span>流水线{{i}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addItem">添加</el-button>
          </div>
          <!--
          添加业务代码
          -->
          <el-form ref="form" label-width="80px">
            <el-form-item label="请求地址">
              <el-input v-model="innerItems[i-1].url"></el-input>
            </el-form-item>
            <el-form-item label="请求方式">
              <el-select v-model="innerItems[i-1].method" placeholder="选择请求方式">
                <el-option label="GET请求" value="GET"></el-option>
                <el-option label="POST请求" value="POST"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="ContentType">
              <el-select v-model="innerItems[i-1].contentType" placeholder="选择ContentType类型">
                <el-option label="application/json" value="application/json"></el-option>
                <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                <el-option label="application/x-www-form-urlencoded"
                           value="application/x-www-form-urlencoded"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="请求头">
              <el-input type="textarea" v-model="innerItems[i-1].header"></el-input>
            </el-form-item>


            <el-form-item label="请求参数">
              <el-input type="textarea" v-model="innerItems[i-1].param" 　placeholder="GET请求可以使用url传递参数"></el-input>
            </el-form-item>
            <el-form-item label="结果处理">
              <el-input type="textarea" v-model="innerItems[i-1].parse"></el-input>
            </el-form-item>


          </el-form>


        </el-card>

      </el-col>
      <el-col :span="12" style="padding-right: 10px">
        　<!--右边控制台执行情况显示-->
        <el-steps direction="vertical" :active="curExecIndex" space="100px" finish-status="success">
          <el-step :title="'流水线'+item.index"
                   v-for="item in innerItems">
            <el-input slot="description" type="textarea" :rows="10" style="width:400px" :value="item.desc">
            </el-input>
          </el-step>
        </el-steps>
        　

      </el-col>
    </el-row>

    <div class="exec-auto">
      <el-button type="success" @click="pipeline(0)">执行流水线</el-button>
    </div>

  </div>
</template>

<script>

  //存放流水线数据的全局缓存
  window.items = []

  import axios from "axios";

  export default {
    name: "AutoTest",
    data() {
      return {
        innerItems: [],
        initCount: 0,
        curExecIndex: 1,
      }
    },

    methods: {

      /**
       *
       * @param index　代表需要操作的index
       */
      pipeline(index, resp) {
        let item = this.innerItems[index];
        this.curExecIndex = index + 1;

        item.index = index;
        if (resp == undefined) {
          item.resp = {};//空对象
        } else {
          item.resp = resp;
        }
        //初始化
        window.items[index] = {};
        this.request(item);
      },

      /**
       * 请求参数的封装类
       * @param item
       */
      request(item) {
        let method = item["method"];
        if (method == "GET") {
          this.getRequest(item);
        } else if (method == "POST") {
          this.postRequest(item);
        }
      },

      getRequest(item) {
        let index = item["index"];
        //定义上一个的响应对象
        let url = item["url"];
        this.commonProcess(item);
        axios.get(url, {
          headers: window.items[index]["header"],
          data: window.items[index]["param"]
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },


      commonProcess(item) {
        let index = item["index"];
        let resp = item["resp"];
        if (item["header"] != null && item["header"].length > 0) {
          eval("window.items[" + index + "]['header']=" + item["header"]);
        }
        if (item["param"] != null && item["param"].length > 0) {
          eval("window.items[" + index + "]['param']=" + item["param"])
        }
        //请求的ContentType
        if (window.items[index]["header"] != undefined) {
          window.items[index]["header"]["Content-Type"] = item.contentType;
        }
      },

      postRequest(item) {
        let index = item["index"];
        let url = item["url"];
        this.commonProcess(item);
        axios.post(url, window.items[index]["param"], {
          headers: window.items[index]["header"],
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },


      processResult(resp, item) {
        let data = resp.data;
        let index = item["index"];
        let desc = JSON.stringify(data);
        let inner = [];

        for (let i = 0; i < this.innerItems.length; i++) {
          inner.push(this.innerItems[i]);
        }
        inner[index].desc = desc;
        this.innerItems = inner;
        //存放执行的脚本数据
        window.items[index]["resp"] = data;

        //执行脚本处理代码
        eval(item["parse"]);


      },

      addItem() {
        this.initCount++;
        this.innerItems.push({
          method: "POST",
          index: this.initCount - 1,
        })

      }


    },

    created() {
      this.initCount++;
      this.innerItems.push({
        method: "POST",
        index: this.initCount - 1
      })
      //挂载
      window.pipeline = this.pipeline;
      axios.disableDefault = true;
      axios.defaults.withCredentials = false;
      //清除相关属性
      axios.interceptors.request.use(
        config => {
          delete config.headers["x-xsrf-token"]
          delete config.headers["Authorization"]
          delete config.headers["X-XSRF-TOKEN"]
          return config;
        },
        error => {
          return Promise.error(error);
        }
      );
    },

    destroyed() {
      axios.disableDefault = false;
      axios.defaults.withCredentials = true;
    }


  }
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 10px;
    position: fixed;
  }


  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 90%;
    margin-bottom: 10px;
  }

  .exec-auto {
    position: fixed;
    bottom: 0px;
    padding: 5px;
    margin-left: 199px;
    width: 100%;
    background: #ccc;
    left: 0px;
  }

  >>> .el-step.is-vertical .el-step__line {
    height: 100%;
  }


</style>
