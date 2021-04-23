<template>


  <div class='generateStart'>
    <!--表单过滤部分-->
    <div class='tableFilter'>
      <el-form :inline='true'>
        <el-form-item :label='mapper.txt' v-for='mapper in tableMapper' v-if='mapper.isFilter'>
          <el-input v-model='mapper[mapper.mname]' v-if='!mapper.isTimeFilter'
                    :placeholder='mapper.txt'></el-input>

          <div v-if='mapper.isTimeFilter'>
            <el-col :span='11'>
              <el-date-picker type='date'
                              value-format='yyyy-MM-dd'
                              v-model='mapper.startTime'
                              style='width: 100%;'></el-date-picker>
            </el-col>
            <el-col style='width: 20px;text-align:center' :span='2'>-</el-col>
            <el-col :span='11'>
              <el-date-picker type='date'
                              value-format='yyyy-MM-dd'
                              v-model='mapper.endTime'
                              style='width: 100%;'></el-date-picker>
            </el-col>
          </div>
        </el-form-item>
        <el-button type='primary' @click='onQuery'>查询</el-button>

      </el-form>
    </div>
    <!--表单生成部分-->
    <div class='tableGenerator'>

      <el-table
        ref='filterTable'
        @sort-change='tableSortChange'
        :data='tableData'
        @selection-change='handleSelectionChange'
        style='width: 100%'>

        <el-table-column v-if='form.isMultSelect'
                         type='selection'
                         width='55'/>
        <el-table-column v-for='mapper in tableMapper'
                         :sortable='mapper.sort'
                         :prop='mapper.mname'
                         :label='mapper.txt'>
        </el-table-column>

        <el-table-column label='操作'>
          <template slot-scope='scope'>
            <el-button v-for='(operate,index) in form.operates' @click='operateFunc(scope.row,operate)'
                       size='mini'>{{operate}}
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination v-if='form.isPage&&form.size>0'
                     @current-change='handleCurrentChange'
                     :page-size='form.size'
                     layout='prev, pager, next, jumper'
                     :total='form.total'>
      </el-pagination>

    </div>
  </div>


</template>

<script>

  import axios from 'axios';

  export default {

    data() {
      return {
        form: {},
        tableMapper: [],
        tableData: [],
      }
    },
    methods: {
      onQuery() {
        let param = this.form.param;
        for (var i = 0; i < this.tableMapper.length; i++) {
          var mapper = this.tableMapper[i];
          if (mapper.isFilter) {
            if (mapper.isTimeFilter) {
              let timestart = mapper.mname + '_start';
              let timeend = mapper.mname + '_end';
              param[timestart] = mapper['startTime'];
              param[timeend] = mapper['endTime'];
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
        if (this.form.isPage) {
          if (param.page == undefined) {
            param.page = this.form.page;
          }
          param.size = this.form.size;
        }
        this.request(this.form);
      },

      request(item) {
        let method = item['method'];
        if (method == 'GET') {
          this.getRequest(item);
        } else if (method == 'POST') {
          this.postRequest(item);
        }
      },

      postRequest(item) {
        let url = item['url'];
        console.log(item)
        axios.post(url, item.param, {
          headers: item.header,
        }).then((resp) => {
          console.log(resp)
          let data = resp.data;
          this.parseResult(data);
        })
      },

      getRequest(item) {
        let url = item['url'];
        axios.get(url, {
          headers: item.header,
          data: item.param
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },

      parseResult(netResp) {
        this.form.total = netResp.total;
        this.tableData = netResp.data;
      },


      tableSortChange(obj) {
        let param = this.form.param;
        param.order = obj.order;
        param.prop = obj.prop;
        this.onQuery();
      },

      handleCurrentChange(page) {
        let param = this.form.param;
        param.page = page;
        param.size = this.form.size;
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

      var obj = "{\"form\":{\"name\":\"name\",\"url\":\"http://localhost:8084/pm/logcat/list\",\"method\":\"POST\",\"header\":\"{\\\"Authorization\\\":\\\"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYW5nIiwiY3JlYXRlZCI6MTYxOTA5NzM4MTI0MywiYXV0aG9yaXRpZXMiOltdfQ.srHL9L5n07ngv3fyqsF0pAVE0J7JBo_ZXXN-p5elUw2GPWS108gKFDBFWi1hzoehyAafgL7ydrKYnFyhe1NK7Q\\\",\\\"Content-Type\\\":\\\"application/json\\\"}\",\"param\":\"{\\\"size\\\":\\\"20\\\",\\\"page\\\":1}\",\"total\":136841,\"isMultSelect\":true,\"isPage\":true,\"size\":\"10\",\"page\":\"1\",\"oprate\":\"详情\",\"contentType\":\"application/json\"},\"tableMapper\":[{\"mname\":\"project\",\"txt\":\"当前的项目名称\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"imei\",\"txt\":\"编号\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"additionNumber\",\"txt\":\"附加参数\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"createTime\",\"txt\":\"创建时间\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true,\"isTimeFilter\":true},{\"mname\":\"level\",\"txt\":\"等级\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"info\",\"txt\":\"信息\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"tag\",\"txt\":\"标签\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"phone\",\"txt\":\"手机号\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"version\",\"txt\":\"版本\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true},{\"mname\":\"brand\",\"txt\":\"品牌\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true}]}";

      this.form = JSON.parse(obj).form;

      let param = this.form.param;
      param = JSON.parse(this.form.param);
      this.form.param = param;
      let header = this.form.header;
      header = JSON.parse(this.form.header);
      this.form.header = header;

      let operates = this.form.oprate.split(',');
      this.form.operates = operates;

      let localTableMapper = JSON.parse(obj).tableMapper;
      for (var i = 0; i < localTableMapper.length; i++) {
        localTableMapper[i].sort = localTableMapper[i].isSort ? 'custom' : false;
      }
      this.tableMapper = localTableMapper;

      this.onQuery();
    }


  }
</script>

<style scoped>


</style>
