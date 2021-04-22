<template>
  <!--
  复杂多任务流水线
  -->
  <div class="container">


    <div class="innerMenu">
      <InnerMenu/>
      <el-button @click="execTask"></el-button>
    </div>

    <div v-for="(item,itemIndex) in taskTree" class="taskItem">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>流水线 <strong>items[{{itemIndex}}]</strong></span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="delItem(itemIndex,item,taskTree)">删除
          </el-button>
          <el-button style="float: right; padding: 3px 0" type="text" @click="addItemFor(item,itemIndex)">添加</el-button>
        </div>
        <!--
        添加业务代码
        -->
        <el-form ref="form" label-width="80px">
          <el-form-item label="请求地址">
            <el-input v-model="item.url"></el-input>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-select v-model="item.method" placeholder="选择请求方式">
              <el-option label="GET请求" value="GET"></el-option>
              <el-option label="POST请求" value="POST"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="ContentType">
            <el-select v-model="item.contentType" placeholder="选择ContentType类型">
              <el-option label="application/json" value="application/json"></el-option>
              <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
              <el-option label="application/x-www-form-urlencoded"
                         value="application/x-www-form-urlencoded"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="请求头">
            <el-input type="textarea" v-model="item.header"></el-input>
          </el-form-item>
          <el-form-item label="请求参数">
            <el-input type="textarea" v-model="item.param" 　placeholder="GET请求可以使用url传递参数"></el-input>
          </el-form-item>
          <el-form-item label="结果处理" v-if="item.type!=2">
            <el-input type="textarea" v-model="item.parse"></el-input>
          </el-form-item>

        </el-form>
      </el-card>
      <!--定义二节点-->
      <div class="taskItem" v-for="(sub,subIndex) in item.task">
        <div class="mg-l-100">
          <div class="line"></div>

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>流水线{{subIndex}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="delItem(subIndex,sub,item.task)">删除
              </el-button>
              <el-button style="float: right; padding: 3px 0" type="text" @click="addItemFor(sub,subIndex)">添加
              </el-button>
            </div>
            <!--
            添加业务代码
            -->
            <el-form ref="form" label-width="80px">
              <el-form-item label="请求地址">
                <el-input v-model="sub.url"></el-input>
              </el-form-item>
              <el-form-item label="请求方式">
                <el-select v-model="sub.method" placeholder="选择请求方式">
                  <el-option label="GET请求" value="GET"></el-option>
                  <el-option label="POST请求" value="POST"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="ContentType">
                <el-select v-model="sub.contentType" placeholder="选择ContentType类型">
                  <el-option label="application/json" value="application/json"></el-option>
                  <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                  <el-option label="application/x-www-form-urlencoded"
                             value="application/x-www-form-urlencoded"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="请求头">
                <el-input type="textarea" v-model="sub.header"></el-input>
              </el-form-item>


              <el-form-item label="请求参数">
                <el-input type="textarea" v-model="sub.param" 　placeholder="GET请求可以使用url传递参数"></el-input>
              </el-form-item>
              <el-form-item label="结果处理" v-if="item.type!=2">
                <el-input type="textarea" v-model="sub.parse"></el-input>
              </el-form-item>


            </el-form>


          </el-card>


          <!--定义三级节点-->
          <div class="taskItem" v-for="(sub_sub,sub_sub_index) in sub.task">
            <div class="left_line" v-if="subIndex<item.task.length-1"></div>
            <div class="mg-l-100">
              <div class="line"></div>

              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>流水线{{sub_sub_index}}</span>
                  <el-button style="float: right; padding: 3px 0" type="text"
                             @click="delItem(sub_sub_index,sub_sub,sub.task)">删除
                  </el-button>
                  <el-button style="float: right; padding: 3px 0" type="text"
                             @click="addItemFor(sub_sub,sub_sub_index)">
                    添加
                  </el-button>
                </div>
                <!--
                添加业务代码
                -->
                <el-form ref="form" label-width="80px">
                  <el-form-item label="请求地址">
                    <el-input v-model="sub_sub.url"></el-input>
                  </el-form-item>
                  <el-form-item label="请求方式">
                    <el-select v-model="sub_sub.method" placeholder="选择请求方式">
                      <el-option label="GET请求" value="GET"></el-option>
                      <el-option label="POST请求" value="POST"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="ContentType">
                    <el-select v-model="sub_sub.contentType" placeholder="选择ContentType类型">
                      <el-option label="application/json" value="application/json"></el-option>
                      <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                      <el-option label="application/x-www-form-urlencoded"
                                 value="application/x-www-form-urlencoded"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="请求头">
                    <el-input type="textarea" v-model="sub_sub.header"></el-input>
                  </el-form-item>


                  <el-form-item label="请求参数">
                    <el-input type="textarea" v-model="sub_sub.param" 　placeholder="GET请求可以使用url传递参数"></el-input>
                  </el-form-item>
                  <el-form-item label="结果处理" v-if="item.type!=2">
                    <el-input type="textarea" v-model="sub_sub.parse"></el-input>
                  </el-form-item>


                </el-form>


              </el-card>

              <!--定义四级节点-->
              <div class="taskItem" v-for="(sub_sub_sub,sub_sub_sub_index) in sub_sub.task">
                <div class="left_line" v-if="sub_sub_index<sub.task.length-1"></div>
                <div class="mg-l-100">
                  <div class="line"></div>

                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>流水线{{sub_sub_sub_index}}</span>
                      <el-button style="float: right; padding: 3px 0" type="text"
                                 @click="delItem(sub_sub_sub_index,sub_sub_sub,sub_sub.task)">删除
                      </el-button>
                      <el-button style="float: right; padding: 3px 0" type="text"
                                 @click="addItemFor(sub_sub_sub,sub_sub_sub_index)">添加
                      </el-button>
                    </div>
                    <!--
                    添加业务代码
                    -->
                    <el-form ref="form" label-width="80px">
                      <el-form-item label="请求地址">
                        <el-input v-model="sub_sub_sub.url"></el-input>
                      </el-form-item>
                      <el-form-item label="请求方式">
                        <el-select v-model="sub_sub_sub.method" placeholder="选择请求方式">
                          <el-option label="GET请求" value="GET"></el-option>
                          <el-option label="POST请求" value="POST"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="ContentType">
                        <el-select v-model="sub_sub_sub.contentType" placeholder="选择ContentType类型">
                          <el-option label="application/json" value="application/json"></el-option>
                          <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                          <el-option label="application/x-www-form-urlencoded"
                                     value="application/x-www-form-urlencoded"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="请求头">
                        <el-input type="textarea" v-model="sub_sub_sub.header"></el-input>
                      </el-form-item>


                      <el-form-item label="请求参数">
                        <el-input type="textarea" v-model="sub_sub_sub.param"
                                  　placeholder="GET请求可以使用url传递参数"></el-input>
                      </el-form-item>
                      <el-form-item label="结果处理" v-if="item.type!=2">
                        <el-input type="textarea" v-model="sub_sub_sub.parse"></el-input>
                      </el-form-item>
                    </el-form>

                  </el-card>

                  <!--定义五级节点-->
                  <div class="taskItem" v-for="(sub_sub_sub_sub,sub_sub_sub_sub_index) in sub_sub_sub.task">
                    <div class="left_line" v-if="sub_sub_sub_index<sub_sub.task.length-1"></div>
                    <div class="mg-l-100">
                      <div class="line"></div>

                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>流水线{{sub_sub_sub_sub_index}}</span>
                          <el-button style="float: right; padding: 3px 0" type="text"
                                     @click="delItem(sub_sub_sub_sub_index,sub_sub_sub_sub,sub_sub_sub.task)">删除
                          </el-button>
                          <el-button style="float: right; padding: 3px 0" type="text"
                                     @click="addItemFor(sub_sub_sub_sub,sub_sub_sub_sub_index)">添加
                          </el-button>
                        </div>
                        <!--
                        添加业务代码
                        -->
                        <el-form ref="form" label-width="80px">
                          <el-form-item label="请求地址">
                            <el-input v-model="sub_sub_sub_sub.url"></el-input>
                          </el-form-item>
                          <el-form-item label="请求方式">
                            <el-select v-model="sub_sub_sub_sub.method" placeholder="选择请求方式">
                              <el-option label="GET请求" value="GET"></el-option>
                              <el-option label="POST请求" value="POST"></el-option>
                            </el-select>
                          </el-form-item>

                          <el-form-item label="ContentType">
                            <el-select v-model="sub_sub_sub_sub.contentType" placeholder="选择ContentType类型">
                              <el-option label="application/json" value="application/json"></el-option>
                              <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                              <el-option label="application/x-www-form-urlencoded"
                                         value="application/x-www-form-urlencoded"></el-option>
                            </el-select>
                          </el-form-item>

                          <el-form-item label="请求头">
                            <el-input type="textarea" v-model="sub_sub_sub_sub.header"></el-input>
                          </el-form-item>

                          <el-form-item label="请求参数">
                            <el-input type="textarea" v-model="sub_sub_sub_sub.param"
                                      　placeholder="GET请求可以使用url传递参数"></el-input>
                          </el-form-item>
                          <el-form-item label="结果处理" v-if="item.type!=2">
                            <el-input type="textarea" v-model="sub_sub_sub_sub.parse"></el-input>
                          </el-form-item>

                        </el-form>

                      </el-card>


                      <!--
                      定义六级节点
                      　-->
                      <div class="taskItem"
                           v-for="(sub_sub_sub_sub_sub,sub_sub_sub_sub_sub_index) in sub_sub_sub_sub.task">
                        <div class="left_line" v-if="sub_sub_sub_sub_index<sub_sub_sub.task.length-1"></div>
                        <div class="mg-l-100">
                          <div class="line"></div>

                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              <span>流水线{{sub_sub_sub_sub_sub_index}}</span>
                              <el-button style="float: right; padding: 3px 0" type="text"
                                         @click="delItem(sub_sub_sub_sub_sub_index,sub_sub_sub_sub_sub,sub_sub_sub.task)">
                                删除
                              </el-button>
                              <el-button style="float: right; padding: 3px 0" type="text"
                                         @click="addItemFor(sub_sub_sub_sub_sub,sub_sub_sub_sub_sub_index)">添加
                              </el-button>
                            </div>
                            <!--
                            添加业务代码
                            -->
                            <el-form ref="form" label-width="80px">
                              <el-form-item label="请求地址">
                                <el-input v-model="sub_sub_sub_sub_sub.url"></el-input>
                              </el-form-item>
                              <el-form-item label="请求方式">
                                <el-select v-model="sub_sub_sub_sub_sub.method" placeholder="选择请求方式">
                                  <el-option label="GET请求" value="GET"></el-option>
                                  <el-option label="POST请求" value="POST"></el-option>
                                </el-select>
                              </el-form-item>

                              <el-form-item label="ContentType">
                                <el-select v-model="sub_sub_sub_sub_sub.contentType" placeholder="选择ContentType类型">
                                  <el-option label="application/json" value="application/json"></el-option>
                                  <el-option label="multipart/form-data" value="multipart/form-data"></el-option>
                                  <el-option label="application/x-www-form-urlencoded"
                                             value="application/x-www-form-urlencoded"></el-option>
                                </el-select>
                              </el-form-item>

                              <el-form-item label="请求头">
                                <el-input type="textarea" v-model="sub_sub_sub_sub_sub.header"></el-input>
                              </el-form-item>

                              <el-form-item label="请求参数">
                                <el-input type="textarea" v-model="sub_sub_sub_sub_sub.param"
                                          　placeholder="GET请求可以使用url传递参数"></el-input>
                              </el-form-item>
                              <el-form-item label="结果处理" v-if="item.type!=2">
                                <el-input type="textarea" v-model="sub_sub_sub_sub_sub.parse"></el-input>
                              </el-form-item>

                            </el-form>

                          </el-card>

                          <!--
                    定义7级节点
                    -->


                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <el-dialog title="请选择类型" append-to-body="true" :visible.sync="outerVisible">
      <el-form ref="form" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="addType" placeholder="请选择操作类型">
            <el-option label="流水线(有子节点)" value="1"></el-option>
            <el-option label="批处理(无子节点)" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import InnerMenu from "./menu/InnerMenu";
  import PipeLineItem from "./Pipeline/PipeLineItem";


  let items = [];


  export default {
    name: "ComplexMultTaskPipeline",
    components: {
      PipeLineItem,
      InnerMenu
    },
    data() {
      return {
        outerVisible: false,
        addType: null,
        taskTree: [
          {
            url: "http://123.56.93.253:8084/pm/userLogin",
            method: "POST",
            contentType: "application/json",
            header: null,
            param: "{\"account\":\"fang\",\"password\":\"123\"}",
            level: 0,
          }
        ],

        curItem: {}

      }
    }, methods: {

      //执行任务
      execTask() {

        for (var i = 0; i < this.taskTree.length; i++) {





        }


      },

      delItem(index, item, task) {
        task.splice(index, 1)
      },

      addItemFor(item, index) {
        this.outerVisible = true;
        this.curItem = item;
        this.curItem.index = index;
      },

      addItem() {
        console.log(this.curItem)
        let item = this.curItem;
        if (item.task == undefined) {
          item.task = [];
        }
        item.task.push({
          type: this.addType
        });
        let tree = Object.create(this.taskTree);
        this.taskTree = tree;

        this.outerVisible = false;

      }

    },
    created() {


    }

  }
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    overflow: scroll;
    box-sizing: border-box;
    padding: 10px;
    position: fixed;
  }

  .mg-l-100 {
    margin-left: 100px;
  }

  .line {
    height: 100px;
    position: relative;
    width: 2px;
    background: #0c77cf;
  }

  .taskItem {
    position: relative;
  }

  .left_line {
    width: 2px;
    height: 100%;
    background: #0c77cf;
    position: absolute;
    left: 0px;
    z-index: 10;
  }


  .box-card {
    width: 600px;
  }


</style>
