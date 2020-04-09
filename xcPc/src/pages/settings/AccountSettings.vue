<template>
  <div>
    <title-text :title="title">
      <template slot="button-group">
        <Button class="search clear1" style="width:92px" @click="saveSlef">保 存</Button>
      </template>
    </title-text>
    <i-form :model="userSlect" label-position="right" :label-width="120">
      <Card>
        <Row>
          <i-col span="8">
            <Form-item label="头像：">
              <!-- <i-input  style="width:150px" v-model="userSlect.input" placeholder="账号"></i-input> -->
              <!-- <openImg :MyUp="MyUp" :[ImgList]="[ImgList]"></openImg> -->
              <openImg :MyUp="MyUp" :ImgList="[userSlect.photo]"></openImg>

              <!-- <Button
                type="text"
                @click="updataImgClick"
                style="margin-top:10px;margin-left:10px;color:#006edd"
              >上传头像</Button>-->
              <span
                class="text-btn"
                @click="updataImgClick"
                style="margin-left:4px;margin-top:0px"
              >上传头像</span>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="账号：">
              <i-input
                size="small"
                style="width:150px"
                readonly
                v-model="userSlect.userName"
                placeholder="账号..."
              ></i-input>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="密码：">
              <i-input
                size="small"
                readonly
                type="password"
                style="width:150px"
                v-model="userSlect.password"
                placeholder="密码..."
              ></i-input>
              <span class="text-btn" @click="modifyPassWord()">修改密码</span>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="手机号码：">
              <i-input
                style="width:150px"
                v-model="userSlect.phone"
                placeholder="手机号码"
                size="small"
                readonly
              ></i-input>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="性别：">
              <Radio-group v-model="userSlect.sex">
                <Radio
                  v-for="(item,index) in sexList"
                  :label="item.value"
                  :key="index"
                >{{item.label}}</Radio>
              </Radio-group>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="微信：">
              <i-input
                readonly
                style="width:150px"
                v-model="userSlect.nickname"
                placeholder="微信号"
                size="small"
              ></i-input>
<!--              <span class="text-btn" @click="confirm" v-if="isWxChat">取消绑定</span>  2019-11-25 科特说暂时隐藏-->
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="6">
            <Form-item label="所属公司：">
              <i-input
                readonly
                style="width:150px"
                v-model="userSlect.cmpName"
                placeholder="所属公司"
                size="small"
              ></i-input>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="所属部门：">
              <i-input
                style="width:150px"
                v-model="userSlect.deptName"
                placeholder="所属部门"
                size="small"
              ></i-input>
            </Form-item>
          </i-col>
          <i-col span="6">
            <Form-item label="公司职位：">
              <i-input
                style="width:150px"
                v-model="userSlect.jobname"
                placeholder="公司职位"
                size="small"
              ></i-input>
            </Form-item>
          </i-col>
          <i-col span="4">
            <Form-item label="部门负责人：">
              <i-input
                style="width:150px"
                v-model="userSlect.name"
                placeholder="部门负责人"
                size="small"
              ></i-input>
            </Form-item>
          </i-col>
        </Row>
      </Card>
      <Row style="margin-top:10px">
        <i-col span="24">
          <title-text :title="countTitle"></title-text>
        </i-col>
      </Row>
      <Card>
        <Row>
          <i-col span="15">
            <Form-item label="账户余额:">
              <i-input
                v-model="userSlect.balance"
                placeholder
                style="width:150px"
                readonly
                size="small"
              ></i-input>
              <span style="margin-left:10px">元</span>
              <span class="text-btn" @click="topath">查看消费流水</span>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Form-item label="账户过期时间:">
              <i-input
                v-model="userSlect.endtime"
                placeholder
                style="width:150px"
                readonly
                size="small"
              ></i-input>
              <span class="text-btn" @click="topath">查看购买明细</span>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="AI机器人数量:">
              <i-input
                readonly
                v-model="userSlect.maxoccurs"
                placeholder
                style="width:100px"
                size="small"
              ></i-input>
              <span style="margin:0 10px">个有效</span>
              <i-input
                readonly
                v-model="userSlect.expireRobotNum"
                placeholder
                style="width:100px"
                size="small"
              ></i-input>
              <span style="margin-left:10px">个已过期</span>
            </Form-item>
          </i-col>
        </Row>
      </Card>
    </i-form>

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
          <Input v-model="formValidate.oldPassword" placeholder="原始密码" type="password"></Input>
        </Form-item>
        <Form-item label="新密码" prop="newPassword">
          <Input v-model="formValidate.newPassword" placeholder="新密码" type="password"></Input>
        </Form-item>
        <Form-item label="确认新密码" prop="resetPassword">
          <Input v-model="formValidate.resetPassword" placeholder="请再次输入新密码" type="password"></Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>
<script>
import titleText from "../components/title";
import openImg from "./openImg";
// getFromSle
import {
  getFromSle,
  falseWxChat,
  isWeChat,
  changePassword,
  updataImg,
  savePhoto,
  saveSlef
  //
} from "../../api/api";
export default {
  components: {
    titleText,
    openImg
  },
  computed: {},
  watch: {},
  data() {
    return {
      sexList: [
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      title: "基本信息",
      countTitle: "账户信息",
      modal1: false,
      isWxChat: false, //是否绑定微信
      modalLoading: true,
      // ImgList: [],
      // userSlect: {
      //   input: "",
      //   select: ""
      // },
      photoHome: "",
      //设置参数
      userSlect: {
        // imgHead: "", //图片地址
        deptName: "", //主属部门
        sex: 0, // 性别公司
        maxoccurs: "", //机器人数量
        photo: "", //图片地址
        cmpName: "", //所属公司
        endtime: "", //账户过期时间
        userName: "", //账号
        balance: "", //账户yue
        nickname: "", // 微信
        phone: "", //手机号
        name: "", //负责人
        expireRobotNum: "", //多少个已过期
        jobname: "", //公司职位
        password: ""
      },
      formValidate: {
        oldPassword: "",
        newPassword: "",
        resetPassword: ""
      }
      // password: "" // 修改的密码
    };
  },
  created() {
    this.getFroms();
    this.isSureWx();
  },
  methods: {
    topath() {
      this.$router.push({ path: "/page6" });
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      console.log(dataurl);

      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    //获取表单数据
    getFroms() {
      getFromSle().then(res => {
        console.log(res);

        if (res.code == "10000") {
          this.userSlect = res.content;
          console.log(this.userSlect);
          this.$set(
            this.userSlect,
            "photo",
            res.content.photo != ""
              ? this.common.common.baseUrlStatic + res.content.photo
              : ""
          ); //
          this.userSlect.password = new Date().getTime();
        }
      });
    },
    //base64转二进制
    // dataURLtoBlob(dataurl) {
    //   var arr = dataurl.split(","),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   return new Blob([u8arr], { type: mime });
    // },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    //查询是否绑定微信
    isSureWx() {
      isWeChat().then(res => {
        isWeChat().then(res => {
          if (!res.content) {
            this.isWxChat = false;
          } else {
            this.isWxChat = true;
          }
        });
      });
    },
    // removeWxChat(){
    //   falseWxChat().then(res => {
    //     log(res)
    //   })
    // },
    //保存个人信息
    saveSlef() {
      let data = {
        // UserInfo?sex=2&deptName=技术部1&jobname=Java1&name=李国胜1&phone=18718520784
        UserInfo: this.userSlect.userName,
        sex: this.userSlect.sex,
        deptName: this.userSlect.deptName,
        jobname: this.userSlect.jobname,
        name: this.userSlect.name,
        phone: this.userSlect.phone
      };
      saveSlef(data).then(res => {
        // console.log(res);
        if (res.code == "10000") {
          this.$Message.success("保存成功");
          this.getFroms();
        } else {
          this.$Message.error(res.content);
        }
      });
    },
    //取消绑定微信
    confirm() {
      this.$Modal.confirm({
        title: "解绑微信",
        content: "<p>是否确认解绑微信</p>",
        onOk: () => {
          falseWxChat().then(res => {
            if (res.code == "10000") {
              this.$Message.info("解绑成功");
              this.isAddWxChat = false;
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消解绑");
        }
      });
    },
    MyUp(imgList, imgUrlList) {
      this.userSlect.photo = imgUrlList[0];
    },
    updataImgClick() {
      //   this.$Message.error("请选择要上传的图片");
      //   return;
      // }
      if (this.userSlect.photo == "") {
        this.$Message.error("请先选择图片再上传");
        return;
      }
      let data = {
        file: this.dataURLtoFile(this.userSlect.photo, "dir.jpg")
        // file: this.dataURLtoBlob(this.userSlect.photo)
      };
      // let formdata=new FormData()
      // formdata.append('file',this.dataURLtoFile(this.userSlect.photo,'dir'))
      updataImg(data).then(res => {
        if (res.code == "10000") {
          this.userSlect.photo = res.content.returnUrl;
          let data = {
            photo: res.content.returnUrl
          };
          this.photoHome = res.content.returnUrl;
          savePhoto(data).then(res => {
            if (res.code == "10000") {
              this.$Message.success("图片上传成功");
              // localStorage.setItem("photoUp", this.photoHome);
              this.setUserInfo({
                photoUp:this.photoHome
              })
              this.getFroms();
            } else {
              this.$Message.error("上传失败请重试!");
            }
          });
        }
      });
    },
    //修改密码
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
          if ((res.code == 10000)) {
            this.modal1 = false;
            localStorage.setItem("token", "");
            this.$Message.success("修改成功,请重新登录!");
            this.$router.push({ path: "/login" });
          } else {
            this.$Message.error(res.content);
          }
        });
        //
        //
      }
    },
    cancel() {
      this.modal1 = false;
      this.$Message.info("点击了取消");
    },
    modifyPassWord() {
      this.modal1 = true;
    }
  },
  mounted() {}
};
</script>
<style scoped>
.search {
  background: #219480;
  color: #fff;
}
.text-btn {
  color: #006edd;
  margin-left: 60px;
  cursor: pointer;
}
.ivu-form-item {
  margin: 8px;
}
</style>
