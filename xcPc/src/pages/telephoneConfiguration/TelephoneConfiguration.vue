
<!-- lcj 优化修改-->
<template>
  <Row>
    <i-col>
      <title-text :title="title"></title-text>
    </i-col>
    <Card>
      <Search></Search>
    </Card>
    <Row :gutter="16">
      <!-- 侧边栏 -->
      <Configuration_Left ref="left"></Configuration_Left>
      <i-col :span="19">
        <Card style="margin-top:16px;height:73vh">
          <i-col>
            <Tabs value="namePar1" name="namePar">
              <TabPane label="基本设置" name="namePar1" tab="namePar">
<!--                <setting ref="setting" @getVoiceRobot="refashList"></setting>-->
                <Setting @getVoiceRobot="refashList"></Setting>
              </TabPane>
              <TabPane label="主动发问" name="namePar2" tab="namePar">
<!--                <qusetion @childFn="parentFn" ref="qusetion"></qusetion>-->
                <Qusetion></Qusetion>
              </TabPane>
              <TabPane label="全局回答" name="namePar3" tab="namePar">
<!--                <global @globalAnswer="parentFn_02" ref="global"></global>-->
                <Global></Global>
              </TabPane>
              <TabPane label="问题库" name="namePar4" tab="namePar">
<!--                <quseAll ref="quseAll"></quseAll>-->
                <QuseAll></QuseAll>
              </TabPane>
              <TabPane label="意向标签" name="namePar5" tab="namePar">
<!--                <labelTit ref="labelTit"></labelTit>-->
                <LabelTit></LabelTit>
              </TabPane>
              <TabPane label="更新记录" name="namePar6" tab="namePar">
<!--                <refash ref="refash"></refash>-->
                <Refash></Refash>
              </TabPane>
            </Tabs>
          </i-col>
        </Card>
      </i-col>
    </Row>
<!--    <Modal-->
<!--      v-model="showModal"-->
<!--      width="800"-->
<!--      title="公司列表(勾选后点击保存即可分享成功!)"-->
<!--    >-->
<!--      <Form :model="formItem" label-position="right">-->
<!--        <FormItem>-->
<!--          <i-input-->
<!--            v-model="cmpname"-->
<!--            placeholder="公司名称"-->
<!--            style="width:150px"-->
<!--          ></i-input>-->
<!--          <Button-->
<!--            style="margin:0 10px"-->
<!--            @click="searchAgent"-->
<!--            class="search"-->
<!--            type="primary"-->
<!--          >搜索</Button-->
<!--          >-->
<!--          <Button @click="cmpname = ''">重置</Button>-->
<!--        </FormItem>-->
<!--        <FormItem>-->
<!--          <Table-->
<!--            border-->
<!--            ref="selection"-->
<!--            :columns="columns4"-->
<!--            :data="companyList"-->
<!--            @on-selection-change="selectShareCmp"-->
<!--          ></Table>-->
<!--        </FormItem>-->
<!--        <FormItem>-->
<!--          <Page-->
<!--            :total="total"-->
<!--            :current="pageNo"-->
<!--            @on-change="changePage"-->
<!--            :page-size="page_Size"-->
<!--            show-elevator-->
<!--            show-total-->
<!--            size="small"-->
<!--          ></Page>-->
<!--        </FormItem>-->
<!--      </Form>-->
<!--      <div slot="footer">-->
<!--        <Button @click="showModal = false">取消</Button>-->
<!--        <Button type="primary" class="search" @click="shareBtn">分享</Button>-->
<!--      </div>-->
<!--    </Modal>-->

  </Row>
</template>

<script>
  import {mapActions} from "vuex"

  import titleText from "../components/title";
  import Search  from "./search/Search"
  import Configuration_Left from "./configuration_Left/Configuration_Left"
  import Setting from "./tabs/Setting"; //基本设置
  import Qusetion from "./tabs/Qusetion"; // 主动发问
  import Global from "./tabs/Global";    //全局回答
  import QuseAll from "./tabs/QustAll";   //问题库
  import LabelTit from "./tabs/Label"; //意向标签
  import Refash from "./tabs/Refash"; //更新记录
  export default {
    data(){
      return {
        title: "话术配置",
      }
    },
    components:{
      titleText,
      Search,
      Configuration_Left,
        Setting,
        Qusetion,
        Global,
        QuseAll,
        LabelTit,
        Refash
    },
      methods:{
         ...mapActions(["getVoiceRobot"]),
          refashList(){
              console.log("触发更新了")
              this.getVoiceRobot()
          },
      },
    mounted(){

    }
  }


  // import {
  //   getVoiceRobotList,
  //   getIndustryList,
  //   getCmpRobotLevel,
  //   getInformant,
  //   deleteVoiceRobot,
  //   copySelfVoiceRobot,
  //   queryAgent,
  //   saveOrUpdateCmpShare,
  //   getCmpShare
  // } from "../../api/api";

  // import { mapActions } from 'vuex'
  // export default {
  //   tabs: {
  //     Search,
  //     Configuration_Left,
  //     titleText,
  //     setting,
  //     qusetion,
  //     quseAll,
  //     global,
  //     labelTit,
  //     refash
  //   },
  //   data() {
  //     return {
  //       cmpname: "", // 公司名
  //       title: "话术配置",
  //       total: 0, //
  //       page_Size: 10,
  //       pageNo: 1,
  //       childrenData: {
  //         sceneid: "", // 主动发问-侧边栏
  //         typeid: "" // 全局回答 -侧边栏
  //       },
  //
  //       robotid: "", //话术id
  //       serviceid: "",
  //       flagIndex: "", //是否选中样式
  //       industryList: [], //话术行业列表
  //       // voiceRobotList: [], // 机器人话术模板列表
  //
  //       self: this,
  //       showModal: false,
  //       tableData: [{ name: 123 }],
  //       tableColumns: [
  //         {
  //           type: "selection",
  //           width: 60,
  //           align: "center"
  //         },
  //         {
  //           title: "数据ID",
  //           key: "name",
  //           align: "center",
  //           sortable: true
  //         },
  //         {
  //           title: "拨打时间",
  //           align: "center",
  //           key: "addr",
  //           width: 300
  //         },
  //         {
  //           title: "外呼名称",
  //           align: "center",
  //           key: "age"
  //         },
  //         {
  //           title: "客户姓名",
  //           align: "center",
  //           key: "birth"
  //         },
  //         {
  //           title: "客户电话",
  //           key: "sex",
  //           align: "center"
  //         },
  //         {
  //           title: "通话时长",
  //           key: "sex",
  //           align: "center"
  //         },
  //         {
  //           title: "拨打结果",
  //           key: "sex",
  //           align: "center",
  //           render: function(row, column, index) {
  //             return row.sex == 0
  //               ? row.sex == 1
  //                 ? "未接通"
  //                 : "已接通"
  //               : "已挂断";
  //           }
  //         },
  //         {
  //           title: "意向标签",
  //           key: "sex",
  //           align: "center",
  //           render: function(row, column, index) {
  //             return row.sex == 0 ? (row.sex == 1 ? "A级" : "C级") : "B级";
  //           }
  //         },
  //         {
  //           title: "已读/未读",
  //           key: "sex",
  //           align: "center",
  //           render: function(row, column, index) {
  //             return row.sex == 0 ? "已读" : "未读";
  //           }
  //         }
  //       ],
  //       columns4: [
  //         {
  //           type: "selection",
  //           width: 60,
  //           align: "center"
  //         },
  //         {
  //           title: "名称",
  //           tooltip: true,
  //           key: "cmpname"
  //         },
  //         {
  //           title: "地区",
  //           tooltip: true,
  //           key: "city",
  //           render: (h, params) => {
  //             const row = params.row;
  //             return h("span", row.province + row.city + row.county);
  //           }
  //         },
  //         {
  //           title: "机器人数",
  //           key: "maxoccurs"
  //         },
  //         {
  //           title: "状态",
  //           key: "state",
  //           render: (h, params) => {
  //             const state = params.row.state;
  //             if (state == null) {
  //               return h("span", {}, "非正常");
  //             } else if (state == "1") {
  //               return h("span", {}, "正常");
  //             } else if (state == "2") {
  //               return h("span", {}, "停用");
  //             }
  //           }
  //         }
  //       ],
  //       companyList: [], // 公司列表
  //       ShareList: [], // 需要分享的公司列表
  //       haveShareList: [] // 已经分享的公司
  //     };
  //   },
  //   created() {
  //     this.getVoiceRobot();
  //     this.getIndustry();
  //     this.queryAgentList({ pageNo: 1, pageSize: 10, cmpname: "" });
  //   },
  //   methods: {
  //     //刷新列表
  //     refashList() {
  //       this.getVoiceRobot();
  //     },
  //     // 接收子组件主动发问的值
  //     parentFn(e) {
  //       this.childrenData.sceneid = e;
  //       console.log(e);
  //     },
  //     parentFn_02(e) {
  //       this.childrenData.typeid = e;
  //     },
  //     //分页
  //     changePage(row) {
  //       let data = {
  //         pageNo: row,
  //         pageSize: 10,
  //         cmpname: this.cmpname
  //       };
  //       this.queryAgentList(data);
  //     },
  //     // 获取机器人话术模板
  //     ...mapActions(['getVoiceRobot']),
  //     // getVoiceRobot(data) {
  //     //   this.$store.dispatch("voiceRobotList")
  //     //   getVoiceRobotList(data).then(res => {
  //     //     console.log("话术模板");
  //     //     console.log(res);
  //     //     if (res.code == "10000") {
  //     //       this.voiceRobotList = res.content;
  //     //     }
  //     //   });
  //     // },
  //
  //     // 新建话术
  //     addVoiceRobot() {
  //       this.$refs.setting.removeData(); // 清空基本设置
  //     },
  //     // 复制话术
  //     copyVoiceRobot() {
  //       if (!this.robotid) {
  //         this.$Message.error({
  //           top: 50,
  //           duration: 3,
  //           content: "请先选择话术"
  //         });
  //         return false;
  //       }
  //
  //       let data = {
  //         robotid: this.robotid
  //       };
  //       this.$Modal.confirm({
  //         title: "复制话术",
  //         content: "<p>是否确定复制</p>",
  //         loading: true,
  //         onOk: () => {
  //           copySelfVoiceRobot(data).then(res => {
  //             console.log(res);
  //
  //             if (res.code == "10000") {
  //
  //               setTimeout(() => {
  //                 this.$Modal.remove();
  //                 this.$Message.success({
  //                   top: 50,
  //                   duration: 3,
  //                   content: "复制成功",
  //
  //                 });
  //               }, 2000);
  //
  //               this.getVoiceRobot();
  //             } else {
  //               this.$Message.error({
  //                 top: 50,
  //                 duration: 3,
  //                 content: res.content
  //               });
  //             }
  //             this.getVoiceRobot();
  //           });
  //         },
  //         onCancel: () => {
  //           this.$Message.info("取消复制");
  //         }
  //       });
  //     },
  //
  //     // 点击获取话术配置详情
  //     getVoiceRobotDetails(e, index) {
  //       console.log("------e-----");
  //
  //       console.log(e);
  //       console.log(index);
  //       this.flagIndex = index;
  //       this.robotid = e.robotid;
  //       this.serviceid = e.onserviceid;
  //       this.$refs.setting.parentMsg(e); // 基本设置
  //       this.$refs.global.parentMsg(e); // 全局回答
  //       this.$refs.refash.parentMsg(e); // 更新记录
  //       this.$refs.labelTit.parentMsg(e); // 意向标签
  //       this.$refs.quseAll.parentMsg(e); // 问题库
  //       this.$refs.qusetion.parentMsg(e); // 主动发问
  //
  //       this.$refs.qusetion.getHoodleMobileLists({
  //         serviceid: this.serviceid,
  //         remark: "",
  //         sceneid: this.childrenData.sceneid
  //       }); // 主动发问
  //       this.$refs.global.getZtCmpRobotGlobalAnswer({
  //         serviceid: this.serviceid,
  //         "ztCmpRobotVtype.typeid": this.childrenData.typeid,
  //         pageSize: 100
  //       });
  //     },
  //     // 获取话术行业列表
  //     getIndustry() {
  //       getIndustryList().then(res => {
  //         console.log("话术行业");
  //         console.log(res);
  //         if (res.code == "10000") {
  //           this.industryList = res.content;
  //         }
  //       });
  //     },
  //     //删除某一项按钮
  //     detailSelf(event, robotid) {
  //       event.stopPropagation();
  //       console.log(robotid);
  //       let data = {
  //         robotid: robotid
  //       };
  //       this.deleteModel = true;
  //       this.$Modal.confirm({
  //         title: "确认删除",
  //         content: "<p>是否确认删除改话术</p>",
  //         onOk: () => {
  //           deleteVoiceRobot(data).then(res => {
  //             console.log(res);
  //             if (res.code == "10000") {
  //               let that = this;
  //               this.$Message.success({
  //                 top: 50,
  //                 duration: 3,
  //                 content: "删除成功"
  //               });
  //               this.robotid = "";
  //               this.flagIndex = "";
  //               this.getVoiceRobot();
  //             } else {
  //               this.$Message.error({
  //                 top: 50,
  //                 duration: 3,
  //                 content: res.content
  //               });
  //             }
  //           });
  //         },
  //         onCancel: () => {
  //           this.$Message.info("取消删除");
  //         }
  //       });
  //     },
  //     // 选择要分享的公司
  //     selectShareCmp(select) {
  //       console.log(select);
  //       if (select.length < 1) {
  //         console.log("没选中");
  //         this.ShareList = [];
  //       } else {
  //         console.log("选择了");
  //         this.ShareList = select;
  //       }
  //     },
  //     // 分享弹窗
  //     shareSelf(e) {
  //       console.log(e);
  //       this.showModal = true;
  //       this.ShareList = [];
  //       let data = {
  //         robotid: e
  //       };
  //       getCmpShare(data).then(res => {
  //         console.log("已分享的公司");
  //         console.log(res);
  //         if (res.code == "10000") {
  //           this.haveShareList = res.content;
  //           for (let i = 0; i < this.companyList.length; i++) {
  //             this.$refs.selection.$refs.tbody.objData[i]._isChecked = false;
  //             this.$refs.selection.$refs.tbody.objData[i]._disabled = false;
  //             for (let j = 0; j < this.haveShareList.length; j++) {
  //               if (
  //                 this.companyList[i].companyid === this.haveShareList[j].cmpid
  //               ) {
  //                 console.log("一致");
  //                 this.$refs.selection.$refs.tbody.objData[i]._isChecked = true;
  //                 this.$refs.selection.$refs.tbody.objData[i]._disabled = true;
  //               }
  //             }
  //           }
  //         }
  //       });
  //     },
  //     // 搜索公司
  //     searchAgent() {
  //       let data = {
  //         pageNo: 1,
  //         pageSize: 10,
  //         cmpname: this.cmpname ? this.cmpname : ""
  //       };
  //       this.pageNo = 1;
  //       this.queryAgentList(data);
  //     },
  //     // 分享按钮
  //     shareBtn() {
  //       if (this.ShareList.length < 1) {
  //         this.$Message.error("请选择要分享的公司");
  //       } else {
  //         let selectNum = [];
  //         this.ShareList.forEach(e => {
  //           console.log(e);
  //           selectNum.push(e.companyid);
  //         });
  //         let data = {
  //           robotid: this.robotid,
  //           serviceid: this.serviceid,
  //           cmpids: selectNum.join(","),
  //           type: "json"
  //         };
  //         this.$Modal.confirm({
  //           title: "分享",
  //           content: "<p>是否保存分享</p>",
  //           onOk: () => {
  //             saveOrUpdateCmpShare(data).then(res => {
  //               if (res.code == "10000") {
  //                 this.$Message.success("分享成功");
  //                 this.showModal = false;
  //                 this.$refs.selection.selectAll();
  //               } else {
  //                 this.$Message.error(res.content);
  //               }
  //             });
  //           },
  //           onCancel: () => {}
  //         });
  //       }
  //     },
  //     // 公司列表
  //     queryAgentList(data) {
  //       queryAgent(data).then(res => {
  //         console.log("公司列表");
  //         console.log(res);
  //         if (res.code == "10000") {
  //           this.companyList = res.content.list;
  //           this.total = res.content.totalCount;
  //         }
  //       });
  //     }
  //   }
  // };
</script>
<style scoped>
  .ivu-tabs-tabpane::-webkit-scrollbar {
    display: none;
  }
  .search {
    background: #219480;
    color: #fff;
  }
  .activeStyle {
    /* border: 1px solid #006edd; */
    margin-top: 10px;
    padding: 10px;
     border: 1px solid #219480;
    box-shadow: 0 0 1px #219480;
    background-color: #E0FFF5;
  }
  .noActiveStyle {
    border: 1px solid #999;
    margin-top: 10px;
    padding: 10px;
  }
  .ivu-tabs-tabpane {
    height: 65vh;
    overflow: auto;
  }
</style>
