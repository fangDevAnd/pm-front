<template>
  　
  <div class="container">
    <div style="width: 400px">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="用户">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div style="position: relative">
            <el-input v-model="form.captcha"></el-input>
            <el-image :src="src" @click="getSrc"
                      style="position:absolute;top: 0px;"></el-image>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>

      </el-form>

    </div>

  </div>
</template>

<script>

  import Urls from "../util/Urls";

  import axios from "axios";

  export default {
    name: "Login",
    data() {
      let srcL = Urls.urlRoot + "captcha.jpg";
      return {
        form: {},
        src: srcL
      }
    },

    methods: {
      getSrc() {
        this.src += "?data=" + new Date().getTime();
      },
      login() {
        axios.post(Urls.urlRoot + "userLogin", this.form).then((res) => {
          console.log(res)
          var token = res.data.data.token;
          localStorage.setItem("token", token);
          this.$router.replace("/pm")
        })
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
    box-sizing: border-box;
    position: fixed;
    background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  >>> .el-form-item__label {
    color: #fff;
  }

  >>> .el-button {
    width: 100%;
  }

  >>> .el-image {
    width: 156px;
    right: 0px;
  }

  >>> .el-input__inner {
    background: #D0D0D033;
    color: #fff;
  }

</style>
