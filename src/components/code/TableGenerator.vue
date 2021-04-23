<template>

  <!--
   表单生成器
  -->

  <div class="container">


    <div>
      <el-button type="primary">使用历史</el-button>
    </div>
    
    <div class="inner-container">
      <el-form ref="form" v-if="formGenerate" :model="form" class="form" label-width="150px">
        <!--
        请求测试
        -->
        <el-form-item label="请求地址">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="form.method" placeholder="选择请求方式">
            <el-option label="GET请求" value="GET"></el-option>
            <el-option label="POST请求" value="POST"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ContentType">
          <el-select v-model="form.contentType" placeholder="选择ContentType类型">
            <el-option label="application/json" value="application/json"></el-option>
            <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
            <el-option label="application/x-www-form-urlencoded"
                       value="application/x-www-form-urlencoded"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="请求头">
          <el-input type="textarea" v-model="form.header"></el-input>
        </el-form-item>
        <el-form-item label="请求参数">
          <el-input type="textarea" v-model="form.param" 　placeholder="GET请求可以使用url传递参数"></el-input>
        </el-form-item>

        <el-form-item label="请求结果">
          <el-input type="textarea" v-model="netResp"></el-input>
        </el-form-item>
        <el-form-item label="结果处理">
          <el-input type="textarea" v-model="form.parse" placeholder="对结果进行自定义映射"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="execNet">执行网络请求</el-button>
        </el-form-item>


        <!--请求测试结束-->


        <div v-for="(keyVal,index) in tableMapper">
          <div>
            <strong>字段映射</strong>
            <el-button type="primary" style="float: right; padding: 3px 0;margin-left: 4px" @click="upMapper(index)"
                       icon="el-icon-top">上
            </el-button>
            <el-button type="primary" style="float: right; padding: 3px 0" @click="downMapper(index)"
                       icon="el-icon-bottom">下
            </el-button>
            <el-button type="primary" style="float: right; padding: 3px 0" @click="delMapper(index)">删除
            </el-button>

          </div>
          <el-form-item label="url字段">
            <el-input v-model="tableMapper[index].mname"></el-input>
          </el-form-item>
          <el-form-item label="显示字段">
            <el-input v-model="tableMapper[index].txt" placeholder="映射表字段"></el-input>
          </el-form-item>
          <el-form-item label="能否进行排序">

            <span>能否在表格显示</span>
            <el-switch
              v-model="tableMapper[index].isDisplay"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <span class="line"></span>

            <span>能否进行排序</span>
            <el-switch
              v-model="tableMapper[index].isSort"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <span class="line"></span>

            <span>是否为过滤类型</span>
            <el-switch
              v-model="tableMapper[index].isFilter"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <span class="line"></span>

            <span v-if="tableMapper[index].isFilter">是否为时间过滤</span>
            <el-switch v-if="tableMapper[index].isFilter"
                       v-model="tableMapper[index].isTimeFilter"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>

          </el-form-item>
        </div>

        <strong>其他条件</strong>
        <el-form-item label="是否具有多选功能">
          <el-switch
            v-model="form.isMultSelect"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否分页">
          <el-switch
            v-model="form.isPage"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="分页大小" v-if="form.isPage">
          <el-input v-model="form.size"></el-input>
        </el-form-item>
        <el-form-item label="起始页" v-if="form.isPage">
          <el-input v-model="form.page"></el-input>
        </el-form-item>
        <strong>操作项</strong>
        <el-form-item label="操作项">
          <el-input v-model="form.oprate" placeholder="操作项,以,分割"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button type="primary" @click="onGerateCode">生成代码</el-button>
          <el-button type="primary" @click="isGenetateTable=false">销毁</el-button>
        </el-form-item>
      </el-form>


      <div class="generateStart" v-if="isGenetateTable">
        <!--表单过滤部分-->
        <div class="tableFilter">
          <el-form :inline="true">
            <el-form-item :label="mapper.txt" v-for="mapper in tableMapper" v-if="mapper.isFilter">
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
    </div>


    <el-dialog
      title="代码生成结果"
      append-to-body="true"
      :visible.sync="generateVisable"
      width="60%">
      <div>{{generateCode}}</div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="generateVisable = false">取 消</el-button>
    <el-button type="primary" @click="generateVisable = false">确 定</el-button>
  </span>
    </el-dialog>


  </div>


</template>

<script>
  import axios from "axios";
  import Urls from "../../util/Urls";

  window.items = {};

  export default {
    name: "TableGenerator",
    data() {
      return {
        generateVisable: false,

        generateCode: null,
        //存放表单数据
        form: {
          name: "name",
          url: "http://localhost:8084/pm/logcat/list",
          method: "POST",
          header: "{\n" +
            "    \"Authorization\":localStorage.getItem(\"token\")}",
          param: "{\"size\":8,\"page\":1}"

        },

        //存放表单映射
        tableMapper: [],

        //存放显示的tableMapper
        displayTableMapper: [],


        //表格的数据
        tableData: [],

        isGenetateTable: false,
        netResp: '',

        localQuery: false,


        formGenerate: true,

      }
    }, methods: {
      upMapper(index) {
        let afterIndex = index - 1;
        let bridge = Object.create(this.tableMapper[index]);
        if (index > 0) {
          this.$set(this.tableMapper, index, this.tableMapper[afterIndex]);
          this.$set(this.tableMapper, afterIndex, bridge);
        }
      },
      downMapper(index) {
        console.log(index)
        let afterIndex = index + 1;
        let bridge = Object.create(this.tableMapper[index]);
        if (index < this.tableMapper.length - 1) {
          this.$set(this.tableMapper, index, this.tableMapper[afterIndex]);
          this.$set(this.tableMapper, afterIndex, bridge);
        }
      },

      delMapper(index) {
        this.tableMapper.splice(index, 1);
      },

      //提交
      onSubmit() {
        //生成过滤项
        //生成table，根据过滤，对数据进行过滤

        let tableTitle = [];
        for (let i = 0; i < this.tableMapper.length; i++) {
          var mapper = this.tableMapper[i];
          if (mapper.isDisplay) {
            tableTitle.push(mapper);
          }
        }

        this.displayTableMapper = tableTitle;
        this.isGenetateTable = true;
        //执行查询
        this.onQuery();
      },


      execNet() {
        this.localQuery = false;
        this.request(this.form);
      },


      //网络执行－－－－－－－－－－－－－－－
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

      getRequest(item) {
        //定义上一个的响应对象
        let url = item["url"];
        this.commonProcess(item);
        axios.get(url, {
          headers: JSON.parse(item.param),
          data: JSON.parse(item.param)
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },

      commonProcess(item) {
        //这里使用eval的意义是，可能下面的几个参数存在参数运算
        if (item["header"] != null && item["header"].length > 0) {
          eval("window.items['header']=" + item["header"]);
        }
        if (item["param"] != null && item["param"].length > 0) {
          eval("window.items['param']=" + item["param"])
        }
        //请求的ContentType
        if (window.items["header"] != undefined) {
          window.items["header"]["Content-Type"] = item.contentType;
        }
        //转存到form中
        item.param = JSON.stringify(window.items['param']);
        item.header = JSON.stringify(window.items['header']);
      },

      postRequest(item) {
        let url = item["url"];
        this.commonProcess(item);
        axios.post(url, JSON.parse(item.param), {
          headers: JSON.parse(item.header),
        }).then((resp) => {
          this.processResult(resp, item);
        })
      },

      processResult(resp, item) {
        let data = resp.data;
        eval(this.form.parse);//可以对返回的数据进行加工
        this.parseResult(data);
      },

      //－－－－－－－－－－－－－－－－－－－网络执行

      parseResult(netResp) {

        let desc = JSON.stringify(netResp);
        //存放执行的脚本数据
        this.netResp = desc;
        //设置表的数据
        this.form.total = netResp.total;

        if (!this.localQuery) {
          //设置请求映射
          let resItem = netResp.data[0];
          let result = []
          for (var key in resItem) {
            result.push(key);
          }
          let mappers = [];
          for (let i = 0; i < result.length; i++) {
            mappers.push({
              mname: result[i]
            })
          }
          this.tableMapper = mappers;
        }

        //表格数据的显示取决于是否设置了显示
        this.tableData = netResp.data;
      },


      //生成表单的方法部分
      onQuery() {

        //额外的参数
        let param = this.form.param;
        param = JSON.parse(param);

        //创建查询对象
        for (var i = 0; i < this.tableMapper.length; i++) {
          var mapper = this.tableMapper[i];
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
        this.localQuery = true;
        this.request(this.form);
      },


      tableSortChange(obj) {
        let param = this.form.param;
        param = JSON.parse(param);
        param.order = obj.order;
        param.prop = obj.prop;
        this.form.param = JSON.stringify(param);
        this.onQuery();
      },

      //分页处理
      handleCurrentChange(page) {
        let param = this.form.param;
        param = JSON.parse(param);
        param.page = page;
        param.size = this.form.size;
        this.form.param = JSON.stringify(param);
        this.onQuery();
      },


      //代码生成
      onGerateCode() {
        this.$prompt('请输入路由名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          //存放localStorage

          let obj = {
            form: this.form,
            tableMapper: this.displayTableMapper
          }
          // localStorage.setItem(value, JSON.stringify(obj));

          let param = {
            router: value,
            formVal: JSON.stringify(JSON.stringify(obj)),
          }
          axios.post(Urls.urlRoot + "generator/router/add1", param).then((resp) => {
            //保存数据
            this.generateCode = resp.data;
            this.generateVisable = true;

          })
        }).catch(() => {

        });
      },


      //---------------------------代码的多选部分，可以对生成的代码进行添加新的功能


      /**
       *
       * @param selection　传递的是数据源选中的数组
       */
      //多选触发
      handleSelectionChange(selection) {
        this.$emit("handleSelectionChange", selection);
      },

      /**
       *
       * @param obj　当前行的对象
       * @param operate　当前操作的类型(按钮的中文名称)
       */
      operateFunc(obj, operate) {
        this.$emit("operateFunc", obj, operate);
      },


    },

    created() {

      //检查存储的数据和当前的路由是否相同，相同取出里面的数据，直接显示图表
      let name = this.$route.name;
      let obj = localStorage.getItem(name);
      if (obj != null) {
        this.localQuery = true;
        this.formGenerate = false;
        obj = JSON.parse(obj);
        this.form = obj.form;
        this.tableMapper = obj.tableMapper;
        this.onSubmit();
      }

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
    padding: 10px;
    overflow-x: scroll;
  }


  .inner-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-right: 100px;
  }

  .form {
    width: 800px;
  }

  .line {
    display: inline-block;
    width: 10px;
  }

</style>
