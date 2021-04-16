<template>

  <div class="container">

    <div>
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回　</i>
      <el-button type="primary" @click="addTest">添加实例</el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="编号"
        prop="id"
        width="180">
      </el-table-column>
      <el-table-column
        label="描述信息"
        prop="descr"
        width="500">
      </el-table-column>

      <el-table-column
        label="初始化脚本数量"
        prop="initCount"
        width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleRouter(scope.$index, scope.row)">查看
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>


</template>

<script>
  import axios from "axios";
  import Urls from "../../../util/Urls";
  import AutoTest from "./AutoTest";
  import AutoTestBatch from "./AutoTestBatch";

  export default {
    name: "TestItemList",
    components: {AutoTestBatch, AutoTest},
    data() {
      return {
        tableData: [],
        autoTestPro: {},
        types: 1,
        dialogFormVisible: false,
      }
    },
    methods: {
      handleRouter(index, row) {
        let types = this.$route.query.type;
        let autoTestId = this.$route.query.autoTestId;
        if (types == 1) {
          this.$router.push("/AutoTest?id=" + row["id"] + "&autoTestId=" + autoTestId);
        } else if (types == 2) {
          this.$router.push("/AutoTestBatch?id=" + row["id"] + "&autoTestId=" + autoTestId);
        }
      },

      handleQuickExec(index, row) {

      },

      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该工程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(Urls.urlRoot + "autoTest/item/del", {
            id: row["id"]
          }).then((res) => {
            this.getList();
          })
        }).catch(() => {

        });
      },

      getList() {
        let autoTestId = this.$route.query.autoTestId;
        axios.post(Urls.urlRoot + "autoTest/item/all?autoTestId=" + autoTestId).then((res) => {
          this.tableData = res.data.data;
        })
      },

      //添加一个新的测试案例
      addTest() {
        let autoTestId = this.$route.query.autoTestId;
        let types = this.$route.query.type;
        if (types == 1) {
          this.$router.push("/AutoTest?autoTestId=" + autoTestId);//this.$route.query.autoTestId
        } else if (types == 2) {
          this.$router.push("/AutoTestBatch?autoTestId=" + autoTestId);
        }
      }
    },
    created() {
      this.type = this.$route.query.type;
      this.getList();

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


</style>
