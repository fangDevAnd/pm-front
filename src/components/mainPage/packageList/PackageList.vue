<template>
  <div style="width: 100%" class="container">

    <el-page-header style="margin: 5px" @back="$router.back(-1)" v-bind:content="selectProject">
    </el-page-header>

    <el-tabs>
      <el-tab-pane v-model="panelModel" v-for="version in keys" :label="version+'_版本'" :name="version">
        <div style="margin-top: 20px" class="card-contain">
          <div class="item-file" v-for="file in versionList[version]">
            <span style="margin-left: 20px">{{file}}</span>
            <div style="margin-right: 20px">
              <el-link :underline="false" type="normal" icon="el-icon-download" @click="download(file)">
                下载
              </el-link>
              <el-link :underline="false" type="normal" icon="el-icon-picture-outline"
                       @click="getQrCode(file)">生成二维码
              </el-link>
            </div>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>

    <!--
 弹出
 -->
    <el-dialog
      title="扫码下载"
      :visible.sync="dialogVisible"
      width="30%">

      <el-image :src="downSrcUrl" style="width: 200px;height: 200px"></el-image>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>


  import axios from 'axios'
  import Urls from "../../../util/Urls";


  export default {
    name: "PackageList",

    data() {

      return {

        //选中的项目名称
        selectProject: "",
        /**
         * 选中的项目的项目文件列表
         */
        selectProjectFile: [],

        dialogVisible: false,
        downSrcUrl: "",

        versionList: {},

        panelModel: 1,
        keys: [],

      }

    },

    methods: {

      getProjectFile() {
        axios.get(Urls.urlRoot + "pm/list/file?project=" + this.selectProject).then((res) => {
          this.selectProjectFile = res.data.data;
          //进行过滤排序
          let branchList = {};
          let keys = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let dataItem = res.data.data[i];
            let info = dataItem.split("__");
            if (info.length == 1) {
              //没有＿＿，不确定的版本
              if (keys.indexOf("uncertain") == -1) {
                keys.push("uncertain");
              }
              if (branchList["uncertain"] == undefined) {
                branchList["uncertain"] = [];
              }
              branchList["uncertain"].push(dataItem);
            } else if (info.length == 2) {
              let versionInfo = info[1].split("_");
              if (versionInfo.length == 1) {
                versionInfo = versionInfo[0].split(".")[0];
                if (keys.indexOf(versionInfo) == -1) {
                  keys.push(versionInfo);
                }
                if (branchList[versionInfo] == undefined) {
                  branchList[versionInfo] = [];
                }
                branchList[versionInfo].push(dataItem);
                //主分支
              } else if (versionInfo.length == 2) {
                //开发分支
                let info = versionInfo[1];
                let version = info.substring(0, info.lastIndexOf("."));
                if (keys.indexOf(version) == -1) {
                  keys.push(version);
                }
                if (branchList[version] == undefined) {
                  branchList[version] = [];
                }
                branchList[version].push(dataItem);
              }
            }
          }

          this.versionList = branchList;

          this.keys = keys;

        })
      },


      download(url) {
        let path = this.selectProject + "/" + url;
        location.href = Urls.urlRoot + "pm/file/down" + "?path=" + path;
      },


      getQrCode(url) {
        let path = this.selectProject + "/" + url;
        this.downSrcUrl = Urls.urlRoot + "pm/qrimage" + "?url=" + path;
        this.dialogVisible = true;
      }

    },


    mounted() {
      this.selectProject = this.$route.query.proName;

      this.getProjectFile();
    }


  }
</script>

<style scoped>

  .item-file {
    display: flex;
    width: 400px;
    flex-direction: row;
    height: 100px;
    margin-left: 20px;
    border-bottom: 1px solid rgba(199, 199, 199, 0.14);
    border-radius: 5px;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    background: rgb(84, 92, 100);
    opacity: 0.7;
    color: #fff;
  }

  .card-contain {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding-left: 20px;
    padding-right: 20px;
  }


  .container {
    padding: 8px;
  }

</style>
