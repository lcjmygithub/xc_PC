<template>
  <Row :gutter="16">
    <!-- <i-col :span="24"> -->
    <i-col :span="18" style="margin-top:5px">
      <Form :model="formItem" :label-width="80">
        <i-col :span="12">
          <FormItem label="关键字">
            <Input
              v-model="question"
              placeholder="请输入问题/相同问题/关键字"
            ></Input>
          </FormItem>
        </i-col>
        <i-col span="4" offset="2">
          <FormItem>
            <Button
              type="primary"
              @click="search"
              style="background: #219480;color: #fff;"
              class="search"
              >搜索</Button
            >
          </FormItem>
        </i-col>
        <i-col span="2" offset="4">
          <Button
            type="primary"
            style="background: #219480;color: #fff;"
            class="search"
            @click="showDrawer"
            >新增问题</Button
          >
        </i-col>
      </Form>
    </i-col>
    <i-col span="23">
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
      <div style="margin: 10px;overflow: hidden">
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
      </div>
    </i-col>
    <Drawer
      class="addQuestionDrawer"
      title="新增问题"
      :closable="false"
      v-model="openDrawer"
      width="600"
    >
      <i-col span="18">
        <Form :model="formItem" :label-width="80">
          <FormItem label="问题">
            <Input
              v-model="formItem.question"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
            ></Input>
          </FormItem>
          <FormItem label="相同问题">
            <Input style="width:90%" v-model="formItem.keywords2"></Input>
            <Icon
              @click="addSameQuestion"
              style="cursor: pointer;"
              size="20"
              type="md-add-circle"
            />
            <div v-show="shows.show9">
              <div v-for="(item, index) in keywords2List" :key="index">
                <Input style="width:90%" v-model="keywords2List[index]"></Input>
                <Icon
                  @click="removeSameQuestion(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </div>
            </div>
          </FormItem>
          <FormItem label="关键字">
            <Input style="width:90%" v-model="formItem.keywords"></Input>
            <Icon
              @click="addKeywords"
              style="cursor: pointer;"
              size="20"
              type="md-add-circle"
            />
            <div v-show="shows.show10">
              <div v-for="(item, index) in keywordsList" :key="index">
                <Input style="width:90%" v-model="keywordsList[index]"></Input>
                <Icon
                  @click="removeKeywords(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </div>
            </div>
          </FormItem>
          <FormItem label="是否可打断">
            <RadioGroup v-model="formItem.interrupt">
              <Radio
                v-for="(item, index) in interruptList"
                :key="item.label"
                :label="item.label"
                >{{ item.name }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="业务问题">
            <RadioGroup
              @on-change="selectChange"
              v-model="formItem.isbussiness"
            >
              <Radio
                v-for="(item, index) in isbussinessList"
                :key="item.label"
                :label="item.label"
                >{{ item.name }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="shows.show1" label="关注点">
            <Input v-model="formItem.focus"></Input>
          </FormItem>
          <FormItem label="客户属性">
            <Select v-model="formItem.attributeid" filterable>
              <Option
                v-for="item in attributeidList"
                :value="item.attributeid"
                :key="item.attributeid"
                >{{ item.attribute }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="问题类型">
            <treeselect
              @select="treeselectChange"
              v-model="formItem.typeid"
              :options="typeidList"
              placeholder=""
              search-nested
            />
          </FormItem>
          <FormItem label="答案类型">
            <Select @on-change="selectChange2" v-model="formItem.answerType">
              <Option
                v-for="item in answerTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="问题类型">
            <Select @on-change="selectChange4" v-model="formItem.qtype">
              <Option
                v-for="item in qtypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show18" label="">
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

          <FormItem label="跳转类型">
            <Select @on-change="selectChange3" v-model="formItem.jumpType">
              <Option
                v-for="item in jumpTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show13" label="服务">
            <Select placeholder="请选择电话服务" v-model="formItem.onserviceid">
              <Option
                v-for="(item, index) in serviceTableList"
                :key="index"
                :value="item.onserviceid"
                >{{ item.servicecontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show17" label="情景">
            <Select placeholder="请选择情景" v-model="formItem.hoodleMobileid">
              <Option
                v-for="(item, index) in showcontentList"
                :key="item.hoodleMobileid"
                :value="item.hoodleMobileid"
                >{{ item.showcontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show16" label="机器人跳转">
            <Select v-model="formItem.robotid">
              <Option value=""></Option>
            </Select>
          </FormItem>

          <FormItem v-show="shows.show15" label="转号码">
            <Input type="number" v-model="formItem.phone"></Input>
          </FormItem>

          <FormItem v-show="shows.show14" label="问题内容">
            <Select v-model="formItem.hoodleMobileids">
              <Option
                v-for="(item, index) in hoodleMobileList"
                :value="item.hoodleMobileid"
                :key="index"
                >{{
                  item.type == 1 || item.type == 3
                    ? item.hoodleMobileadress
                    : item.remark
                }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.show2" label="答案">
            <audio
              :src="common.common.upLoadVideoURL + '/' + formItem.src"
              controls
              id=""
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

            <div v-show="shows.show12">
              <div v-for="(item, index) in audioList" :key="index">
                <audio
                  :src="common.common.upLoadVideoURL + '/' + item"
                  controls
                  id=""
                />
                <Upload
                  ref="upload"
                  :format="['wav', 'mp3']"
                  :on-success="handleSuccessList"
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
              </div>
            </div>
          </FormItem>
          <FormItem v-show="shows.show3" label="答案">
            <div v-show="shows.show4">
              <Input
                style="width:90%"
                v-model="formItem.answer_text"
                type="textarea"
                placeholder="不超过200字"
                :autosize="{ minRows: 2, maxRows: 5 }"
              ></Input>
              <Icon
                @click="addAnswer"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </div>
            <div v-show="shows.show11">
              <div v-for="(item, index) in answerTextList" :key="index">
                <Input
                  style="width:90%"
                  v-model="answerTextList[index]"
                  type="textarea"
                  placeholder="不超过200字"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                ></Input>
                <Icon
                  @click="removeAnswer(index)"
                  style="cursor: pointer;"
                  size="20"
                  type="md-remove-circle"
                />
              </div>
            </div>
            <div
              v-show="shows.show5"
              class="ivu-input searchbtnBox answer_div"
              maxlength="200"
              style="height:auto;min-height: 50px;overflow-y: auto;"
              v-html="formItem.answer_div"
              placeholder="不超过200字"
              contenteditable="true"
              @input="onDivInput($event)"
            >
              {{ formItem.answer_div }}
            </div>
          </FormItem>
          <FormItem v-show="shows.show8" label="语音描述">
            <Input
              v-show="shows.show6"
              v-model="formItem.remark_text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
            ></Input>
            <div
              ref="editor"
              v-show="shows.show7"
              class="ivu-input remark_div"
              maxlength="200"
              style="height:auto;min-height: 60px"
              v-html="formItem.remark_div"
              placeholder="不超过200字"
              contenteditable="true"
              @input="changeText"
              @blur="editBlur"
            >
              {{ formItem.remark_div }}
            </div>
          </FormItem>
          <FormItem>
            <Button
              style="background: #219480;color: #fff;"
              @click="saveBtn"
              type="primary"
              >保存</Button
            >
          </FormItem>
        </Form>
      </i-col>
    </Drawer>
  </Row>
</template>
<script>
import {
  getKnowQuestionList,
  deleteKnowQuestion,
  getZtCustomerAttrList,
  getKnowTypeTreeByTypeId,
  getHoodleMobileList,
  getServiceTable,
  getVoiceRobotListWithoutMenu,
  getCustomerItemList,
  saveOrUpdateKnowQuestion
} from "../../../api/api";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      total: 0,
      page: 1,
      page_Size: 10,
      data1: [],
      question: "", // 搜索关键字
      serviceid: "", //
      openDrawer: false,
      formItem: {
        quesid: "", // id
        question: "", // 问题
        keywords2: "", // 相同问题
        keywords: "", // 关键字
        interrupt: "", // 是否可打断
        isbussiness: "", // 业务问题 1为是 空为否
        attributeid: null, // 客户属性
        typeid: null, // 问题类型- 默认
        answerType: "1", // 答案类型 1为文字 2为语音
        qtype: "1", // 问题类型 1为普通问题 2为变量问题
        jumpType: "", // 跳转类型
        focus: "", // 关注点
        uploadAudio: {},
        answer_text: "", // 答案-富文本
        answer_div: "", // 答案-div
        remark_text: "", // 语音描述-富文本
        remark_div: "", // 语音描述-div
        src: "",
        onserviceid: "", // 服务id
        phone: "", // 转号码
        robotid: "", // 机器人跳转
        hoodleMobileid: "", // 情景id
        hoodleMobileids: "", // 问题内容id
        ztKnowAnswers: [{ showcontent: "", answer: "", answertype: "" }]
      },
      typeidList: [], // 问题类型下拉树
      options: [
        {
          id: "a",
          label: "a",
          children: [
            {
              id: "aa",
              label: "aa"
            },
            {
              id: "ab",
              label: "ab"
            }
          ]
        },
        {
          id: "b",
          label: "b"
        },
        {
          id: "c",
          label: "c"
        }
      ],
      showcontentList: [], // 情景列表
      serviceTableList: [], // 服务列表
      keywords2List: [], // 相同问题数组
      keywordsList: [], // 关键字数组
      answerTextList: [], // 答案-富文本数组
      audioList: [], // 答案-录音数组
      VoiceRobotList: [],
      customerItemList: [], // 变量列表
      columns12: [
        {
          title: "问题",
          align: "center",
          key: "question"
        },
        {
          title: "类型",
          align: "center",
          key: "ztKnowType.typename",
          render: (h, params) => {
            const typename = params.row.ztKnowType.typename;
            return h("span", {}, typename);
          }
        },
        {
          title: "创建时间",
          align: "center",
          key: "createtime",
          render: (h, params) => {
            const createtime = params.row.createtime;
            return h("span", {}, this.formatDate(new Date(createtime)));
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
                      console.log(row);
                      this.removeData();
                      this.hides();
                      this.hides2();
                      this.openDrawer = true;
                      this.formItem.quesid = String(row.quesid);
                      let hoodleMobileadress = row.ztKnowAnswers[0].answer.split(
                        /\{.*?\}/g
                      );
                      let hoodleMobileadressArr = this.notemptyArr(
                        hoodleMobileadress
                      );
                      console.log(hoodleMobileadressArr);

                      this.formItem.question = row.question; // 问题
                      this.formItem.typeid = row.ztKnowType.typeid; // 问题类型-下拉树
                      this.formItem.qtype = String(row.ztKnowAnswers[0].qtype); // 问题类型
                      this.formItem.jumpType = row.ztKnowAnswers[0].type
                        ? String(row.ztKnowAnswers[0].type)
                        : ""; // 跳转类型

                      //
                      if (row.ztKnowAnswers[0].type == "1") {
                        this.shows.show14 = true;
                        this.formItem.hoodleMobileids =
                          row.ztKnowAnswers[0].content;
                      } else if (row.ztKnowAnswers[0].type == "3") {
                        this.shows.show13 = true;
                        this.formItem.onserviceid =
                          row.ztKnowAnswers[0].content;
                      } else if (row.ztKnowAnswers[0].type == "4") {
                        this.shows.show15 = true;
                        this.formItem.phone = row.ztKnowAnswers[0].content;
                      } else if (row.ztKnowAnswers[0].type == "5") {
                        this.shows.show16 = true;
                        this.formItem.robotid = row.ztKnowAnswers[0].content;
                      } else if (row.ztKnowAnswers[0].type == "6") {
                        this.shows.show17 = true;
                        this.formItem.hoodleMobileid = String(
                          row.ztKnowAnswers[0].content
                        );
                      }

                      if (row.ztKnowSamequestions.length > 0) {
                        this.shows.show9 = true; // 相同问题数组
                        this.formItem.keywords2 =
                          row.ztKnowSamequestions[0].question; // 相同问题
                        for (
                          let i = 0;
                          i < row.ztKnowSamequestions.length - 1;
                          i++
                        ) {
                          if (row.ztKnowSamequestions[i + 1]) {
                            this.keywords2List.push(
                              row.ztKnowSamequestions[i + 1].question
                            );
                          }
                        }
                        console.log(this.keywords2List);
                      } else {
                        this.shows.show9 = false;
                        this.formItem.keywords2 = "";
                      }

                      let keywordsArr = this.notemptyArr(
                        row.keywords.split(",")
                      );
                      if (keywordsArr.length > 0) {
                        this.shows.show10 = true; // 关键字数组
                        this.formItem.keywords = keywordsArr[0]; // 关键字
                        for (let i = 0; i < keywordsArr.length; i++) {
                          if (keywordsArr[i + 1]) {
                            this.keywordsList.push(keywordsArr[i + 1]);
                          }
                          console.log(keywordsArr[i + 1]);
                        }
                        console.log(this.keywordsList);
                      } else {
                        this.shows.show10 = false;
                        this.formItem.keywords = "";
                      }

                      this.formItem.interrupt = String(row.interrupt); // 是否可打断
                      this.formItem.isbussiness = row.isbussiness; // 业务问题
                      this.formItem.attributeid = Number(row.attrids);
                      this.formItem.answerType =
                        row.ztKnowAnswers[0].answertype == "3"
                          ? "1"
                          : String(row.ztKnowAnswers[0].answertype);
                      // 业务问题
                      if (row.isbussiness == "1") {
                        this.shows.show1 = true; // 关注点
                        this.formItem.focus = row.focus;
                      } else {
                        this.shows.show1 = false;
                        this.formItem.focus = "";
                      }
                      // 文本语音
                      if (
                        row.ztKnowAnswers[0].answertype == "1" ||
                        row.ztKnowAnswers[0].answertype == "3"
                      ) {
                        // 文本
                        this.shows.show2 = false; // 答案-录音
                        this.shows.show3 = true; // 答案-输入框
                        this.shows.show8 = false; // 语音描述
                        if (row.ztKnowAnswers[0].qtype == "2") {
                          // 变量
                          this.shows.show4 = false; // 答案 富文本
                          this.shows.show5 = true; // 答案 div
                          this.formItem.answer_div = decodeURI(
                            encodeURI(row.ztKnowAnswers[0].showcontent)
                          );
                        } else {
                          this.shows.show4 = true; // 答案 富文本
                          this.shows.show5 = false; // 答案 div
                          console.log(row.ztKnowAnswers);
                          for (let i = 0; i < row.ztKnowAnswers.length; i++) {
                            this.shows.show11 = true;
                            if (i == "0") {
                              this.formItem.answer_text =
                                row.ztKnowAnswers[0].answer;
                            } else {
                              this.answerTextList.push(
                                row.ztKnowAnswers[i].answer
                              );
                            }
                          }
                        }
                      } else if (row.ztKnowAnswers[0].answertype == "2") {
                        // 录音
                        this.shows.show2 = true;
                        this.shows.show3 = false;
                        this.shows.show8 = true;
                        // this.formItem.src = row.ztKnowAnswers[0].answer;
                        if (row.ztKnowAnswers[0].qtype == "2") {
                          // 变量问题
                          this.shows.show6 = false; // 语音描述 富文本
                          this.shows.show7 = true; // 语音描述 div
                          this.shows.show18 = true;
                          this.formItem.remark_div = decodeURI(
                            encodeURI(row.ztKnowAnswers[0].showcontent)
                          );
                          for (
                            let i = 0;
                            i < hoodleMobileadressArr.length;
                            i++
                          ) {
                            // 录音
                            this.shows.show12 = true; // 录音数组
                            console.log(hoodleMobileadressArr[i]);
                            if (i == "0") {
                              this.formItem.src = hoodleMobileadressArr[0];
                            } else {
                              this.audioList.push(hoodleMobileadressArr[i]);
                            }
                          }
                        } else {
                          // 普通问题
                          this.shows.show6 = true;
                          this.shows.show7 = false;
                          this.shows.show18 = false;
                          this.formItem.remark_text =
                            row.ztKnowAnswers[0].remark;
                          let zes = row.ztKnowAnswers.sort(
                            this.objectArraySort("sort")
                          );
                          console.log(zes);
                          for (let i = 0; i < zes.length; i++) {
                            // 录音
                            this.shows.show12 = true; // 录音数组
                            if (i == "0") {
                              this.formItem.src = zes[0].answer;
                            } else {
                              this.audioList.push(zes[i].answer);
                            }
                          }
                        }
                      }
                      //
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
                          deleteKnowQuestion({ questid: row.quesid }).then(
                            res => {
                              console.log(res);
                              if (res.code == "10001") {
                                let that = this;
                                this.$Message.success({
                                  top: 50,
                                  duration: 3,
                                  content: "删除成功"
                                });
                                that.getKnowQuestion({
                                  serviceid: row.serviceid
                                });
                              } else {
                                this.$Message.error({
                                  top: 50,
                                  duration: 3,
                                  content: res.content
                                });
                              }
                            }
                          );
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
      typenameList: [],
      // 客户属性列表
      attributeidList: [],
      // 是否可打断
      interruptList: [{ label: "1", name: "是" }, { label: "", name: "否" }],
      // 业务问题
      isbussinessList: [{ label: "1", name: "是" }, { label: "", name: "否" }],
      // 答案类型
      answerTypeList: [
        { value: "1", name: "文字" },
        { value: "2", name: "语音" }
      ],
      // 问题类型列表
      qtypeList: [
        { value: "1", name: "普通问题" },
        { value: "2", name: "变量问题" }
      ],
      // 问题类型列表
      hoodleMobileList: [],
      // 跳转类型列表
      jumpTypeList: [
        { value: "", name: "无" },
        { value: "1", name: "问题跳转" },
        { value: "3", name: "转人工服务" },
        { value: "4", name: "转号码" },
        { value: "5", name: "机器人跳转" },
        { value: "6", name: "多轮会话" },
        { value: "2", name: "结束" }
      ],
      datas: [],
      // 显示隐藏
      shows: {
        show1: false, // 关注点
        show2: false, // 答案 - 音频
        show3: true, // 答案 - 输入框
        show4: true, // 答案 富文本
        show5: false, // 答案 div
        show6: true, // 语音描述 富文本
        show7: false, // 语音描述 div
        show8: false, // 语音描述
        show9: false, // 相同问题数组
        show10: false, // 关键字数组
        show11: false, // 答案-富文本数组
        show12: false, // 答案-录音数组
        show13: false, // 服务
        show14: false, // 问题内容
        show15: false, // 转号码
        show16: false, // 机器人跳转
        show17: false, // 情景
        show18: false // 变量
      }
    };
  },
  created() {
    this.getZtCustomerAttr();
    this.getKnowTypeTreeByTypeIdList();
    this.getServiceTableList();
    this.getCustomerItem();
  },
  mounted() {
    $(".remark_div").on("click", ".searchbtn", function() {
      $(this).remove();
    });
  },
  methods: {
    // 接收父组件传的值
    parentMsg(e) {
      this.serviceid = e.onserviceid;
      console.log(this.serviceid);

      let data = {
        serviceid: this.serviceid,
        "pagebean.pageSize": 10,
        "pagebean.pageNo": 1
      };
      this.getKnowQuestion(data);
      let data2 = {
        serviceid: this.serviceid,
        sceneid: 0
      };
      getHoodleMobileList(data2).then(res => {
        console.log("答案问题list");
        console.log(res);
        if (res.code == "10000") {
          this.hoodleMobileList = res.content;
        }
      });
      let data3 = {
        serviceid: this.serviceid,
        sceneid: 9,
        remark: ""
      };
      getHoodleMobileList(data3).then(res => {
        console.log(res);
        if (res.code == "10000") {
          this.showcontentList = res.content;
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

    // 获取变量
    getCustomerItem() {
      getCustomerItemList().then(res => {
        console.log("变量");
        console.log(res);
        if (res.code == "10000") {
          this.customerItemList = res.content;
        }
      });
    },
    // 问题类型下拉树
    treeselectChange(e) {
      console.log(e);
    },
    // 点击添加变量
    clickVariate(e) {
      console.log(e.target.outerHTML);
      if (this.formItem.answerType == "1") {
        this.formItem.answer_div += e.target.outerHTML;
      } else {
        this.formItem.remark_div += e.target.outerHTML;
      }
      console.log(this.formItem.remark_div);
    },
    // 点击移除变量

    onDivInput(e) {
      this.formItem.answer_div = decodeURI(encodeURI(e.target.innerHTML));
    },
    // 获取问题列表
    getKnowQuestion(data) {
      getKnowQuestionList(data).then(res => {
        console.log("问题库- 问题列表");
        console.log(res);
        let { code, content } = res;
        if (code == "10000") {
          if (content.list) {
            this.datas = content.list;
          } else {
            this.datas = [];
          }
          this.total = content.totalCount;
        }
      });
    },
    // 分页
    changePage(row) {
      let data = {
        question: this.question,
        serviceid: this.serviceid,
        pageSize: this.page_Size,
        pageNo: row
      };
      this.getKnowQuestion(data);
    },
    //页容量的改变
    changePageSize(pageSize) {
      this.page_Size = pageSize;
      this.page=1;
      this.getKnowQuestion({
        serviceid: this.serviceid,
        pageSize: this.page_Size,
        pageNo: this.page
      });
    },
    // 获取问题类型
    getKnowTypeTreeByTypeIdList() {
      getKnowTypeTreeByTypeId({ usetype: 1 }).then(res => {
        console.log("问题类型");
        console.log(res);
        if (res.code == "10000") {
          let content = JSON.parse(res.content);
          for (let i = 0; i < content.length; i++) {
            if (content[i].children) {
              for (let j = 0; j < content[i].children.length; j++) {
                content[i].children[j].label = content[i].children[j].text;
              }
            }
            this.typeidList.push(content[i]);
            this.typeidList[i].label = "";
            this.typeidList[i].label = content[i].text;
          }
          console.log(this.typeidList);
        }
      });
    },
    // 清空数据
    removeData() {
      this.formItem.quesid = "";
      this.formItem.question = "";
      this.formItem.keywords2 = "";
      this.keywords2List = [];
      this.formItem.keywords = "";
      this.formItem.focus = "";
      this.keywordsList = [];
      this.formItem.interrupt = "";
      this.formItem.isbussiness = "";
      this.formItem.attributeid = "";
      this.formItem.typeid = null;
      this.formItem.answerType = "1";
      this.formItem.qtype = "1";
      this.formItem.jumpType = "";
      this.formItem.answer_text = "";
      this.formItem.answer_div = "";
      this.formItem.remark_text = "";
      this.formItem.remark_div = "";
      this.formItem.src = "";
      this.audioList = [];
      this.answerTextList = [];
      this.formItem.hoodleMobileid = "";
      this.formItem.hoodleMobileids = "";
      this.formItem.robotid = "";
      this.formItem.phone = "";
    },
    // 获取服务 机器人跳转
    getServiceTableList() {
      getServiceTable({ "ztChannel.channelid": 5 }).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.serviceTableList = res.content;
        }
      });
      // getVoiceRobotListWithoutMenu().then(res => {
      //   if (res.code == "10000") {
      //     console.log("机器人跳转");
      //     console.log(res);
      //   }
      // });
    },
    // 搜索
    search() {
      this.page_Size=10;
      this.page=1;
      let data = {
        question: this.question,
        serviceid: this.serviceid,
        pageSize: 10,
        pageNo: 1
      };
      this.page = 1;
      this.getKnowQuestion(data);
    },
    //
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：22`
      });
    },
    // 默认配置
    hides() {
      this.shows.show1 = false;
      this.shows.show2 = false;
      this.shows.show3 = true;
      this.shows.show4 = true;
      this.shows.show5 = false;
      this.shows.show6 = true;
      this.shows.show7 = false;
      this.shows.show8 = false;
      this.shows.show9 = false;
      this.shows.show10 = false;
      this.shows.show11 = false;
      this.shows.show12 = false;
      this.shows.show18 = false;
    },
    // 默认配置2
    hides2() {
      this.shows.show13 = false;
      this.shows.show14 = false;
      this.shows.show15 = false;
      this.shows.show16 = false;
      this.shows.show17 = false;
    },
    // 新建问题弹窗
    showDrawer() {
      if (!this.serviceid) {
        this.$Message.error("请先选择话术");
        return false;
      }
      this.openDrawer = true;
      this.hides();
      this.hides2();
      this.removeData();
    },
    // 保存
    saveBtn() {
      let questions = []; // 相同问题
      let content = ""; //

      let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
      let telReg = /^([0-9]{3,4})?[0-9]{6,7}$/;
      if (this.formItem.keywords2) {
        questions = [
          {
            question: this.formItem.keywords2
          }
        ];
      }
      let arrs = this.notemptyArr(this.keywords2List);
      for (let i = 0; i < arrs.length; i++) {
        questions.push({
          question: arrs[i]
        });
      }

      if (this.formItem.jumpType == "1") {
        // 跳转类型
        content = String(this.formItem.hoodleMobileids);
        if (!content) {
          this.$Message.error("请选择问题");
          return false;
        }
      } else if (this.formItem.jumpType == "3") {
        content = this.formItem.onserviceid;
        if (!content) {
          this.$Message.error("请选择人工服务");
          return false;
        }
      } else if (this.formItem.jumpType == "4") {
        content = this.formItem.phone;
        if (!(phoneReg.test(content) || telReg.test(content))) {
          this.$Message.error("请输入固话或手机");
          return false;
        }
      } else if (this.formItem.jumpType == "5") {
        content = this.formItem.robotid;
        if (!content) {
          this.$Message.error("请选择跳转机器人");
          return false;
        }
      } else if (this.formItem.jumpType == "6") {
        content = this.formItem.hoodleMobileid;
        if (!content) {
          this.$Message.error("请选择情景");
          return false;
        }
      } else {
        content = "";
      }

      let answerTexts = []; // 答案列表
      let ztKnowAnswersList = []; //
      answerTexts.push(this.formItem.answer_text);

      for (let i = 0; i < this.answerTextList.length; i++) {
        answerTexts.push(this.answerTextList[i]);
      }
      console.log("------------");
      console.log(answerTexts);

      if (this.formItem.qtype == "1") {
        // 普通问题
        if (this.formItem.answerType == "1") {
          // 文本
          for (let j = 0; j < answerTexts.length; j++) {
            ztKnowAnswersList.push({
              answertype: this.formItem.answerType,
              remark:
                this.formItem.answerType == "2"
                  ? this.formItem.qtype == "1"
                    ? this.formItem.remark_text
                    : "测试变量默认文本"
                  : "",
              qtype: this.formItem.qtype,
              showcontent:
                this.formItem.answerType == "1"
                  ? this.formItem.qtype == "1"
                    ? this.formItem.answer_text
                    : this.formItem.answer_div
                  : "测试变量默认文本",
              type: this.formItem.jumpType,
              answer: answerTexts[j],
              content: content,
              sort: j + 1
            });
          }
        } else {
          // 录音
          // for (let j = 0; j < array.length; j++) {
          ztKnowAnswersList.push({
            answertype: this.formItem.answerType,
            remark:
              this.formItem.answerType == "2"
                ? this.formItem.qtype == "1"
                  ? this.formItem.remark_text
                  : "测试变量默认文本"
                : "",
            qtype: this.formItem.qtype,
            showcontent:
              this.formItem.answerType == "1"
                ? this.formItem.qtype == "1"
                  ? this.formItem.answer_text
                  : this.formItem.answer_div
                : "测试变量默认文本",
            type: this.formItem.jumpType,
            answer: this.formItem.src,
            content: content,
            sort: 1
          });

          // }
        }
      } else {
        // 变量
        ztKnowAnswersList = [
          {
            answer:
              this.formItem.answerType == "1"
                ? this.formItem.qtype == "1"
                  ? this.formItem.answer_text
                  : this.formItem.answer_div
                : this.formItem.qtype == "1"
                ? this.formItem.src
                : this.formItem.src,
            answertype: this.formItem.answerType,
            remark:
              this.formItem.answerType == "2"
                ? this.formItem.qtype == "1"
                  ? this.formItem.remark_text
                  : "测试变量默认文本"
                : "",
            qtype: this.formItem.qtype,
            showcontent:
              this.formItem.answerType == "1"
                ? this.formItem.qtype == "1"
                  ? this.formItem.answer_text
                  : this.formItem.answer_div
                : "测试变量默认文本",
            type: this.formItem.jumpType,
            content: content,
            sort: 1
          }
        ];
      }

      let data = {
        question: this.formItem.question,
        attrids: this.formItem.attributeid,
        serviceid: String(this.serviceid),
        quesid: this.formItem.quesid,
        interrupt: this.formItem.interrupt,
        isbussiness: this.formItem.isbussiness,
        focus: this.formItem.focus,
        ztKnowSamequestions: questions,
        keywords:
          this.formItem.keywords +
          "," +
          this.notemptyArr(this.keywordsList).join(","),
        ztKnowType: {
          //所属类型
          typeid: this.formItem.typeid ? String(this.formItem.typeid) : null
          //类型ID
        },
        ztKnowAnswers: ztKnowAnswersList,
        type: "json"
      };
      if (!data.serviceid) {
        this.$Message.error("请选择话术");
      } else if (!data.question) {
        this.$Message.error("请填写问题");
      } else if (
        !data.ztKnowAnswers[0].answer &&
        data.ztKnowAnswers[0].type != "6"
      ) {
        this.$Message.error("请填写答案");
      } else if (!data.ztKnowSamequestions) {
        this.$Message.error("请填写相同问题");
      } else if (!data.ztKnowType.typeid && data.ztKnowAnswers[0].type != "6") {
        this.$Message.error("请选择类型");
      } else if (
        this.formItem.answerType == "2" &&
        !data.ztKnowAnswers[0].remark &&
        data.ztKnowAnswers[0].type != "6"
      ) {
        this.$Message.error("请填写语音描述");
      } else {
        saveOrUpdateKnowQuestion(data).then(res => {
          console.log(res);
          if (res.code == "10001") {
            this.$Message.success("保存成功");
            this.openDrawer = false;
            this.getKnowQuestion({
              serviceid: this.serviceid
            });
          } else {
            this.$Message.error(res.content);
          }
        });
      }
      console.log(data);
    },
    // 添加相同问题
    addSameQuestion() {
      this.keywords2List.push("");
      this.shows.show9 = true;
    },
    // 移除相同问题
    removeSameQuestion(e) {
      console.log(e);
      this.keywords2List.splice(e, 1);
    },
    // 添加关键字
    addKeywords() {
      this.keywordsList.push("");
      console.log(this.keywordsList);
      this.shows.show10 = true;
    },
    // 移除关键字
    removeKeywords(e) {
      console.log(e);
      this.keywordsList.splice(e, 1);
      console.log(this.keywordsList);
    },
    // 添加答案
    addAnswer() {
      this.shows.show11 = true;
      this.answerTextList.push("");
    },
    // 移除答案
    removeAnswer(e) {
      this.answerTextList.splice(e, 1);
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
    // 业务问题单选
    selectChange(e) {
      console.log(e);
      if (e == "1") {
        this.shows.show1 = true;
      } else {
        this.shows.show1 = false;
      }
    },
    // 答案类型
    selectChange2(e) {
      console.log(e);
      if (e == "1") {
        this.shows.show2 = false;
        this.shows.show3 = true;
        this.shows.show8 = false;
      } else {
        this.shows.show2 = true;
        this.shows.show3 = false;
        this.shows.show8 = true;
      }
    },
    // 跳转类型
    selectChange3(e) {
      console.log(e);
      this.hides2();
      if (e == "1") {
        this.shows.show14 = true;
      } else if (e == "3") {
        this.shows.show13 = true;
      } else if (e == "4") {
        this.shows.show15 = true;
      } else if (e == "5") {
        this.shows.show16 = true;
      } else if (e == "6") {
        this.shows.show17 = true;
      }
    },
    // 问题类型
    selectChange4(e) {
      console.log(e);
      if (e == "1") {
        this.shows.show4 = true;
        this.shows.show11 = true;
        this.shows.show6 = true;
        this.shows.show5 = false;
        this.shows.show7 = false;
        this.shows.show18 = false;
      } else {
        this.shows.show4 = false;
        this.shows.show11 = false;
        this.shows.show6 = false;
        this.shows.show5 = true;
        this.shows.show7 = true;
        this.shows.show18 = true;
      }
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
    // 上传音频列表
    handleSuccessList(response, file, fileList) {
      console.log(response);

      // if (response.code == "10000") {
      //   this.$Message.success("上传成功");
      //   // this.audioList.push()
      // } else {
      //   this.$Message.error("上传失败,请重试");
      // }
    },

    // 上传格式报错
    handleFormatError(file) {
      console.log(file);
      this.$Message.error(file.name + "格式不正确，请上传mp3或wav格式的文件");
    },
    //对包含对象的数组排序，要求根据对象中的sort进行由小到大的顺序排列
    objectArraySort(keyName) {
      return function(objectN, objectM) {
        let valueN = objectN[keyName];
        let valueM = objectM[keyName];
        if (valueN > valueM) return 1;
        else if (valueN < valueM) return -1;
        else return 0;
      };
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
    // 监听事件
    editBlur() {
      this.$refs.editor.focus();
      // if (!this.isfocus) {
      this.$refs.editor.blur();
      // }
    },
    changeText() {
      this.formItem.remark_div = this.$refs.editor.innerHTML;
      console.log(this.$refs.editor.innerHTML);
    }
  }
};
</script>
<style >
.search {
  background: #219480;
  color: #fff;
}
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
.addQuestionDrawer ul.ivu-select-dropdown-list {
  max-width: 200px !important;
  padding: 16px;
}
</style>
