<template>

  <div class="generateStart">
    <!--表单过滤部分-->
    <div class="tableFilter">
      <el-form :inline="true">
        <el-form-item :label="mapper.txt" v-for="mapper in displayTableMapper" v-if="mapper.isFilter">
          <el-input v-model="mapper[mapper.mname]" v-if="!mapper.isTimeFilter"
                    :placeholder="mapper.txt"></el-input>

          <div v-if="mapper.isTimeFilter">
            <el-col :span="11">
              <el-date-picker type="date"
                              value-format="yyyy-MM-dd"
                              v-model="mapper.startTime"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col style="width: 20px;text-align:center" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date"
                              value-format="yyyy-MM-dd"
                              v-model="mapper.endTime"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </div>
        </el-form-item>
        <el-button type="primary" @click="onQuery">查询</el-button>

      </el-form>
    </div>
    <!--表单生成部分-->
    <div class="tableGenerator">

      <el-table
        ref="filterTable"
        @sort-change="tableSortChange"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%">

        <el-table-column v-if="form.isMultSelect"
                         type="selection"
                         width="55"/>
        <el-table-column v-for="mapper in displayTableMapper"
                         :sortable="mapper.isSort?'custom':false"
                         :prop="mapper.mname"
                         :label="mapper.txt">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-for="(operate,index) in form.oprate.split(',')" @click="operateFunc(scope.row,operate)"
                       size="mini">{{operate}}
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination v-if="form.isPage&&form.size>0"
                     @current-change="handleCurrentChange"
                     :page-size="form.size"
                     layout="prev, pager, next, jumper"
                     :total="form.total">
      </el-pagination>

    </div>
  </div>

</template>

<script>

  import axios from "axios";

  export default {

    data() {
      return {

        //存放表单数据
        form: {
          name: "name",
          url: "http://123.56.93.253:8084/pm/logcat/list",
          method: "POST",
          header: "{\n" +
            "    \"Authorization\":\n" +
            "\t\"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYW5nIiwiY3JlYXRlZCI6MTYxODgxMTUwNTQ4MSwiYXV0aG9yaXRpZXMiOltdfQ.hmQKWGwv4dWi5ItHbsN2EOuEstwuE1hCKwFZXCxqTLWXIZY5L4uyR6skd31a3TbpjSpjZU7Kuk7AcoY3kujlRA\"\n" +
            "}",
          param: "{\n" +
            "    \"createTime_end\": null,\n" +
            "    \"createTime_start\": null,\n" +
            "    \"page\": \"1\",\n" +
            "    \"project\": null,\n" +
            "    \"size\":\"10\"}",

        },
        //存放显示的tableMapper
        displayTableMapper: [{
          "mname": "project",
          "txt": "项目名称",
          "isFilter": true,
          "isDisplay": true
        },
          {
            "mname": "imei",
            "txt": "国际识别码",
            "isDisplay": true
          },
          {
            "mname": "additionNumber",
            "txt": "附加编号",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "createTime",
            "txt": "创建时间",
            "isDisplay": true,
            "isSort": true,
            "isFilter": true,
            "isTimeFilter": true
          },
          {
            "mname": "level",
            "txt": "日志等级",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "info",
            "txt": "日志信息",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "tag",
            "txt": "日志标签",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "phone",
            "txt": "手机号",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "version",
            "txt": "版本",
            "isDisplay": true,
            "isSort": true
          },
          {
            "mname": "brand",
            "txt": "品牌",
            "isDisplay": true,
            "isSort": true
          }],

      }
    },
    methods: {

      //生成表单的方法部分
      onQuery() {

        //额外的参数
        let param = this.form.param;
        param = JSON.parse(param);


        //生成查询条件
        for (var i = 0; i < this.displayTableMapper.length; i++) {
          var mapper = this.displayTableMapper[i];
          if (mapper.isFilter) {
            if (mapper.isTimeFilter) {
              let timestart = mapper.mname + "_start";
              let timeend = mapper.mname + "_end";
              param[timestart] = mapper["startTime"];
              param[timeend] = mapper["endTime"];
            } else {
              param[mapper.mname] = mapper[mapper.mname];
            }

          }
        }

        for (var key in param) {
          if (param[key] == '') {
            delete param[key];
          }
        }
        //如果存在分页，添加分页查询
        if (this.form.isPage) {
          if (param.page == undefined) {
            param.page = this.form.page;
          }
          param.size = this.form.size;
        }
        this.form.param = JSON.stringify(param);
        this.request(this.form);
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

      postRequest(item) {
        let url = item["url"];
        axios.post(url, {
          headers: item.header,
          data: item.param
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },

      getRequest(item) {
        //定义上一个的响应对象
        let url = item["url"];
        axios.get(url, {
          headers: item.header,
          data: item.param
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },


      tableSortChange(obj) {
        let param = this.form.param;
        param = JSON.parse(param);
        param.order = obj.order;
        param.prop = obj.prop;
        this.form.param = JSON.stringify(param);
        this.onQuery();
      },

      handleSelectionChange(selection) {
        console.log(selection);
      },
      operateFunc(obj, operate) {
        console.log(obj, operate);
      }
    },

    created() {
      this.onQuery();
    }


  }
</script>

<style scoped>


</style>
