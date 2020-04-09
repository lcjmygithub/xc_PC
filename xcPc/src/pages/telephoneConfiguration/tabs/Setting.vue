<template>
  <Row>
    <Form :model="formItem" :label-width="100" style="width:400px;">
      <FormItem label="话术模板">
        <Input v-model="formItem.nickname"></Input>
      </FormItem>
      <FormItem label="拒绝次数">
        <Input v-model="formItem.denialtimes"></Input>
      </FormItem>
      <FormItem label="行业列表">
        <Select v-model="formItem.industryid">
          <Option
            v-for="(item, index) in industryList"
            :key="index"
            :value="item.industryid"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="标签">
        <Select v-model="formItem.levelid">
          <Option
            v-for="(item, index) in labelList"
            :key="index"
            :value="item.levelid"
            >{{ item.levelname }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="外呼设置">
        <RadioGroup v-model="formItem.calltype">
          <Radio label="">外呼</Radio>
          <Radio label="1">呼入</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="机器人类型">
        <RadioGroup @on-change="switchVtype" v-model="formItem.vtype">
          <Radio v-for="(item, index) in vtypeList" :key="index" :label="item.label">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-show="isStatus.hide" label="发音人">
        <Select v-model="formItem.informantid">
          <Option
            v-for="(item, index) in informantList"
            :key="index"
            :value="item.informantid"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="自动转接模式">
        <RadioGroup @on-change="switchTransfer" v-model="formItem.istransfer">
          <Radio v-for="(item, index) in istransferList" :key="index" :label="item.label">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="意图">
        <Select v-model="formItem.imains" multiple style="width:260px">
          <Option
            v-for="(item, index) in imainsList"
            :key="index"
            :value="item.intentionid"
            >{{ item.intention }}({{item.identityname}})</Option
          >
        </Select>
      </FormItem>
      <FormItem v-show="isStatus.hide2" label="转接分值">
        <Input v-model="formItem.transferscore" type="number"></Input>
      </FormItem>
      <FormItem v-show="isStatus.hide2" label="链接类型">
        <Select @on-change="switchTransferType" v-model="formItem.transfertype">
          <Option v-for="(item, index) in transfertypeList" :key="index" :value="item.value">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem v-show="isStatus.hide3" label="服务">
        <Select v-model="formItem.transferserviceid">
          <Option v-for="(item, index) in transferserviceidList" :key="index" :value="item.value">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem v-show="isStatus.hide4" label="转号码">
        <Input v-model="formItem.transfernum" type="number"></Input>
      </FormItem>
      <FormItem label="话术模板描述">
        <Input
          v-model="formItem.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 3 }"
          placeholder=""
        ></Input>
      </FormItem>
      <FormItem>
        <Button @click="saveVerbal" class="search" type="primary" style="margin-top: -30px">保存</Button>
      </FormItem>
    </Form>
  </Row>
</template>
<script>
import {
  getIndustryList,
  getCmpRobotLevel,
  getInformant,
  getZtIntentionMainList,
  saveOrUpdateVoiceRobot
} from "../../../api/api";

import {mapActions,mapState} from "vuex"
export default {
  data() {
    return {
        voiceRobotBaseMsg:{},
        formItem: {
          robotid: "", // 话术模板id
          nickname: "", // 话术模板名称
          denialtimes: "", //拒接次数
          industryid: "", // 行业列表id
          levelid: "", // 标签id
          calltype: "", // 外呼设置 空为外呼 1为呼入
          vtype: 1, // 机器人类型 1为文本 2为语音
          informantid: "", // 发音人id
          istransfer: 2, // 自动转接模式 1为开启 2为关闭
          imains: "", // 意图
          transferscore: "", // 转接分值
          transfertype: "", // 链接类型 1为转服务 2为转人工
          remark: "", // 描述
          transferserviceid: "", // 服务类型
          transfernum: "" // 转号码(人工)
        },
     // industryList: [], //行业列表
     // labelList: [], // 标签列表
     //  informantList: [], // 发音人列表
     // imainsList: [], // 意图列表

      vtypeList:[
        {label:1,name:"文本"},
        {label:2,name:"语音"},
      ],
      transfertypeList:[
        {value:1,name:"转服务"},
        {value:2,name:"转人工"},
      ], // 链接类型
      transferserviceidList:[
        {value:1,name:"电话呼叫"}
      ],
      istransferList:[
        {label:1,name:"开启"},
        {label:2,name:"关闭"},
      ],
      isStatus: {
        // 状态
        hide: true, // 发音人显示隐藏
        hide2: false, // 转接类型,链接类型显示隐藏
        hide3: false, // 服务显示隐藏
        hide4: false // 转号码显示隐藏
      },
      parentData: {}
    };
  },
  computed:{
      ...mapState(["industryList","labelList","informantList","imainsList"])
  },
  props: ["datas"],
  created() {
    // this.getIndustry();
    this.getInformantList();   //获取发音人
    this.getZtIntentionMain();    //  获取意图
    this.getVoiceRobotBaseMsg()   //获取父组件的传递的话术
    this.getCmpRobotLevelList()    //获取标签
  },
  methods: {
      //获取列表
      ...mapActions(["getCmpRobotLevelList","getInformantList","getZtIntentionMain"]),
      getVoiceRobotBaseMsg(){
          this.$bus.on('pas',msg=>{
              this.voiceRobotBaseMsg= msg
              console.log("父组件传来的")
              console.log(typeof msg.imains + '-----------------------' )
              console.log(msg)
              this.formItem.robotid= msg.robotid;
              this.formItem.nickname = msg.nickname
              this.formItem.denialtimes= msg.denialtimes
              this.formItem.industryid = msg.industryid
              this.formItem.levelid = msg.levelid
              this.formItem.calltype = msg.calltype
              this.formItem.vtype = msg. vtype
              this.formItem.informantid = msg.informantid
              this.formItem.istransfer = msg .istransfer
              this.formItem.imains = msg.imains
              this.formItem.transferscore = msg.transferscore
              this.formItem.transfertype = msg.transfertype
              this.formItem.remark = msg.remark
              this.formItem.transferserviceid = msg.transferserviceid
              this.formItem.transfernum = msg.transfernum

                if (msg.istransfer == "1") {
                  // 自动转接模式 1为开启
                  this.isStatus.hide2 = true;
                  if (msg.transfertype == "1") {
                      // 链接类型 1为转服务 2为转号码
                      this.isStatus.hide3 = true;
                      this.isStatus.hide4 = false;
                  } else if (msg.transfertype == "2") {
                      this.isStatus.hide3 = false;
                      this.isStatus.hide4 = true;
                  } else {
                      this.isStatus.hide3 = false;
                      this.isStatus.hide4 = false;
                  }
              } else {
                  this.isStatus.hide2 = false;
                  this.isStatus.hide3 = false;
                  this.isStatus.hide4 = false;
              }
              if (msg.vtype == "1") {
                  // 机器人类型 1位文本 2为语音
                  this.isStatus.hide = true;
              } else {
                  this.isStatus.hide = false;
              }
          })

      },

      // 切换机器人类型
      switchVtype(e) {
          console.log(e);
          if (e == "1") {
              this.isStatus.hide = true;
          } else {
              this.isStatus.hide = false;
          }
      },
      // 切换转接模式
      switchTransfer(e) {
          console.log(e);
          if (e == "1") {
              this.isStatus.hide2 = true;
          } else {
              this.isStatus.hide2 = false;
          }
      },
      // 切换链接类型
      switchTransferType(e) {
          console.log(e);
          if (e == "1") {
              this.isStatus.hide3 = true;
              this.isStatus.hide4 = false;
              this.formItem.transferserviceid = "";
          } else {
              this.isStatus.hide3 = false;
              this.isStatus.hide4 = true;
              this.formItem.transfernum = "";
          }
      },
      //保存基本设置
      saveVerbal(){
            let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
            let telReg = /^([0-9]{3,4})?[0-9]{6,7}$/;
            let data = {
              robotid: this.formItem.robotid,
              nickname: this.formItem.nickname,
              denialtimes: this.formItem.denialtimes,
              industryid: this.formItem.industryid,
              levelid: this.formItem.levelid,
              calltype: this.formItem.calltype,
              vtype: this.formItem.vtype,
              informantid: this.formItem.informantid,
              istransfer: this.formItem.istransfer,
              imains: this.formItem.imains,
              transferscore: this.formItem.transferscore,
              transfertype: this.formItem.transfertype,
              remark: this.formItem.remark,
              transferserviceid: this.formItem.transferserviceid,
              transfernum: this.formItem.transfernum,
              state: 1,
              type: "json"
            };

               if (!this.formItem.nickname) {
                  this.$Message.error("请填写话术名称");
                } else if (!this.formItem.denialtimes) {
                  this.$Message.error("请填写拒绝次数");
                } else if (
                  this.formItem.istransfer == "1" &&
                  !this.formItem.transferscore
                ) {
                  this.$Message.error("请填写转接分值");
                } else if (!this.formItem.remark) {
                  this.$Message.error("请填写描述");
                } else if (
                  this.formItem.transfertype == "1" &&
                  this.formItem.transferserviceid == "" &&
                  this.formItem.istransfer != "2"
                ) {
                  this.$Message.error("请选择电话服务");
                } else if (
                  this.formItem.transfertype == "2" &&
                  !(
                    phoneReg.test(this.formItem.transfernum) ||
                    telReg.test(this.formItem.transfernum)
                  ) &&
                  this.formItem.istransfer != "2"
                ) {
                  this.$Message.error("请输入固话或手机");
                } else if (!this.formItem.informantid && this.formItem.vtype == "1") {
                  this.$Message.error("请选择发音人");
                } else {
                   console.log(data)
                  saveOrUpdateVoiceRobot(data).then(res => {
                    console.log(res);
                    if (res.code == "10000") {
                      this.$Message.success("保存成功");
                      this.$emit("getVoiceRobot")         //重新加载话术列表

                    }else{
                      this.$Message.error(res.content);
                    }
                  });
                }
      },


    // // 新建清空
    // removeData() {
    //   this.formItem.robotid = "";
    //   this.formItem.nickname = "";
    //   this.formItem.denialtimes = "";
    //   this.formItem.industryid = "";
    //   this.formItem.levelid = "";
    //   this.formItem.calltype = "";
    //   this.formItem.vtype = 1;
    //   this.formItem.informantid = "";
    //   this.formItem.istransfer = 2;
    //   this.formItem.imains = [];
    //   this.formItem.transferscore = "";
    //   this.formItem.transfertype = "";
    //   this.formItem.remark = "";
    //   this.formItem.transferserviceid = "";
    //   this.formItem.transfernum = "";
    //
    //   this.isStatus.hide = true;
    //   this.isStatus.hide2 = false;
    //   this.isStatus.hide3 = false;
    //   this.isStatus.hide4 = false;
    // },



  }
};
</script>
<style scoped>
.search {
  background: #219480;
  color: #fff;
  margin-top: 40px;
}
.ivu-form-item{
  /* height:15px; */
}

</style>
