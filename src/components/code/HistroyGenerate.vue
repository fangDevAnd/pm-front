<template>

  <div class="container">
    <div class='generateStart'>
      <div class='tableFilter'>
        <el-form :inline='true'>
          <el-form-item :label='mapper.txt' v-for='mapper in tableMapper' v-if='mapper.isFilter'>
            <el-input v-model='mapper[mapper.mname]' v-if='!mapper.isTimeFilter' :placeholder='mapper.txt'></el-input>
            <div v-if='mapper.isTimeFilter'>
              <el-col :span='11'>
                <el-date-picker type='date' value-format='yyyy-MM-dd' v-model='mapper.startTime'
                                style='width: 100%;'></el-date-picker>
              </el-col>
              <el-col style='width: 20px;text-align:center' :span='2'>-</el-col>
              <el-col :span='11'>
                <el-date-picker type='date' value-format='yyyy-MM-dd' v-model='mapper.endTime'
                                style='width: 100%;'></el-date-picker>
              </el-col>
            </div>
          </el-form-item>
          <el-button type='primary' @click='onFilterQuery'>查询</el-button>
        </el-form>
      </div>
      <div class='tableGenerator'>
        <el-table ref='filterTable' @sort-change='tableSortChange' :data='tableData'
                  @selection-change='handleSelectionChange' style='width: 100%'>
          <el-table-column v-if='form.isMultSelect' type='selection' width='55'/>
          <el-table-column v-for='mapper in tableMapper' :sortable='mapper.sort' :prop='mapper.mname'
                           :label='mapper.txt'></el-table-column>
          <el-table-column label='操作'>
            <template slot-scope='scope'>
              <el-button v-for='(operate,index) in form.operates' @click='operateFunc(scope.row,operate)' size='mini'>
                {{operate}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if='form.isPage&&form.size>0' @current-change='handleCurrentChange' :page-size='form.size'
                       layout='prev, pager, next, jumper' :total='form.total'></el-pagination>
      </div>
    </div>


    <el-dialog
      append-to-body="true"
      title="详情数据"
      :visible.sync="formDialogVisible"
      width="70%">
      <div>{{code}}</div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="formDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      fullscreen="true"
      append-to-body="true"
      title="预览页面"
      v-if="codePreviewDialogVisible"
      :visible.sync="codePreviewDialogVisible"
      width="70%">
      <TableGenerator :form-val="preViewCode"/>
    </el-dialog>


  </div>
</template>
<script> import axios from 'axios';
import TableGenerator from "./TableGenerator";

export default {
  components: {TableGenerator},
  props: ["model"],
  data() {
    return {
      form: {}, tableMapper: [], tableData: [],
      formDialogVisible: false,
      code: null,
      codePreviewDialogVisible: false,
      preViewCode: null,

    }
  }, methods: {

    onFilterQuery() {
      this.form.param.page = this.form.page;
      this.onQuery();
    },

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
    }, request(item) {
      let method = item['method'];
      if (method == 'GET') {
        this.getRequest(item);
      } else if (method == 'POST') {
        this.postRequest(item);
      }
    }, postRequest(item) {
      let url = item['url'];
      console.log(item)
      axios.post(url, item.param, {headers: item.header,}).then((resp) => {
        console.log(resp)
        let data = resp.data;
        this.parseResult(data);
      })
    }, getRequest(item) {
      let url = item['url'];
      axios.get(url, {headers: item.header, data: item.param}).then((resp) => {
        this.processResult(resp, item);
      })
    }, parseResult(netResp) {
      this.form.total = netResp.total;
      this.tableData = netResp.data;
    }, tableSortChange(obj) {
      let param = this.form.param;
      param.order = obj.order;
      param.prop = obj.prop;
      this.onQuery();
    }, handleCurrentChange(page) {
      let param = this.form.param;
      param.page = page;
      param.size = this.form.size;
      this.onQuery();
    }, handleSelectionChange(selection) {
      console.log(selection);

    }, operateFunc(obj, operate) {
      console.log(obj, operate);
      if (operate == '表单详情') {
        this.code = obj.formVal;
        this.formDialogVisible = true;
      } else if (operate == '获得代码') {
        this.code = obj.generatorCode;
        this.formDialogVisible = true;
      } else if (operate == '预览') {
        this.preViewCode = obj.formVal;
        this.codePreviewDialogVisible = true;
      } else if (operate == '选择') {
        console.log(this.$parent.$parent);
        this.$parent.$parent.historySelect(obj);
      }


    }
  }, created() {
    var obj = "{\"form\":{\"name\":\"name\",\"url\":\"http://localhost:8084/pm/generator/router/list\",\"method\":\"POST\",\"header\":\"{\\\"Authorization\\\":\\\"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYW5nIiwiY3JlYXRlZCI6MTYxOTIzMDIyNTkxMSwiYXV0aG9yaXRpZXMiOltdfQ.380KOGjeg7zveyZ4gc8DUAODh1rx6tm1MNIhz4V2AAndmvxT26wEXlIbv3bcJDRoGmFDKHPkYw65lDq6Cbk2GQ\\\",\\\"Content-Type\\\":\\\"application/json\\\"}\",\"param\":\"{\\\"size\\\":\\\"10\\\",\\\"page\\\":3}\",\"contentType\":\"application/json\",\"paramExpression\":\"{\\\"size\\\":8,\\\"page\\\":1}\",\"headerExpression\":\"{\\\"Authorization\\\":\\\"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYW5nIiwiY3JlYXRlZCI6MTYxOTIzMDIyNTkxMSwiYXV0aG9yaXRpZXMiOltdfQ.380KOGjeg7zveyZ4gc8DUAODh1rx6tm1MNIhz4V2AAndmvxT26wEXlIbv3bcJDRoGmFDKHPkYw65lDq6Cbk2GQ\\\",\\\"Content-Type\\\":\\\"application/json\\\"}\",\"total\":44,\"isMultSelect\":true,\"isPage\":true,\"size\":\"10\",\"page\":\"1\",\"oprate\":\"表单详情,获得代码\"},\"tableMapper\":[{\"mname\":\"router\",\"txt\":\"路由地址\",\"isDisplay\":true,\"isSort\":true,\"isFilter\":true}]}"
    this.form = JSON.parse(obj).form;
    let param = this.form.param;
    param = JSON.parse(this.form.param);
    let paramExpression;
    eval("paramExpression=" + this.form.paramExpression);
    for (var key in paramExpression) {
      param[key] = paramExpression[key];
    }
    this.form.param = param;
    let header = this.form.header;
    header = JSON.parse(this.form.header);
    let headerExpression;
    eval("headerExpression=" + this.form.headerExpression);
    for (var key in headerExpression) {
      header[key] = headerExpression[key];
    }
    this.form.header = header;
    let operates = this.form.oprate.split(',');
    this.form.operates = operates;
    let localTableMapper = JSON.parse(obj).tableMapper;
    for (var i = 0; i < localTableMapper.length; i++) {
      localTableMapper[i].sort = localTableMapper[i].isSort ? 'custom' : false;
    }

    //选择模式
    if (this.model != 'select') {
      //添加自定义代码
      this.form.operates.push("预览");
    } else {
      this.form.operates.push("选择");
    }
    this.tableMapper = localTableMapper;
    this.onQuery();
  }
}</script>
<style scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
  }


</style>
