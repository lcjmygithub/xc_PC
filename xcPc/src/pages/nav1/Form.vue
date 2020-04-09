<template>
  <div>
    <Row>
      <Col span="24">
        <title-text :title="title">
          <template slot="button-group">
            <div class="btn-grop" style="color:#fff">
              <Button class="search clear1" @click="(alertCall = true), (modelFlag = 1)">重新拨打</Button>
              <Button
                @click="
                  (alertCall = true),
                    (modelFlag = 2),
                    (robatTest.test = ''),
                    (robatTest.phone = '')
                "
                style="margin-right:10px"
                class="clear"
              >机器人测试</Button>
              <Button @click="exportTape" style="margin-right:10px" class="clear">
                <!-- <a href="" style="color:#333">导出通话录音</a> -->
                导出通话录音
              </Button>
              <Button @click="exportCallRecord" class="clear">导出通话记录</Button>
            </div>
          </template>
        </title-text>
      </Col>
      <i-col span="6" offset="18" style="margin-bottom:20px"></i-col>
    </Row>

    <Card style="margin-bottom:20px">
      <i-form :model="formItem" :label-width="64" label-position="left">
        <Row :gutter="10">
          <Col span="18" offset>
            <!-- <Form-item label="客户等级"> -->
            <FormItem label="意向标签:">
              <CheckboxGroup v-model="formItem.iclevelname">
                <Checkbox
                  v-for="(item, index) in IcLevelList"
                  :key="index"
                  :label="item.iclevelid"
                >{{ item.iclevelname }}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>

          <Col span="1" style="margin-top:8px;font-size:12px">
            <div style="cursor: pointer" @click="isMoreSearch = !isMoreSearch">
              <span style="margin-top:10px;">更多</span>
              <Icon type="md-arrow-dropdown" style="font-size:20px" />
            </div>
          </Col>
          <Col span="3" offset>
            <!-- <Button type="text" icon="md-arrow-dropdown" @click="isMoreSearch = !isMoreSearch">更多</Button> -->
            <Button class="search clear1" @click="search()">搜索</Button>
            <Button @click="clearform" class="clear">清空</Button>
          </Col>
          <div v-if="isMoreSearch" style="margin-top:47px" class="form">
            <Col span="5" >
              <Form-item label="联系电话" style="margin-left:0px" class="item">
                <i-input v-model="formItem.phone" placeholder="请输入手机号" style=""></i-input>
              </Form-item>
            </Col>
            <Col span="5" :gutter="16">
              <Form-item label="数据 ID" class="item">
                <i-input v-model="formItem.saleid" placeholder="请输入数据ID" style=""></i-input>
              </Form-item>
            </Col>
            <Col span="5" >
              <Form-item label="任务名称" class="item">
                <i-input v-model="formItem.taskname" placeholder="请输入任务名称" style=""></i-input>
              </Form-item>
            </Col>
            <Col span="5" :gutter="16" >
              <Form-item label="未读/已读" class="item">
                <i-select v-model="formItem.isread" placeholder="是否已读" style="">
                  <i-option value="1">已读</i-option>
                  <i-option value="2">未读</i-option>
                  <i-option value="0">全部</i-option>
                </i-select>
              </Form-item>
            </Col>
            <Col span="5">
              <Form-item label="拨打结果" class="item" style="margin-top:10px">
                <i-select v-model="formItem.closeresult" placeholder="拨打结果" style="">
                  <i-option value>全部状态</i-option>
                  <i-option value="0">无人接听</i-option>
                  <i-option value="1">号码错误</i-option>
                  <i-option value="2">客户未接</i-option>
                  <i-option value="3">接听后挂断</i-option>
                  <i-option value="4">客户忙碌中稍后联系</i-option>
                  <i-option value="5">回答超时挂机</i-option>
                  <i-option value="6">多次拒绝挂机</i-option>
                  <i-option value="7">邀约拒绝</i-option>
                  <i-option value="8">脏话</i-option>
                  <i-option value="9">已转人工</i-option>
                  <i-option value="10">邀约成功</i-option>
                  <i-option value="11">用户关机</i-option>
                  <i-option value="12">防骚扰</i-option>
                </i-select>
              </Form-item>
            </Col>
            <Col span="4"  style="margin-top:10px">
              <Form-item label="最近通话时长" :label-width="84">
                <i-input
                  v-model="formItem.sTimeSmall"
                  placeholder="最短时间      秒"
                  style="width:130px"
                ></i-input>
              </Form-item>
            </Col>
            <Col span="4" style="margin-left:10px;margin-top:10px" >
              <Form-item label :label-width="20">
                <i-input v-model="formItem.sTimeLong" placeholder="最长时间      秒" style="width:130px"></i-input>
              </Form-item>
            </Col>

            <div>
              <Col style="margin-top:10px" span="5">
                <Form-item label="拨打时间" :label-width="64" class="item">
                  <DatePicker
                    v-model="formItem.stime"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 170px"
                  ></DatePicker>
                </Form-item>
              </Col>
              <Col span="5" style="margin-left:-15px;margin-top:10px">
                <Form-item label="" :label-width="20" class="item">
                  <DatePicker
                    v-model="formItem.etime"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 170px"
                  ></DatePicker>
                </Form-item>
              </Col>
            </div>
          </div>
        </Row>
      </i-form>
    </Card>
    <div style="height:auto;overflow:auto">
      <Table
        :loading="loadings"
        max-height="520"
        ref="selection"
        :context="self"
        :data="tableData"
        :columns="tableColumns"
        @on-selection-change="selectNum"
        @on-row-dblclick="clicksTable"
      ></Table>
    </div>
    <!-- <Row style="display:flex"> -->
    <Row style="padding:0px;margin-top:10px">
      <Col :span="4" style="padding-top:0px">
        <!-- <Button @click="handleSelectAll(!isSelected)">全选</Button> -->
        <Button class="search clear1" @click="confirm()" v-if="tableData.length != 0">批量删除</Button>
        <!-- <Button class="search">批量设置分类</Button> -->
      </Col>
      <Col :span="20">
        <div style="margin: 0px;overflow: hidden">
          <div style="float: right;">
            <Page
              size="small"
              :total="total"
              :current="page"
              @on-change="changePage"
              @on-page-size-change="updatePageSize"
              show-elevator
              show-sizer
              show-total
            ></Page>
          </div>
        </div>
      </Col>
    </Row>
    <Drawer title="通话详情" @on-close="hideEven" :closable="false" v-model="addDrawer" width="80%">
      <i-col span="14">
        <i-col style="background:#F8F8F9">
          <i-col style="display:flex;justify-content:space-around;padding-top:10px">
            <div style="margin-top:20px">
              <span>数据id:</span>
              {{ formDatas.saleid }}
            </div>
            <div>
              <audio controls="controls" :src="formDatas.voxfile" id="audioVocie" />
            </div>
            <div style="margin-top:13px">
              跟进状态:
              <Button type="primary" size="small" ghost class="ghost">进行中</Button>
            </div>
          </i-col>
          <i-col
            style="height:600px;text-align:center;margin-top:20px;color:#9D9D9D;overflow:auto;"
          >
            <div>
              {{
              formDatas.createtime
              ? formatDate(new Date(formDatas.createtime))
              : ""
              }}
            </div>
            <div
              v-for="(item, index) in formDatas.message"
              :key="index"
              style="font-size:18px;text-align:center;color:#F8F8F9;height:auto;padding:20px;overflow: hidden;"
            >
              <span
                :class="
                  item.ifornotrobot == '1' ? 'spanRobot fl' : 'spanPeo fr'
                "
                style="display:inline-block;width:60px;line-height:60px;border-radius:50%;text-align: center;"
              >{{ item.ifornotrobot == "1" ? "小诚" : "客户" }}</span>
              <span
                :class="item.ifornotrobot == '1' ? 'spanRobot' : 'spanPeo'"
                style="padding:10px 10px;margin:10px;max-width:60%;font-size: 14px;line-height: 24px"
              >
                {{ item.storagetext }}
                <img
                  @click="playAudio($event, index)"
                  :data-audioUrl="
                    common.common.audioUrl + '/' +
                      item.storagevoice
                  "
                  style="display:inline-block;width:25px;height:25px;margin-bottom:0px;cursor: pointer;vertical-align: middle"
                  v-show="item.ifornotrobot == '1' ? false : true"
                  :audioSrc="item.storagevoice"
                  src="../../assetss/images/playAudio.png"
                  alt
                />
              </span>
            </div>
          </i-col>
        </i-col>
        <i-col>
          <Form :model="formItem" :label-width="80">
            <FormItem label="意向标签:">
              <Radio-group @on-change="updateIcLevel" v-model="iclevelid">
                <Radio
                  v-for="(item, index) in IcLevelList"
                  :key="index"
                  :label="item.iclevelid"
                >{{ item.iclevelname }}</Radio>
              </Radio-group>
            </FormItem>
            <!-- <FormItem label="关键词:"></FormItem> -->
          </Form>
        </i-col>
      </i-col>
      <i-col span="10" class="gadLabelBox">
        <!-- <h2 class="gadLabel">客户标签</h2> -->
        <p>
          <span>姓名:{{ formDatas.tempcustomername }}</span>
        </p>
        <p>
          <span>电话:{{ formDatas.tempmobilephone }}</span>
        </p>
        <p>
          <span>微信:{{ formDatas.weixin }}</span>
        </p>
        <p>
          <span>客户来源:{{ formDatas.clientSource }}</span>
        </p>
        <p>
          <span>客户分组:{{ formDatas.clientGroup }}</span>
        </p>
        <p>
          <span>
            创建时间:{{
            formDatas.createtime
            ? formatDate(new Date(formDatas.createtime))
            : ""
            }}
          </span>
        </p>
        <p v-if="formDatas.focus.length">
          <span>客户关注点:</span>
          <span v-for="(item, index) in formDatas.focus" :key="index">
            {{
            item.focus
            }}
          </span>
        </p>
        <p v-if="formDatas.clientAttr.length">
          <span>
            客户属性:
            <span
              style="display: inline-block;margin-right: 5px;"
              v-for="(item, index) in formDatas.clientAttr"
              :key="index"
            >{{ item.attribute }}</span>
          </span>
        </p>
      </i-col>
    </Drawer>
    <!-- 通话记录弹框 -->
    <Modal v-model="alertCall" :title="modelFlag == 1 ? '重新拨打' : '机器人测试'">
      <i-col v-if="modelFlag == 1">
        <!-- <p>将以下勾选中的{{ selectTotal }}条中呼叫失败数据进行重置</p>
        <p>重置后将重新拨打您确定吗？</p>-->
        <p>重新拨打会清除之前的通话记录哦</p>
      </i-col>

      <i-col v-if="modelFlag == 2">
        <Form
          ref="robatTest"
          :model="robatTest"
          :rules="robatTest"
          :label-width="80"
          style="padding:20px"
          label-position="left"
        >
          <FormItem label="测试任务" style="margin-bottom:30px">
            <i-col>
              <Select v-model="robatTest.test" filterable @on-change="selectChange">
                <Option
                  v-for="(item, index) in testTaskList"
                  :key="index"
                  :value="item.salenum"
                >{{ item.taskname }}</Option>
              </Select>
            </i-col>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="robatTest.phone" placeholder="请输入手机号"></Input>
          </FormItem>
        </Form>
      </i-col>
      <div slot="footer">
        <Button @click="alertCall = false" class="clear">取消</Button>
        <Button
          type="primary"
          :loading="loadingData.loading"
          class="search"
          @click="confirmOk"
        >{{ loadingData.text }}</Button>
      </div>
    </Modal>
    <!-- 片段录音 -->
    <audio
      @ended="palyEnded"
      :src="audio_src"
      preload="auto"
      id="audio_play"
      hidden
      :data-playIndex="playIndex"
      controls="controls"
    ></audio>
  </div>
</template>
<script>
import titleText from "../components/title";
import {
  getSaleDatas,
  manyDeleteSaleDate,
  getRobatDataTask,
  getVoiceRobotChatList,
  saveTestSaleData,
  exportTapeFile,
  exportCallRecordFile,
  resetCall,
  readSaleData,
  getIcLevelList,
  updateSaleDateIcLevel,
  getSaleDataMatch,
  getSaleDateCustomerAttrLinks
} from "../../api/api";
export default {
  mixins: [require("@/mymixins").default],
  components: {
    titleText
  },
  data() {
    return {
      createTime: "", //通话任务创建时间
      loadings: false, // 列表数据loading
      loadingData: {
        loading: false, // 确定按钮loading
        text: "确定",
        disabled: false
      },
      isMoreSearch: false, // 是否显示更多搜索选项
      audio_src: "", // 片段录音src
      playState: false, // 播放状态
      playIndex: null, // 播放索引
      iclevelid: "",
      saleidsList: [],
      audiourlList: [],
      IcLevelList: [], // 意向客户等级列表
      robatTest: {
        test: "",
        phone: "",
        salenum: "" // 批次号
      },
      selectTotal: 0, //选中数
      testTaskList: [],
      addDrawer: false,
      title: "机器人通话记录",
      isSelected: false,
      alertCall: false,
      modelFlag: 1,
      formItem: {
        phone: "", // 联系电话
        saleid: "", //数据id
        taskname: "", //任务名称
        closeresult: "", // 拨打结果
        isread: "", // 已读/未读
        iclevelname: [], //意向标签
        sTimeSmall: "",
        sTimeLong: "",
        stime: "", // 开始时间
        etime: "" // 结束时间
      },
      formDatas: {
        //抽屉数据
        saleid: "",
        voxfile: "", //录音文件
        createtime: "", // 创建时间
        tempcustomername: "", //姓名
        weixin: "", //微信
        tempmobilephone: "", // 号码
        clientSource: "导入", //客户来源
        clientGroup: "", //客户分组
        clientAttention: "", //客户关注
        clientAttr: "", // 客户属性
        message: [], // 消息对话
        focus: []
      },
      removeList: [], // 删除
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10, // 每页显示条数
      self: this,
      input: "",
      select: "",
      radio: "male",
      checkbox: [],
      switch: true,
      date: "",
      time: "",
      slider: [20, 50],
      textarea: "",
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "数据ID",
          align: "center",
          key: "saleid"
        },
        {
          title: "拨打时间",
          align: "center",
          width: 200,
          key: "createtime",
          render: (h, params) => {
            let date = new Date(params.row.createtime);
            // var s1 = "";
            // if (params.row.createtime) {
            //   s1 = `${date.getFullYear()}-${date.getMonth() +
            //     1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            // }
            return h("span", {}, this.formatDate(date));
          }
        },
        {
          title: "外呼名称",
          align: "center",
          tooltip: true,
          key: "taskname"
        },
        {
          title: "客户姓名",
          align: "center",
          key: "tempcustomername"
        },
        {
          title: "客户电话",
          align: "center",
          key: "tempmobilephone"
        },
        {
          title: "通话时长",
          align: "center",
          key: "calltime",
          render: (h, params) => {
            let calltime = "";
            if (!params.row.calltime) {
              calltime = "";
            } else {
              calltime = params.row.calltime + "秒";
            }
            if (params.row.closeresult >= 3 && params.row.closeresult < 11) {
              calltime = params.row.calltime
                ? params.row.calltime + "秒"
                : "0秒";
            }
            return h("span", {}, calltime);
          }
        },
        {
          title: "拨打结果",
          key: "closeresult",
          align: "center",
          render: (h, params) => {
            const closeresult = params.row.closeresult;
            if (closeresult == "0") {
              return h("span", "无人接听");
            } else if (closeresult == "1") {
              return h("span", "号码错误");
            } else if (closeresult == "2") {
              return h("span", "客户未接");
            } else if (closeresult == "3") {
              return h("span", "接听后挂断");
            } else if (closeresult == "4") {
              return h("span", "客户忙碌中稍后联系");
            } else if (closeresult == "5") {
              return h("span", "回答超时挂机");
            } else if (closeresult == "6") {
              return h("span", "多次拒绝挂机");
            } else if (closeresult == "7") {
              return h("span", "邀约拒绝");
            } else if (closeresult == "8") {
              return h("span", "脏话");
            } else if (closeresult == "9") {
              return h("span", "已转人工");
            } else if (closeresult == "10") {
              return h("span", "邀约成功");
            } else if (closeresult == "11") {
              return h("span", "用户关机");
            } else if (closeresult == "12") {
              return h("span", "防骚扰");
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "意向标签",
          align: "center",
          tooltip: true,
          key: "iclevelname"
        },
        {
          title: "已读/未读",
          align: "center",
          key: "isread",
          render: (h, params) => {
            const row = params.row;
            return row.isread == "1"
              ? h("span", {}, "已读")
              : h(
                  "span",
                  {
                    style: {
                      color: "#ff3040"
                    }
                  },
                  "未读"
                );
          }
        }
      ]
    };
  },
  created() {
   console.log(this.common.common.baseUrlPort);
    this.getSaleData({
      state: 1,
      calltype: 3
    });
    this.getRobatTestData();
    this.getIcLevel();
  },
  methods: {
    //是否确认批量删除
    confirm() {
      this.$Modal.confirm({
        title: "批量删除",
        content: "<p>是否确认删除选中的数据</p>",
        onOk: () => {
          if (!this.removeList.length) {
            this.$Message.error({
              top: 50,
              duration: 3,
              content: "请选择要删除的数据"
            });
          } else {
            let removeNum = []; //存储需要删除的id
            this.removeList.forEach(e => {
              removeNum.push(e.saleid);
            });
            let data = {
              saleids: removeNum.join(","),
              calltype: 3,
              "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
              // isread: this.formItem.isread, // 已读/未读
              isread: this.formItem.isread
                ? this.formItem.isread != "0"
                  ? this.formItem.isread
                  : ""
                : "", // 已读/未读
              Saleids: this.formItem.saleid, // 数据id
              taskname: this.formItem.taskname, // 任务名称
              closeresult: this.formItem.closeresult, // 拨打结果
              level: this.formItem.iclevelname.join(","), // 意向标签
              minCallTime: this.formItem.sTimeSmall,
              maxCallTime: this.formItem.sTimeLong
            };
            manyDeleteSaleDate(data).then(res => {
              if (res.code == 10000) {
                this.$Message.success({
                  top: 50,
                  duration: 3,
                  content: "删除成功"
                });
                this.page = 1;
                let data1 = {
                  pageSize: 10,
                  pageNo: 1,
                  calltype: 3,
                  state: 1,
                  "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
                  // isread: this.formItem.isread, // 已读/未读
                  isread: this.formItem.isread
                    ? this.formItem.isread != "0"
                      ? this.formItem.isread
                      : ""
                    : "", // 已读/未读
                  Saleids: this.formItem.saleid, // 数据id
                  taskname: this.formItem.taskname, // 任务名称
                  closeresult: this.formItem.closeresult // 拨打结果
                };
                setTimeout(() => {
                  this.getSaleData(data1);
                }, 2000);
              } else {
                this.$Message.error({
                  top: 50,
                  duration: 3,
                  content: "删除失败"
                });
              }
            });
          }
        },
        onCancel: () => {}
      });
    },
    // 时间戳
    formatDate(datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
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
    // 获取测试任务列表
    getRobatTestData() {
      getRobatDataTask().then(res => {
        if (res.code == "10000") {
          this.testTaskList = res.content;
        }
      });
    },
    // 下拉框事件
    selectChange(e) {
      this.robatTest.salenum = e;
    },
    confirmOk() {
      if (this.modelFlag == "1") {
        this.resetCalls();
      } else if (this.modelFlag == "2") {
        this.robotTest();
      }
    },

    // 机器人测试
    robotTest() {
      let phoneReg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)|(^09\d{8}$)/;
      if (!phoneReg.test(this.robatTest.phone)) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "手机号码格式不正确"
        });
      } else if (!this.robatTest.salenum) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请选择测试任务"
        });
      } else {
        this.loadingData.loading = true;
        this.loadingData.text = "loading...";
        let data = {
          mobile: this.robatTest.phone,
          salenum: this.robatTest.salenum
        };
        saveTestSaleData(data).then(res => {
          if (res.code == "10000") {
            this.$Message.success({
              top: 50,
              duration: 3,
              content: "保存成功"
            });
            this.loadingData.loading = false;
            this.loadingData.text = "确定";
            this.alertCall = false;
          } else {
            this.$Message.error({
              top: 50,
              duration: 3,
              content: "保存失败"
            });
          }
        });
      }
    },
    // 重新拨打
    resetCalls() {
      this.loadingData.loading = true;
      this.loadingData.text = "loading...";
      let resetCallNum = []; //需要重新拨打的id
      if (this.removeList.length) {
        this.removeList.forEach(e => {
          resetCallNum.push(e.saleid);
        });
      }
      let data = {
        saleids: resetCallNum.join(","),
        calltype: 3,
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        // isread: this.formItem.isread, // 已读/未读
        isread: this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "", // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult, // 拨打结果
        level: this.formItem.iclevelname.join(","), // 意向标签
        minCallTime: this.formItem.sTimeSmall,
        maxCallTime: this.formItem.sTimeLong
      };
      resetCall(data).then(res => {
        if (res.code == "10000") {
          this.$Message.success("重新拨打成功");
          this.getSaleData({
            state: 1,
            calltype: 3
          });
          this.loadingData.loading = false;
          this.loadingData.text = "确定";
          this.alertCall = false;
          this.removeList = [];
          console.log(this.removeList);
        } else {
          this.$Message.error(res.content);
        }
      });
    },
    // 导出通话录音
    exportTape() {
      let exportNum = []; // 存储需要导出的id
      let exportUrl = []; // 存储需要导出的url
      if (this.removeList.length) {
        this.removeList.forEach(e => {
          exportNum.push(e.saleid);
          exportUrl.push(
            "https://zvoice.oss-cn-beijing.aliyuncs.com/cerec" +
              e.voxfile +
              ".wav"
          );
        });
      } else {
        exportNum = this.saleidsList;
        exportUrl = this.audiourlList;
      }
      let data = {
        saleids: exportNum.join(","),
        calltype: 3,
        level: this.formItem.iclevelname.join(","), // 意向标签
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        isread: this.formItem.isread, // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult // 拨打结果
      };
      let url = `${
        this.common.common.baseUrlPort
      }manage/downloadFile?saleids=${exportNum.join(",")}&url=${
        this.common.common.AllaudioUrl
      }&calltype=3&Authorization=${this.userInfo.token}`;
      window.location.href = url;
    },

    // 导出通话记录
    exportCallRecord() {
      let stime = this.formItem.stime
        ? this.formatDate(this.formItem.stime)
        : "";
      let etime = this.formItem.etime
        ? this.formatDate(this.formItem.etime)
        : "";
      let exportNum = []; // 存储需要导出的id
      let array =
        "数据id,时间,任务名称,客户名称,客户电话,意向标签,通话时长,拨打结果,通话记录详情";
      // if (this.removeList.length != []) {
      this.removeList.forEach(e => {
        exportNum.push(e.saleid);
      });
      // }
      //  else {
      //   this.$Message.error({
      //     top: 50,
      //     duration: 3,
      //     content: "请选择要导出的数据"
      //   });
      // }
      let data = {
        array: array,
        saleids: exportNum.join(","),
        calltype: 3,
        state: 1,
        level: this.formItem.iclevelname.join(","), // 意向标签
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        isread: this.formItem.isread, // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult // 拨打结果
      };

      let url = `${
        this.common.common.baseUrlPort
      }sale/exportRobotSaleData?array=${array}&saleids=${exportNum.join(
        ","
      )}&calltype=3&ztCustomerTm.mobilephone=${this.formItem.phone}&isread=${
        this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "" // 已读/未读
      }&Saleids=${this.formItem.saleid}&taskname=${
        this.formItem.taskname
      }&minCallTime=${this.formItem.sTimeSmall}&maxCallTime=${
        this.formItem.sTimeLong
      }&stime=${stime}&etime=${etime}&closeresult=${
        this.formItem.closeresult
      }&Authorization=${
        this.userInfo.token
      }&level=${this.formItem.iclevelname.join(",")}&state=1`;
      window.location.href = url;
    },
    // 通话记录列表
    getSaleData(data) {
      this.loadings = true;
      this.saleidsList = [];
      this.audiourlList = [];
      let A, B;
      console.log(this.common.common.baseUrlPort);
      if (this.common.common.baseUrlPort == "http://api.yizeai.com/") {
        A = "21826";
        B = "313";
      } else {
        A = "90";
        B = "91";
      }
      getSaleDatas(data).then(res => {
        if (res.code == "10000") {
          this.loadings = false;
          this.tableData = res.content.list;
          //判断AB级客户 隐藏手机号中间 5位
          let state = window.localStorage.getItem("state");
          this.tableData.forEach((item, i) => {
            if (state == 2 && (item.iclevelid == A || item.iclevelid == B)) {
              item.tempmobilephone = item.tempmobilephone.replace(
                item.tempmobilephone.substring(3, 8),
                "*****"
              );
            } else {
              item.tempmobilephone = item.tempmobilephone;
            }
          });
          console.log("------------------------");
          console.log(this.tableData);
          console.log("------------------------");
          this.total = res.content.totalCount;
          for (let i = 0; i < res.content.list.length; i++) {
            this.saleidsList.push(res.content.list[i].saleid);
            this.audiourlList.push(
              this.common.common.AllaudioUrl +
                res.content.list[i].voxfile +
                ".wav"
            );
          }
        }
      });
    },
    // 搜索
    search() {
      let data = {
        pageNo: 1,
        calltype: 3,
        pageSize: this.pageSize,
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        // isread: this.formItem.isread, // 已读/未读
        isread: this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "", // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult, // 拨打结果
        level: this.formItem.iclevelname.join(","), // 意向标签
        minCallTime: this.formItem.sTimeSmall,
        maxCallTime: this.formItem.sTimeLong,
        stime: this.formItem.stime ? this.formatDate(this.formItem.stime) : "",
        etime: this.formItem.etime ? this.formatDate(this.formItem.etime) : "",
        state: 1
        // saleid: this.formItem.saleid // 数据id
      };
      if (this.formItem.sTimeLong) {
        if (
          Number(this.formItem.sTimeSmall) > Number(this.formItem.sTimeLong)
        ) {
          this.$Message.info("最小时长不能大于最大时长哦!");
          return false;
        }
      }
      this.page = 1;
      this.getSaleData(data);
    },
    clearform() {
      (this.formItem.isread = ""),
        (this.formItem.saleid = ""),
        (this.formItem.taskname = ""),
        (this.formItem.closeresult = ""),
        (this.formItem.iclevelname = []),
        (this.formItem.sTimeSmall = ""),
        (this.formItem.sTimeLong = ""),
        (this.formItem.phone = "");
      this.formItem.stime = "";
      this.formItem.etime = "";
    },
    //全选
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
      this.isSelected = !this.isSelected;
    },
    /************三个月后录音不支持播放提示 *******************/
    //格式化时间格式
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    //格式化时间戳
    formMatTime(timeC) {
      var myDate = new Date(timeC);
      var years = myDate.getFullYear();
      // var months = parseInt(myDate.getMonth()) + 1;
      var months = parseInt(myDate.getMonth()) + 4; //往后3个月
      var dates = myDate.getDate();
      var h = myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds();
      var now =
        this.p(years) +
        "-" +
        this.p(months) +
        "-" +
        this.p(dates) +
        " " +
        this.p(h) +
        ":" +
        this.p(m) +
        ":" +
        this.p(s);
      return now;
    },
    /************三个月后录音不支持播放提示  *******************/
    //双击table某一项触发
    clicksTable(e) {
      this.createTime = e.createtime;
      //获取三个月后时间
      let next3Mon = this.formMatTime(this.createTime);
      //将三个月后时间转为时间戳
      next3Mon = next3Mon.replace(/-/g, "/");
      console.log(next3Mon);
      next3Mon = new Date(next3Mon).getTime();
      //获取当前时间的时间戳
      let nowTime = new Date().getTime();
      //比较当前时间戳与三个月后的时间戳大小
      this.formMatTime(this.createTime);
      if (Number(next3Mon) < Number(nowTime)) {
        this.$Message.warning({
          content: "录音已超过3个月，不支持播放",
          top: 80,
          duration: 1
        });
      } else {
        this.addDrawer = true;
        this.formDatas.saleid = e.saleid;
        this.formDatas.voxfile = e.voxfile
          ? this.common.common.AllaudioUrl + e.voxfile + ".wav"
          : "";
        this.formDatas.createtime = e.createtime;
        this.formDatas.tempcustomername = e.tempcustomername;
        this.formDatas.tempmobilephone = e.tempmobilephone;
        this.iclevelid = e.iclevelid;
        let data = { saleid: e.saleid };
        readSaleData(data).then(res => {
          if (res.code == "10000") {
            console.log(res);
          }
        });
        getVoiceRobotChatList(data).then(res => {
          if (res.code == "10000") {
            console.log(res);
            for (let i = 0; i < res.content.length; i++) {
              res.content[i].playState = false;
            }
            this.formDatas.message = res.content;
            console.log(this.formDatas.message);
          }
        });
        getSaleDataMatch(data).then(res => {
          console.log(res);
          if (res.code == "10000") {
            this.formDatas.focus = res.content.queslist
              ? res.content.queslist
              : [];
          }
        });
        getSaleDateCustomerAttrLinks(data).then(res => {
          if (res.code == "10000") {
            console.log(res);
            this.formDatas.clientAttr = res.content ? res.content : [];
          }
        });
      }
      if (!(e.closeresult >= 3 && e.closeresult < 11)) {
        return false;
      }
    },
    // 抽屉关闭事件
    hideEven() {
      // 关闭录音
      let audios = document.getElementById("audioVocie");
      audios.pause();
      console.log(audios);

      this.getSaleData({
        pageNo: this.page,
        pageSize: this.pageSize,
        calltype: 3,
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        isread: this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "", // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult, // 拨打结果
        level: this.formItem.iclevelname.join(","), // 意向标签
        minCallTime: this.formItem.sTimeSmall,
        maxCallTime: this.formItem.sTimeLong,
        stime: this.formItem.stime ? this.formatDate(this.formItem.stime) : "",
        etime: this.formItem.etime ? this.formatDate(this.formItem.etime) : "",
        state: 1
      });
    },
    // 播放音频
    playAudio(e, index) {
      let audios = document.getElementById("audio_play");
      this.playIndex = index; //
      audios.pause();
      console.log(index);
      if (audios.paused) {
        this.formDatas.message[index].playState = false;
        console.log("这已经是暂停的");
      }
      let playStateZt = this.formDatas.message[index].playState;
      this.audio_src = e.target.dataset.audiourl;
      console.log(playStateZt);

      if (playStateZt) {
        audios.pause();
        console.log("暂停了");
        this.formDatas.message[index].playState = false;
      } else {
        audios.currentTime = 0;
        // 不写在this.$nextTick回调函数里会报错
        this.$nextTick(() => {
          audios.play();
        });
        this.formDatas.message[index].playState = true;
        console.log("播放了");
      }
    },
    // 播放结束监听
    palyEnded(e) {
      console.log("播放结束了");
    },
    // 选中监听
    selectNum(e) {
      if (e.length == []) {
        this.removeList = [];
        this.selectTotal = 0;
      } else {
        this.removeList = e;
        this.selectTotal = e.length;
      }
    },

    show(index) {
      this.$Modal.info({
        title: "用户信息",
        content: `姓名：${this.tableData[index].name}<br>年龄：${this.tableData[index].age}<br>地址：${this.tableData[index].addr}`
      });
    },

    // 分页
    changePage(row) {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
      this.page = row;
      let data = {
        pageSize: 10,
        pageNo: this.page,
        pageSize: this.pageSize,
        calltype: 3,
        level: this.formItem.iclevelname.join(","), // 意向标签
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        // isread: this.formItem.isread, // 已读/未读
        isread: this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "", // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult, // 拨打结果
        state: 1,
        minCallTime: this.formItem.sTimeSmall,
        maxCallTime: this.formItem.sTimeLong,
        stime: this.formItem.stime ? this.formatDate(this.formItem.stime) : "",
        etime: this.formItem.etime ? this.formatDate(this.formItem.etime) : ""
      };
      this.getSaleData(data);
    },
    // 改变每页显示条数
    updatePageSize(e) {
      this.pageSize = e;
      let data = {
        pageNo: this.page,
        pageSize: e,
        calltype: 3,
        state: 1,
        level: this.formItem.iclevelname.join(","), // 意向标签
        "ztCustomerTm.mobilephone": this.formItem.phone, // 联系电话
        // isread: this.formItem.isread, // 已读/未读
        isread: this.formItem.isread
          ? this.formItem.isread != "0"
            ? this.formItem.isread
            : ""
          : "", // 已读/未读
        Saleids: this.formItem.saleid, // 数据id
        taskname: this.formItem.taskname, // 任务名称
        closeresult: this.formItem.closeresult, // 拨打结果
        minCallTime: this.formItem.sTimeSmall,
        maxCallTime: this.formItem.sTimeLong,
        stime: this.formItem.stime ? this.formatDate(this.formItem.stime) : "",
        etime: this.formItem.etime ? this.formatDate(this.formItem.etime) : ""
      };
      this.getSaleData(data);
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
    // 修改意向标签
    updateIcLevel(e) {
      let data = {
        saledataid: this.formDatas.saleid,
        levelid: e
      };
      updateSaleDateIcLevel(data).then(res => {
        if (res.code == "10000") {
          this.$Message.success({
            top: 50,
            duration: 3,
            content: "修改意向标签成功"
          });
        } else {
          this.$Message.error({
            top: 50,
            duration: 3,
            content: res.content
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.search {
  background: #219480;
  color: #fff;
  margin-right: 10px;
}
.title {
  font-size: 24px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
.gadLabelBox p {
  line-height: 40px;
  padding-left: 10px;
  font-size: 16px;
  font-family: "Helvetica Neue";
}
.gadLabel {
  width: 100px;
  border-bottom: 1px solid #333;
  text-align: center;
  margin-left: 10px;
  line-height: 57px;
}
.spanRobot {
  background: #36AC85;
  display: inline-block;
  line-height: 40px;
  float: left;
  text-align: left;
  border-radius: 6px;
}
.spanPeo {
  background: #ccc;
  display: inline-block;
  line-height: 40px;
  float: right;
  text-align: right;
  border-radius: 6px;
}
.ivu-form-item {
  margin-bottom: 0;
}
.form .item {
  margin-bottom: 5px;
}
</style>

