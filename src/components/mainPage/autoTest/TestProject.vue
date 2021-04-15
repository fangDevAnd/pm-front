<template>
  <!--测试项目
  　　项目名称, 创建时间　
  　　
  -->

  <div class="container">

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
        prop="id"
        width="180">
      </el-table-column>

      <el-table-column
        label="创建时间"
        prop="id"
        width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
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

  export default {
    name: "TestProject",
    data() {
      return {
        tableData: [],


      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },

      getList() {
        axios.post(Urls.urlRoot + "autoTest/project/all").then((res) => {
          this.tableData = res.data.data;
        })
      },






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
