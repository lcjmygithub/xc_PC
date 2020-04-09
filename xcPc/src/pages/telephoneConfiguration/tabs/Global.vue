<template>
  <Row :gutter="16">
    <i-col :span="4">
      <Menu
        width="auto"
        @on-select="selectChange"
        style="height:65vh;overflow:auto;"
      >
        <MenuItem
          v-for="(item, index) in cmpRobotVtypeList"
          :key="item.sceneid"
          :name="item.typeid"
          :class="{ 'ivu-menu-item-active': sel }"
          >{{ item.name }}</MenuItem
        >
      </Menu>
    </i-col>
    <i-col :span="20">
      <i-col span="2" offset="22">
        <Button
          @click="addBtn"
          style="background: #219480;color: #fff;"
          type="primary"
          >新增</Button
        >
      </i-col>
      <i-col span="24" style="padding-top:10px;">
        <Table
          border
          :columns="columns12"
          :data="globalAnswer"
          max-height="500"
        >
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
          <template slot="toped">
            <Icon
              type="md-arrow-up"
              style="margin-right: 5px;color:##2d8cf0;font-size:24px"
            />
            <!-- <Button type="text" size="small" @click="remove(index)" style="color:#ff3040">Delete</Button> -->
            <Icon type="md-arrow-down" style="color:##2d8cf0;font-size:24px" />
          </template>
        </Table>
        <!-- <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page
              :total="total"
              :current="page"
              @on-page-size-change="changePageSize"
              @on-change="changePage"
              :page-size="page_Size"
              show-sizer
              show-total
              size="small"
            ></Page>
          </div>
        </div> -->
      </i-col>
    </i-col>
    <!-- 弹窗 -->
    <Drawer
      class="verbalModel"
      title="话术模板全局答案"
      :closable="false"
      v-model="showModel"
      width="500"
    >
      <!-- <Modal v-model="showModel" title="话术模板全局答案" @on-ok="" @on-cancel=""> -->
      <i-col span="24">
        <Form :model="formItem" label-position="right" style="padding:15px">
          <FormItem label="答案类型:" :label-width="100">
            <Select
              @on-change
              placeholder="请选择答案类型"
              v-model="formItem.typeid"
            >
              <Option
                v-for="(item, index) in cmpRobotVtypeList"
                :key="index"
                :value="item.typeid"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="跳转类型" :label-width="100">
            <Select @on-change="selectChanges" v-model="formItem.type">
              <Option
                v-for="(item, index) in typeList"
                :key="index"
                :value="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show1" label="问题内容" :label-width="100">
            <Select @on-change v-model="formItem.hoodleMobileid">
              <Option
                v-for="(item, index) in formItem.question"
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
          <FormItem v-show="shows.show2" label="是否结束" :label-width="100">
            <RadioGroup v-model="formItem.isend">
              <Radio
                v-for="(item, index) in isendList"
                :key="index"
                :label="item.label"
                >{{ item.state }}</Radio
              >
            </RadioGroup>
          </FormItem>
          <FormItem v-show="shows.show3" label="类型" :label-width="100">
            <Select @on-change="selectChanges1" v-model="formItem.ctype">
              <Option
                v-for="(item, index) in qtypeList"
                :key="index"
                :value="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show4" label="场景" :label-width="100">
            <Select
              placeholder="请选择场景"
              @on-change
              v-model="formItem.sceneid"
            >
              <Option
                v-for="(item, index) in sceneList"
                :key="index"
                :value="item.sceneid"
                >{{ item.scene }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show5" label="意图" :label-width="100">
            <Select v-model="formItem.intentionid">
              <Option
                v-for="(item, index) in intentionMainList"
                :key="index"
                :value="item.intentionid"
                >{{ item.intention }}({{ item.identityname }})</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show6" label="短信模板" :label-width="100">
            <Select placeholder="请选择短信模板" v-model="formItem.modelid">
              <Option
                v-for="(item, index) in modelNoteList"
                :key="index"
                :value="item.modelid"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show7" label="服务" :label-width="100">
            <Select placeholder="请选择电话服务" v-model="formItem.onserviceid">
              <Option
                v-for="(item, index) in serviceTableList"
                :key="index"
                :value="item.onserviceid"
                >{{ item.servicecontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show8" label="转号码" :label-width="100">
            <Input v-model="formItem.phone"></Input>
          </FormItem>
          <FormItem v-show="shows.show9" label="回答" :label-width="100">
            <audio
              :src="common.common.upLoadVideoURL + '/' + formItem.src"
              controls
              id
            />
            <Upload
              ref="upload"
              :format="['wav', 'mp3']"
              :on-success="handleSuccess"
              :show-upload-list="false"
              :data="formItem.uploadAudio"
              :on-format-error="handleFormatError"
              :action="
                common.common.baseUrlPort + 'open/uploadFile?dir=robotvoice'
              "
            >
              <Button icon="ios-cloud-upload-outline" class="search"
                >选择文件</Button
              >
            </Upload>
          </FormItem>
          <FormItem v-show="shows.show10" label="备注" :label-width="100">
            <Input
              v-model="formItem.text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
            ></Input>
          </FormItem>
          <FormItem v-show="shows.show11" label="回答" :label-width="100">
            <Input
              v-model="formItem.answer"
              type="textarea"
              placeholder="最大不能超过300个字"
              :autosize="{ minRows: 3, maxRows: 8 }"
              :maxlength="300"
            ></Input>
          </FormItem>
          <FormItem style="text-align: center;">
            <Button
              type="primary"
              style="background: #219480;color: #fff;"
              size="large"
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
  getZtCmpRobotVtypeList,
  getZtCmpRobotGlobalAnswerList,
  deleteZtCmpRobotGlobalAnswerById,
  saveOrUpdateZtCmpRobotGlobalAnswer,
  getZtIntentionMainList,
  getHoodleMobileList,
  getModelNoteList,
  getServiceTable,
  getSave
} from "../../../api/api";
import Vue from "vue";
export default {
  data() {
    return {
      oldSort: [],
      answerList: [],
      sel: false, //默认没选
      formItem: {
        typeid: "", // 答案类型
        type: 1, // 跳转类型
        isend: "", // 是否结束
        intentionid: "", //意图
        ctype: 1, // 文本 语音
        text: "", // 备注
        sceneid: "", // 场景id
        content: "", //
        uploadAudio: {
          src: ""
        },
        src: "", // 录音地址
        onserviceid: "", //服务id
        modelid: "", // 短信模板id
        question: [], // 问题内容
        answer: "", // 回答 富文本
        hoodleMobileid: "", // 问题内容id
        phone: "", // 转号码
        total: 0
      },
      shows: {
        // 显示隐藏
        show1: false, // 问题内容
        show2: false, // 是否结束
        show3: false, // 类型
        show4: false, // 场景
        show5: false, // 意图
        show6: false, // 短信模板
        show7: false, // 服务
        show8: false, // 转号码
        show9: false, // 文件
        show10: false, // 备注
        show11: false // 回答
      },
      modelNoteList: [], // 短信模板列表
      serviceid: "",
      answerid: "",
      robotVtype: "",
      typeid: "",
      showModel: false,
      globalAnswer: [], //全局答案列表
      intentionMainList: [], // 意图列表
      columns12: [
        {
          title: "类型",
          align: "center",
          key: "ztCmpRobotVtype.name",
          render: (h, params) => {
            const name = params.row.ztCmpRobotVtype.name;
            return h("span", {}, name);
          }
        },
        {
          title: "内容",
          align: "center",
          key: "ctype",
          tooltip: true,
          render: (h, params) => {
            const row = params.row;
            if (row.ctype == "2" && row.type == "5") {
              return h("span", row.text);
            } else if (row.ctype == "2" && row.type == "1") {
            } else {
              return h("span", row.showcontent);
            }
          }
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
                      this.showModel = true;
                      console.log(row);
                      console.log(row.type);
                      this.hides();
                      this.answerid = row.answerid;
                      this.formItem.typeid = row.ztCmpRobotVtype.typeid;
                      this.formItem.type = row.type;
                      this.formItem.text = row.text;

                      this.formItem.ctype = Number(
                        row.ctype == "3" ? "1" : row.ctype
                      );
                      if (row.type == "1") {
                        this.shows.show1 = true;
                        this.formItem.hoodleMobileid = Number(row.content);
                      } else if (row.type == "2") {
                        this.shows.show4 = true;
                        this.formItem.sceneid = Number(row.content);
                      } else if (row.type == "3") {
                        this.shows.show7 = true;
                        this.formItem.onserviceid = Number(row.content);
                      } else if (row.type == "4") {
                        this.shows.show6 = true;
                        this.formItem.modelid = Number(row.content);
                      } else if (row.type == "5") {
                        this.formItem.isend = row.isend;
                        this.shows.show2 = true;
                        this.shows.show3 = true;
                        this.shows.show5 = true;
                        this.formItem.intentionid = row.intentionid;
                        console.log(this.formItem.intentionid);
                        if (row.ctype == "1" || row.ctype == "3") {
                          this.shows.show11 = true;
                          this.formItem.answer = row.content;
                        } else {
                          this.shows.show9 = true;
                          this.shows.show10 = true;
                          this.formItem.src = row.content;
                        }
                      } else if (row.type == "6") {
                      } else if (row.type == "7") {
                        this.shows.show8 = true;
                        this.formItem.phone = row.content;
                      }
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
                          "<p>问题一旦删除将无法恢复确定要现在删除吗？</p>",
                        onOk: () => {
                          console.log(row);
                          deleteZtCmpRobotGlobalAnswerById({
                            id: row.answerid
                          }).then(res => {
                            console.log(res);
                            if (res.code == "10000") {
                              this.$Message.success("删除成功");
                              this.getZtCmpRobotGlobalAnswer({
                                serviceid: this.serviceid,
                                "ztCmpRobotVtype.typeid": this.typeid,
                                pageSize: 100
                              });
                            } else {
                              this.$Message.error(res.content);
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
        },
        {
          title: "置顶",
          // slot: "toped",
          slot: "action",
          key: "address",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const index = params.index;
            return h("div", [
              h(
                "Icon",
                {
                  props: {
                    type: "ios-arrow-round-up",
                    size: "35"
                  },
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.sortUp(index);
                    }
                  }
                },
                ""
              ),
              h(
                "Icon",
                {
                  props: {
                    type: "ios-arrow-round-down",
                    size: "35"
                  },
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.sortDown(index);
                    }
                  }
                },
                ""
              )
            ]);
          }
        }
      ],
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
      typeList: [
        // 跳转类型列表
        { value: 1, name: "问题跳转" },
        { value: 2, name: "场景跳转" },
        { value: 3, name: "跳转人工服务" },
        { value: 4, name: "发送短信" },
        { value: 5, name: "回答" },
        { value: 6, name: "流程继续" },
        { value: 7, name: "转号码" }
      ],
      isendList: [
        // 是否结束
        { label: 1, state: "是" },
        { label: "", state: "否" }
      ],
      qtypeList: [
        // 类型
        { value: 1, name: "文本" },
        { value: 2, name: "语音" }
      ],
      serviceTableList: [], // 服务列表
      cmpRobotVtypeList: [] // 全局语境类型
    };
  },
  created() {
    this.getZtCmpRobotVtype();
    this.getZtIntentionMain();
    this.getModelNote();
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      });
    },
    hides() {
      this.shows.show1 = false;
      this.shows.show2 = false;
      this.shows.show3 = false;
      this.shows.show4 = false;
      this.shows.show5 = false;
      this.shows.show6 = false;
      this.shows.show7 = false;
      this.shows.show8 = false;
      this.shows.show9 = false;
      this.shows.show10 = false;
      this.shows.show11 = false;
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    // 获取父组件传的值
    parentMsg(e) {
      this.serviceid = e.onserviceid;
      let data = {
        serviceid: e.onserviceid,
        remark: "",
        sceneid: ""
      };
      getHoodleMobileList(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.formItem.question = res.content;
        }
      });
      getServiceTable({ "ztChannel.channelid": 5 }).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.serviceTableList = res.content;
        }
      });
    },
    // 获取全局语境类型
    getZtCmpRobotVtype() {
      getZtCmpRobotVtypeList().then(res => {
        console.log("全局语境类型");
        console.log(res);
        if (res.code == "10000") {
          this.cmpRobotVtypeList = res.content;
        }
      });
    },
    // 获取全局答案
    getZtCmpRobotGlobalAnswer(data) {
      getZtCmpRobotGlobalAnswerList(data).then(res => {
        console.log("获取全局答案");
        console.log(res);
        if (res.code == "10000") {
          this.globalAnswer = res.content.list;
          this.total = res.content.totalCount;
          /*  this.globalAnswer.forEach(item=>{
            console.log(item.answerid);
            this.answerList.push(item.answerid)
          }) */
          // console.log(this.answerList);
        }
      });
    },
    // 获取短信模板
    getModelNote() {
      let data = {
        variable: 1
      };
      getModelNoteList(data).then(res => {
        console.log("短信模板");
        console.log(res);
        if (res.code == "10000") {
          this.modelNoteList = res.content;
        }
      });
    },
    // 获取意图
    getZtIntentionMain() {
      getZtIntentionMainList().then(res => {
        console.log("意图");
        console.log(res);
        if (res.code == "10000") {
          this.intentionMainList = res.content;
        }
      });
    },
    // 跳转类型监听
    selectChanges(e) {
      console.log(e);
      this.hides();
      if (e == "1") {
        this.shows.show1 = true;
      } else if (e == "2") {
        this.shows.show4 = true;
      } else if (e == "3") {
        this.shows.show7 = true;
      } else if (e == "4") {
        this.shows.show6 = true;
      } else if (e == "5") {
        this.shows.show2 = true;
        this.shows.show3 = true;
        this.shows.show5 = true;

        if (this.formItem.ctype == "1") {
          this.shows.show11 = true;
          this.show.show9 = false;
          this.shows.show10 = false;
        } else {
          this.shows.show11 = false;
          this.shows.show9 = true;
          this.shows.show10 = true;
        }
      } else if (e == "6") {
      } else if (e == "7") {
        this.shows.show8 = true;
      }
    },
    // 文本语音类型监听
    selectChanges1(e) {
      console.log(e);
      if (e == "1") {
        this.shows.show11 = true;
        this.shows.show9 = false;
        this.shows.show10 = false;
      } else {
        this.shows.show11 = false;
        this.shows.show9 = true;
        this.shows.show10 = true;
      }
    },
    // 清空
    removeData() {
      this.answerid = "";
      this.formItem.typeid = "";
      this.formItem.type = 1;
      this.formItem.isend = "";
      this.formItem.intentionid = "";
      this.formItem.ctype = 1;
      this.formItem.text = "";
      this.formItem.content = "";
      this.formItem.uploadAudio = {};
      this.formItem.src = "";
      this.formItem.onserviceid = "";
      this.formItem.modelid = null;
      this.formItem.answer = "";
      this.formItem.hoodleMobileid = "";
      this.formItem.phone = "";
    },
    // 新增按钮
    addBtn() {
      if (!this.serviceid) {
        this.$Message.error("请先选择话术");
        return false;
      }
      this.removeData();
      this.hides();
      this.showModel = true;
      this.shows.show1 = true;
    },
    // 保存按钮
    saveBtn() {
      let that = this;
      let content = "";
      let intentionid = "";
      let isend = "";
      let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
      let telReg = /^([0-9]{3,4})?[0-9]{6,7}$/;
      if (this.formItem.type == "1") {
        content = String(this.formItem.hoodleMobileid);
      } else if (this.formItem.type == "2") {
        content = String(this.formItem.sceneid);
      } else if (this.formItem.type == "3") {
        content = String(this.formItem.onserviceid);
      } else if (this.formItem.type == "4") {
        content = String(this.formItem.modelid);
      } else if (this.formItem.type == "5") {
        content =
          this.formItem.ctype == "1" ? this.formItem.answer : this.formItem.src;
        intentionid = this.formItem.intentionid;
        isend = this.formItem.isend;
      } else if (this.formItem.type == "6") {
      } else if (this.formItem.type == "7") {
        content = this.formItem.phone;
        if (!(phoneReg.test(content) || telReg.test(content))) {
          this.$Message.error("请输入固话或手机");
          return false;
        }
      }
      let texts = this.formItem.text;
      let data = {
        answerid: String(this.answerid),
        serviceid: String(this.serviceid),
        ctype: String(this.formItem.ctype),
        type: String(this.formItem.type),
        ztCmpRobotVtype: {
          typeid: String(this.formItem.typeid)
        },
        content: content,
        text: texts,
        intentionid: intentionid,
        isend: isend
      };
      console.log(data);

      if (!this.formItem.typeid) {
        this.$Message.error("请选择答案类型");
      } else if (!content && this.formItem.type != "6") {
        if (this.formItem.type == "1" && !content) {
          this.$Message.error("问题内容不能为空");
        } else if (this.formItem.type == "2" && !content) {
          this.$Message.error("场景不能为空");
        } else if (this.formItem.type == "3" && !content) {
          this.$Message.error("服务不能为空");
        } else if (this.formItem.type == "4" && !content) {
          this.$Message.error("短信模板不能为空");
        } else if (this.formItem.type == "5" && !content) {
          this.$Message.error("回答不能为空");
        } else if (this.formItem.type == "7" && !content) {
          this.$Message.error("手机或座机不能为空");
        }
      } else if (
        this.formItem.type == "5" &&
        this.formItem.ctype == "2" &&
        !texts
      ) {
        this.$Message.error("备注不能为空");
      } else {
        $.ajax({
          type: "post",
          url: saveOrUpdateZtCmpRobotGlobalAnswer,
          data: JSON.stringify(data),
          dataType: "json",
          headers: {
            //请求头
            "Content-Type": "application/json",
            Authorization: this.userInfo.token //这是获取的token
          },
          success: function(res) {
            console.log(res);
            if (res.code == "10000") {
              that.$Message.success("保存成功");
              that.showModel = false;
              that.getZtCmpRobotGlobalAnswer({
                serviceid: that.serviceid,
                "ztCmpRobotVtype.typeid": that.typeid,
                pageSize: 100
              });
            } else {
              that.$Message.error(res.content);
            }
          }
        });
      }
    },
    //
    selectChange(e) {
      /* console.log('change');
      this.isChange=!this.isChange;
      console.log(this.isChange);
      if(this.isChange){

      }else{

      } */

      console.log(e);
      this.typeid = e;

      this.$emit("globalAnswer", e);
      if (!this.serviceid) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请先选择话术"
        });
        return false;
      }
      let data = {
        serviceid: this.serviceid,
        "ztCmpRobotVtype.typeid": e,
        pageSize: 100
      };
      this.getZtCmpRobotGlobalAnswer(data);
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      console.log(response);
      if (response.code == "10000") {
        this.$Message.success("上传成功");
        this.formItem.src = response.content.returnUrl;
      } else {
        this.$Message.error("上传失败,请重试");
      }
    },
    // 上传文件格式报错
    handleFormatError(file) {
      console.log(file);
      this.$Message.error(file.name + "格式不正确，请上传mp3或wav格式的文件");
    },
    // 上移按钮
    sortUp(index) {
      if (index === 0) {
        this.$Message.error("已经是第一个了");
      } else {
        let temp = this.globalAnswer[index - 1];
        Vue.set(this.globalAnswer, index - 1, this.globalAnswer[index]);
        Vue.set(this.globalAnswer, index, temp);
        console.log(this.globalAnswer);
        this.answerList = [];
        this.globalAnswer.forEach(item => {
          this.answerList.push(item.answerid);
        });
        // console.log("移动后");
        // console.log(this.answerList);

        getSave({ ids: this.answerList }).then(res => {
          // console.log("结果");
          // console.log(res);
          if(res.code=='10000'){
          console.log(this.globalAnswer);

          }
        });
      }
    },

    // 下移按钮
    sortDown(index) {
      if (index === this.globalAnswer.length - 1) {
        this.$Message.error("已经是最后一个了");
      } else {
        let i = this.globalAnswer[index + 1];
        Vue.set(this.globalAnswer, index + 1, this.globalAnswer[index]);
        Vue.set(this.globalAnswer, index, i);
        console.log(this.globalAnswer);
        this.answerList = [];
        this.globalAnswer.forEach(item => {
          this.answerList.push(item.answerid);
        });
        // console.log("移动后");
        console.log(this.answerList);

        getSave({ ids: this.answerList }).then(res => {
          // console.log("结果");
          // console.log(res);
          if(res.code=='10000'){
          console.log(this.globalAnswer);

          }
        });
      }
    }
  }
};
</script>
<style>
.verbalModel ul.ivu-select-dropdown-list {
  max-width: 200px !important;
}
.verbalModel {
}
</style>
