<template>
  <Row :gutter="16">
    <i-col :span="4">
      <Menu ref="menus" width="auto" @on-select="getHoodleMobile">
        <!-- 左侧 开场白 了解情况... -->
        <MenuItem
          v-for="(item, index) in sceneList"
          :key="item.sceneid"
          :name="item.sceneid"
        >{{ item.scene }}</MenuItem
        >
      </Menu>
    </i-col>
    <i-col :span="20">
      <Tabs ref="tabs" value="nameson" @on-click="exchange">
        <TabPane
          v-for="(item, index) in question"
          :key="index"
          :hoodleMobileadress="item.hoodleMobileadress"
          :name="'nameson' + (index + 1)"
          :label="item.type == 1 || item.type == 3 ? '文本' : '录音'"
        >
          <Row>
            <i-col span="18">
              <Card>
                <!-- <div v-html="decodeURI(encodeURI(item.hoodleMobileadress))"></div> -->
                <div v-if="item.type == 1 || item.type == 3">
                  <div
                    v-if="item.qtype == 2"
                    v-html="
                      decodeURI(
                        encodeURI(item.showcontent).replace(/[\r\n]/g, '')
                      )
                    "
                  ></div>
                  <div
                    v-else
                    v-html="item.showcontent.replace(/[\r\n]/g, '')"
                  ></div>
                </div>
                <div v-else-if="item.type == 2">
                  <div v-if="item.qtype == 2" v-html="item.showcontent"></div>
                  <div v-else v-html="item.remark"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="2" offset="4">
              <Button @click="addQuestion(item)" class="search" type="primary"
              >新增问题</Button
              >
              <div
                style="color:#219480;font-weight:bold;font-size:22px;"
              >
                <Icon
                  style="cursor: pointer"
                  @click="editorQuestion(item)"
                  type="ios-create-outline"
                />
                <Icon
                  style="cursor: pointer;"
                  @click="deleteQuestion(item.hoodleMobileid)"
                  type="ios-trash-outline"
                />
              </div>
            </i-col>
            <i-col
              v-show="item.type == 1 || item.type == 3 ? false : true"
              span="18"
            >
              <Card>
                <audio
                  :src="
                    common.common.upLoadVideoURL + '/' + item.hoodleMobileadress
                  "
                  controls="controls"
                ></audio>
              </Card>
            </i-col>
          </Row>

          <!-- 新增回答 下面 -->
          <i-col style="margin-top: 10px" span="2" offset="22">
            <Button
              @click="
                addAnswer(
                  item.hoodleMobileid,
                  item.type == 2
                    ? item.qtype == 2
                      ? item.showcontent
                      : item.remark
                    : item.showcontent
                )
              "
              type="primary"
              class="search"
            >新增回答</Button
            >
          </i-col>
          <i-col span="24" style="padding-top:10px;">
            <Table
              border
              :columns="columns12"
              :data="data6[index]"
              max-height="350"
            >
              <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="show(index)"
                >View</Button
                >
                <Button type="error" size="small" @click="remove(index)"
                >Delete</Button
                >
              </template>
            </Table>
          </i-col>
        </TabPane>
        <Button @click="addQuestion" class="search" type="primary"
        >新增问题</Button
        >
      </Tabs>
    </i-col>

    <!-- 弹窗1 -->
    <Drawer
      :title="addTitle"
      :closable="false"
      v-model="showModel"
      width="500"
      style="padding:15px"
    >
      <i-col span="24">
        <Form :model="formItem" label-position="right" style="padding:15px">
          <FormItem label="场景" :label-width="100">
            <Select @on-change v-model="formItem.sceneid">
              <Option value="1">开场白</Option>
              <Option value="2">了解情况</Option>
              <Option value="3">邀约语境</Option>
              <Option value="4">结束语境</Option>
              <Option value="5">挽留</Option>
              <Option value="6">多轮会话</Option>
            </Select>
          </FormItem>
          <FormItem label="类型" :label-width="100">
            <Select @on-change="selectChange" v-model="formItem.type">
              <Option value="1">文本</Option>
              <Option value="2">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="是否可打断" :label-width="100">
            <RadioGroup v-model="formItem.interrupt">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="shows.show1" label="问题" :label-width="100">
            <audio
              :src="common.common.upLoadVideoURL + '/' + formItem.src"
              controls
              id
            />
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['wav', 'mp3']"
              :on-success="handleSuccess"
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
          <FormItem label="问题类型" :label-width="100">
            <Select @on-change="selectChange2" v-model="formItem.qtype">
              <Option value="1">普通问题</Option>
              <Option value="2">变量问题</Option>
            </Select>
          </FormItem>
          <FormItem v-show="shows.show4" :label-width="100">
            <div>
              <div
                @click="clickVariate"
                v-for="(item, index) in customerItemList"
                :key="item.COLUMN_NAME"
                class="searchbtn"
                :types="item.type"
                contenteditable="false"
                :COLUMN_NAME="item.COLUMN_NAME"
              >
                {{ item.COLUMN_COMMENT }}
              </div>
            </div>
          </FormItem>
          <FormItem v-show="shows.show2" label="问题内容" :label-width="100">
            <Input
              v-show="shows.show5"
              v-model="formItem.answer_text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
              :maxlength="200"
            ></Input>
            <div
              v-show="shows.show6"
              class="ivu-input answer_div searchbtnBox"
              maxlength="200"
              style="height:auto;min-height: 50px"
              v-html="formItem.answer_div"
              @input="onDivInput($event)"
              contenteditable="true"
            ></div>
          </FormItem>
          <!-- <FormItem v-show="shows.show3" label="备注" :label-width="100">
            <Input
              v-show="shows.show7"
              v-model="formItem.remark_text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
            ></Input>
            <div
              v-show="shows.show8"
              class="ivu-input remark_div searchbtnBox"
              maxlength="200"
              style="height:auto;min-height: 50px"
              v-html="formItem.remark_div"
              @input="onDivInputs($event)"
              contenteditable="true"
            ></div>
          </FormItem>-->
          <FormItem v-show="shows.show3" label="备注" :label-width="100">
            <Input
              v-show="shows.show7"
              v-model="formItem.remark_text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
            ></Input>
            <div
              v-show="shows.show8"
              class="ivu-input remark_div searchbtnBox"
              maxlength="200"
              style="height:auto;min-height: 50px"
              v-html="formItem.remark_div"
              @input="onDivInputs($event)"
              contenteditable="true"
            ></div>
          </FormItem>
          <FormItem style="text-align: center;">
            <Button
              type="primary"
              class="search"
              size="large"
              @click="saveQuestion"
            >确定</Button
            >
          </FormItem>
        </Form>
      </i-col>
    </Drawer>

    <!-- 弹窗2 -->
    <Drawer
      :title="addAns"
      :closable="false"
      v-model="showModel2"
      width="500"
      style="padding:15px"
    >
      <i-col span="24">
        <Form :model="formItem" label-position="right" style="padding:15px">
          <FormItem label="问题名称" :label-width="100">
            <Input disabled v-model="formItem2.question"></Input>
          </FormItem>
          <FormItem label="态度" :label-width="100">
            <Select
              :disabled="disabled"
              @on-change="selectChange3"
              v-model="formItem2.attitude"
            >
              <Option value="1">肯定</Option>
              <Option value="2">否定</Option>
              <Option value="3">拒绝</Option>
              <Option value="4">特殊1</Option>
              <Option value="8">特殊2</Option>
              <Option value="9">特殊3</Option>
              <Option value="10">特殊4</Option>
              <Option value="5">其他</Option>
            </Select>
          </FormItem>
          <FormItem v-show="shows.show16" label="关键字" :label-width="100">
            <div>
              <Input style="width:60%" v-model="formItem2.specialwords"></Input>
              <Input
                type="number"
                style="width:25%"
                v-model="formItem2.important"
              ></Input>
              <Icon
                @click="addKeywords"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </div>
            <!--  -->
            <div v-show="shows.show9">
              <div v-for="(item, index) in keywordList" :key="index">
                <Input
                  style="width:60%"
                  v-model="keywordList[index].specialwords"
                ></Input>
                <Input
                  type="number"
                  style="width:25%"
                  v-model="keywordList[index].important"
                ></Input>
                <Icon
                  @click="removeKeywords(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </div>
            </div>
          </FormItem>
          <FormItem label="正则匹配" :label-width="100">
            <div>
              <Input style="width:86%" v-model="formItem2.regwords"></Input>
              <Icon
                @click="addRegwords"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </div>
            <div v-show="shows.show10">
              <div v-for="(item, index) in regexList" :key="index">
                <Input style="width:86%" v-model="regexList[index]"></Input>
                <Icon
                  @click="removeRegwords(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </div>
            </div>
          </FormItem>
          <FormItem label="客户属性" :label-width="100">
            <Select
              placeholder
              v-model="formItem2.attributeid"
              multiple
              filterable
            >
              <Option
                v-for="item in attributeidList"
                :value="item.attributeid"
                :key="item.attributeid"
              >{{ item.attribute }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="跳转类型" :label-width="100">
            <Select @on-change="selectChange4" v-model="formItem2.type">
              <Option value="1">问题跳转</Option>
              <Option value="2">场景跳转</Option>
              <Option value="3">跳转人工服务</Option>
              <Option value="4">发送短信</Option>
              <Option value="5">流程继续</Option>
              <Option value="6">转号码</Option>
              <Option value="7">交接</Option>
            </Select>
          </FormItem>
          <FormItem v-show="shows.show15" label="转号码" :label-width="100">
            <Input type="number" v-model="formItem2.mobile"></Input>
          </FormItem>
          <FormItem v-show="shows.show12" label="场景" :label-width="100">
            <Select @on-change v-model="formItem2.sceneid">
              <Option value="1">开场白</Option>
              <Option value="2">了解情况</Option>
              <Option value="3">邀约语境</Option>
              <Option value="4">结束语境</Option>
              <Option value="5">挽留</Option>
              <Option value="9">多轮会话</Option>
            </Select>
          </FormItem>
          <FormItem v-show="shows.show13" label="服务" :label-width="100">
            <Select
              placeholder="请选择电话服务"
              v-model="formItem2.onserviceid"
            >
              <Option
                v-for="(item, index) in serviceTableList"
                :key="index"
                :value="item.onserviceid"
              >{{ item.servicecontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show14" label="短信模板" :label-width="100">
            <Select placeholder="请选择短信模板" v-model="formItem2.modelid">
              <Option
                v-for="(item, index) in modelNoteList"
                :key="index"
                :value="item.modelid"
              >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show11" label="问题内容" :label-width="100">
            <Select
              placement="bottom-end"
              placeholder="请选择问题"
              @on-change="selectChange2"
              v-model="formItem2.hoodleMobileid"
            >
              <Option
                v-for="(item, index) in hoodleMobileList"
                :key="index"
                :value="item.hoodleMobileid"
                style="width:370px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;"
              >
                {{
                item.type == 1 || item.type == 3
                ? item.hoodleMobileadress
                : item.remark
                }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="答案得分" :label-width="100">
            <Input
              type="number"
              v-model="formItem2.score"
              placeholder="请输入得分"
            ></Input>
          </FormItem>
          <FormItem style="text-align: center;">
            <Button
              type="primary"
              class="search"
              size="large"
              @click="saveAnswer"
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
    getSceneList,
    getHoodleMobileList,
    getHoodleMobileAnswerList,
    getCustomerItemList,
    deleteHoodleMobile,
    saveOrUpdateHoodleMobile,
    deleteHoodleMobileAnswer,
    saveOrUpdateHoodleMobileAnswer,
    getZtCustomerAttrList,
    getModelNoteList,
    getServiceTable
  } from "../../../api/api";
  import Vue from "vue";
  export default {
    data() {
      return {
        // 问题类型列表
        hoodleMobileList: [],
        addAns: "新增答案", //新增答案 or 编辑答案
        addTitle: "新增问题", // 新增问题 or 编辑问题
        arrList: [],
        sceneids: "",
        formItem: {
          hoodleMobileid: "",  //问题id
          hoodleMobileadress: "", //
          sceneid: "", // 场景id
          type: "1", // 1为文本 2为录音
          qtype: "1", // 1为普通问题 2为变量问题
          showcontent: "", //
          interrupt: "0", // 是否可打断 1为是 0为否
          uploadAudio: {},
          src: "",
          answer_text: "", // 问题内容-富文本
          answer_div: "", // 问题内容-div
          remark_text: "", // 备注-富文本
          remark_div: "" // 备注-div
        },
        disabled: false, // 是否可编辑
        formItem2: {
          question: "", // 问题名称
          score: "", // 得分
          type: "1", // 跳转类型
          attitude: "", // 态度id
          attributeid: [], // 客户属性id
          modelid: "", // 短信模板id
          mobile: "", // 号码
          specialwords: "", // 关键字
          important: "", // 权重
          regwords: "", // 正则匹配
          hoodleMobileid: "", // 问题内容
          hoodleMobileids: "", // 问题id
          attrids: [], // 客户属性
          onserviceid: "", // 服务id
          sceneid: "", // 场景id
          hoodleMobileAnswerid: "" // 答案id
        },
        keywordList: [], // 关键字列表
        regexList: [], // 正则匹配列表
        attributeidList: [], // 客户属性列表
        showModel: false, // 弹窗1
        showModel2: false, // 弹窗2
        serviceid: "",
        customerItemList: [], // 变量列表
        modelNoteList: [], // 短信模板列表
        serviceTableList: [], // 服务列表
        sceneList: [
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
            sceneid: 6,
            scene: "多轮会话"
          }
        ],
        question: [], // 问题列表
        columns12: [
          {
            title: "态度",
            key: "attitude",
            render: (h, params) => {
              const attitude = params.row.attitude;
              if (attitude == "1") {
                return h("span", "肯定");
              } else if (attitude == "2") {
                return h("span", "否定");
              } else if (attitude == "3") {
                return h("span", "拒接");
              } else if (attitude == "4") {
                return h("span", "特殊1");
              } else if (attitude == "5") {
                return h("span", "其他");
              } else if (attitude == "8") {
                return h("span", "特殊2");
              } else if (attitude == "9") {
                return h("span", "特殊3");
              } else if (attitude == "10") {
                return h("span", "特殊4");
              }
            }
          },
          {
            title: "跳转类型",
            key: "type",
            render: (h, params) => {
              const type = params.row.type;
              if (type == "1") {
                return h("span", "问题跳转");
              } else if (type == "2") {
                return h("span", "场景跳转");
              } else if (type == "3") {
                return h("span", "转人工服务");
              } else if (type == "4") {
                return h("span", "发送短信");
              } else if (type == "5") {
                return h("span", "流程继续");
              } else if (type == "6") {
                return h("span", "转号码");
              } else if (type == "7") {
                return h("span", "交接");
              }
            }
          },
          {
            title: "内容",
            ellipsis: true,
            key: "nextHoodleMobileRemark"
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
                        this.addAns = "编辑答案";
                        console.log("编辑");
                        this.disabled = true;
                        this.showModel2 = true;
                        console.log(row);
                        this.removeData2();
                        this.hides2();
                        this.shows.show11 = false;
                        this.formItem2.question = "";
                        this.formItem2.hoodleMobileAnswerid =
                          row.hoodleMobileAnswerid; // 答案id
                        this.formItem2.question = row.remark; // 问题名称
                        this.formItem2.attitude = String(row.attitude); // 态度
                        this.formItem2.score = row.score; // 得分
                        this.formItem2.attributeid = row.attrids
                          .split(",")
                          .map(Number); // 客户属性
                        this.formItem2.type = String(row.type); // 跳转类型
                        if (row.attitude == "5") {
                          this.shows.show16 = false;
                        }
                        let keywords = [];
                        keywords = row.specialwords.split(","); // 关键字
                        // keywords = this.notemptyArr(row.specialwords.split(",")); // 关键字
                        for (let i = 0; i < keywords.length; i++) {
                          if (keywords.length > 1) {
                            this.shows.show9 = true;
                          }
                          if (i == 0) {
                            this.formItem2.specialwords = keywords[0].split(
                              "$"
                            )[0];
                            this.formItem2.important = keywords[0].split("$")[1];
                          } else {
                            this.keywordList.push({
                              specialwords: keywords[i].split("$")[0],
                              important: keywords[i].split("$")[1]
                            });
                          }
                        }
                        let regexs = [];
                        regexs = row.regwords.split(","); // 正则匹配
                        for (let j = 0; j < regexs.length; j++) {
                          if (regexs.length > 1) {
                            this.shows.show10 = true;
                          }
                          if (j == 0) {
                            this.formItem2.regwords = regexs[0];
                          } else {
                            this.regexList.push(regexs[j]);
                          }
                        }

                        if (row.type == "1") {
                          this.shows.show11 = true;
                          this.formItem2.hoodleMobileid = row.hoodleMobileid;
                        } else if (row.type == "2") {
                          this.shows.show12 = true;
                          this.formItem2.sceneid = String(row.scene.scenid);
                        } else if (row.type == "3") {
                          this.shows.show13 = true;
                          this.formItem2.onserviceid = row.serviceid;
                        } else if (row.type == "4") {
                          this.shows.show14 = true;
                          this.formItem2.modelid = row.modelid;
                        } else if (row.type == "6") {
                          this.shows.show15 = true;
                          this.formItem2.mobile = row.mobile;
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
                        console.log(row);

                        this.$Modal.confirm({
                          title: "确认删除",
                          content: "<p>确定要删除吗？</p>",
                          onOk: () => {
                            console.log(row);
                            deleteHoodleMobileAnswer({
                              id: row.hoodleMobileAnswerid
                            }).then(res => {
                              console.log(res);
                              if (res.code == "10000") {
                                let that = this;
                                this.$Message.success("删除成功");
                                this.getHoodleMobileLists({
                                  serviceid: this.serviceid,
                                  remark: "",
                                  sceneid: this.sceneids
                                });
                                console.log("222");
                                console.log(row.hoodleMobileid);
                                // that.getHoodleMobileAnswer(
                                //   row.hoodleMobileids
                                // );
                              } else {
                                this.$Message.error({
                                  top: 50,
                                  duration: 3,
                                  content: res.content
                                });
                              }
                            });
                          },
                          onCancel: () => {}
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
        data6: [],
        shows: {
          show1: false, // 问题-录音
          show2: true, // 问题内容
          show3: false, // 备注
          show4: false, // 变量
          show5: true, // 问题内容-富文本
          show6: false, // 问题内容-div
          show7: true, // 备注-富文本
          show8: false, // 备注-div

          show9: false, // 关键字-新增
          show10: false, // 正则匹配
          show11: true, // 问题内容
          show12: false, // 场景
          show13: false, // 服务
          show14: false, // 短信模板
          show15: false, // 转号码
          show16: true // 关键字
        },
        shops: ""
      };
    },
    created() {
      this.getCustomerItem();
      this.getZtCustomerAttr();
      this.getServiceTableList();
      this.getModelNote();
    },
    methods: {
      show(index) {
        this.$Modal.info({
          title: "User Info",
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        });
      },
      onDivInput(e) {
        this.formItem.answer_div = decodeURI(encodeURI(e.target.innerHTML));
      },
      onDivInputs(e) {
        this.formItem.remark_div = decodeURI(encodeURI(e.target.innerHTML));
      },
      // 编辑问题按钮
      editorQuestion(e) {
        this.addTitle = "编辑问题";
        this.hides();
        this.removeData();
        this.showModel = true;
        this.formItem.hoodleMobileid = e.hoodleMobileid;
        this.formItem.qtype = String(e.qtype); // 1为普通问题 2为变量问题
        this.formItem.type = e.type == "3" ? "1" : String(e.type); // 1和3为文本 2为语音
        this.formItem.interrupt = String(e.interrupt); // 是否可打断
        this.formItem.sceneid = String(e.sceneid); // 场景id
        console.log(e);
        if (e.type == "1" || e.type == "3") {
          // 文本
          this.shows.show2 = true;
          if (e.qtype == "1") {
            // 普通问题
            this.shows.show5 = true;

            this.formItem.answer_text = e.showcontent;
          } else {
            this.shows.show5 = false;
            this.shows.show4 = true;
            this.shows.show6 = true;

            this.formItem.answer_div = decodeURI(encodeURI(e.showcontent));
          }
        } else if (e.type == "2") {
          // 语音
          this.shows.show1 = true;
          this.shows.show2 = false;
          this.shows.show3 = true;
          this.formItem.src = this.getCaption(e.hoodleMobileadress, "robotvoice");
          if (e.qtype == "1") {
            this.shows.show7 = true;
            this.formItem.remark_text = decodeURI(encodeURI(e.remark));
          } else {
            this.shows.show4 = true;
            this.shows.show7 = false;
            this.shows.show8 = true;
            this.formItem.remark_div = decodeURI(encodeURI(e.showcontent));
          }
        }
      },

      // 默认配置
      hides() {
        this.shows.show1 = false;
        this.shows.show2 = true;
        this.shows.show3 = false;
        this.shows.show4 = false;
        this.shows.show5 = true;
        this.shows.show6 = false;
        this.shows.show7 = true;
        this.shows.show8 = false;
      },
      // 默认配置2
      hides2() {
        this.shows.show9 = false;
        this.shows.show10 = false;
        this.shows.show11 = true;
        this.shows.show12 = false;
        this.shows.show13 = false;
        this.shows.show14 = false;
        this.shows.show15 = false;
        // this.shows.show16 = true;
      },
      // 清空问题数据
      removeData() {
        this.formItem.sceneid = "";
        this.formItem.type = "1";
        this.formItem.qtype = "1";
        this.formItem.interrupt = "0";
        // this.formItem.src = "0";
        this.formItem.answer_text = "";
        this.formItem.answer_div = "";
        this.formItem.remark_text = "";
        this.formItem.remark_div = "";
      },
      // 清空答案数据
      removeData2() {
        // this.formItem2.question = "";
        this.formItem2.score = "";
        this.formItem2.type = "";
        this.formItem2.attitude = "";
        this.formItem2.attributeid = [];
        this.formItem2.modelid = "";
        this.formItem2.specialwords = "";
        this.formItem2.important = "";
        this.formItem2.regwords = "";
        this.formItem2.hoodleMobileid = "";
        this.formItem2.attrids = "";
        this.formItem2.onserviceid = "";
        this.keywordList = [];
        this.regexList = [];
      },
      // 文本或录音
      selectChange(e) {
        console.log(e);
        if (e == "1") {
          this.shows.show2 = true;
          this.shows.show3 = false;
          this.shows.show1 = false;
        } else {
          this.shows.show2 = false;
          this.shows.show3 = true;
          this.shows.show1 = true;
        }
      },
      // 问题类型
      selectChange2(e) {
        console.log("-------------------")
        console.log(e);
        if (e == "1") {
          this.shows.show4 = false;
          this.shows.show5 = true;
          this.shows.show6 = false;
          this.shows.show7 = true;
          this.shows.show8 = false;
        } else {
          this.shows.show4 = true;
          this.shows.show5 = false;
          this.shows.show6 = true;
          this.shows.show7 = false;
          this.shows.show8 = true;
        }
      },
      // 态度
      selectChange3(e) {
        console.log(e);
        if (e == "5") {
          this.shows.show16 = false;
        } else {
          this.shows.show16 = true;
        }
      },
      // 跳转类型
      selectChange4(e) {
        console.log("跳转类型");
        console.log(e);
        this.type = e;
        this.hides2();
        this.shows.show11 = false;
        if (e == "1") {
          this.shows.show11 = true;
        } else if (e == "2") {
          this.shows.show12 = true;
        } else if (e == "3") {
          this.shows.show13 = true;
        } else if (e == "4") {
          this.shows.show14 = true;
        } else if (e == "6") {
          this.shows.show15 = true;
        }
      },

      // 删除问题按钮
      deleteQuestion(e) {
        console.log(e);
        this.$Modal.confirm({
          title: "确认删除",
          content: "<p>问题一旦删除将无法恢复确定要现在删除吗？</p>",
          onOk: () => {
            let data = {};
            deleteHoodleMobile({ id: e }).then(res => {
              console.log(res);
              if (res.code == "10000") {
                let that = this;
                this.$Message.success("删除成功");
                this.getHoodleMobileLists({
                  serviceid: this.serviceid,
                  remark: "",
                  sceneid: this.sceneids
                });
              } else {
                this.$Message.error({
                  top: 50,
                  duration: 3,
                  content: res.content
                });
              }
            });
          },
          onCancel: () => {}
        });
      },
      // 新增问题按钮  /**************************/
      addQuestion(e) {
        this.addTitle = "新增问题";
        this.hides();
        this.removeData();
        this.showModel = true;
        console.log("-------------e.sceneid--------------");
        console.log(e);
        console.log(e.sceneid);
        console.log(this.formItem.sceneid);
        if (!this.serviceid) {
          this.$Message.error("请先选择话术");
          this.showModel = false;
        } else if (this.sceneids == "") {
          this.$Message.error("请先选择场景");
          this.showModel = false;
        } else if (e.sceneid) {
          this.formItem.sceneid = String(e.sceneid);
        } else {
          e.sceneid = 9;
          this.formItem.sceneid = String(e.sceneid);
        }
      },

      // 点击添加变量
      clickVariate(e) {
        console.log(e);
        // if (this.formItem.type == "1") {

        this.formItem.answer_div += e.target.outerHTML;
        // } else {
        this.formItem.remark_div += e.target.outerHTML;
        // }
      },
      // 保存问题
      saveQuestion() {
        console.log("this---------------------------------this")
        console.log(this)
        let that = this;
        let answerDiv = $(".answer_div");
        let remarkDiv = $(".remark_div");

        let cont = ""; //
        let reMarkCont = ""; //
        let varRemark = ""; //
        let reMarkURL = ""; //

        let answer_text = this.formItem.answer_text; // 问题内容-富文本
        let answer_div = this.formItem.answer_div; // 问题内容-div
        let remark_text = this.formItem.remark_text; // 备注-富文本
        let remark_div = this.formItem.remark_div; // 备注-div

        cont = answer_div.replace(/&nbsp;/g, "");
        reMarkCont = remark_div.replace(/&nbsp;/g, "").replace(/\s+/g, "");

        let hoodleMobileadress = "";
        if (this.formItem.type == "1") {
          if (this.formItem.qtype == "1") {
            hoodleMobileadress = answer_text;
          } else {
            hoodleMobileadress = answer_div;
          }
        }
        if (this.formItem.type == "2") {
          if (this.formItem.qtype == "1") {
            hoodleMobileadress = this.formItem.src;
          } else {
            hoodleMobileadress = remark_div;
          }
        }

        // for (let i = 0; i < answerDiv.find(".searchbtn").length; i++) {
        //   var htmls = answerDiv.find(".searchbtn").eq(i).prop("outerHTML");
        //   var texts = answerDiv.find(".searchbtn").eq(i).text();
        //   var engName = answerDiv.find(".searchbtn").eq(i).attr("COLUMN_NAME");
        //   var types = answerDiv.find(".searchbtn").eq(i).attr("types");
        //   cont = cont.replace(htmls,"{" + texts + "#" + types + "#" + engName + "}");
        // }

        // if (this.formItem.type == "2") {
        //   for (let i = 0; i < remarkDiv.contents().length; i++) {
        //     if (remarkDiv.contents().eq(i).get(0).nodeType == 3) {
        //       varRemark = varRemark + remarkDiv.contents().eq(i).text().replace(/&nbsp;/g, "");
        //     }
        //     if (remarkDiv.contents().eq(i).get(0).nodeType == 1) {
        //       if (remarkDiv.contents().eq(i).attr("class") == "searchbtn") {
        //         var htmls = remarkDiv.contents().eq(i).prop("outerHTML");
        //         var texts = remarkDiv.contents().eq(i).text();
        //         var engName = remarkDiv.contents().eq(i).attr("COLUMN_NAME");
        //         var types = remarkDiv.contents().eq(i).attr("types");
        //         varRemark = varRemark + "{" + texts + "#" + types + "#" + engName + "}";
        //         reMarkURL = reMarkURL + "{" + texts + "#" + types + "#" + engName + "}";
        //       }
        //     }

        //     if (remarkDiv.contents().eq(i).get(0).nodeType == 3 && remarkDiv.contents().eq(i).text().replace(/\s|\xA0/g, "") != "") {
        //       if (!this.formItem.src) {
        //         this.$Message.error("请检查是否上传语音");
        //         return false;
        //       } else {
        //         reMarkURL = reMarkURL + this.formItem.src;
        //       }
        //     }
        //   }
        //   varRemark = varRemark.replace(/\s+/g, "");
        //   reMarkURL = reMarkURL.replace(/\s+/g, "");
        // }

        // if (this.formItem.type == "1") {
        //   reMarkURL = this.formItem.qtype == 1 ? answer_text : this.removeHTMLTag(cont);
        // }
        console.log(reMarkURL);
        console.log(hoodleMobileadress);
        console.log(this.formItem.type);
        console.log(this.formItem.qtype);

        let data = {
          hoodleMobileid: String(this.formItem.hoodleMobileid),
          hoodleMobileadress: hoodleMobileadress,
          sceneid: this.formItem.sceneid,
          serviceid: String(this.serviceid),
          // remark:
          //   this.formItem.type == "2"
          //     ? this.formItem.qtype == "1"
          //       ? remark_text
          //       : varRemark
          //     : "",
          remark:
            this.formItem.type == "2"
              ? this.formItem.qtype == "1"
              ? remark_text
              : "测试变量文本"
              : "",
          type: this.formItem.type,
          qtype: this.formItem.qtype,
          showcontent:
            this.formItem.type == "1"
              ? this.formItem.qtype == "1"
              ? answer_text
              : answer_div
              : this.formItem.qtype == "1"
              ? remark_text
              : remark_div,
          interrupt: this.formItem.interrupt
        };
        console.log("新增问题data。。。。。。。。。。。。。。。")
        console.log(data)

        if (!this.serviceid) {
          this.$Message.error("请先选择话术");
        } else if (!this.formItem.sceneid) {
          this.$Message.error("请选择场景");
        } else if (this.formItem.type == "2" && !data.hoodleMobileadress) {
          this.$Message.error("请上传语音文件");
        } else if (
          (this.formItem.type == "1" &&
            (this.formItem.qtype == "1" ? answer_text : answer_div) == "") ||
          (this.formItem.type == "2" &&
            (this.formItem.qtype == "1" ? remark_text : remark_div) == "")
        ) {
          this.$Message.error("请填写问题内容或备注");
        } else {
          console.log("wowowowowoowo")
          console.log(data);
          $.ajax({
            type: "post",
            url: saveOrUpdateHoodleMobile,
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
                that.getHoodleMobileLists({
                  serviceid: that.serviceid,
                  remark: "",
                  sceneid: that.sceneids
                });
                that.showModel = false;
              } else {
                that.$Message.error(res.content);
              }
            }
          });
        }
      },
      // 新增答案按钮
      addAnswer(hoodleMobileid, question) {
        this.addAns = "新增答案";
        console.log(hoodleMobileid, question);
        this.formItem2.hoodleMobileids = hoodleMobileid;
        console.log("iiiiiiiiiiiiiiddddddddddddddddddd")
        console.log(this.formItem2.hoodleMobileids);

        this.formItem2.question = question;
        this.disabled = false;
        this.showModel2 = true;
        this.removeData2();
        this.hides2();
      },
      // 保存答案
      saveAnswer() {
        console.log(this.formItem2.hoodleMobileids);
        let that = this;
        let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/; //电话
        let telReg = /^([0-9]{3,4})?[0-9]{6,7}$/; //座机
        let specialwords = ""; // 关键字
        let regwords = ""; // 正则匹配
        let attrids = ""; // 客户属性
        if (this.formItem2.attitude == "5") {
          specialwords = "";
        } else {
          let key_01 =
            this.formItem2.specialwords +
            (this.formItem2.important ? "$" + this.formItem2.important : "");
          let keywordLists = [];
          keywordLists = this.keywordList;
          let keywordsArray = []; //
          let key_03 = "";
          for (let i = 0; i < keywordLists.length; i++) {
            let key_02 =
              keywordLists[i].specialwords +
              (keywordLists[i].important ? "$" + keywordLists[i].important : "");
            keywordsArray.push(key_02);
          }
          if (this.notemptyArr(keywordsArray).length) {
            key_03 = this.notemptyArr(keywordsArray).join(",");
          }
          console.log(keywordsArray);
          specialwords = key_01 + (key_03 ? "," + key_03 : "");
        }
        let regex_01 = "";
        if (this.notemptyArr(this.regexList).length) {
          regex_01 = this.notemptyArr(this.regexList).join(",");
        }
        regwords = this.formItem2.regwords + (regex_01 ? "," + regex_01 : "");
        attrids = this.formItem2.attributeid.join(",");

        let data = {
          hoodleMobileAnswerid: this.formItem2.hoodleMobileAnswerid,
          hoodleMobileid: this.formItem2.hoodleMobileids,
          attrids: attrids,
          attitude: this.formItem2.attitude,
          type: this.formItem2.type,
          nextHoodleMobileid:
            this.formItem2.type == "1" ? this.formItem2.hoodleMobileid : "",
          scene: {
            scenid: this.formItem2.type == "2" ? this.formItem2.sceneid : ""
          },
          serviceid: this.formItem2.type == "2" ? this.formItem2.onserviceid : "",
          modelid: this.formItem2.modelid,
          specialwords: specialwords,
          score: this.formItem2.score,
          mobile: this.formItem2.mobile,
          regwords: regwords,
          answerLinks: []
        };

        console.log("--------------------data------------------");
        console.log(data);
        console.log(this.hoodleMobileid)
        if (this.formItem2.type == "1") {
          if (!this.formItem2.hoodleMobileid) {
            this.$Message.error("请选择跳转问题");
            return false;
          }
        } else if (this.formItem2.type == "2") {
          if (!this.formItem2.sceneid) {
            this.$Message.error("请选择跳转场景");
            return false;
          }
        } else if (this.formItem2.type == "3") {
          if (!this.formItem2.onserviceid) {
            this.$Message.error("请选择跳转电话服务");
            return false;
          }
        } else if (this.formItem2.type == "4") {
          if (!this.formItem2.modelid) {
            this.$Message.error("请选择短信模板");
            return false;
          }
        } else if (this.formItem2.type == "6") {
          if (
            !(phoneReg.test(this.formItem2.mobile) || telReg.test(this.formItem2))
          ) {
            this.$Message.error("请输入固话或手机");
            return false;
          }
        } else if (!this.formItem2.type) {
          this.$Message.error("请选择跳转类型");
          return false;
        }
        console.log("saveOrUpdateHoodleMobileAnswer");

        $.ajax({
          type: "post",
          url: saveOrUpdateHoodleMobileAnswer,
          data: JSON.stringify(data),
          dataType: "json",
          headers: {
            //请求头
            "Content-Type": "application/json",
            Authorization: this.userInfo.token //这是获取的token
          },
          success: function(res) {
            if (res.code == "10000") {
              console.log("-------------------------");
              console.log(res);
              // console.log(res.content);
              //  that.formItem2 = res.content;
              that.$Message.success("保存成功");
              that.showModel2 = false;
              // res.content.type= this.type;
              // console.log(res.content.type);

              that.getHoodleMobileLists({
                serviceid: that.serviceid,
                remark: "",
                sceneid: that.sceneids
              });

              console.log(data.hoodleMobileid);

              // this.getHoodleMobileAnswer(data.hoodleMobileid);
            } else {
              that.$Message.error(res.content);
            }
          }
        });
      },

      // 获取客户属性
      getZtCustomerAttr() {
        getZtCustomerAttrList({ pageNo: -1 }).then(res => {
          console.log("客户属性");
          console.log(res);
          if (res.code == "10000") {
            this.attributeidList = res.content.list;
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
      // 获取服务
      getServiceTableList() {
        getServiceTable({ "ztChannel.channelid": 5 }).then(res => {
          if (res.code == "10000") {
            console.log(res);
            this.serviceTableList = res.content;
          }
        });
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
      // 添加关键字
      addKeywords() {
        this.keywordList.push({
          specialwords: "",
          important: ""
        });
        console.log(this.keywordList);
        this.shows.show9 = true;
      },
      // 移除关键字
      removeKeywords(e) {
        console.log(e);
        this.keywordList.splice(e, 1);
        console.log(this.keywordList);
      },
      // 添加正则匹配
      addRegwords() {
        this.regexList.push("");
        this.shows.show10 = true;
      },
      // 移除正则匹配
      removeRegwords(e) {
        this.regexList.splice(e, 1);
        console.log(this.regexList);
      },
      // 上传文件格式报错
      handleFormatError(file) {
        console.log(file);
        this.$Message.error(file.name + "格式不正确，请上传mp3或wav格式的文件");
      },
      remove(index) {
        this.data6.splice(index, 1);
      },
      // 获取父组件传的值
      parentMsg(e) {
        this.serviceid = e.onserviceid;
        let data2 = {
          serviceid: this.serviceid,
          sceneid: 0
        };
        console.log("ppppppppppppbbbbbbbbbbbbbbb执行了")
        getHoodleMobileList(data2).then(res => {
          console.log("获取所有问题list");
          console.log(res);
          if (res.code == "10000") {
            console.log(res.content);
            this.hoodleMobileList = res.content;
            //   for (let i = 0; i < this.question.length; i++) {
            //   this.getHoodleMobileAnswer(this.question[i].hoodleMobileid);
            // }
            //  console.log(this.hoodleMobileList);
          }
        });
        // this.getLists(data2);
      },
      // 点击侧边栏
      getHoodleMobile(e) {

        console.log("侧边栏------------------");
        console.log(e);
        this.sceneids = e;
        this.$emit("childFn", e);
        // this.formItem.hoodleMobileid = e;
        this.data6 = [];
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
          remark: "",
          sceneid: e
        };
        this.getHoodleMobileLists(data);
      },


      // 获取多轮会话列表
      getHoodleMobileLists(data) {
        getHoodleMobileList(data).then(res => {
          console.log("多轮会话列表");
          console.log("------------------------------------------------------------")
          console.log(res);
          if (res.code == "10000") {
            console.log("------------------------------------------------------------")
            console.log("问题内容");
            console.log(res.content);

            this.question = res.content;
            this.$refs.tabs.activeKey = "nameson1";
            console.log("问题问题问题问题问题111111111111111111")
            console.log(this.question)
            for (let i = 0; i < this.question.length; i++) {
              this.getHoodleMobileAnswer(this.question[i].hoodleMobileid);
            }
            console.log(this.question);
          }
        });
      },
      // 获取答案
      getHoodleMobileAnswer(data) {
        console.log("hahah aaaaaaaaaaaaaaaaa")
        console.log(data)
        getHoodleMobileAnswerList({
          id: data
        }).then(result => {
          if (result.code == "10000") {
            console.log('哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或')
            console.log(result);
            this.data6.push(result.content);
            console.log("获取data6")
            console.log(this.data6)
          }
        });
      },
      // 获取变量
      getCustomerItem() {
        getCustomerItemList().then(res => {
          if (res.code == "10000") {
            this.customerItemList = res.content;
          }
        });
      },
      // 截取指定字符串
      getCaption(str, obj) {
        var index = str.lastIndexOf(obj);
        str = str.substring(index, str.length);
        //  console.log(obj);
        return str;
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
      //

      //tab切换
      exchange(index){
        console.log("huhuhuhuhuhuh")
        console.log(index)
      },

      removeHTMLTag(str) {
        str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
        str = str.replace(/ /gi, ""); //去掉
        str = str.replace(/<br>/gi, "");
        str = str.replace(/\s+/g, "");
        return str;
      }
    }
  };
</script>
<style scoped>
  div.searchbtn {
    cursor: pointer;
    background: #0eb288;
    color: #fff;
    display: inline-block;
    margin: 4px;
    margin-left: 8px;
    width: auto;
    padding: 0 4px;
  }
  .search {
    background: #219480;
    color: #fff;
  }
</style>
