<template>

  <div class="container">

    <div>
      <el-button type="primary" @click="dialogFormVisible=true">添加实例</el-button>
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
        width="180">
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


    <!-- Form -->
    <el-dialog title="添加测试实例" modal="false" append-to-body="true" :visible.sync="dialogFormVisible">
      <el-form :model="autoTestPro">
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
    name: "TestItemList",
    data() {
      return {
        tableData: [],
        autoTestPro: {},
      }
    },
    methods: {
      handleRouter(index, row) {
        this.$router.push("/AutoTest?id=" + row["id"] + "&autoTestId=" + this.$route.query.autoTestId);
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

      addTest() {
        let autoTestId = this.$route.query.autoTestId;
        if (this.autoTestPro.type == 1) {
          this.$router.push("/AutoTest?autoTestId=" + autoTestId);//this.$route.query.autoTestId
        } else if (this.autoTestPro.type == 2) {
          this.$router.push("/AutoTestBatch?autoTestId=" + autoTestId);
        }
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
