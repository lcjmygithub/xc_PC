<template>
  <Row>
    <Row>
      <title-text :title="title"></title-text>
    </Row>
    <Row>
      <flex-card :financeDatas="financeData"></flex-card>
    </Row>
    <Card style="margin-top:15px">
      <Form :model="formItem" :label-width="64">
        <Row>
          <Col span="6">
            <div style="width:100%;height:100%;">
              <Form-item label="开始时间" label-position="left">
                <Date-picker
                  :clearable="true"
                  v-model="formItem.sTime"
                  type="datetime"
                  placeholder="选择日期"
                  style="width: 170px"
                ></Date-picker>
              </Form-item>
            </div>
          </Col>
          <Col span="6">
            <Form-item label="结束时间" label-position="left">
              <Date-picker
                :clearable="true"
                v-model="formItem.eTime"
                type="datetime"
                placeholder="选择日期"
                style="width: 170px"
              ></Date-picker>
            </Form-item>
          </Col>
          <Col span="4">
            <Button class="search clear1" @click="searchDate">搜索</Button>
            <Button @click="clearDate" class="clear">清空</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card style="margin-top:15px;height:480px">
      <div style="height:30px position: relative;">
        <i-col :span="24" style="display:flex;justify-content:space-between;line-height:30px">
          <Tabs :value="tabNames" @on-click="tabNamesCilck" style="width:100%">
            <TabPane label="通话账单" name="name1">
              <i-col style="margin:10px 0">
                <i-button
                  :class="buttonFlag == 1 ? 'search clear1' : ''"
                  :type="buttonFlag == 1 ? 'text' : 'default'"
                  @click="changeTable(),buttonFlag = 1"
                >账单报表</i-button>
                <i-button
                  :class="buttonFlag == 2 ? 'search clear1' : ''"
                  :type="buttonFlag == 2 ? 'text' : 'default'"
                  @click="changeTable(),buttonFlag = 2"
                >账单明细</i-button>
              </i-col>
              <Table
                :loading="loadings[0].loading"
                max-height="340"
                v-if="buttonFlag == 1"
                :context="self"
                :data="tableData"
                :columns="tableColumns"
              ></Table>
              <Table
                :loading="loadings[1].loading"
                max-height="340"
                v-if="buttonFlag == 2"
                :context="self"
                :data="tableDataDetail"
                :columns="tableColumnsDetail"
              ></Table>
            </TabPane>
            <TabPane label="充值记录" name="name2">
              <Table
                :loading="loadings[2].loading"
                max-height="370"
                :context="self"
                :data="payData"
                :columns="payHead"
              ></Table>
            </TabPane>
            <TabPane label="机器人账单" name="name3">
              <Table
                :loading="loadings[3].loading"
                max-height="370"
                :context="self"
                :data="robotData"
                :columns="robotColumns"
              >
                 <template slot-scope="{ row }" slot="editor">
                   <Button type="primary" size="small" style="margin-right: 5px;font-size: 12px;background-color: #36AC85"  @click="editorTime(row)"     v-if="roleMsg.ztRoleRightses.some((v)=>{
                      return v.ztRights.permission == 'robotcharging:edit'
                   })&&Number(roleMsg.comp.companyid)==289&&row.state==1" >编辑</Button>
                </template>
              </Table>
            </TabPane>
          </Tabs>
        </i-col>
        <i-col :span="1" offset="17" style="position: absolute;top:15px;right:30px">
          <i-button type="text" @click="exportData" class="search clear1">导出</i-button>
        </i-col>
      </div>
    </Card>
    <Col :span="24">
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-for="(item,index) in pagination"
            v-if="isPage ==index"
            :key="index"
            :total="item.total"
            :current="item.current"
            :page-size="item.size"
            @click="isPages(index)"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-elevator
            show-sizer
            show-total
            size="small"
          ></Page>
        </div>
      </div>
    </Col>
    <Modal
      v-model="modalTime"
      title="编辑结束时间"
      >
      <div style="display: flex;justify-content: center;">
        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间" style="width: 200px" v-model="formatTime" @on-change="changeTime"></DatePicker>
      </div>
      <div slot="footer">
        <Button type="default" size="small"  @click="cancel">取消</Button>
        <Button type="primary" size="small" style="background-color: #36AC85"  @click="sure">确认</Button>
      </div>
    </Modal>
  </Row>
</template>
<script>
import titleText from "../components/title";
import flexCard from "./components/flexCard";
import {
  updateRobotEndTime,     //更新结束时间
  getBillingStatements,
  getBillingDetails,
  getRobotBill,
  getCmpBalance,
  getPresentMonthPay,
  getRechargeRecord,
  getPresentMonthTolCount,
  getPresentMonthTelTime,
  api
} from "../../api/api"; //
export default {
            mixins: [require("@/mymixins").default],
  components: {
    titleText,
    flexCard
  },
  data() {
    return {
      rowMsg:{},
      formatTime:'',
      modalTime: false,  //编辑结束时间对话框
      roleMsg:{},// 存储 角色信息
      res:[],
      isPage: 0, //定义page的显示与隐藏
      formItem: {
        sTime: "", //开始日期
        eTime: "" // 结束日期
      },
      loadings: [
        { loading: false },
        { loading: false },
        { loading: false },
        { loading: false }
      ], //loading
      pagination: [
        { total: 0, current: 1, size: 10 },
        { total: 0, current: 1, size: 10 },
        { total: 0, current: 1, size: 10 },
        { total: 0, current: 1, size: 10 }
      ],
      title: "财务管理",
      self: this,
      // baseURL: "http://47.94.89.73:5432",
      tabNames: "", //tabs的name
      pageSize: 10,

      //账单 button
      buttonFlag: 1,
      totalAll: 0,
      financeData: {
        balance: 0, // 余额
        intergral: 0, // 积分
        monthConsume: 0, // 本月消费
        callNum: 0, // 拨打数量
        callTime: 0 // 拨打时长
      },
      //表格总数
      total: 0,
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      //通话账单 tbody
      tableData: [],
      //通话账单 thead
      tableColumns: [
        {
          title: "时间",
          align: "center",
          key: "calltime"
        },
        {
          title: "通话总时长",
          align: "center",
          key: "duration",
          render: (h, params) => {
            let num = params.row.duration;
            let minute = Math.floor(num / 60);
            let sec = num - minute * 60;
            return h("span", {}, `${minute}分${sec}秒`);
          }
        },
        {
          title: "呼叫单数",
          align: "center",
          key: "count"
        },
        {
          title: "消费金额(元)",
          align: "center",
          key: "price"
        }
      ],
      // 通话明细总数
      total1: 0,
      // 账单明细
      tableDataDetail: [],
      tableColumnsDetail: [
        {
          title: "计费类型",
          align: "center",
          key: "type",
          render: (h, params) => {
            const row = params.row.type;
            if (row == "1") {
              return h("span", "呼入");
            } else if (row == "2") {
              return h("span", "呼出");
            } else if (row == "3") {
              return h("span", "群呼");
            } else if (row == "4") {
              return h("span", "内呼");
            }
          }
        },
        {
          title: "通话开始时间",
          align: "center",
          key: "calltime",
          render: (h, params) => {
            let date = new Date(params.row.calltime);
            // let time = params.row.createtime;
            // var s1 = `${date.getFullYear()}-${date.getMonth() +
            //   1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            return h("span", {}, this.formatDate(date));
          }
        },
        {
          title: "通话时长",
          align: "center",
          key: "duration",
          render: (h, params) => {
            const row = params.row.duration;
            return h("span", row + "秒");
          }
        },
        {
          title: "计费(元)",
          align: "center",
          key: "price",
          sortable: true
        }
      ],
      // // 充值记录总数
      // total3: 0,
      //充值记录
      payData: [],
      payHead: [
        {
          title: "充值时间",
          align: "center",
          key: "createtime",
          render: (h, params) => {
            let date = new Date(params.row.createtime);
            // let time = params.row.createtime;
            // var s1 = `${date.getFullYear()}-${date.getMonth() +
            //   1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            return h("span", {}, this.formatDate(date));
          }
        },
        {
          title: "充值方式",
          align: "center",
          key: "paytype",
          render: (h, params) => {
            const row = params.row.paytype;
            if (row == "1") {
              return h("span", "支付宝");
            } else if (row == "3") {
              return h("span", "预支付");
            } else {
              return h("span", "微信");
            }
          }
        },
        {
          title: "充值金额",
          align: "center",
          key: "sum"
        }
      ],

      // // 机器人账单总数
      // total4: 0,
      robotData: [],
      // 机器人账单
      robotColumns: [
        {
          title: "公司",
          align: "center",
          key: "cmpName"
        },
        {
          title: "并发数",
          align: "center",
          key: "robotnum"
        },
        {
          title: "机器人价格",
          align: "center",
          key: "price"
        },
        {
          title: "实际用价",
          align: "center",
          key: "pprice"
        },
        {
          title: "使用类型",
          align: "center",
          key: "ptype",
          render: (h, params) => {
            const ptype = params.row.ptype;
            if (ptype == "1") {
              return h("span", "时间");
            } else if (ptype == "2") {
              return h("span", "流量");
            } else if (ptype == "3") {
              // return h("span", "时间+机器人");
              return h("span", "机器人+话费");
            }
          }
        },
        {
          title: "开始时间",
          align: "center",
          key: "starttime",
          tooltip: true,
          render: (h, params) => {
            let date =params.row.starttime&&params.row.starttime!=0? new Date(params.row.starttime):'';
            // let time = params.row.createtime;
            // var s1 = `${date.getFullYear()}-${date.getMonth() +
            //   1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            return h("span", {}, date?this.formatDate(date):'');
          }
        },
        {
          title: "结束时间",
          align: "center",
          key: "endtime",
          tooltip: true,
          render: (h, params) => {
            let date = params.row.endtime&&params.row.endtime!=0?new Date(params.row.endtime):'';
            // let time = params.row.createtime;
            // var s1 = `${date.getFullYear()}-${date.getMonth() +
            //   1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            return h("span", {}, date?this.formatDate(date):'');
          }
        },
        {
          title:' ',
          slot: 'editor'
        },
        {
          title: "状态",
          align: "center",
          key: "state",
          render: (h, params) => {
            const state = params.row.state;
            return state == "1" ? h("span", {}, "正常") : h("span", {}, "过期");
          }
        }
      ]
    };
  },
  created() {
    this.getMonthTelReport();
    this.getDataList();
    // this.getCall_mingxi();
    // this.Rechargerecord();
    // this.Robotcord();
    console.log(this.common.common);
    console.log(this.userInfo)
     this.roleMsg = JSON.parse(this.userInfo.role)
      console.log(this.roleMsg)
  },
  methods: {
    //选择时间
    changeTime(t,d){
      console.log(t)
      this.formatTime = t
      console.log(t)
      console.log(this.formatTime)
    },
    //编辑时间
    editorTime(row){
      this.formItem.sTime = ''
      this.formItem.eTime = ''
      // let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      // let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      // if (endTime) {
      //   if (startTime > endTime) {
      //     this.$Message.error("开始时间不能大于结束时间");
      //     return false;
      //   }
      // }
       this.rowMsg = row
       this.formatTime = this.formatDate(row.endtime)  //转为时间格式
       console.log(this.formatTime)
       this.modalTime = true
    },
    //取消弹框
    cancel(){
     this.modalTime = false
    },
    //确认对话框
    sure(){
      console.log(this.rowMsg)
     let cid = this.rowMsg.cid
      if(!this.formatTime){
        this.$Message.warning({
          content: '请选择时间',
          duration: 1
        });
        return false
      }
     let endtime = this.formatDate(this.formatTime)  //转为时间格式

      let params=`cid=${cid}&endtime=${endtime}`
      console.log(params)
       updateRobotEndTime(params).then(res=>{
           if(res.code="10000"){
             this.modalTime = false
             this.$Message.success('编辑成功');
                 let stime = "";
                 let etime = "";
                 if (this.formItem.sTime) {
                   stime = this.formatDate(this.formItem.sTime);
                 }
                 if (this.formItem.eTime) {
                   etime = this.formatDate(this.formItem.eTime);
                 }
                 let data = {
                   stime: stime,
                   etime: etime,
                   pageNo: this.pagination[3].current,
                   pageSize: this.pagination[3].size
                 }
                 console.log(data)
                 this.Robotcord(data)

           }
       })
    },

    isPages(index) {
      console.log(index);
    },
    // 时间戳
    formatDate(datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      datetime = new Date(datetime)  //增加的
      var year = datetime.getFullYear(),
        month = ("0" + (datetime.getMonth() + 1)).slice(-2),
        date = ("0" + datetime.getDate()).slice(-2),
        hour = ("0" + datetime.getHours()).slice(-2),
        minute = ("0" + datetime.getMinutes()).slice(-2),
        second = ("0" + datetime.getSeconds()).slice(-2);
      // 拼接
      var result =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
      // 返回
      return result;
    },
    //获取tabNmaes

    tabNamesCilck(name) {
      let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      if (endTime) {
        if (startTime > endTime) {
          this.$Message.error("开始时间不能大于结束时间");
          return;
        }
      }
      let stime = "";
      let etime = "";
      if (this.formItem.sTime) {
        stime = this.formatDate(this.formItem.sTime);
      }
      if (this.formItem.eTime) {
        etime = this.formatDate(this.formItem.eTime);
      }
      this.tabNames = name;
      let data = {
        stime: stime,
        etime: etime,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      console.log(this.tabNames);
      if (this.tabNames == "name2") {
        this.isPage = 2;
        this.Rechargerecord(data);
      } else if (this.tabNames == "name3") {
        this.isPage = 3;
        this.Robotcord(data);
      } else {
        if (this.buttonFlag == 1) {
          this.isPage = 0;
          this.getMonthTelReport(data);
        } else {
          this.isPage = 1;
          this.getCall_mingxi(data);
        }
      }
      (this.currentPage = 1), (this.pageSize = 10);
    },
    // 切换每页条数
    changePageSize(row) {
      let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      if (endTime) {
        if (startTime > endTime) {
          this.$Message.error("开始时间不能大于结束时间");
          return;
        }
      }
      let stime = "";
      let etime = "";
      if (this.formItem.sTime) {
        stime = this.formatDate(this.formItem.sTime);
      }
      if (this.formItem.eTime) {
        etime = this.formatDate(this.formItem.eTime);
      }
      if (this.buttonFlag == 1) {
        this.pagination[0].size = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[0].current,
          pageSize: this.pagination[0].size
        };
        //获取账单报表
        // console.log("获取账单报表");
        this.getMonthTelReport(data);
      }
      if (this.buttonFlag == 2) {
        this.pagination[1].size = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[1].current,
          pageSize: this.pagination[1].size
        };
        //获取账单明细
        // console.log("获取账单明细");
        this.getCall_mingxi(data);
      }
      if (this.tabNames == "name2") {
        this.pagination[2].size = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[2].current,
          pageSize: this.pagination[2].size
        };
        //获取充值记录
        // console.log("获取充值记录");
        this.Rechargerecord(data);
      }
      if (this.tabNames == "name3") {
        this.pagination[3].size = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[3].current,
          pageSize: this.pagination[3].size
        };
        //获取机器人账单\
        // console.log("获取机器人账单");
        this.Robotcord(data);
      }
      (this.currentPage = 1), (this.pageSize = 10);
    },
    changePage(row) {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
      let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      if (endTime) {
        if (startTime > endTime) {
          this.$Message.error("开始时间不能大于结束时间");
          return;
        }
      }
      let stime = "";
      let etime = "";
      if (this.formItem.sTime) {
        stime = this.formatDate(this.formItem.sTime);
      }
      if (this.formItem.eTime) {
        etime = this.formatDate(this.formItem.eTime);
      }
      if (this.buttonFlag == 1) {
        //获取账单报表
        this.pagination[0].current = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[0].current,
          pageSize: this.pagination[0].size
        };

        this.getMonthTelReport(data);
      }
      if (this.buttonFlag == 2) {
        //获取账单明细
        this.pagination[1].current = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[1].current,
          pageSize: this.pagination[1].size
        }; // console.log("获取账单明细");
        this.getCall_mingxi(data);
      }
      if (this.tabNames == "name2") {
        this.pagination[2].current = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[2].current,
          pageSize: this.pagination[2].size
        };

        //获取充值记录
        // console.log("获取充值记录");
        this.Rechargerecord(data);
      }
      if (this.tabNames == "name3") {
        //获取机器人账单\
        this.pagination[3].current = row;
        let data = {
          stime: stime,
          etime: etime,
          pageNo: this.pagination[3].current,
          pageSize: this.pagination[3].size
        };
        this.Robotcord(data);
      }
      // this.currentPage = 1;
      // this.pageSize = 10;
    },
    // 切换表格
    changeTable() {
      let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      if (endTime) {
        if (startTime > endTime) {
          this.$Message.error("开始时间不能大于结束时间");
          return;
        }
      }
      let stime = "";
      let etime = "";
      if (this.formItem.sTime) {
        stime = this.formatDate(this.formItem.sTime);
      }
      if (this.formItem.eTime) {
        etime = this.formatDate(this.formItem.eTime);
      }
      let data = {
        stime: stime,
        etime: etime,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.buttonFlag == 2) {
        this.isPage = 0;
        //获取账单报表
        this.getMonthTelReport(data);
      } else {
        this.isPage = 1;
        this.getCall_mingxi(data);
      }
    },
    // 获取账单报表
    getMonthTelReport(data) {
      this.loadings[0].loading = true;
      getBillingStatements(data).then(res => {
        console.log("获取账单报表");
        console.log(res);
        if (res.code == "10000") {
          this.loadings[0].loading = false;
          this.tableData = res.content.list; // 账单list
          // this.total = res.content.totalCount; //总数[0]
          this.pagination[0].total = res.content.totalCount;
        }
      });
    },
    // 获取账单明细
    getCall_mingxi(data) {
      this.loadings[1].loading = true;
      getBillingDetails(data).then(res => {
        // console.log("获取账单明细");
        // console.log(res);
        if (res.code == "10000") {
          this.loadings[1].loading = false;
          this.tableDataDetail = res.content.list;
          // this.total = res.content.totalCount;
          this.pagination[1].total = res.content.totalCount;
        }
      });
    },
    // 获取充值记录
    Rechargerecord(data) {
      this.loadings[2].loading = true;
      getRechargeRecord(data).then(res => {
        // console.log("获取充值记录");
        console.log(res);
        if (res.code == "10000") {
          this.loadings[2].loading = false;
          this.payData = res.content.list;
          // this.total = res.content.totalCount;
          this.pagination[2].total = res.content.totalCount;
        }
      });
    },
    // 获取机器人账单
    Robotcord(data) {
      console.log(this.roleMsg)
      this.loadings[3].loading = true;
      getRobotBill(data).then(res => {
        console.log("获取机器人账单");
        console.log(res);
        if (res.code == "10000") {
          this.loadings[3].loading = false;
          this.robotData = res.content.list;
          // this.total = res.content.totalCount;
          this.pagination[3].total = res.content.totalCount;
        }
      });
    },

    // 获取余额 本月消费 本月拨打数量 本月拨打时长 积分
    getDataList() {
      getCmpBalance().then(res => {
        // console.log("余额、积分");
        // console.log(res);
        if (res.code == "10000") {
          this.financeData.balance = res.content.balance; // 余额
          this.financeData.intergral = res.content.intergral; // 积分
        }
      });
      getPresentMonthPay().then(res => {
        // console.log("本月消费");
        // console.log(res);
        if (res.code == "10000") {
          this.financeData.monthConsume = res.content;
        }
      });
      getPresentMonthTolCount().then(res => {
        // console.log("本月拨打数量");
        // console.log(res);
        if (res.code == "10000") {
          this.financeData.callNum = res.content;
        }
      });
      getPresentMonthTelTime().then(res => {
        console.log("本月拨打时长");
        console.log(res);
        if (res.code == "10000") {
          let callTime = Math.floor(
            (res.content ? Number(res.content) : 0) / 60
          );
          this.financeData.callTime = callTime;
        }
      });
    },
    //根据日期搜索
    searchDate() {
      let startTime = this.formItem.sTime ? this.formItem.sTime.getTime() : "";
      let endTime = this.formItem.eTime ? this.formItem.eTime.getTime() : "";
      if (endTime) {
        if (startTime > endTime) {
          this.$Message.error("开始时间不能大于结束时间");
          return;
        }
      }

      let stime = "";
      let etime = "";
      if (this.formItem.sTime) {
        stime = this.formatDate(this.formItem.sTime);
      }
      if (this.formItem.eTime) {
        etime = this.formatDate(this.formItem.eTime);
      }
      let data = {
        stime: stime,
        etime: etime,
        pageNo: 1,
        pageSize: this.pageSize,
        cmpName: "" // 公司名
      };
      if (this.buttonFlag == 1) {
        //获取账单报表
        this.getMonthTelReport(data);
      }
      if (this.buttonFlag == 2) {
        //获取账单明细
        this.getCall_mingxi(data);
      }
      if (this.tabNames == "name2") {
        //获取充值记录
        this.Rechargerecord(data);
      }
      if (this.tabNames == "name3") {
        //获取机器人账单\
        this.Robotcord(data);
      }
      this.currentPage = 1;
      this.pageSize = 10;
    },
    //清空日期
    clearDate() {
      this.formItem.sTime = "";
      this.formItem.eTime = "";
    },
    // 导出
    exportData() {
      // 根据不同表格的值判断
      if (this.tabNames == "name2") {
        let name = "充值时间,充值方式,充值金额（元）";
        let sendid = [];
        // payData
        console.log(this.payData);

        if (this.payData.length) {
          for (let i = 0; i < this.payData.length; i++) {
            sendid.push(this.payData[i].rechargeid);
          }
        } else {
          this.$Message.error("当前充值记录为空");
          return;
        }
        let url = `${
          this.common.common.baseUrlPort
        }pay/exportPayRechargeLog?name=${name}&array=${sendid.join(
          ","
        )}&Authorization=${this.userInfo.token}`;
        window.location.href = url;
      } else if (this.tabNames == "name3") {
        let stimes = this.formItem.sTime
          ? this.formatDate(this.formItem.sTime)
          : "";
        let eTimes = this.formItem.eTime
          ? this.formatDate(this.formItem.eTime)
          : "";
        let name =
          "公司,并发数,机器人价格,实际用价,使用类型,开始时间,结束时间,状态";
        var sendid = [];
        // exportRobotCharing_pay robotData
        console.log(this.robotData);
        if (this.robotData.length) {
          for (let i = 0; i < this.robotData.length; i++) {
            sendid.push(this.robotData[i].cid);
          }
        } else {
          this.$Message.error("当前机器人报表为空");
          return;
        }
        let url = `${
          this.common.common.baseUrlPort
        }pay/exportRobotCharing?stime=${stimes}&etime=${eTimes}&name=${name}&array=${sendid.join(
          ","
        )}&Authorization=${this.userInfo.token}`;
        window.location.href = url;
      } else {
        if (this.buttonFlag == 1) {
          //账单报表导出
          let name = "时间,通话总时长,呼叫单数,消费金额（元）";
          let sendid = [];
          console.log(this.tableData);

          if (this.tableData.length) {
            for (let i = 0; i < this.tableData.length; i++) {
              sendid.push(this.tableData[i].calltime);
            }
          } else {
            this.$Message.error("当前账单报表为空");
            return;
          }
          let url = `${
            this.common.common.baseUrlPort
          }pay/exportMonthTelReport?name=${name}&type=1&array=${sendid.join(
            ","
          )}&Authorization=${this.userInfo.token}`;
          window.location.href = url;
        } else if (this.buttonFlag == 2) {
          let name = "计费类型,通话开始时间,通话时长,计费（元）";
          let sendid = [];
          console.log(this.tableDataDetail);

          if (this.tableDataDetail.length) {
            for (let i = 0; i < this.tableDataDetail.length; i++) {
              sendid.push(this.tableDataDetail[i].billid);
            }
          } else {
            this.$Message.error("当前账单明细为空");
            return;
          }
          let url = `${
            this.common.common.baseUrlPort
          }pay/exportZtPayBillLog?name=${name}&array=${sendid.join(
            ","
          )}&Authorization=${this.userInfo.token}`;
          window.location.href = url;
        }
      }
    }
  }
};
</script>
<style scoped>
  /*确定按钮*/
  .ivu-modal-wrap .ivu-modal-footer >.ivu-btn> span {
    font-size: 12px!important;
    padding: 4px 2px
  }
.title {
  font-size: 24px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
.search {
  background: #219480;
  color: #fff;
  margin-right: 10px;
}
.ivu-form-item {
  margin-bottom: 0;
}
</style>
