
<template>
  <div class="login">
    <div class="altcet magtop">
      <img src="../assets/logo1.png" />
    </div>
    <div class="h40">
      <Col :span="7" :push="11" class="altlft lftShadow" style="min-width: 400px;">
        <div class="box" v-if="flagUser">
          <div
            style="display: flex;justify-content: space-between;padding-bottom: 20px;border-bottom: 1px solid #f5f5f5;"
          >
            <div class="title">账号登录</div>
            <div style="text-align:right" @click="flagEr = true,flagUser = false">
              <img src="../assets/username.png" alt />
            </div>
          </div>
          <div>
            <input v-model="formLogin.username" placeholder="账号" class="loginNum" />
            <input v-model="formLogin.password" placeholder="密码" type="password" class="loginNum" />
          </div>
          <div style="margin:10px 0">
            <i-col :span="12">
              <Checkbox-group v-model="formLogin.remember">
                <Checkbox label="记住密码" name="remember"></Checkbox>
              </Checkbox-group>
            </i-col>
            <i-col :span="7" offset="5">
              <p style="font-size:12px">忘记密码?</p>
            </i-col>
          </div>
          <div style="height:20%;margin-top:70px">
            <i-col :span="24" class="loginButton">
              <div
                class="loginButton"
                @click="handleSubmit()"
                @keyup.enter.native="handleSubmit()"
              >登录</div>
            </i-col>
          </div>
        </div>
        <div class="box" v-if="flagEr">
          <!-- <div class="erweimaLogin" v-if="flagEr"> -->
          <div
            style="display: flex;justify-content: space-between;padding-bottom: 20px;border-bottom: 1px solid #f5f5f5;"
          >
            <div class="title">二维码登录</div>
            <div style="text-align:right" @click="flagEr = false,flagUser = true">
              <img src="../assets/isErweima.png" alt />
            </div>
          </div>
          <div style="width:100%;" class="ermBox">
            <iframe
              scrolling="no"
              sandbox="allow-top-navigation allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              style="height: 380px;"
              src="https://open.weixin.qq.com/connect/qrconnect?appid=wx98d5b6b49201800e&redirect_uri=http://www.yizeai.com/&response_type=code&scope=snsapi_login&state=STATE"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </Col>
      <Col :span="8" class="altrit lftShadow" :pull="2"></Col>
    </div>
  </div>
</template>
<script>
import { resLogin, wxLogin } from "../api/api";
import axios from "axios";
export default {
  mixins: [require("@/mymixins").default],
  data() {
    return {
      // flagUser: true,
      // flagEr: false,
      flagUser: false,
      flagEr: true,
      formLogin: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
        remember: ["记住密码"]
      },
      path: ""
    };
  },
  watch: {
    "formLogin.remember"(oldVal, newVal) {
    }
  },
  created() {},
  beforeMount() {
    function urlToObj(str) {
      if (str.indexOf("&") == -1) {
        return;
      }
      var obj = {};
      var arr1 = str.split("?");
      var arr2 = arr1[1].split("&");
      for (var i = 0; i < arr2.length; i++) {
        var res = arr2[i].split("=");
        obj[res[0]] = res[1];
      }
      return obj;
    }
    if (urlToObj(window.location.href)) {
      var code = urlToObj(window.location.href).code;
      if (code) {
        let data = {
          code: code
        };
        console.log(code);
        wxLogin(data).then(res => {
          if (res.code == 10000) {
            console.log(res.content.ztGuser.userId);
            console.log(res.content.ztCompany.calltype);
            this.setUserInfo({
              token: res.content.authorization,
              photoUp: res.content.ztGuser.photo,
              userId: res.content.ztGuser.userId,
              userName: res.content.ztGuser.name,
              ismanage: res.content.ztCompany.ismanage,
              role: JSON.stringify(res.content.role),
              ztCompany: JSON.stringify(res.content.ztCompany)
            });
            console.log(this.userInfo);
            localStorage.setItem(
              "ztCompany",
              JSON.stringify(res.content.ztCompany)
            );
            this.$Message.success("登录成功");
            console.log(window.location.href);
            this.$router.push({ path: "/home" });

            // window.location.reload(); //重新加载 路由权限
          } else {
            this.$Message.error({
              content: res.content,
              duration: 3
            });
          }
        });
      }
    }
    console.log(window.location.href + "111");
    console.log(this.$Message);
  },
  mounted() {
    //  console.log(window.location.href);
  },
  methods: {
    handleSubmit() {
      // this.$refs[name].validate(valid => {
      sessionStorage.setItem("user", JSON.stringify(this.formLogin.username));
      let data = {
        userName: this.formLogin.username,
        password: this.formLogin.password
      };
      const _this = this;
      // if (valid) {
      //更改
      this.$store.dispatch("getResLogin", [data, _this]);
      /* resLogin(data).then(res => {
        if (res.code == "10000") {
          localStorage.setItem("token", res.content.authorization);
          localStorage.setItem("photoUp", res.content.ztGuser.photo);
          localStorage.setItem("userId", res.content.ztGuser.userId);
          localStorage.setItem("userName", res.content.ztGuser.name);
          this.$Message.success("登录成功!");
          console.log("测试登录成功返回的数据")
          console.log(data)
          this.$router.push({ path: "/home" });
        } else {
          this.$Message.error(res.content);
        }
      });*/
      // } else {
      //   // this.$Message.error("表单验证失败!");
      // }
      if (this.formLogin.remember[0] != "记住密码") {
        //没有记住密码
        localStorage.setItem("username", this.formLogin.username);
        localStorage.setItem("password", "");
      } else {
        //记住密码
        localStorage.setItem("username", this.formLogin.username);
        localStorage.setItem("password", this.formLogin.password);
      }
      // });
    }
  },
  mounted() {
    if (localStorage.getItem("username")) {
      this.formLogin.username = localStorage.getItem("username");
    }
    if (localStorage.getItem("password")) {
      this.formLogin.password = JSON.parse(localStorage.getItem("password"));
    }
  }
};
</script>


<style scoped>
.login {
  height: 65%;
}
.lftShadow {
  background: #fcfcfc;

  box-shadow: 0 12px 60px 0 rgba(0, 0, 0, 0.2);
}
.altcet {
  text-align: center;
}
.altlft {
  margin-top: 0.5%;
  height: 130%;
  text-align: left;
}
.altrit {
  height: 136%;
  text-align: right;
  background: url("../assets/left.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* background-color: #fff; */
}
.magtop {
  margin-top: 10%;
}
.h40 {
  height: 60%;
  margin-top: 4%;
}
.title {
  font-size: 18px;
  color: #36AC85;
}
.box {
  width: 50%;
  margin-left: 36%;
  margin-top: 5%;
}
.loginButton {
  background-image: url("../assets/button.png");
  height: 10%;
  background-size: 100% 100%;
  /* margin-top:10%; */
  text-align: center;
  color: #fff;
  font-size: 18px;
  padding: 2px;
  cursor: pointer;
  /* line-height: 20%; */
}
/* input {
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   -webkit-user-modify: read-write-plaintext-only;
   outline: none;
   box-shadow: none;
} */
@media screen and (max-width: 1780px) {
  .ermBox{
    transform: scale(0.9,0.9);
  }
}
@media screen and (max-width: 1600px) {
  .ermBox{
    transform: scale(0.85,0.85);
    margin-top: -10px;
    margin-left: -20px
  }
}
@media screen and (max-width: 1480px) {
  .ermBox{
    transform: scale(0.8,0.8);
    margin-top: -70px;
    margin-left: -30px
  }
}
@media screen and (max-width: 1366px) {
  .ermBox{
    transform: scale(0.75,0.75);
    margin-top: -82px;
    margin-left: -25px
  }
}
@media screen and (max-width: 1280px) {
  .ermBox{
    transform: scale(0.72,0.72);
    margin-top: -70px;
    margin-left: -15px
  }
}

.loginNum {
  margin: 10% 0;
  border: none;
  border-bottom: 1px solid #36AC85;
  padding: 6px;
  padding-right: 37%;
  outline: none;
}
.ivu-tabs-nav .ivu-tabs-tab-active {
  font-weight: bold;
}
.demo-tabs-style2
  > .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active {
  border-top: 1px solid #3399ff;
}
</style>
