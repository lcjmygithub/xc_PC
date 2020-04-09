<template>
  <Row :gutter="16">
    <i-col :span="4">
      <Menu ref="menus" width="auto" @on-select="getHoodleMobile" @passSceneId="getHoodleMobile">
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
      <Tabs ref="tabs" value="nameson" @on-click="" v-show="questions&&flag==0">
        <TabPane
          v-for="(item, index) in questions"
          :key="index"
          :hoodleMobileadress="item.hoodleMobileadress"
          :name="'nameson' + (index + 1)"
          :label="item.type == 1 || item.type == 3 ? '文本' : '录音'"
        >
          <Row>
            <i-col span="18">
              <!--              显示内容-->
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
                  <div v-if="item.qtype == 2" v-html="item.remark"></div>
                  <div v-else v-html="item.remark"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="2" offset="3">
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
                  :src="common.common.upLoadVideoURL + '/' + item.hoodleMobileadress"
                  controls="controls"
                ></audio>
              </Card>
            </i-col>
          </Row>

          <!--        新增回答 下面-->
          <i-col style="margin-top: 10px" span="2" offset="21">
            <Button
              @click="
                addAnswer(
                  item.hoodleMobileid,
                  item.type == 2
                    ? item.qtype == 2
                      ? item.remark
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
              :columns="columns"
              :data="ztKnowHoodlemobileAnswers[index]"
              max-height="350"
            >
            </Table>
          </i-col>

        </TabPane>

      </Tabs>
      <Button v-show="questions.length<1||flag==1" @click="addQuestion" class="search" type="primary"
      >新增问题</Button>
    </i-col>

    <!-- 问题弹窗 -->
    <Drawer
      :title="addTitle"
      :closable="close"
      v-model="showModelQuestion"
      width="500"
      style="padding:15px"
    >
      <i-col span="24">
        <Form :model="formData" label-position="right" style="padding:15px">
          <FormItem label="场景" :label-width="100">
            <Select @on-change="selectSceneid" v-model="formData.sceneid">
              <Option value="1">开场白</Option>
              <Option value="2">了解情况</Option>
              <Option value="3">邀约语境</Option>
              <Option value="4">结束语境</Option>
              <Option value="5">挽留</Option>
              <Option value="9">多轮会话</Option>
            </Select>
          </FormItem>
          <FormItem label="类型" :label-width="100">
            <Select @on-change="selectChange" v-model="formData.type">
              <Option value="1">文本</Option>
              <Option value="2">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="是否可打断" :label-width="100">
            <RadioGroup v-model="formData.interrupt">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <!--          问题-->
          <FormItem v-show="shows.showRecording" label="问题" :label-width="100">
            <audio
              :src="common.common.upLoadVideoURL + '/' + formData.src"
              controls
              id
            />
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['wav', 'mp3']"
              :on-success="handleSuccess"
              :data="formData.uploadAudio"
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
            <Select @on-change="selectChange2" v-model="formData.qtype">
              <Option value="1">普通问题</Option>
              <Option value="2">变量问题</Option>
            </Select>
          </FormItem>
          <FormItem v-show="shows.showVariable" :label-width="100">
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
                {{ item.COLUMN_COMMENT}}
              </div>
            </div>
          </FormItem>
          <!--          问题内容-->
          <FormItem v-show="shows.questionContent" label="问题内容" :label-width="100" style="">
            <Input
              v-show="shows.showText"
              v-model="formData.answer_text"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
              :maxlength="200"
            ></Input>
            <div
              v-show="shows.showCustomerListOrGeneral"
              class="ivu-input answer_div searchbtnBox"
              maxlength="200"
              style="height:auto;min-height: 50px"
              v-html="formData.answer_div"
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
          <!--          备注-->
          <FormItem v-show="shows.showRemarks" label="备注" :label-width="100">
            <Input
              v-model="formData.remark_text"
              v-show = "shows.showRecordOrGeneral"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="不超过200字"
            ></Input>
            <div
              v-show="shows.showRecordOrCustomer"
              class="ivu-input remark_div searchbtnBox"
              maxlength="200"
              style="height:auto;min-height: 50px"
              v-html="formData.remark_div"
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
    <!-- 答案弹窗 -->
    <Drawer
      :title="addAns"
      :closable="false"
      v-model="showModelAnswer"
      width="500"
      style="padding:15px"
    >
      <i-col span="24">
        <Form :model="formAnswerData" label-position="right" style="padding:15px">
          <FormItem label="问题名称" :label-width="100">
            <Input disabled v-model="formAnswerData.question"></Input>
          </FormItem>
          <FormItem label="态度" :label-width="100">
            <Select
              :disabled="disabled"
              @on-change="selectChange3"
              v-model="formAnswerData.attitude"
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
          <FormItem v-show="initShow.keyWordShow" label="关键字" :label-width="100">
            <div>
              <Input style="width:60%" v-model="formAnswerData.specialwords"></Input>
              <Input
                type="number"
                style="width:25%"
                v-model="formAnswerData.important"
              ></Input>
              <Icon
                @click="addKeywords"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </div>
            <!--  -->
            <div v-show="initShow.DelWordShow">
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
              <Input style="width:86%" v-model="formAnswerData.regwords"></Input>
              <Icon
                @click="addRegwords"
                style="cursor: pointer;"
                size="20"
                type="md-add-circle"
              />
            </div>
            <div v-show="initShow.DelRegshow">
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
              v-model="formAnswerData.attributeid"
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
            <Select @on-change="selectChange4" v-model="formAnswerData.type">
              <Option value="1">问题跳转</Option>
              <Option value="2">场景跳转</Option>
              <Option value="3">跳转人工服务</Option>
              <Option value="4">发送短信</Option>
              <Option value="5">流程继续</Option>
              <Option value="6">转号码</Option>
              <Option value="7">交接</Option>
            </Select>
          </FormItem>
          <FormItem v-show="initShow.transferNumbershow" label="转号码" :label-width="100">
            <Input type="number" v-model="formAnswerData.mobile"></Input>
          </FormItem>
          <FormItem v-show="initShow.sceneShow" label="场景" :label-width="100">
            <Select @on-change v-model="formAnswerData.sceneid">
              <Option value="1">开场白</Option>
              <Option value="2">了解情况</Option>
              <Option value="3">邀约语境</Option>
              <Option value="4">结束语境</Option>
              <Option value="5">挽留</Option>
              <Option value="9">多轮会话</Option>
            </Select>
          </FormItem>
          <FormItem v-show="initShow.serviceShow" label="服务" :label-width="100">
            <Select
              placeholder="请选择电话服务"
              v-model="formAnswerData.onserviceid"
            >
              <Option
                v-for="(item, index) in serviceTableList"
                :key="index"
                :value="item.onserviceid"
              >{{ item.servicecontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="initShow.msgModelShow" label="短信模板" :label-width="100">
            <Select placeholder="请选择短信模板" v-model="formAnswerData.modelid">
              <Option
                v-for="(item, index) in modelNoteList"
                :key="index"
                :value="item.modelid"
              >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="initShow.questionContentShow" label="问题内容" :label-width="100">
            <Select
              placement="bottom-end"
              placeholder="请选择问题"
              @on-change="selectChange2"
              v-model="formAnswerData.hoodleMobileid"
            >
              <Option
                v-for="(item, index) in hoodleMobileList.filter((v,i)=>{
                   if(v.type=='1'||v.type=='3'){
                      return v
                   }
                })"
                :key="index"
                :value="item.hoodleMobileid"
                style="width:370px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;"
              >
                <!--                {{-->
                <!--                  item.type == 1 || item.type == 3-->
                <!--                    ? item.showcontent-->
                <!--                    : ""-->
                <!--                }}-->
                {{item.showcontent}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="答案得分" :label-width="100">
            <Input
              type="number"
              v-model="formAnswerData.score"
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
  import {mapActions,mapState} from "vuex"
  export default  {
        mixins: [require("@/mymixins").default],
    data(){
      return {
        robitMsg:{}, //话术信息
        hoodleMobileList:[],  //一个话术对应的所有问题列表
        sceneids:"", //当前选中的场景id
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
            sceneid: 9,
            scene: "多轮会话"
          }
        ],
        /*********       回答    ****************/
        showModelAnswer: false,  //回答弹框   默认
        addAns:  "",               //弹框标题
        formAnswerData:{
          question: "", //             问题名称
          attitude :"" ,              //态度
          specialwords:"",           //关键字
          important: "",             //权重
          regwords:"" ,              //正则匹配
          attributeid:"" ,           //客户属性
          type:""    ,                //跳转类型

          mobile:""   ,                //转号码
          sceneid:""  ,                 //场景
          onserviceid:"" ,               //服务id
          modelid:""    ,                //短信模板id
          hoodleMobileid: "" ,           //问题id
          hoodleMobileids: "",
          //   nextHoodleMobileid:"",          // 问题内容id
          score:""          ,
          hoodleMobileAnswerid: ""      // 答案id

        },
        disabled: false, // 是否可编辑
        keywordList: [], // 关键字列表
        regexList: [], // 正则匹配列表
        attributeidList: [], // 客户属性列表
        modelNoteList: [], // 短信模板列表
        serviceTableList: [], // 服务列表

        //回答 弹框 表单项默认显示
        initShow:{
          transferNumbershow:false ,  //转号码
          sceneShow: false ,           //场景
          serviceShow: false,         //服务
          msgModelShow: false,        //短信模板
          questionContentShow: true,  // 问题内容

          keyWordShow: true,        // 关键字

          DelRegshow: false ,       //删除正则
          DelWordShow :false        //删除关键字
        },

        // 表单项默认状态
        /*********       问题     ****************/
        questions:[],    //问题列表
        flag:1,         //显示隐藏新增问题按钮
        ztKnowHoodlemobileAnswers:[],  //回答列表
        showModelQuestion: false ,  //弹框 问题  默认关闭
        close:false,
        addTitle: "",            //弹框标题
        formData:{              //弹窗1 表单 对象
          hoodleMobileid: "",     //问题 id  ===>>>编辑时必须要
          hoodleMobileadress: "", //
          sceneid: "", // 场景id
          type: "1", // 1为文本 2为录音
          qtype: "1" ,//1为普通问题 2为变量问题
          interrupt: "0", // 是否可打断 1为是 0为否
          showcontent:"",
          remark:"",
          src: "",      //录音资源引路径
          uploadAudio:{},   //上传时附带的额外参数
          answer_text: "" ,  //问题内容
          answer_div: "", // 问题内容-div
          remark_text: "", // 备注-富文本
          remark_div: "" // 备注-div

        },
        onserviceid: "", // 服务id
        serviceid:'',
        shows:{
          showRecording: false ,  //显示录音展开
          showVariable : false ,  // 选择变量  变量列表展开
          questionContent: true , //选择文本时 展开  问题内容
          showText : true       ,     // 选择文本时 选择普通问题   ----问题内容
          showCustomerListOrGeneral :  false ,// 选择文本时，选择 变量 ，------问题内容
          showRemarks:false,   //备注 是否显示
          showRecordOrGeneral : false  , //选择  录音 ，选择 文本    -----备注内容
          showRecordOrCustomer :false  , //选择 录音  ，选择 变量    -----备注内容
        },

        columns: [
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
                        let data2 = {
                          serviceid: this.serviceid,
                          sceneid: 0
                        };
                        getHoodleMobileList(data2).then(res => {        //重新加载所有问题列表  =>文本类型
                          console.log("获取所有问题list");
                          console.log(res);
                          if (res.code == "10000") {
                            console.log(res.content);
                            this.hoodleMobileList = res.content;
                          }
                        });

                        this.addAns = "编辑答案";
                        console.log("编辑");
                        console.log(row);
                        this.removeAnswerData()
                        this.initShows()
                        this.showModelAnswer = true
                        this.formAnswerData.hoodleMobileAnswerid = row.hoodleMobileAnswerid; // 答案id
                        this.formData.question = row.remark        // 问题名称
                        this.formAnswerData.attitude =  String(row.attitude); // 态度
                        this.formAnswerData.score =  row.score; // 得分
                        this.formAnswerData.type= String(row.type)     //类型
                        this.formAnswerData.hoodleMobileids = String(row.hoodleMobileid);
                        console.log("编辑数据")
                          console.log(this.formData.question)
                        this.formAnswerData.attributeid = row.attrids
                          .split(",")
                          .map(Number);                // 客户属性
                        console.log( this.formAnswerData.type+"哈哈")
                        //获取 关键字
                        let  keyWords = row.specialwords
                        const  keyWordsArr = keyWords.split(",")
                        let arr0 =[]
                        this.keywordList =[]
                        keyWordsArr.forEach((v,i)=>{
                          if(i==0){
                            if( v.indexOf("$")!==-1){
                              arr0= v.split("$")
                              arr0.forEach((item,index)=>{
                                if(index==0){
                                  this.formAnswerData.specialwords = item
                                }else{
                                  this.formAnswerData.important = item
                                }
                              })
                            }else{
                              this.formAnswerData.specialwords = v
                            }
                          }else{
                            if( v.indexOf("$")!==-1){
                              let a1 = ""
                              let  a2 = ""
                              v.split("$").forEach((val,j)=>{
                                if(j==0){
                                  a1=val
                                }else{
                                  a2=val
                                }
                              })
                              this.keywordList.push({
                                specialwords: a1,
                                important:  a2
                              });
                            }else{
                              this.keywordList.push({
                                specialwords: v,
                                important: ""
                              });
                            }
                          }
                        })
                        console.log(this.keywordList)
                        //获取正则匹配
                        let regwords = row.regwords
                        const regwordsArr = regwords.split(",")
                        console.log( regwordsArr)
                        // - 号的数组 regexList
                        let   regexArr = []
                        regwordsArr.forEach((v,i)=>{
                          if(i==0){
                            this.formAnswerData.regwords = v
                          }else{
                            regexArr.push(v)
                          }
                        })
                        this.regexList  = regexArr

                        if (this.formAnswerData.type == "1") {
                          this.initShow.questionContentShow= true
                          this. formAnswerData.hoodleMobileid = row.nextHoodleMobileid   //问题id
                        } else if (this.formAnswerData.type == "2") {
                          this.initShow.sceneShow= true
                          this.formAnswerData.sceneid = String(row.scene.scenid);
                        } else if (this.formAnswerData.type == "3") {
                          this.initShow.serviceShow= true
                          this.formAnswerData.onserviceid = row.serviceid;
                        } else if (this.formAnswerData.type == "4") {
                          this.initShow.msgModelShow= true
                          this.formAnswerData.modelid = row.modelid;
                        } else if (this.formAnswerData.type == "6") {
                          this.initShow.transferNumbershow= true
                          this.formAnswerData.mobile = row.mobile;
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
                                this.$Message.success("删除成功");
                                this.getHoodleMobileLists({
                                  serviceid: this.serviceid,
                                  remark: "",
                                  sceneid: this.sceneids
                                });
                                console.log(row.hoodleMobileid);

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
      }
    },
    methods:{
      /************** 答案 ************************/
      //新增回答
      addAnswer(questionId,textTitle){
        let data2 = {
          serviceid: this.serviceid,
          sceneid: 0
        };
        getHoodleMobileList(data2).then(res => {     //加载所有的问题     =>文本列表
          console.log("获取所有问题list");
          console.log(res);
          if (res.code == "10000") {
            console.log(res.content);
            this.hoodleMobileList = res.content;
          }
        });
        console.log(this.hoodleMobileList)
        console.log(textTitle)
        console.log(questionId)
        this.showModelAnswer = true
        this.addAns = "新增答案"
        // 初始化 弹框
        this.initShows()
        //this.initShow.questionContentShow = true // 打开弹框问题内容默认显示
        this.removeAnswerData()
        // 表单数据
        this.formAnswerData.hoodleMobileid= "" // 问题id
        this.formAnswerData.question = textTitle   //问题标题
        this.formAnswerData.hoodleMobileids = questionId;   //问题id

      },
    // 获取所有问题列表
      getAllgetHoodleMobileList(){
        this.$bus.on('pass',msg=>{
          console.log("哈哈哈哈哈哈")
          this.robitMsg = msg
          this.onserviceid = msg.onserviceid
          this.serviceid = msg.onserviceid
          console.log(this.onserviceid)
          //获取一个话术对应的所有问题列表
          let data2 = {
            serviceid: this.serviceid,
            sceneid: 0
          };
          getHoodleMobileList(data2).then(res => {
            console.log("获取所有问题list");
            console.log(res);
            if (res.code == "10000") {
              console.log(res.content);
              this.hoodleMobileList = res.content;
            }
          });
        })
      },
      //默认 显示
      initShows(){
        this.initShow.transferNumbershow = false ,  //转号码
          this.initShow.sceneShow = false ,           //场景
          this.initShow.serviceShow = false ,                  //服务
          this.initShow.msgModelShow =false ,        //短信模板
          this.initShow.questionContentShow = false  // 问题内容

        this.initShow.DelRegshow = true ,       //删除正则
          this.initShow.DelWordShow = true      //删除关键字
      },
      //清空答案 弹框 数据
      removeAnswerData(){
        this.formAnswerData.score = "";
        this.formAnswerData.type = "";
        this.formAnswerData.attitude = "";
        this.formAnswerData.attributeid = [];
        this.formAnswerData.modelid = "";
        this.formAnswerData.specialwords = "";
        this.formAnswerData.important = "";
        this.formAnswerData.regwords = "";
        this.formAnswerData.hoodleMobileid = "";
        this.formAnswerData.attrids = "";
        this.formAnswerData.onserviceid = "";
        this.keywordList = [];
        this.regexList = [];
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
      selectChange3(){      //选择态度
        if(this.formAnswerData.attitude=="5"){
          this.initShow.keyWordShow = false
        }else{
          this.initShow.keyWordShow = true
        }
      },

      //添加关键字
      addKeywords(){      //添加关键字
        this.keywordList.push({
          specialwords: "",
          important: ""
        })
        // console.log(this.keywordList);
        this.initShow.DelWordShow =  true;
      },
      //移除关键字
      removeKeywords(index){  //移除关键字
        this.keywordList.splice(index,1)
        console.log(index)
      },
      //添加正则匹配
      addRegwords(){    //添加正则匹配
        console.log("添加regexList")
        this.regexList.push("")
        this.initShow.DelRegshow = true
      },
      //删除正则
      removeRegwords(index){    //删除正则匹配
        this.regexList.splice(index,1)
      },
      selectChange4(e){   //选择跳转类型
        console.log(e)
        this.initShows()
        if(e=="1"){
          this.initShow.questionContentShow= true      //问题内容
        }else if(e=="2"){
          this.initShow.sceneShow= true           //场景
        }else if(e=="3"){
          this.initShow.serviceShow= true         //服务
        }else if(e=="4"){
          this.initShow.msgModelShow= true        //短信模板
        }else if(e=="6"){
          this.initShow.transferNumbershow= true   //转号码
        }
      },
      //清除字符串左右两端的空格
      trim(str){     //清除字符串左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      //保存回答
      saveAnswer(){     //保存回答
        let that = this
        let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/; //电话
        let telReg = /^([0-9]{3,4})?[0-9]{6,7}$/; //座机
        if (this.formAnswerData.type == "1") {
          if (!this.formAnswerData.hoodleMobileid) {
            this.$Message.error("请选择跳转问题");
            return false;
          }
        } else if (this.formAnswerData.type == "2") {
          if (!this.formAnswerData.sceneid) {
            this.$Message.error("请选择跳转场景");
            return false;
          }
        } else if (this.formAnswerData.type == "3") {
          if (!this.formAnswerData.onserviceid) {
            this.$Message.error("请选择跳转电话服务");
            return false;
          }
        } else if (this.formAnswerData.type == "4") {
          if (!this.formAnswerData.modelid) {
            this.$Message.error("请选择短信模板");
            return false;
          }
        } else if (this.formAnswerData.type == "6") {
          if (
            !(phoneReg.test(this.formAnswerData.mobile) || telReg.test(this.formAnswerData))
          ) {
            this.$Message.error("请输入固话或手机");
            return false;
          }
        } else if (!this.formAnswerData.type) {
          this.$Message.error("请选择跳转类型");
          return false;
        }

        // 提交的字段
        let item = this.trim(this.formAnswerData.specialwords)?
          this.formAnswerData.important?this.trim(this.formAnswerData.specialwords)+"$"+this. formAnswerData.important:this.trim(this.formAnswerData.specialwords)
          :""

        // 关键字
        let  wordsArrString
        if (this.formAnswerData.attitude == "5") {
          wordsArrString = "";
        }{
          //处理 关键字 为 提交表单需要的字段格式
          let  wordsArr=[]
          if(item){
            wordsArr.push(item )
          }
          this.keywordList.forEach((v,i)=>{
            let   item1 = v.specialwords?
              v.important?this.trim(v.specialwords)+"$"+v.important:this.trim(v.specialwords)
              :""
            if(item1){
              wordsArr.push(item1)
            }
          })
          //关键字处理正确格式
          wordsArrString =  wordsArr.join(",")
        }

        //正则 处理
        const regArr = []
        let  regitem = this.trim(this.formAnswerData.regwords)?this.trim(this.formAnswerData.regwords):""
        //当 考虑到 空字符串时 不会有逗号
        // if(regitem){
        //  regArr.push(regitem)
        // }
        //  不考虑到空字符串时, 有逗号
        //  +号的
        regArr.push(regitem)
        //   -号的
        this.regexList.forEach((v,i)=>{
          let   regitem1 =   this.trim(v)
          if(regitem1){
            regArr.push(regitem1)
          }
        })
        console.log(regArr)
        //正则 处理后的正确格式
        let regArrString = regArr.join(",")

        let data = {
          hoodleMobileAnswerid: this.formAnswerData.hoodleMobileAnswerid,         //回答 id
          hoodleMobileid: this.formAnswerData.hoodleMobileids,                     // 标签页的 问题id
          attrids: this.formAnswerData.attributeid.join(","),                       //客户属性
          attitude: this.formAnswerData.attitude,                          //态度
          type: this.formAnswerData.type,                                  //类型
          nextHoodleMobileid:                                               //问题内容下拉选择   ====>所选择的对应问题id
            this.formAnswerData.type == "1" ? this.formAnswerData.hoodleMobileid : "",
          scene: {
            scenid: this.formAnswerData.type == "2" ? this.formAnswerData.sceneid : ""            //场景
          },
          serviceid: this.formAnswerData.type == "3" ? this.formAnswerData.onserviceid : "",    //服务
          modelid: this.formAnswerData.type == "4"?this.formAnswerData.modelid :"",                //短信模板
          mobile: this.formAnswerData.mobile,                                                 //转号码
          regwords: regArrString,                      //正则
          specialwords: wordsArrString,               //关键字
          score: this.formAnswerData.score,
          answerLinks: []
        };
        console.log("测试data数据")
        console.log(data)
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
              that.showModelAnswer = false;
              // res.content.type= this.type;
              // console.log(res.content.type);

              that.getHoodleMobileLists({
                serviceid: that.serviceid,
                remark: "",
                sceneid: that.sceneids
              });
              console.log(data.hoodleMobileid);

            } else {
              that.$Message.error(res.content);
            }
          }
        });

      },


      /**************** 问题 **************/
      ...mapActions(["getCustomerItem"]),

      //选择场景
      selectSceneid(){},
      //选择类型 录音/文本
      selectChange(e){
        console.log(e)
        if(this.formData.type==2){   //录音
          this. shows.showRecording = true
          this.shows.showRemarks = true
          this.shows.questionContent =false
          // 备注
          this.shows.showRecordOrGeneral= true
          this.shows.showRecordOrCustomer = false

        }else{
          this. shows.showRecording= false
          this.shows.showRemarks = false
          this.shows.questionContent = true
        }

      },
      // 选择 普通 /变量
      selectChange2(e){     //问题类型选择
        if(this.formData.qtype==2){   //变量
          this.shows.showVariable= true;
          this.shows.showText = false
          this.shows.showCustomerListOrGeneral=true

          this.shows.showRecordOrGeneral= false
          this.shows.showRecordOrCustomer = true

        }else{                      //普通
          this.shows.showVariable= false;

          this.shows.showText = true
          this.shows.showCustomerListOrGeneral= false
          this.shows.showRecordOrGeneral= true
          this.shows.showRecordOrCustomer = false
        }
      },
      //上传成功
      handleSuccess(response, file, fileList) {
        console.log(response);
        if (response.code == "10000") {
          this.$Message.success("上传成功");
          this.formData.src = response.content.returnUrl;
        } else {
          this.$Message.error("上传失败,请重试");
        }
      },
      // 上传文件格式报错
      handleFormatError(file) {
        console.log(file);
        this.$Message.error(file.name + "格式不正确，请上传mp3或wav格式的文件");
      },
      //点击变量项
      clickVariate(e) {
        console.log(e);
        // if (this.formItem.type == "1") {
        this.formData.answer_div += e.target.outerHTML;
        // } else {
        this.formData.remark_div += e.target.outerHTML;
        // }
      },
      onDivInput(e){
        console.log( e.target.innerHTML)
        this.formData.answer_div = decodeURI(encodeURI(e.target.innerHTML));

      },
      onDivInputs(e){
        this.formData.remark_div = decodeURI(encodeURI(e.target.innerHTML));
      },

      //从父组件出来的数据
      // ParentMsg(){
      //
      // },


      //侧边栏  发起
      getHoodleMobile(e){
        this.flag= 0
        console.log("我被触发了")
        console.log(e)
        this.sceneids= e    //当前的场景id
        // 把 sceneid 传到 话术列表侧边栏
        this.$emit("childFn", e);
        if(!this.robitMsg.robotid){
          this.$Message.error({
            content:'请选择话术',
            top:20,
            duration: 3,
          });
        }else{
          //获取多轮会话列表
          this.$refs.tabs.activeKey = "nameson1";    //默认显示 问题 1
          console.log(this.$refs.tabs.activeKey)
          console.log("refs")
          console.log( this.$refs.tabs)
          let data = {
            serviceid: this.serviceid,
            remark: "",
            sceneid: e
          };
          this.getHoodleMobileLists(data);

        }

      },

      // 主动回答 ，获取多轮会话列表

      getHoodleMobileLists(data){
        getHoodleMobileList(data).then(res=>{
          console.log(res)
          if(res.code==10000){
            //获取  sceneid  对应的 问题列表
            this.questions= res.content
            console.log("问题列表哈哈哈哈哈")
            console.log(this.questions)
            //获取 所有问题的列表
            let arr=[]
            for (let i = 0; i < this.questions.length; i++) {
              arr.push(this.questions[i].hoodleMobileid)
              console.log(this.questions[i].hoodleMobileid)
            }
            this.getHoodleMobileAnswer(arr);
            console.log("测试结束")
          }
        })
      },
      //获取 问题对应的 答案列表
      getHoodleMobileAnswer(aids){
        let strId=aids.join(",")
        console.log("哈哈哈哈哈测试问题回答")
        console.log(strId)
        this.ztKnowHoodlemobileAnswers=[]  //重新获取
        getHoodleMobileAnswerList(
          {
            ids: strId
          }
        ).then(res=>{
          console.log("哈哈哈，测试每个问题对应的回答列表")
          console.log(res)
          if(res.code=10000){
            const data = res.content
            for (let key in data){
              console.log("测试data遍历key")
              console.log(data[key])
              //每个问题对应的回答列表
              let question_Answers = data[key]
              this.ztKnowHoodlemobileAnswers.push(question_Answers)
            }
            console.log("测试正确的回答列表")
            console.log( this.ztKnowHoodlemobileAnswers)
          }
        })
      },
      //新增问题默认初始状态显示
      initShowTK(){
        this.shows.showRecording= false
        this.shows.questionContent=true
        this.shows.showText = true
        this.shows.showVariable= false;   //变量
        this.shows.showRemarks = false   //备注 是否显示
        this.shows.showCustomerListOrGeneral = false
        this.shows.showRemarks = false  //备注 是否显示
        this.shows.showRecordOrGeneral = false
        this.shows.showRecordOrCustomer = false
      },
      //新增问题
      addQuestion(e){
        console.log("噢噢噢")
        console.log(e)
        this.showModelQuestion=true
        this.initShowTK()
        //先初始化  清除
        this.removeData()

        this.close=true
        this.addTitle = "新增问题"

        if(!this.onserviceid){
          this.$Message.error({
            content:'请选择话术',
            top:20,
            duration: 3,
          });
          this.showModelQuestion=false
        }else if(!this.sceneids){
          this.$Message.error({
            content:'请选择场景',
            top:20,
            duration: 3,
          });
          this.showModelQuestion=false
        }else if(this.sceneids){
          this.formData.sceneid= String(this.sceneids);
          console.log("this.formData.sceneid")
          console.log(this.formData.sceneid)
        }
      },
      //保存问题
      saveQuestion(){
        const that= this
        let data = {
          hoodleMobileid: String(this.formData.hoodleMobileid),  //问题 id
          serviceid: String(this.serviceid),
          sceneid : this.formData.sceneid,
          interrupt: this.formData.interrupt,
          type: this.formData.type,
          qtype: this.formData.qtype,
          showcontent: this.formData.type=="1"?
            this.formData.qtype==="1"?this.formData.answer_text:this.formData.answer_div
            : this.formData.qtype==="1"?this.formData.remark_text:this.formData.remark_div,
          remark: this.formData.type==2?
            (this.formData.qtype==1?this.formData.remark_text:this.formData.remark_div)
            :"",
          hoodleMobileadress: this.formData.type==1? (this.formData.qtype==1?this.formData.answer_text:this.formData.answer_div)
            :(this.formData.qtype==1?this.formData.src:this.formData.remark_div)

        }
        console.log("表单数据")
        console.log(data)

        if (!this.serviceid) {
          this.$Message.error("请先选择话术");
        } else if (!this.formData.sceneid) {
          this.$Message.error("请选择场景");
        } else if (this.formData.type == "2" && !this.formData.src) {
          this.$Message.error("请上传语音文件");
        } else if (
          (this.formData.type == "1" &&
            (this.formData.qtype == "1" ? this.formData.answer_text : this.formData.answer_div) == "") ||
          (this.formData.type == "2" &&
            (this.formData.qtype == "1" ?this.formData.remark_text : this.formData.remark_div) == "")
        ) {
          this.$Message.error("请填写问题内容或备注");
        } else {

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
            success: function (res) {
              console.log(res);
              if (res.code == "10000") {
                that.$Message.success("保存成功");
                that.getHoodleMobileLists({
                  serviceid: that.serviceid,
                  remark: "",
                  sceneid: that.sceneids
                });
                that.showModelQuestion= false
              } else {
                that.$Message.error(res.content);
              }
            }
          });

        }
      },
      //编辑问题
      editorQuestion(item){
        console.log("item---------------------------------")
        console.log(item)
        //显示 问题弹框
        this.showModelQuestion= true
        //先初始化 清除
        this.initShowTK()
        this.removeData()
        this.close=true
        this.addTitle = "编辑问题"
        //获取 当前问题的默认信息
        this.formData.hoodleMobileid = item.hoodleMobileid
        this.formData.sceneid = String(item.sceneid)
        this.formData.interrupt = String(item.interrupt)
        this.formData.qtype =  String(item.qtype)
        this.formData.type =  String(item.type)
        // this.formData.remark = item.type=="2"?String(item.remark):""
        this.formData.hoodleMobileadress = String(item .hoodleMobileadress)
        //内容显示
        if( this.formData.type=="1"){
          this.shows.showRecording = false
          this.shows.questionContent =true
          this.shows.showRemarks = false
          if( this.formData.qtype=="1"){
            this.shows.showVariable = false
            this.shows.showText =true
            this.shows.showCustomerListOrGeneral=false
            this.formData.answer_text=item.showcontent.replace(/[\r\n]/g, '')
          }else{
            this.shows.showVariable = true
            this.shows.showText =false
            this.shows.showCustomerListOrGeneral=true
            this.formData.answer_div= decodeURI(
              encodeURI(item.showcontent).replace(/[\r\n]/g, '')
            )
          }
        }
        //备注显示
        if(this.formData.type=="2"){
          this.shows.showRecording = true
          this.shows.questionContent =false
          this.shows.showRemarks = true
          if( this.formData.qtype=="1"){
            this.shows.showVariable = false
            this.shows.showRecordOrGeneral = true
            this.shows.showRecordOrCustomer = false
            this.formData.remark_text=item.remark.replace(/[\r\n]/g, '')
          }else{
            this.shows.showVariable = true
            this.shows.showRecordOrGeneral = false
            this.shows.showRecordOrCustomer = true
            this.formData.remark_div= decodeURI(
              encodeURI(item.remark).replace(/[\r\n]/g, '')
            )
          }
        }
      },
      //删除问题
      deleteQuestion(e){
        //问题id  ===>e
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>问题一旦被删除掉就无法恢复,确定要删除吗?</p>',
          onOk: () => {
            deleteHoodleMobile({id:e}).then(res =>{
              console.log("删除测试响应结果")
              console.log(res)
              if(res.code==10000){
                this.$refs.tabs.activeKey = "nameson1";    //默认显示 问题 1
                console.log(this.serviceid)
                console.log(this.sceneids)
                console.log(this)
                this.$Message.success("删除成功");
                this.getHoodleMobileLists({
                  serviceid: this.serviceid,
                  remark: "",
                  sceneid: this.sceneids
                });
              }
            })
          },
          onCancel: () => {
            this.$Message.success('取消成功');
          }
        });

      },

      //清除问题
      removeData() {
        this.formData.sceneid = "";
        this.formData.type = "1";
        this.formData.qtype = "1";
        this.formData.interrupt = "0";
        this.formData.src = "";
        this.formData.answer_text = "";
        this.formData.answer_div = "";
        this.formData.remark_text = "";
        this.formData.remark_div = "";
      },

      show(){},
      remove(){},

    },
    computed:{
      ...mapState(["customerItemList"]),


    },
    mounted(){
      // this.getSceneLists()
      this.getCustomerItem()
      this.getZtCustomerAttr();
      this.getServiceTableList();
      this.getModelNote();
      // this.ParentMsg()
      this.getAllgetHoodleMobileList()   //加载所有的问题     =>文本列表

    }
  }

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

