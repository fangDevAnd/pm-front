<template>
  <div>
    <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
    <el-button type="primary" @click="queryEnvDrawer=true">查看环境变量</el-button>
    <el-button type="warning" @click="envDialogVisable=true">设置环境变量</el-button>

    <el-drawer
      title="环境变量"
      append-to-body="true"
      :visible.sync="queryEnvDrawer">
      <el-table :data="envList">
        <el-table-column property="key" label="名称" width="150"/>
        <el-table-column property="val" label="值"/>
      </el-table>
    </el-drawer>

    <el-dialog title="设置环境变量" append-to-body="true" :visible.sync="envDialogVisable">
      <el-form :model="envObj">
        <el-form-item label="变量名" :label-width="60">
          <el-input v-model="envObj.key" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="请选择变量类型" :label-width="60">
          <el-select v-model="envObj.type" placeholder="请选择变量类型">
            <el-option label="表达式" value="1"></el-option>
            <el-option label="文本" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值" :label-width="60">
          <el-input type="textarea" v-model="envObj.val"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="envSet">设置</el-button>
          <el-button @click="envDialogVisable=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "InnerMenu",
    data() {
      return {
        envDialogVisable: false,
        queryEnvDrawer: false,
        envList: [],
        envObj: {},
      }
    },

    methods: {

      envSet() {
        if (this.envObj.type == 1) {
          //表达式式
          let val = eval(this.envObj.val);
          localStorage.setItem(this.envObj.key, val)
        } else {
          localStorage.setItem(this.envObj.key, this.envObj.val)
        }
        this.envDialogVisable = false;
      }


    },

    created() {
      let envList = [];
      //遍历本地存储localStorage
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i); //获取本地存储的Key
        var val = localStorage.getItem(key);
        console.log(key, val);
        envList.push({
          key: key,
          val: val
        })
      }
      this.envList = envList;

    }


  }
</script>

<style scoped>

  >>> .el-drawer {
    overflow-y: scroll;
  }


</style>
