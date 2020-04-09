<template>
  <Row>
    <i-col span="12">
      <p>意向规则客户设置(请选择客户等级):</p>
    </i-col>
    <i-col span="6" offset="6">
      <!-- <Button type="primary">恢复默认设置</Button> -->
      <Button
        @click="addBtn"
        style="background: #219480;color: #fff;"
        type="primary"
        >新增</Button
      >
    </i-col>
    <i-col style="margin-top:50px;">
      <Table border :columns="columns12" :data="datas" max-height="500">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="text"
            size="small"
            style="margin-right: 5px;color:##2d8cf0"
            @click="show(index)"
            >View</Button
          >
          <Button
            type="text"
            size="small"
            @click="remove(index)"
            style="color:#ff3040"
            >Delete</Button
          >
        </template>
      </Table>
     <!--  <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            @on-page-size-change="changePageSize"
            :page-size="page_Size"
            :total="total"
            :current="page"
            @on-change="changePage"
            show-sizer
            show-total
            size="small"
          ></Page>
        </div>
      </div> -->
    </i-col>
    <!-- 弹窗 -->
    <Drawer
      title="意向客户规则"
      :closable="false"
      v-model="showModel"
      width="500"
      class="labelDrawer"
    >
      <i-col span="24">
        <Form :model="formItem" label-position="right">
          <FormItem label="客户等级:" :label-width="120">
            <Select @on-change v-model="formItem.iclevelid">
              <Option
                v-for="(item, index) in icLevelList"
                :key="index"
                :value="item.iclevelid"
                >{{ item.iclevelname }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="是否接听" :label-width="120">
            <Select @on-change v-model="formItem.isconnect">
              <Option
                v-for="(item, index) in isconnectList"
                :key="index"
                :value="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="拨打结果" :label-width="120">
            <Select multiple @on-change v-model="formItem.closeresult">
              <Option
                v-for="(item, index) in closeresultList"
                :key="index"
                :value="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="邀约语境" :label-width="120">
            <RadioGroup v-model="formItem.isagree">
              <Radio
                v-for="(item, index) in isagreeList"
                :key="index"
                :label="item.label"
                >{{ item.name }}</Radio
              >
            </RadioGroup>
          </FormItem>
          <FormItem label="通话时长" :label-width="120">
            <span>大于</span>
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.mincalltime"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <!-- <Input v-model="formItem.mincalltime"></Input> -->
            <span>秒,小于</span>
            <!-- <Input v-model="formItem.maxcalltime"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.maxcalltime"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>秒</span>
          </FormItem>
          <FormItem label="肯定次数" :label-width="120">
            <span>大于</span>
            <!-- <Input v-model="formItem.minyesnum"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.minyesnum"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>次,小于</span>
            <!-- <Input v-model="formItem.maxyesnum"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.maxyesnum"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>次</span>
          </FormItem>
          <FormItem label="否定次数" :label-width="120">
            <span>大于</span>
            <!-- <Input v-model="formItem.minnonum"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.minnonum"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>次,小于</span>
            <!-- <Input v-model="formItem.maxnonum"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.maxnonum"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>次</span>
          </FormItem>
          <FormItem label="客户说话字数" :label-width="120">
            <span>大于</span>
            <!-- <Input v-model="formItem.mincusword"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.mincusword"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>字,小于</span>
            <!-- <Input v-model="formItem.maxcusword"></Input> -->
            <input
              type="text"
              class="formItemInput"
              v-model="formItem.maxcusword"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span>字</span>
          </FormItem>
          <FormItem label="客户最后是否拒绝" :label-width="120">
            <RadioGroup v-model="formItem.finalattitude">
              <Radio
                v-for="(item, index) in finalattitudeList"
                :key="index"
                :label="item.label"
                >{{ item.name }}</Radio
              >
            </RadioGroup>
          </FormItem>
          <FormItem label="相关字段" :label-width="120">
            <Input
              class="_keywords"
              style="width:90%"
              v-model="formItem.keywords"
            ></Input>
            <Icon
              @click="addKeywords"
              style="cursor: pointer;"
              size="20"
              type="md-add-circle"
            />
            <!-- <div v-show="this.shows.show1"> -->
            <div v-for="(item, index) in keywordsList" :key="index">
              <Input
                class="_keywords"
                style="width:90%"
                v-model="keywordsList[index]"
              ></Input>
              <Icon
                @click="removeKeywords(index)"
                style="cursor: pointer;"
                size="20"
                type="md-remove-circle"
              />
            </div>
            <!-- </div> -->
          </FormItem>
          <FormItem label="场景" :label-width="120">
            <Select @on-change v-model="formItem.sceneid">
              <Option
                v-for="(item, index) in sceneList"
                :key="index"
                :value="item.sceneid"
                >{{ item.scene }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="分数" :label-width="120">
            <Input
              type="number"
              placeholder="请输入分数"
              v-model="formItem.score"
            ></Input>
          </FormItem>
          <FormItem label="问题库触发次数" :label-width="120">
            <Input
              type="number"
              placeholder="请输入次数"
              v-model="formItem.asknum"
            ></Input>
          </FormItem>
          <FormItem label="互动次数" :label-width="120">
            <Input
              type="number"
              placeholder="请输入互动次数"
              v-model="formItem.interactnum"
            ></Input>
          </FormItem>
          <div style="display: flex;justify-content:center;">
            <FormItem style="width:40%" label="问题" :label-width="50">
              <Select @on-change v-model="formItem.hoodleMoboleid">
                <Option
                  v-for="(item, index) in question"
                  :key="index"
                  :value="item.hoodleMobileid"
                >
                  {{
                    item.type == "1" || item.type == "3"
                      ? item.hoodleMobileadress
                      : item.remark
                  }}
                </Option>
              </Select>
            </FormItem>
            <FormItem style="width:40% " label="态度" :label-width="50">
              <Select @on-change v-model="formItem.ruleAttitude">
                <Option
                  v-for="(item, index) in ruleAttitudeList"
                  :key="index"
                  :value="item.value"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
            <FormItem style="margin-left:4px">
              <Icon
                @click="addIssue"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </FormItem>
          </div>
          <div>
            <div
              v-for="(item, index) in ztCmpRobotIclevelQuestions"
              :key="index"
              style="display: flex;justify-content:center;"
            >
              <FormItem style="width:40%" label="问题" :label-width="50">
                <Select
                  @on-change
                  v-model="ztCmpRobotIclevelQuestions[index].hoodleMoboleid"
                >
                  <Option
                    v-for="(i, idx) in question"
                    :key="idx"
                    :value="i.hoodleMobileid"
                  >
                    {{
                      i.type == "1" || i.type == "3"
                        ? i.hoodleMobileadress
                        : i.remark
                    }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem style="width:40% " label="态度" :label-width="50">
                <Select
                  @on-change
                  v-model="ztCmpRobotIclevelQuestions[index].answertypeid"
                >
                  <Option
                    v-for="(i, idx) in ruleAttitudeList"
                    :key="idx"
                    :value="i.value"
                    >{{ i.name }}</Option
                  >
                </Select>
              </FormItem>
            <FormItem style="margin-left:4px">
                <Icon
                  @click="removeIssue(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </FormItem> 
            </div>
          </div>

          <FormItem style="text-align: center;">
            <Button
              type="primary"
              size="large"
              style="background: #219480;color: #fff;"
              @click="saveBtn"
              >确定</Button
            >
          </FormItem>
        </Form>
      </i-col>
    </Drawer>
  </Row>
</template>
<script>
import {
  getIcRuleList,
  delteIcRule,
  getIcLevelList,
  getHoodleMobileList,
  saveOrUpdateIcRule,

} from "../../../api/api";
export default {
  data() {
    return {
      total: 0,
      page: 1,
      page_Size: 10,
      formItem: {
        iclevelid: "", // 客户等级
        isconnect: "", // 是否接听 1为接听 2为不接听
        closeresult: [], // 拨打结果
        isagree: "", // 邀约语境 1为同意 2为拒绝 空为无
        mincalltime: "", // 最小通话时长
        maxcalltime: "", // 最大通话时长
        minyesnum: "", // 最小肯定次数
        maxyesnum: "", // 最大肯定次数
        minnonum: "", // 最小否定次数
        maxnonum: "", // 最大否定次数
        mincusword: "", // 最小说话字数
        maxcusword: "", // 最大说话字数
        finalattitude: "", // 是否拒绝 1为是 2位否 空为无
        keywords: "", // 相关字段
        sceneid: "", // 场景
        score: "", // 分数
        asknum: "", // 问题库触发次数
        interactnum: "", // 互动次数
        hoodleMoboleid: "", // 问题
        ruleAttitude: "",
        icruleid: "",
        callresult: ""
      },
      ztCmpRobotIclevelQuestions: [],
      icLevelList: [], // 客户等级列表
      isconnectList: [{ value: 1, name: "接听" }, { value: 2, name: "不接听" }], // 是否接听列表
      closeresultList: [
        { value: 0, name: "无人接听" },
        { value: 1, name: "号码错误" },
        { value: 2, name: "占线" },
        { value: 3, name: "接听后挂断" },
        { value: 4, name: "客户忙碌中稍后联系" },
        { value: 5, name: "回答超时挂机" },
        { value: 6, name: "多次拒绝挂机" },
        { value: 7, name: "邀约拒绝" },
        { value: 8, name: "脏话" },
        { value: 9, name: "已转人工" },
        { value: 10, name: "邀约成功" },
        { value: 11, name: "用户关机" },
        { value: 12, name: "线路异常" }
      ],
      // 显示隐藏
      shows: {
        show1: false, // 相关字段
        show2: false // 问题态度列表
      },
      // 邀约语境列表
      isagreeList: [
        { label: 1, name: "同意" },
        { label: 2, name: "拒绝" },
        { label: "", name: "无" }
      ],
      // 是否拒绝
      finalattitudeList: [
        { label: 1, name: "是" },
        { label: 2, name: "否" },
        { label: "", name: "无" }
      ],
      // 相关字段列表
      keywordsList: [],
      // 场景列表
      sceneList: [
        //场景
        {
          sceneid: 1,
          scene: "开场白"
        },
        {
          sceneid: 2,
          scene: "了解情况"
        },
        {
          sceneid: 3,
          scene: "邀约语境"
        },
        {
          sceneid: 4,
          scene: "结束语境"
        },
        {
          sceneid: 5,
          scene: "挽留"
        },
        {
          sceneid: 9,
          scene: "多轮会话"
        }
      ],
      // 态度列表
      ruleAttitudeList: [
        { value: 1, name: "肯定" },
        { value: 2, name: "否定" },
        { value: 3, name: "拒绝" },
        { value: 4, name: "特殊1" },
        { value: 8, name: "特殊2" },
        { value: 9, name: "特殊3" },
        { value: 10, name: "特殊4" },
        { value: 5, name: "其他" }
      ],
      question: [], // 问题列表
      serviceid: "", // 父组件id
      showModel: false, // 弹窗
      columns12: [
        {
          title: "顺序",
          align: "center",
          type: "index"
        },
        {
          title: "规则",
          key: "asknum",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            // console.log(params.row);
            // console.log(params);
            
            const asknum = params.row.asknum ? params.row.asknum : 0;
            const minyesnum = params.row.minyesnum?params.row.minyesnum :0;//最小肯定次数
            const minnonum = params.row.minnonum?params.row.minnonum :0;//最小否定次数 
            const mincalltime = params.row.mincalltime?params.row.mincalltime :0;//最小通话时长


            return h("span", {}, "接听 且 问题库触发" + asknum + "次 且 肯定次数大于"+minyesnum+'次 且 否定次数大于'+minnonum+'次 且 通话时长大于'+mincalltime+'秒');
            // return h("span", {}, "接听 且 问题库触发" + asknum + "次 且 肯定次数大于"+minyesnum+'次');
          }
        },
        {
          title: "客户意向标签",
          key: "iclevelname",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
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
                      console.log("编辑");
                      console.log(row);
                      this.removeData();
                      this.showModel = true;

                      let keywords = []; // 相关字段
                      let issuesList = []; // 问题态度

                      this.formItem.iclevelid = row.iclevelid;
                      this.formItem.isconnect = row.isconnect;
                      this.formItem.closeresult = row.closeresult
                        .split(",")
                        .map(Number);
                      this.formItem.isagree = row.isagree;
                      this.formItem.mincalltime = row.mincalltime;
                      this.formItem.maxcalltime = row.maxcalltime;
                      this.formItem.minyesnum = row.minyesnum;
                      this.formItem.maxyesnum = row.maxyesnum;

                      this.formItem.minnonum = row.minnonum;
                      this.formItem.maxnonum = row.maxnonum;
                      this.formItem.mincusword = row.mincusword;
                      this.formItem.maxcusword = row.maxcusword;
                      this.formItem.finalattitude = row.finalattitude;

                      keywords = this.notemptyArr(row.keywords.split(","));
                      console.log(keywords);
                      for (let i = 0; i < keywords.length; i++) {
                        if (i == "0") {
                          this.formItem.keywords = keywords[0];
                        } else {
                          this.keywordsList.push(keywords[i]);
                        }
                      }
                      issuesList = row.ztCmpRobotIclevelQuestions;
                      for (let i = 0; i < issuesList.length; i++) {
                        if (i == "0") {
                          this.formItem.hoodleMoboleid =
                            issuesList[0].hoodleMoboleid;
                          this.formItem.ruleAttitude =
                            issuesList[0].answertypeid;
                        } else {
                          this.ztCmpRobotIclevelQuestions.push({
                            hoodleMoboleid: issuesList[i].hoodleMoboleid,
                            answertypeid: issuesList[i].answertypeid
                          });
                        }
                      }

                      this.formItem.sceneid = row.sceneid;
                      this.formItem.score = row.score;
                      this.formItem.asknum = row.asknum;
                      this.formItem.interactnum = row.interactnum;
                      this.formItem.icruleid = row.icruleid;
                      this.formItem.callresult = row.callresult;
                    }
                  }
                },
                "编辑"
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
                      console.log("删除");
                      this.$Modal.confirm({
                        title: "确认删除",
                        content:
                          "<p>意向客户规则一旦删除将无法恢复确定要现在删除吗？</p>",
                        onOk: () => {
                          console.log(row);
                          delteIcRule({
                            id: row.icruleid,
                            serviceid: row.serviceid
                          }).then(res => {
                            console.log(res);
                            if (res.code == "10000") {
                              let that = this;
                              this.$Message.success({
                                top: 50,
                                duration: 3,
                                content: "删除成功"
                              });
                              that.getIcRule({ serviceid: row.serviceid });
                            } else {
                              this.$Message.error({
                                top: 50,
                                duration: 3,
                                content: res.content
                              });
                            }
                          });
                        },
                        onCancel: () => {
                          this.$Message.info("取消删除");
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      datas: []//意向规则用户
    };
  },
  created() {
    this.getIcLevel();
  },
  methods: {
  /*   // 分页
    changePage(row) {
      console.log(row);
      let data = {
        serviceid: this.serviceid,
        pageNo: row,
        pageSize: this.page_Size
      };
      this.getIcRule(data);
    },
    //页容量的改变
    changePageSize(pageSize) {
      let data = {
        serviceid: this.serviceid,
        pageNo: this.page,
        pageSize: this.page_Size
      };
      this.page_Size = pageSize;
      this.page = 1;
      this.getIcRule(data);
    }, */
    // 获取父组件传的值
    parentMsg(e) {
      this.serviceid = e.onserviceid;
      let data = {
        serviceid: e.onserviceid
      };
      this.getIcRule(data);
      getHoodleMobileList({
        serviceid: e.onserviceid,
        sceneid: 0
      }).then(res => {
        console.log("问题");
        console.log(res);
        if (res.code == "10000") {
          this.question = res.content;
        }
      });
    },

    // 添加相关字段
    addKeywords() {
      this.shows.show1 = true;
      this.keywordsList.push("");
    },
    // 移除相关字段
    removeKeywords(index) {
      this.keywordsList.splice(index, 1);
    },
    // 添加问题与态度
    addIssue() {
      this.ztCmpRobotIclevelQuestions.push({
        hoodleMoboleid: null,
        answertypeid: null
      });
    },
    // 移除问题与态度
    removeIssue(index) {
      this.ztCmpRobotIclevelQuestions.splice(index, 1);
    },
    // 获取意向规则
    getIcRule(data) {
      getIcRuleList(data).then(res => {
        console.log("意向规则客户");
        console.log(res);
        console.log("长度" + res.content.length);

        if (res.code == "10000") {
          this.datas = res.content;
          this.total = res.content.length;
        }
      });
    },
    // 获取客户等级
    getIcLevel() {
      getIcLevelList().then(res => {
        console.log("客户等级");
        console.log(res);
        if (res.code == "10000") {
          this.icLevelList = res.content;
        }
      });
    },
    // 清空数据
    removeData() {
      this.formItem.iclevelid = "";
      this.formItem.isconnect = "";
      this.formItem.closeresult = [];
      this.formItem.isagree = "";
      this.formItem.mincalltime = "";
      this.formItem.maxcalltime = "";
      this.formItem.minyesnum = "";
      this.formItem.maxyesnum = "";
      this.formItem.minnonum = "";
      this.formItem.maxnonum = "";
      this.formItem.mincusword = "";
      this.formItem.maxcusword = "";
      this.formItem.finalattitude = "";
      this.formItem.keywords = "";
      this.formItem.sceneid = "";
      this.formItem.score = "";
      this.formItem.asknum = "";
      this.formItem.interactnum = "";
      this.formItem.hoodleMoboleid = "";
      this.formItem.ruleAttitude = "";
      this.ztCmpRobotIclevelQuestions = [];
      this.keywordsList = [];
    },
    // 新增按钮
    addBtn() {
      // console.log(this.IcRule);
      /* if(this.IcRule>10){
        this.$Message.error('意向规则最多11条');
        return;
      } */
      if (!this.serviceid) {
        this.$Message.error("请先选择话术");
        return false;
      }
      this.removeData();
      this.showModel = true;
    },
    saveBtn() {
      let ztCmpRobotIclevelQuestions = [];

      ztCmpRobotIclevelQuestions.push({
        hoodleMoboleid: this.formItem.hoodleMoboleid,
        answertypeid: this.formItem.ruleAttitude,
        icquestionid: ""
      });
      for (let i = 0; i < this.ztCmpRobotIclevelQuestions.length; i++) {
        // if()
        ztCmpRobotIclevelQuestions.push({
          hoodleMoboleid: this.ztCmpRobotIclevelQuestions[i].hoodleMoboleid,
          answertypeid: this.ztCmpRobotIclevelQuestions[i].answertypeid,
          icquestionid: ""
        });
      }
      let data = {
        iclevelid: this.formItem.iclevelid,
        icruleid: this.formItem.icruleid,
        rulename: "",
        isconnect: this.formItem.isconnect,
        closeresult: this.formItem.closeresult.join(","),
        isagree: this.formItem.isagree,
        mincalltime: this.formItem.mincalltime,
        maxcalltime: this.formItem.maxcalltime,
        minyesnum: this.formItem.minyesnum,
        maxyesnum: this.formItem.maxyesnum,
        minnonum: this.formItem.minnonum,
        maxnonum: this.formItem.maxnonum,
        mincusword: this.formItem.mincusword,
        maxcusword: this.formItem.maxcusword,
        finalattitude: this.formItem.finalattitude,
        keywords: this.formItem.keywords + "," + this.keywordsList.join(","),
        sceneid: this.formItem.sceneid,
        score: this.formItem.score,
        asknum: this.formItem.asknum,
        interactnum: this.formItem.interactnum,

        ztCmpRobotIclevelQuestions: ztCmpRobotIclevelQuestions,

        callresult: this.formItem.callresult,
        serviceid: this.serviceid,
        type: "json"
      };
      console.log(data);
      //超出提示

      if (!this.formItem.iclevelid) {
        this.$Message.error("请选择客户等级");
      }else if(!this.formItem.hoodleMoboleid){
        this.$Message.error("请选择问题");
      }else if(!this.formItem.ruleAttitude){
        this.$Message.error("请选择态度");
      } else if (
        (this.formItem.mincalltime || this.formItem.mincalltime == 0) &&
        (this.formItem.maxcalltime || this.formItem.maxcalltime == 0)
      ) {
        if (
          parseInt(this.formItem.mincalltime) >
          parseInt(this.formItem.maxcalltime)
        ) {
          this.$Message.error("通话时长有误");
        } else if (
          parseInt(this.formItem.minyesnum) > parseInt(this.formItem.maxyesnum)
        ) {
          this.$Message.error("肯定次数有误");
        } else if (
          parseInt(this.formItem.minnonum) > parseInt(this.formItem.maxnonum)
        ) {
          this.$Message.error("否定次数有误");
        } else if (
          parseInt(this.formItem.mincusword) >
          parseInt(this.formItem.maxcusword)
        ) {
          this.$Message.error("说话字数有误");
        } else {

          saveOrUpdateIcRule(data).then(res => {
            console.log(res);
            if (res.code == "10000") {
              this.$Message.success("保存成功");
              this.showModel = false;
              this.getIcRule({ serviceid: this.serviceid });
            } else {
              this.$Message.error(res.content);
            }
          });
        }
      }
    },
    // 数组去空值
    notemptyArr(arrs) {
      var arr = [];
      arrs.map(function(val, index) {
        //过滤规则为，不为空串、不为null、不为undefined
        if (val !== "" && val != undefined) {
          arr.push(val);
        }
      });
      return arr;
    },
    // 获取客户等级
   
  }
};
</script>
<style>
.formItemInput {
  width: 70px;
  border: none;
  border-bottom: 1px solid #dcdee2;
  outline: none;
  padding: 0 10px;
  text-align: center;
}
.formItemInput::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.formItemInput::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.labelDrawer ul.ivu-select-dropdown-list {
  max-width: 200px !important;
  padding: 15px;
}
</style>
