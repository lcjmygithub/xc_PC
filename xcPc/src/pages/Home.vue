<style scoped>
.layout {
  background: #f5f7f9;
  /* position: relative; */
  height: 100%;
  overflow: hidden;
 
}
.layout-breadcrumb {
  padding: 10px 15px 0;
}
.layout-content {
  min-height: 200px;
  /* min-width:1300px; */
  margin: 15px;
  /* overflow: auto; */
  /* background: #fff; */
   border-radius: 4px;
   height: calc(100% - 66px)!important;
   overflow-y:auto;
   padding-bottom: 20px;

 
}
.layout-content-main {
  padding: 10px;
  width: 100%;
   
}
.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left {
  background: #fff;
  /* min-width:150px; */
}
.layout-header {
  height: 60px;
  background: #fff;
}
.ivu-menu-dark {
  background: #fff;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
  background: rgba(60, 88, 153, 1);
}
.layout-logo-left {
  width: 90%;
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  text-align: center;
  /*  background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;*/
}
.layout-ceiling-main a {
  color: #9ba7b5;
}
.layout-hide-text .layout-text {
  display: none;
}
.ivu-col {
  transition: width 0.2s ease-in-out;
}
.ivu-row-flex {
  height: 100%;
}
.userinfo {
  display: inline-block;
  float: right;
}
.userinfo .ivu-dropdown {
  margin-top: 50px;
}
.ivu-dropdown {
  margin-right: 25px;
  margin-top: 22px;
}
.ivu-menu-submenu-title {
  padding: 14px;
}

.head-img {
  width: 100%;
  height: 60px;
  line-height: 60px;
  float: right;
  margin-top: -50px;
  cursor: pointer;
  position: relative;
}
.wxErWeiMa div {
  position: absolute;
  z-index: 9999;
  width: 200px;
  height: 200px;
  background-color: #ccc;
}
.iconErWeiMa {
  font-size: 30px;
  position: relative;
  right: 0px;
  top: 20px;
}
.head-img .user-img {
  border-radius: 20px;
  margin: 10px 0px 10px 10px;
  width: 40px;
  height: 40px;
  float: right;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
  color: #000;
}
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 3}">
    <Row type="flex" style="height: 100%;">
      <i-col :span="3" class="layout-menu-left">
        <Menu
          :mode="modeType"
          theme="light"
          width="auto"
          :active-name="this.$route.path"
          :open-names="openNames"
          @on-select="menuSelect"
          accordion
        >
          <div class="layout-logo-left">
            <Icon type="paper-airplane" :size="logoSize" v-show="logoIsDisplay"></Icon>
            <!-- <span class="layout-text">Admin 管理系统</span> -->
            <img style="margin-top:5px" src="../assetss/images/header/logo.png" alt />
          </div>
          <template>
            <div
              v-for="(item,index) in allRoutes"
              :key="index+ $router.options.routes.length"
              v-if="spanLeft >= 5 && !item.hidden"
            >
              <Submenu :name="item.name" v-if="!item.leaf">
                <template slot="title">
                  <Icon :type="item.iconCls" :size="iconSize"></Icon>

                  <span class="layout-text">{{item.name}}</span>
                </template>
                <template>
                  <div
                    v-for="(child,childIndex) in item.children"
                    :key="childIndex+item.children.length"
                    v-if="!child.hidden"
                  >
                    <Menu-item :name="child.path" v-if="child.isShow">{{child.name}}</Menu-item>
                  </div>
                </template>
              </Submenu>
              <template v-if="item.leaf&&item.children.length>0">
                <Menu-item :name="item.children[0].path">
                  <Icon :type="item.iconCls" :size="iconSize"></Icon>
                  <span class="layout-text">{{item.children[0].name}}</span>
                </Menu-item>
              </template>
            </div>
          </template>
          <template>
            <div
              v-for="(item,index) in allRoutes"
              :key="index+$router.options.routes.length"
              v-if="spanLeft < 5 && !item.hidden"
            >
              <Dropdown
                placement="right-start"
                class="_dropdownList"
                transfer="true"
                @on-click="dropDown"
              >
                <a href="javascript:void(0)">
                  <Icon :type="item.iconCls" class="_iconCls ivu-col-span-1" :size="iconSize"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-if="!item.name"
                    :name="item.children[0].path"
                  >{{item.children[0].name}}</DropdownItem>
                  <Dropdown
                    placement="right-start"
                    transfer="true"
                    v-if="item.children && item.name"
                  >
                    <DropdownItem>
                      {{item.name}}
                      <Icon type="ios-arrow-right"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                      <DropdownItem
                        v-for="(child,childIndex) in item.children"
                        :key="childIndex"
                        :name="child.path"
                      ></DropdownItem>

                    </DropdownMenu>
                  </Dropdown>
                </DropdownMenu>
              </Dropdown>
            </div>
          </template>
        </Menu>
      </i-col>
      <i-col :span="21" style="height: 100%;">
        <div class="layout-header">
          <!-- <i-button type="text" @click="toggleClick">
            <Icon type="navicon" size="32" style="color:#666"></Icon>
          </i-button>-->
          <div class="userinfo">
            <Dropdown placement="bottom-end">
              <span class="head-img wxErWeiMa">
                <Icon
                  type="ios-close"
                  class="iconErWeiMa"
                  @click.self="closeErWeiMa"
                  v-if="isERweimaShow"
                />
                <img
                  src="../assetss/images/header/weixin.png"
                  alt
                  style="height:14px;width:18px;"
                  v-if="!isAddWxChat && common.common.baseUrl != 'http://47.94.89.73/'"
                />
                <span
                  @click="weChat"
                  v-if="!isAddWxChat && common.common.baseUrl != 'http://47.94.89.73/'"
                >绑定微信</span>
                <!--                <div v-if="isERweimaShow">-->
                <div
                  v-if="isERweimaShow"
                  style="border: 2px solid #ccc;box-sizing: border-box;width:204px;height:230px;background-color: #fff"
                >
                  <div
                    style="text-align: center;position: relative;display: flex;justify-content: center"
                  >
                    <img :src="erweima" alt style="width:100%;height:100%" />
                    <span style="color: red;position: absolute;bottom: -36px ; ">绑定后,暂时不支持解绑!</span>
                  </div>
                  <!--                  <div style="color: red;text-align: center">绑定后,暂时不支持解绑!</div>-->
                  <!-- <img src="" alt=""> -->
                  <!-- <iframe src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGq8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyR1k2SVVsWVFjTGsxMDAwMHcwN2MAAgRQoVtdAwQAAAAA" frameborder="0"></iframe> -->
                </div>
              </span>
            </Dropdown>
            <Dropdown placement="bottom-end" style="position: relative
  ">
              <span class="head-img" @mouseenter="newsVisible=true" @mouseleave="newsVisible=false">
                <img src="../assetss/images/header/xiaoxi.png" alt style="height:14px;width:12px;" />
                <!-- <span> -->
                <span>消息中心</span>
                <!-- <Badge :count="numNews" style="margin-top:-8px">
                    <a href="#" class="demo-badge"></a>
                </Badge>-->
                <span style="margin-top:10px;margin-left:14px">
                  <Badge :count="numNews" type="error">
                    <a href="#" class="demo-badge"></a>
                  </Badge>
                </span>
                <!-- </span> -->
                <Card class="card-wrap" v-if="newsVisible && numNews" style="z-index:9999">
                  <Row>
                    <i-col class="news-wrap">
                      <span class="news-title">消息中心</span>
                      <!-- <a href class="news-all">查看全部</a> -->
                    </i-col>
                  </Row>
                  <Row>
                    <i-col>
                      <ul class="news-list">
                        <div>
                          <li class="list-wrap" v-for="(item,index) in newsList" :key="index">
                            <div>
                              <span class>
                                <span
                                  style="color:#999;padding-left:6px;font-size:12px"
                                >{{item.content}}</span>
                              </span>
                              <Time :time="item.createtime" type="datetime" />
                            </div>
                          </li>
                        </div>
                      </ul>
                      <div style="margin-top:10px">
                        <Page
                          :total="numNews"
                          :current="current"
                          @on-change="changeCurrent"
                          size="small"
                        />
                      </div>
                    </i-col>
                  </Row>
                </Card>
              </span>
            </Dropdown>
            <Dropdown placement="bottom-end">
              <span class="head-img">
                <span>
                  当前机器人个数:
                  <span style="color:#ff3030">{{robatPeoples}}</span>个
                </span>
              </span>
            </Dropdown>
            <Dropdown placement="bottom-end" trigger="click">
              <span class="head-img" style="font-weight:bold">
                <img class="user-img" :src="photo?photo:'/static/img/admin.53614cb.png'" />
                {{curUserName}}
                <span
                  v-if="isAddWxChat"
                  style="font-weight:normal"
                >({{wxNickName}})</span>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item @click.native="goSetting()">个人资料</Dropdown-item>
                <Dropdown-item @click.native="modifyPassWord()">修改密码</Dropdown-item>
                <!-- <Dropdown-item
                  @click.native="confirm()"
                  v-if="isAddWxChat && common.common.baseUrl != 'http://47.94.89.73/'"
                >解绑微信</Dropdown-item> -->
                <!-- 2019-11-25科特说暂时隐藏 -->
                <Dropdown-item @click.native="logout()" divided>退出</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </div>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
      </i-col>
    </Row>

    <Modal
      v-model="modal1"
      title="修改密码"
      :loading="modalLoading"
      :maskClosable="false"
      @on-ok="comfirmModifyPS()"
      ref="modal"
      @on-cancel="cancel"
    >
      <Form ref="formValidate" :model="formValidate" :label-width="100">
        <Form-item label="原密码" prop="oldPassword">
          <Input v-model="formValidate.oldPassword" placeholder="请输入原始密码" type="password"></Input>
        </Form-item>
        <Form-item label="新密码" prop="newPassword">
          <Input v-model="formValidate.newPassword" placeholder="请输入新密码" type="password"></Input>
        </Form-item>
        <Form-item label="确认新密码" prop="resetPassword">
          <Input v-model="formValidate.resetPassword" placeholder="请再次输入新密码" type="password"></Input>
        </Form-item>
      </Form>
    </Modal>
    <!-- <Button @click="confirm">Normal</Button> -->
  </div>
  <!-- 修改密码 模态框 -->

  <!-- 修改密码 模态框 -->
</template>

<script>
import {
  getNewsMore,
  getRobatPeople,
  addWxChat,
  isWeChat,
  falseWxChat,
  changePassword,
  getImage
} from "../api/api";
import { setLocal } from "../function/index";

export default {
  mixins: [require("@/mymixins").default],
  data() {
    return {
      roleMsg: {}, //角色信息
      current: 1,
      newsVisible: false, //是否显示消息中心
      modalLoading: true,
      // userPhoto:common.common.baseUrlPort+localStorage.getItem("photo"),
      newsList: [], //消息中心
      wxNickName: "",
      robatPeoples: 0, //机器人个数,
      erweima: "", //二维码
      numPage: "", //当前消息中心索引
      isERweimaShow: false, // 是否显示二维码
      isAddWxChat: false, //是否绑定微信
      isShows: true, //消息中心单个数据是否隐藏
      numNews: 10, //消息中心条数
      photo: "", //头像
      initPic: "",
      openNames: [this.$route.matched[0].name],
      curUserName: "",
      modeType: "vertical",
      spanLeft: 5,
      spanRight: 19,
      logoIsDisplay: false,
      loading: true,
      modal1: false,
      formValidate: {
        oldPassword: "",
        newPassword: "",
        resetPassword: ""
      }
    };
  },
  computed: {
    allRoutes() {
      let that = this;
      let allMenuList = that.$router.options.routes;
      let menuList = that.handFor(allMenuList);
      return menuList;
    },
    iconSize() {
      return this.spanLeft === 5 ? 14 : 24;
    },
    logoSize() {
      if (this.spanLeft !== 5) {
        this.logoIsDisplay = true;
        return 50;
      } else {
        this.logoIsDisplay = false;
        return 0;
      }
    }
  },
  created() {
    window.location.href = window.location.href;
    //获取角色
    this.curUserName = this.userInfo.userName;
    console.log(this.userInfo);
    this.ztCompany = JSON.parse(this.userInfo.ztCompany);
    this.getNewsMore();
    this.getRobatPeople();
    // this.weChat()
    this.closeErWeiMa();
    // this.getImage();
  },
  methods: {
    handFor(l) {
      let that = this;
      // let ur = this.$router.options.routes;
      let lm = [];
      l.forEach(e => {
        let callType = JSON.parse(this.userInfo.ztCompany).calltype;
        that.$set(e, "isShow", true);
        if (e.path == "/lineManagement" && callType == 1) {
          that.$set(e, "isShow", false);
        }
        if (e.children && e.children.length > 0) {
          that.handFor(e.children);
          lm.push(e);
        }
      });
      return lm;
    },
    //消息中心
    getNewsMore() {
      let data = {
        pageNo: this.current,
        pageSize: 10
      };
      //加载更多
      getNewsMore(data).then(res => {
        if (res.code == "10000") {
          //console.log(res);
          this.newsList = res.content.list;
          this.numNews = res.content.totalCount;
        } else {
          this.$Message.error(res.content);
        }
      });
    },
    changeCurrent(row) {
      this.current = row;
      this.getNewsMore();
    },
    //个人设置
    goSetting() {
      this.$router.push({ path: "/AccountSettings" });
    },
    // 消息中心
    // isShow(index) {
    //   this.isShows = false;
    //   this.newsList.splice(index, 1);
    //   this.numNews--;
    //   if (this.numNews <= 0) {
    //     this.numNews = 0;
    //     return;
    //   }
    // },
    //获取机器人个数
    getRobatPeople() {
      //机器人个数
      getRobatPeople().then(res => {
        //console.log(res);
        this.robatPeoples = res.content.maxoccurs;
      });
    },
    // 获取二维码
    weChat() {
      //绑定微信
      this.isERweimaShow = true;
      addWxChat().then(res => {
        console.log(res);
        this.erweima = res.content;
      });
    },
    //查看是否绑定微信
    closeErWeiMa() {
      //console.log("yes");

      this.isERweimaShow = false;
      isWeChat().then(res => {
        this.wxNickName = res.content.nickname;
        if (!res.content) {
          this.isAddWxChat = false;
          //console.log(2);
        } else {
          //console.log(1);
          this.isAddWxChat = true;
          this.photo = res.content.headimgurl;
        }
      });
    },
    // 解绑微信
    confirm() {
      this.$Modal.confirm({
        title: "解绑微信",
        content: "<p>是否确认解绑微信</p>",
        onOk: () => {
          falseWxChat().then(res => {
            //console.log(res);
            if (res.code == "10000") {
              this.$Message.info("解绑成功");
              this.isAddWxChat = false;
              this.photo =
                this.common.common.baseUrlStatic + this.userInfo.photoUp;
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消解绑");
        }
      });
    },
    modifyPassWord() {
      this.modal1 = true;
    },
    logout() {
      // localStorage.setItem("token", "");
      // this.$router.push({ path: "/login" });
      console.log(this.common.common);
       window.location.href = "http://www.yizeai.com/#/login";   //正式库
      // window.location.href = "http://47.94.89.73/testyize/#/login";   //测试库
      // window.location.href = "127.0.0.1:8082/#/login";   //本地
    },
    comfirmModifyPS() {
      if (
        !this.formValidate.oldPassword ||
        !this.formValidate.newPassword ||
        !this.formValidate.resetPassword
      ) {
        this.$refs.modal.visible = true;
        this.modalLoading = false;
        this.$Message.error("请完整表单信息");
        return;
      } else {
        this.modalLoading = false;
        let data = {
          password: this.formValidate.newPassword,
          oldPassword: this.formValidate.oldPassword
        };
        if (this.formValidate.newPassword != this.formValidate.resetPassword) {
          this.$Message.error("两次密码不一致");
          return;
        }
        // if(this.formValidate.oldPassword != localStorage.getItem('password')){
        //   this.$Message.error('新密码与旧密码不一致')
        //   return;
        // }
        changePassword(data).then(res => {
          // //console.log(res);
          if (res.code == 10000) {
            this.modal1 = false;
            localStorage.setItem("token", "");
            this.$Message.success("修改成功,请重新登录!");
            this.$router.push({ path: "/login" });
          } else {
            this.$Message.error(res.content);
          }
        });
      }
    },
    cancel() {
      this.modal1 = false;
      this.$Message.info("取消修改密码");
    },
    menuSelect(name) {
      this.$router.push({ path: name });
    },
    dropDown(name) {
      this.$router.push({ path: name });
    },
    beforeunloadFn() {
      setLocal("userMemory", {
        userInfo: this.userInfo
      });
    }
  },
  mounted() {
    let username = localStorage.getItem("username");
    let token = this.userInfo.token;
    if (!username && !token) {
      this.$router.push({ path: "/login" });
    }
    // localStorage.removeItem("photoUp")
    this.photo = this.common.common.baseUrlStatic + this.userInfo.photoUp;
    // this.initPic = localStorage.getItem('photoUp')
    console.log("测试图片地址");
    console.log(this.initPic);
    //获取橘色信息
    this.roleMsg = this.userInfo.role;
    // console.log(this.roleMsg)
    // console.log("测试吧")
    window.addEventListener("beforeunload", this.beforeunloadFn, true);
  },

  beforeDestroy() {
    // window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("beforeunload", this.beforeunloadFn, true);
  }
};
</script>
<style scoped>
.ivu-select-dropdown .ivu-dropdown {
  margin: 0px 12px 0px 0px;
}
._dropdownList {
  /*  width: 100%;
    text-align: center; */
}
._iconCls {
  width: 56px;
  text-align: center;
}
.card-wrap {
  z-index: 9999;
  width: 580px;
  /* height:400px; */
  padding-bottom: 30px;
  position: absolute;
  left: -200px;
  line-height: normal;
}
.news-wrap {
  display: flex;
  justify-content: space-between;
}
.news-wrap > .news-title {
  font-size: 18px;
  font-weight: bold;
  /* border: 1px solid red; */
  padding-bottom: 5px;
  border-bottom: 2px solid #495060;
}
.news-wrap > .news-all {
  font-size: 16px;
}
.news-list .list-wrap {
  list-style: none;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gainsboro;
  padding: 8px 0;
}
.ivu-badge-count {
  top: -13px;
}
.ivu-badge {
  padding-top: 4px;
}
</style>
