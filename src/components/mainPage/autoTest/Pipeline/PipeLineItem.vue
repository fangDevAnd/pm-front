<template>

  <!--
    流水线　pipeline
  -->
  <div>
    <div v-for="(item,itemIndex) in task" class="taskItem">
      <div class="left_line" v-if="superIndex<superLength-1"></div>
      <div class="mg-l-100">
        <div class="line" v-if="item.level!==0"></div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>流水线{{itemIndex}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="delItem(itemIndex,item,task)">删除
            </el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addItem(itemIndex,item)">添加</el-button>
          </div>
          <!--
          添加业务代码
          -->
          <el-form ref="form" label-width="80px">
            <el-form-item label="请求地址">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="请求方式">
              <el-select v-model="item.method" placeholder="选择请求方式">
                <el-option label="GET请求" value="GET"></el-option>
                <el-option label="POST请求" value="POST"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="ContentType">
              <el-select v-model="item.contentType" placeholder="选择ContentType类型">
                <el-option label="application/json" value="application/json"></el-option>
                <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                <el-option label="application/x-www-form-urlencoded"
                           value="application/x-www-form-urlencoded"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="请求头">
              <el-input type="textarea" v-model="item.header"></el-input>
            </el-form-item>
            <el-form-item label="请求参数">
              <el-input type="textarea" v-model="item.param" 　placeholder="GET请求可以使用url传递参数"></el-input>
            </el-form-item>
            <el-form-item label="结果处理">
              <el-input type="textarea" v-model="item.parse"></el-input>
            </el-form-item>

          </el-form>
        </el-card>

        <PipeLineItem :task="item.task" :super-index="itemIndex" :super-length="task.length"></PipeLineItem>


      </div>

    </div>
  </div>
</template>

<script>
  let task;
  let superIndex;
  let superLength;


  export default {
    name: "PipeLineItem",
    props: {task, superIndex, superLength},
    data() {
      return {}
    },
    methods: {

      delItem(index, item, task) {
        // console.log(item)
        // task.splice(index, 1)
        this.$emit("delItem", index, item, task);
      },

      addItem(index, item) {
        console.log(this)
        this.$emit("addItem", index, item);

      }


    },

    created() {

    }


  }
</script>

<style scoped>

  .card {
    width: 300px;
    height: 200px;
    background: #cccccc;
    border-radius: 5px;
  }


  .mg-l-100 {
    margin-left: 100px;
  }

  .line {
    height: 100px;
    position: relative;
    width: 2px;
    background: #0c77cf;
  }

  .taskItem {
    position: relative;
  }

  .left_line {
    width: 2px;
    height: 100%;
    background: #0c77cf;
    position: absolute;
    left: 0px;
    z-index: 10;
  }


  .box-card {
    width: 600px;
  }


</style>
