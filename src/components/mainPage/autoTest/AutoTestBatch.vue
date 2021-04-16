<template>
  <!--
    自动批处理项目测试的实现
  -->
  <div class="container">

    <div class="innerMenu">
      <InnerMenu/>
    </div>

    <el-row>
      <el-col :span="12">
        <!--左边操作部分-->
        <el-card class="box-card" v-for="i in innerItems.length">
          <div slot="header" class="clearfix">
            <span>批处理{{i-1}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="delItem(i)">删除</el-button>
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


          </el-form>


        </el-card>

      </el-col>
      <el-col :span="12" style="padding-right: 10px">
        　<!--右边控制台执行情况显示-->
        <el-steps direction="vertical" :active="curExecIndex" space="100px" finish-status="success">
          <el-step :title="'批处理'+item.index"
                   v-for="item in innerItems">
            <el-input slot="description" type="textarea" :rows="10" style="width:400px" :value="item.desc">
            </el-input>
          </el-step>
        </el-steps>
        　

      </el-col>
    </el-row>

    <div class="exec-auto">
      <el-button type="success" @click="execPipe">执行批处理</el-button>
      <el-button type="warning" @click="savePipeLinePop">保存</el-button>
    </div>


  </div>
</template>


<script>

  //存放批处理数据的全局缓存
  import Urls from "../../../util/Urls";
  import axios from "axios";

  import InnerMenu from "./menu/InnerMenu";

  window.items = []

  export default {
    name: "AutoTestBatch",
    components: {
      InnerMenu
    },
    data() {
      return {
        innerItems: [],
      }
    },

    methods: {

      /**
       *
       * @param index　代表需要操作的index
       */
      pipeline(index, resp) {
        let item = this.innerItems[index];
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
        }).catch(reason => {
          console.log(reason)
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
        }).catch(reason => {
          console.log(reason)
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

      },

      addItem() {

        let length = this.innerItems.length;
        this.innerItems.push({
          method: "POST",
          index: length,
        })
      },

      delItem(index) {
        console.log(index)
        this.innerItems.splice(index - 1, 1);
        window.items.splice(index - 1, 1);
      },

      getDetail(id) {
        axios.post(Urls.urlRoot + "autoTest/item/all?id=" + id).then((res) => {
          let data = res.data.data;
          if (data[0].innerItems != null) {
            this.innerItems = JSON.parse(data[0].innerItems);
          } else {
            this.innerItems.push({
              method: "POST",
              index: 0,
            })
          }
        })
      },

      savePipeLinePop() {
        this.$prompt('请输入案例描述', '案例描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          this.savePipeLine(value);
        }).catch(() => {

        });
      },


      //保存当前的pipeLine
      savePipeLine(descr) {
        this.clearAuth(false);

        //添加一个item
        axios.post(Urls.urlRoot + "autoTest/item/add", {
          autoTestId: this.$route.query.autoTestId,
          descr: descr,
          type: 2,
          initCount: this.innerItems.length,
          innerItems: JSON.stringify(this.innerItems)
        }).then((res) => {

        })


      },


      execPipe() {
        //同时执行
        for (let i = 0; i < this.innerItems.length; i++) {
          this.pipeline(i);
        }

        //挂载
        window.pipeline = this.pipeline;
        this.clearAuth(true);
      },

      clearAuth(boolClear) {
        if (!boolClear) {
          axios.disableDefault = false;
          axios.defaults.withCredentials = true;
        } else {
          axios.disableDefault = true;
          axios.defaults.withCredentials = false;
        }
      }

    },


    created() {

      let id = this.$route.query.id;
      if (id != null) {
        this.getDetail(id);
      } else {
        this.innerItems.push({
          method: "POST",
          index: 0
        })
      }

    },

    destroyed() {
      this.clearAuth(false);
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

  .innerMenu {
    display: flex;
    margin-bottom: 5px;
  }

</style>
