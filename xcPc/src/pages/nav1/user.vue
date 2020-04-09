 <template>
  <!-- <Table border :columns="columns5" :data="data5"></Table> -->
  <div>
    <title-text :title="title">
      <template slot="button-group">
        <Button class="search clear1" @click="setPush" style="width:92px">保 存</Button>
      </template>
    </title-text>
    <i-form :model="formItem" :label-width="80">
      <Card style="padding:16px">
        <Form-item label="开始推送" style="margin-top:5px">
          <RadioGroup @on-change="radios" v-model="isSure">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="意向标签" style="margin-top:-24px;margin-bottom:-0px">
          <CheckboxGroup v-model="iclevelid" @on-change="changeLabel" disabled>
            <Checkbox
              v-for="(item, index) in IcLevelList"
              :label="item.iclevelid"
              :key="index"
              :disabled="disIclevelid"
            >{{ item.iclevelname }}</Checkbox>
          </CheckboxGroup>
        </Form-item>
      </Card>
    </i-form>
    <div class="showOrHideBox">
      <title-text :title="showOrHideTitle" style="margin-top:16px">
        <template slot="button-group">
          <Button class="search clear1" @click="saveHideOrShow" style="width:92px">保 存</Button>
        </template>
      </title-text>
      <Card style="padding:16px">
        <RadioGroup @on-change="changeState" v-model="state" vertical @click="showOrHideEven">
          <Radio label="2">开启隐藏</Radio>
          <Radio label="1">关闭隐藏</Radio>
        </RadioGroup>
      </Card>
      <div>
        <div class="ewmBox" :style="{display:showOrHide}">
          <div class="ewmHeader"><span>扫一扫</span><span class="close-X" @click="closeX">×</span></div>
          <img  :src="ewmSrc" alt="" class="ewmImg">
        </div>
      </div>
    </div>

    <title-text :title="titleTime" style="margin-top:16px">
      <template slot="button-group">
        <span style="position: absolute;left: 160px;">&nbsp;(默认呼叫时间为08:30-20:30)</span>
        <Button class="search clear1" @click="addTask" style="width:92px">添加时间</Button>
      </template>
      <!-- <template slot="sub">
        <span>(默认呼叫时间为08:30-20:30)</span>
      </template>-->
    </title-text>
    <!-- <Card style="padding:none"> -->
    <Table ref="selection" :context="self" :data="taskAllInfor" :columns="tableColumns"></Table>
    <Page
      style="margin-top:15px;text-align:right"
      :total="total"
      :current="pageNo"
      @on-change="changePage"
      show-elevator
      show-total
      size="small"
    ></Page>
    <!-- </Card> -->
    <Modal v-model="isTime" :title="titles">
      <Form :model="timeArr" :label-width="80">
        <FormItem label="开始时间">
          <!-- //开始时间必须大于08:30,不能设置开始时间为12:00至14:00之间,不能大于20:30 -->
          <TimePicker v-model="timeArr.sTime" :editable="false" confirm></TimePicker>
        </FormItem>
        <FormItem label="结束时间">
          <TimePicker v-model="timeArr.eTime" :editable="false" confirm></TimePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isTime = false">取消</Button>
        <Button type="primary" class="search clear1" @click="updateTask">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import titleText from "../components/title";
// import axios from 'axios'
import {
  setSaveCmpParam,
  getSaveCmpParam,
  getSaletaskCall,
  getIcLevelList,
  updateSaletaskCalltime,
  delSaletaskCalltime,
  getEwm,
  showOrHidePhone,
  getShowOrHide
} from "../../api/api"; //
export default {
  components: {
    titleText
  },
  data() {
    return {
      flag: 1,     //默认为1   没成功确认扫过
      showOrHide: 'none',        //显示隐藏
      userId:'' ,       //userId
      showOrHideTitle:"电脑端AB级客户手机号隐藏/显示",
      state: "1",                //默认关闭隐藏
      ewmSrc:'' ,                //二维码路径
      title: "微信消息推送设置",
      titles: "修改呼叫时间",
      titleTime: "任务呼叫时间",
      isSure: "true", //是否推送消息
      isTime: false, //添加时间
      disIclevelid: false, // 是否禁用多选
      calltimeid: "", // id
      isUp: false,
      timeArr: {
        sTime: "08:30:00", //开始时间必须大于08:30,不能大于20:30
        eTime: "20:30:00" //结束时间必须在20:30:00之前,且不能小于开始时间
      },
      tableData: [{ name: "08:00:00", date: "13:00:00", name1: "修改" }],
      self: this,
      iclevelid: [],
      total: 0,
      pageNo: 1,
      formItem: {
        radio: "male",
        radio1: "1"
      },
      IcLevelList: [], // 意向客户等级
      IcLevelIdList: [], //选中客户等级
      taskAllInfor: [], //任务呼叫时间

      tableColumns: [
        {
          title: "开始时间",
          align: "center",
          key: "startime"
          // width:300,
        },
        {
          title: "结束时间",
          align: "center",
          key: "endtime"
          // width:300,
        },
        {
          title: "操作",
          align: "center",
          slot: "action",
          render: (h, params) => {
            const row = params.row;
            let that = this;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      console.log(row);
                      that.$set(that.timeArr, "sTime", row.startime);
                      that.$set(that.timeArr, "eTime", row.endtime);
                      // that.$set(that.timeArr, "calltimeid", row.calltimeid);
                      that.calltimeid = row.calltimeid;
                      that.isTime = true;
                      that.isUp = true;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确认删除",
                        content: "<p>确定要删除吗？</p>",
                        onOk: () => {
                          console.log(row);
                          delSaletaskCalltime({
                            calltimeid: row.calltimeid
                          }).then(res => {
                            console.log(res);
                            if (res.code == "10000") {
                              let that = this;
                              this.$Message.success("删除成功");
                              this.SaletaskCalltime();
                            } else {
                              this.$Message.error("删除失败,请重试");
                            }
                          });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
            // return h(
            //   "a",
            //   {
            //     style: {
            //       color: "#FF0000"
            //     },
            //     on: {
            //       click: () => {
            //         console.log(row);
            //         that.$set(that.timeArr, "sTime", row.startime);
            //         that.$set(that.timeArr, "eTime", row.endtime);
            //         // that.$set(that.timeArr, "calltimeid", row.calltimeid);
            //         that.calltimeid = row.calltimeid;
            //         that.isTime = true;
            //         that.isUp = true;
            //       }
            //     }
            //   },
            //   "修改"
            // );
          }
        }
      ],
      disabledSMinutes: [],
      disabledEMinutes: []
    };
  },
  watch: {
    labelArr: {
      handler(newName, oldName) {
        console.log(newName, oldName);
      },
      immediate: true
    },
    isSure: {
      handler(newName, oldName) {
        this.disIclevelid = !Boolean(JSON.parse(newName));
        if (this.disIclevelid) {
          this.iclevelid.splice(0, this.iclevelid.length);
        }
      },
      immediate: true,
      deep: true
    }
    // "timeArr.sTime": {
    //   handler(newName, oldName) {
    //     this.disabledSMinutes.splice(0, this.disabledSMinutes.length);
    //     if (newName.substr(0, 2) == "08") {
    //       if (!this.isUp) this.$set(this.timeArr, "sTime", "08:30:00");
    //       for (var i = 0; i < 31; i++) {
    //         this.disabledSMinutes.push(i);
    //       }
    //     } else if (newName.substr(0, 2) == "20") {
    //       if (!this.isUp) this.$set(this.timeArr, "sTime", "20:30:00");
    //       for (var i = 30; i < 60; i++) {
    //         this.disabledSMinutes.push(i);
    //       }
    //     }
    //     this.isUp = false;
    //   },
    //   // immediate: true,
    //   deep: true
    // },
    // "timeArr.eTime": {
    //   handler(newName, oldName) {
    //     this.disabledEMinutes.splice(0, this.disabledEMinutes.length);
    //     if (newName.substr(0, 2) == "08") {
    //       if (!this.isUp) this.$set(this.timeArr, "eTime", "08:30:00");
    //       for (var i = 0; i < 31; i++) {
    //         this.disabledEMinutes.push(i);
    //       }
    //     } else if (newName.substr(0, 2) == "20") {
    //       if (!this.isUp) this.$set(this.timeArr, "eTime", "20:30:00");
    //       for (var i = 30; i < 60; i++) {
    //         this.disabledEMinutes.push(i);
    //       }
    //     }
    //     this.isUp = false;
    //   },
    //   // immediate: true,
    //   deep: true
    // }
  },
  created() {
    console.log("userid")
    console.log(this.$store.state.userInfo.userId)
    console.log("userid")
    this.getPush();
    this.SaletaskCalltime();
    this.getIcLevel();
    this.getState() ;          //获取设置显示与隐藏状态
    this.getMsg()

  },
  methods: {
    //接收信息
    getMsg(){
      //接收二维码信息
      let that = this
      let ztCompany = window.localStorage.getItem("ztCompany")
      let companyid =JSON.parse(ztCompany).companyid
      let userId = this.$store.state.userInfo.userId
      console.log(userId )
      console.log(companyid)
       this.$goEasy.subscribe({
          channel: userId+'',      //替换为您自己的channel
          onMessage: (message) => {
            console.log(message)
              if(message.content==1){
                  //成功
                 this.showOrHide= 'none'    //隐藏二维码
                 this.flag =2  //確認成功
                console.log("確認成功")
                  this.$Message.success({
                      content:'扫码确认成功',
                      duration: 1.5
                  })
              }else if(message.content==2){
                  //失敗
                  this.$Message.warning({
                      content:"该账号没绑定微信,请先绑定微信",
                      duration: 1.5
                  })
                  return false
              }else if(message.content==3){
                  //失敗
                  this.$Message.warning({
                      content:"请用绑定该账户的微信扫码",
                      duration: 1.5
                  })
                  return false
              }
          }
        });

    },
    //点击显示二维码
    showOrHideEven(){
      this.getEwmFn()
    },
    //切换状态
    changeState(e){
      this.state = e
      this.getEwmFn()
      this.showOrHide= 'block'
    },
    //获取二维码
    getEwmFn(){
      //获取userId
       this.userId = this.$store.state.userInfo.userId
       //获取二维码
      let params = {
         'userid': this.userId,
         // 'authorization':this.$store.state.userInfo.token
       }
      getEwm(params).then(res=>{
        console.log("res-------")
        if(res.code=="10000"){
          this.ewmSrc = res.content +''
        }
      })
    },
    //关闭二维码
    closeX(){
      this.showOrHide='none'
    },
    //设置隐藏与显示 保存
    saveHideOrShow(e){
      if(!this.ewmSrc){
          this.getEwmFn()
      }
      let params= {
         state: this.state
      }
        if(this.flag==1){
            this.$Message.warning({
                content:"请先扫码确认",
                duration: 1.5
            })
            return false
        }
        showOrHidePhone(params).then(res=>{
            console.log(res)
          if(res.code=="10000"){
            window.localStorage.setItem("state",this.state)
              this.flag = 1
              this.showOrHide= 'none'    //隐藏二维码
            this.$Message.success({
              content:'设置成功',
              duration: 1.5
            })
          }else{
              this.$Message.error({
                  content:'服务响应异常',
                  duration: 1.5
              })
          }
        })
    },
    //获取状态
    getState(){
      getShowOrHide().then(res=>{
          console.log(res)
        if(res.code=="10000"){
          console.log("satet")
          console.log(res.content.state)
          console.log("satet")
           this.state = res.content.state
           window.localStorage.setItem("state",this.state)
        }
      })
    },
    // 单选
    radios(e) {
      console.log(e);
      if (e == "false") {
        this.IcLevelIdList = "";
      } else {
      }
    },
    // 多选
    changeLabel(e) {
      console.log(e);
      this.IcLevelIdList = e;
    },
    // 分页
    changePage(e) {
      let data = {
        pageNo: e,
        pageSize: 10
      };
      this.SaletaskCalltime(data);
    },
    okTime() {},
    cancelTime() {},
    // 获取消息推送设置
    getPush() {
      getSaveCmpParam().then(res => {
        if (res.code == "10000") {
          console.log(res);
          if (res.content.pushlevel == "") {
            this.isSure = "false";
            this.disIclevelid = true;
            // 推送为否
          } else {
            this.isSure = "true";
            this.disIclevelid = false;
            // 推送为是
            let pushlevel = res.content.pushlevel;
            let _arr = pushlevel.split(",");
            for (let i = 0; i < _arr.length; i++) {
              this.iclevelid.push(Number(_arr[i]));
            }
          }
        }
      });
    },
    // 设置消息推送
    setPush() {
      console.log(this.iclevelid);
      if (this.iclevelid.length == [] && this.isSure == "true") {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请勾选意向客户等级"
        });
      } else {
        let data = {
          type: 2,
          content: this.iclevelid.join(",")
        };
        setSaveCmpParam(data).then(res => {
          if (res.code == "10000") {
            console.log(res);
            this.$Message.success({
              top: 50,
              duration: 3,
              content: "设置成功"
            });
          } else {
            this.$Message.error({
              top: 50,
              duration: 3,
              content: "设置失败"
            });
          }
        });
      }
    },
    // 获取任务呼叫时间列表
    SaletaskCalltime(data) {
      getSaletaskCall(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.taskAllInfor = res.content.list;
          this.total = res.content.totalCount;
        }
      });
    },
    // 获取意向客户等级
    getIcLevel() {
      getIcLevelList().then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.IcLevelList = res.content;
        }
      });
    },
    // 添加任务呼叫时间
    addTask() {
      this.calltimeid = "";
      this.isTime = true;
      this.timeArr.sTime = "08:30:00";
      this.timeArr.eTime = "20:30:00";
    },
    // 编辑任务呼叫时间
    updateTask() {
      let startime = this.timeArr.sTime ? this.timeArr.sTime : "";
      let endtime = this.timeArr.eTime ? this.timeArr.eTime : "";
      if (!startime) {
        this.$Message.error("请选择开始时间");
        return false;
      }
      if (!endtime) {
        this.$Message.error("请选择结束时间");
        return false;
      }

      let starArr = "2019-8-31 " + startime;
      let endArr = "2019-8-31 " + endtime;
      console.log(starArr);
      console.log(endArr);

      if (Number(Date.parse(starArr)) < 1567211400000) {
        this.$Message.error("开始时间不能小于08:30");
        return false;
      }
      if (Number(Date.parse(starArr)) > 1567254600000) {
        this.$Message.error("开始时间不能大于20:30");
        return false;
      }
      if (Number(Date.parse(endArr)) < 1567211400000) {
        this.$Message.error("结束时间不能小于08:30");
        return false;
      }
      if (Number(Date.parse(endArr)) > 1567254600000) {
        this.$Message.error("结束时间不能大于20:30");
        return false;
      }
      if (Number(Date.parse(starArr)) > Number(Date.parse(endArr))) {
        this.$Message.error("开始时间不能大于结束时间");
        return false;
      }
      let data = {
        type: "json",
        startime: this.timeArr.sTime,
        endtime: this.timeArr.eTime,
        calltimeid: this.calltimeid // 必传项
      };
      console.log(data);

      updateSaletaskCalltime(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.$Message.success({
            top: 50,
            duration: 3,
            content: "编辑成功"
          });
          this.isTime = false;
          this.isUp = false;
          this.SaletaskCalltime();
        } else {
          this.$Message.error({
            top: 50,
            duration: 3,
            content: "编辑失败"
          });
        }
      });
    }
  }
};

</script>

<style scoped>
  .showOrHideBox{
    position: relative
  }
  .ewmBox{
    box-sizing: border-box;
    /*display: none;*/
    position: absolute;
    left: 400px;
    top: -50px;
    width: 262px;
    height: 302px;
    border: 1px solid #d2d2d2;
  }
  .ewmHeader{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: #fff;
    background: #2d8cf0;
  }
  .ewmImg{
    width:260px;
    height: 260px;

  }
  .close-X{
    font-size: 26px;
    position: absolute;
    right: 8px;
    cursor: pointer;
  }
.search {
  background: #219480;
  color: #fff;
}
</style>
