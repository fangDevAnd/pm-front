<template>
  <div class="container">
    <div>
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回　</i>
      <el-button type="primary" @click="dialogFormVisible=true">添加测试</el-button>
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
        label="项目名称"
        prop="name"
        width="180">
      </el-table-column>

      <el-table-column
        label="类型"
        prop="createTime"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.type==1">流水线项目</span>
          <span v-if="scope.row.type==2">批处理项目</span>

        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleRouter(scope.$index, scope.row)">测试案例
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>


        </template>
      </el-table-column>
    </el-table>


    <!-- Form -->
    <el-dialog title="添加测试项" modal="false" append-to-body="true" :visible.sync="dialogFormVisible">
      <el-form :model="autoTestPro">
        <el-form-item label="测试项名称" :label-width="100">
          <el-input v-model="autoTestPro.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="150">
          <el-select v-model="autoTestPro.type" placeholder="请选择类型">
            <el-option label="流水线" value="1"></el-option>
            <el-option label="批处理" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTest">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import axios from "axios";
  import Urls from "../../../util/Urls";

  export default {
    name: "AutoTestList",
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        autoTestPro: {},
      }
    },
    methods: {
      handleRouter(index, row) {
        this.$router.push("/TestItemList?autoTestId=" + row["id"] + "&type=" + row["type"]);
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该工程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          axios.post(Urls.urlRoot + "autoTest/test/del", {
            id: row["id"]
          }).then((res) => {
            this.getList();
          })
        }).catch(() => {

        });
      },

      getList() {
        let projectId = this.$route.query.projectId;
        axios.post(Urls.urlRoot + "autoTest/test/all?projectId=" + projectId).then((res) => {
          this.tableData = res.data.data;
        })
      },

      addTest() {

        let projectId = this.$route.query.projectId;
        this.autoTestPro.projectId = projectId;
        axios.post(Urls.urlRoot + "autoTest/test/add", this.autoTestPro).then((res) => {
          this.getList();
        })


      }


    },
    created() {

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
