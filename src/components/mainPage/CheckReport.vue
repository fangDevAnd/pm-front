<template>


  <div class="container">


    <!--
     集成检查报告
    -->
    <div style="padding:20px">
      <el-table
        :data="tableData">
        <el-table-column
          label="项目名称"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="项目创建时间"
          width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>


        <el-table-column
          label="报表生成时间"
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.generateDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="router(scope.$index, scope.row)">查看报告
            </el-button>
            <el-button
              size="mini"
              @click="router(scope.$index, scope.row)">生成Excel报表
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>

</template>

<script>
  import axios from "axios";
  import Urls from "../../util/Urls";

  export default {
    name: "CheckReport",
    data() {
      return {
        tableData: []
      }
    },
    methods: {

      getList() {
        axios.post(Urls.urlRoot + "check/all").then((res) => {

          let table = [];
          res.data.data.forEach((v) => {
            if (v.projectName.indexOf("@tmp") != -1) {
              table.push(v);
            }
          })
          this.tableData = table;
        })
      },
      router(index, obj) {
        let url = encodeURI(Urls.urlRoot + obj.projectName + "/dependency-check-report.html");
        this.$router.push("/HtmlInner?url=" + url);
      }
    },
    created() {

      this.getList()

    }

  }
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    position: fixed;
  }


</style>
