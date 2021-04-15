<template>
  <!--
   lint 代码检查工具
  -->
  <div>

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

        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="router(scope.$index, scope.row)">查看报告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!--
    项目的列表
    -->
    <el-drawer
      title="请选择对应模块"
      :visible.sync="lintListVisable"
      direction="rtl"
      size="30%">
      <el-table :data="lintModuleList" style="padding: 10px" highlight-current-row="true" @row-click="rowClick">
        <el-table-column property="name" label="项目名称"></el-table-column>
      </el-table>
    </el-drawer>


  </div>
</template>

<script>
  import axios from "axios";
  import Urls from "../../util/Urls";

  export default {
    name: "UserBehavior",
    data() {
      return {
        tableData: [],
        lintListVisable: false,
        lintModuleList: [],
        curProject: '',

      }
    },
    methods: {

      getList() {
        axios.post(Urls.urlRoot + "check/all").then((res) => {
          let table = [];
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i]["projectName"].indexOf("@tmp") == -1) {
              table.push(res.data.data[i]);
            }
          }
          this.tableData = table;
        })
      },
      router(index, obj) {
        this.curProject = obj["projectName"];
        axios.get(Urls.urlRoot + "lint/all?project=" + this.curProject,).then((res) => {
          let data = res.data.data;
          let dataForm = [];
          data.forEach((v) => {
            dataForm.push({
              name: v
            })
          })

          this.lintListVisable = true;
          this.lintModuleList = dataForm;
        })
      },


      //行点击
      rowClick(row, column, event) {
        let url="/pm/lint/" + this.curProject + "/" + row["name"] + "/lint-result.html";
        console.log("/HtmlInner?url=" +url);
        this.$router.push("/HtmlInner?url="+url);
      }
    },
    created() {
      this.getList()

    }
  }
</script>

<style scoped>

</style>
