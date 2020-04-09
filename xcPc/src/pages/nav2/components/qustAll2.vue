<template>
  <Row :gutter="16">
    <!-- <i-col :span="24"> -->
    <i-col :span="18" style="margin-top:5px">
      <Form :model="formItem" :label-width="80">
        <i-col :span="12">
          <FormItem label="关键字">
            <Input
              v-model="formItem.question"
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
            @click="addQustion"
          >新增问题</Button
          >
        </i-col>
      </Form>
    </i-col>
    <i-col span="23">
      <Table border :columns="columns" :data="dataList" max-height="500">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.question }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="text"
            size="small"
            style="margin-right: 5px;color:#2d8cf0"
            @click="editor(index)"
          >View</Button
          >
          <Button
            type="text"
            size="small"
            @click="del(index)"
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
            :page-size="pageSize"
            show-sizer
            show-total
          ></Page>
        </div>
      </div>
    </i-col>
<!--    新增问题弹框-->
    <Drawer
      class="addQuestionDrawer"
      title="新增问题"
      :closable="false"
      v-model="questionDrawer"
      width="600"
    >
      <i-col span="18">
        <Form :model="formData" :label-width="80">
          <FormItem label="问题">
            <Input
              v-model="formData.question"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
            ></Input>
          </FormItem>
          <FormItem label="相同问题">
            <Input style="width:90%" v-model="formData.sameQuestion"></Input>
            <Icon
              @click="addSameQuestion"
              style="cursor: pointer;"
              size="20"
              type="md-add-circle"
            />
            <div v-show="1">
              <div v-for="(item, index) in sameQuestionList" :key="index">
                <Input style="width:90%" v-model="sameQuestionList[index].question"></Input>
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
            <Input style="width:90%" v-model="formData.keywords"></Input>
            <Icon
              @click="addKeywords"
              style="cursor: pointer;"
              size="20"
              type="md-add-circle"
            />
            <div >
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
            <RadioGroup v-model="formData.interrupt">
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
              v-model="formData.isbussiness"
            >
              <Radio
                v-for="(item, index) in isbussinessList"
                :key="item.label"
                :label="item.label"
              >{{ item.name }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="1" label="关注点">
            <Input v-model="formData.focus"></Input>
          </FormItem>
          <FormItem label="客户属性">
            <Select v-model="formData.attributeid" filterable>
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
            <Select @on-change="selectChange2" v-model="formData.answerType">
              <Option
                v-for="item in answerTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="问题类型">
            <Select @on-change="selectChange3" v-model="formData.qtype">
              <Option
                v-for="item in qtypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.showBL" label="">
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
            <Select @on-change="selectChange4" v-model="formData.jumpType">
              <Option
                v-for="item in jumpTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
<!--         转人工服务-->
          <FormItem v-show="shows.showService" label="服务">
            <Select placeholder="请选择电话服务" v-model="formData.onserviceid">
              <Option
                v-for="(item, index) in serviceTableList"
                :key="index"
                :value="item.onserviceid"
              >{{ item.servicecontent }}</Option
              >
            </Select>
          </FormItem>
<!--          多轮会话-->
          <FormItem v-show="shows.showScene" label="情景">
            <Select placeholder="请选择情景" v-model="formData.hoodleMobileid">
              <Option
                v-for="(item, index) in showcontentList"
                :key="item.hoodleMobileid"
                :value="item.hoodleMobileid"
              >{{ item.showcontent }}</Option
              >
            </Select>
          </FormItem>
          <FormItem v-show="shows.showRobotJump" label="机器人跳转">
            <Select v-model="formData.robotid">
              <Option value=""></Option>
            </Select>
          </FormItem>
<!--          转号码-->
          <FormItem v-show="shows.showNumber" label="转号码">
            <Input type="number" v-model="formData.phone"></Input>
          </FormItem>

          <FormItem v-show="shows.showQuestionContent" label="问题内容">
            <Select v-model="formData.hoodleMobileids">
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
                {{item.showcontent}}
              </Option>
            </Select>
          </FormItem>
<!--          答案-->
          <FormItem v-show="shows.showAnswer" label="答案">
            <audio
              :src="common.common.upLoadVideoURL + '/' + formData.src"
              controls
              id=""
            />
            <Upload
              ref="upload"
              :format="['wav', 'mp3']"
              :on-success="handleSuccess"
              :show-upload-list="false"
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
          <FormItem v-show="shows.showAnswerRecordBL" label="答案">
            <div v-show="shows.showAddAnswer" style="position: relative">
              <audio
                :src="common.common.upLoadVideoURL + '/' + formData.src"
                controls
                id=""
              />
              <Upload
                ref="upload"
                :format="['wav', 'mp3']"
                :on-success="handleSuccess"
                :show-upload-list="false"
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
              <div style="position: absolute;right: 0;top: 36px">
                <Icon

                  @click="addReords"
                  style="cursor: pointer;"
                  size="30"
                  type="md-add-circle"
                />
              </div>

            </div>
          </FormItem>
          <FormItem v-show="shows.showAnswerList" label="答案">
            <div v-show="shows.showAnswerText">
              <Input
                style="width:90%"
                v-model="formData.answer_text"
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
            <div >
              <div v-for="(item, index) in answerTextList" :key="index">
                <Input
                  style="width:90%"
                  v-model="answerTextList[index].answer"
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
              v-show="shows.showAnswerDiv"
              class="ivu-input searchbtnBox answer_div"
              maxlength="200"
              style="height:auto;min-height: 50px;overflow-y: auto;"
              v-html="formData.answer_div"
              placeholder="不超过200字"
              contenteditable="true"
              @input="onDivInput($event)"
            >
              {{ formData.answer_div }}
            </div>
          </FormItem>
          <FormItem v-show="shows.showRecordDescrible" label="语音描述" >
            <Input
              v-show="shows.showRecordText"
              v-model="formData.remark_text"
              type="textarea"
              placeholder="不超过200字"
              :autosize="{ minRows: 2, maxRows: 5 }"
            ></Input>
            <div
              ref="editor"
              v-show="shows.showRecordRemark"
              class="ivu-input remark_div"
              maxlength="200"
              style="height:auto;min-height: 60px"
              v-html="formData.remark_div"
              placeholder="不超过200字"
              contenteditable="true"
              @input="changeText"
              @blur="editBlur"
            >
              {{ formData.remark_div }}
            </div>
<!--            <div v-for="(item,i) in remark_divList" >-->
<!--              <div-->
<!--                ref="editor"-->
<!--                v-show="shows.showRecordRemark"-->
<!--                class="ivu-input remark_div"-->
<!--                maxlength="200"-->
<!--                style="height:auto;min-height: 60px"-->
<!--                v-html="formData.remark_div"-->
<!--                placeholder="不超过200字"-->
<!--                contenteditable="true"-->
<!--                @input="changeText"-->
<!--                @blur="editBlur"-->
<!--              ></div>-->
<!--            </div>-->
          </FormItem>
          <FormItem label="语音描述">
            <div v-for="(item, index) in audioList" :key="index" style="position: relative">
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
              <div style="position: absolute;right: 0;top: 36px">
                <Icon
                  @click="removeReords"
                  style="cursor: pointer;"
                  size="30"
                  type="md-remove-circle"
                />
              </div>
              <div
                ref="editor"
                v-show="shows.showRecordRemark"
                class="ivu-input remark_div"
                maxlength="200"
                style="height:auto;min-height: 60px"
                v-html="formData.remark_div"
                placeholder="不超过200字"
                contenteditable="true"
                @input="changeText"
                @blur="editBlur"
              >
                {{ formData.remark_div }}
              </div>
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
        saveOrUpdateKnowQuestion, falseWxChat
    } from "../../../api/api";
    // import the component
    import Treeselect from "@riophae/vue-treeselect";
    // import the styles
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import {mapActions,mapState} from "vuex"
    export default {
          mixins: [require("@/mymixins").default],
        components: { Treeselect },
        data() {
            return {
                formItem:{
                    question:""
                },
                columns:[
                    {title:"问题",key:"question"},
                    {title:"类型",key:"ztKnowType"},
                    {title:"创建时间",key:"createtime"},
                    {title:"操作",slot:"action"}
                ],
                dataList:[],
                //页码
                pageSize: 10,
                total: 0,
                page:1,

                //新增问题弹框
                questionDrawer: false,
                formData:{
                    question:"",      //问题名称
                    sameQuestion:"", //相同问题
                    keywords:"",     //关键字
                    interrupt:  "" ,    //是否打断   "" 代表否  1代表 是
                    isbussiness: "",   //业务问题     "" 代表否  1代表 是
                    focus:"",         //关注点
                    answerType: 1,    //答案类型
                    qtype: 1,          //问题类型
                    jumpType: "0",      //跳转类型
                    onserviceid:"",    //服务Id
                    hoodleMobileid:"",  // 场景对应的 选择  ===>问题id
                    robotid:"",       //机器人id
                    phone:"",         //转号码
                    hoodleMobileids:"" ,      //问题跳转  对应的要选择的 ===>  下拉框问题id
                    src:""        ,        //上传录音资源路径
                    uploadAudio: {},          //上传录音的所要携带的额外数据
                    answer_text:""    ,        //文字 普通   答案内容
                    answer_div:""  ,           // 文字 变量   答案内容
                    remark_text:"",           //   语音 普通   语音描述
                    remark_div:"" ,           //   语音 变量   语音描述
                    typeid: null ,            //   问题类型- 默认

                },
                hoodleMobileList:[],  //问题列表   ------->某个话术对应的  所有问题列表
                sameQuestionList:[],   //添加相同问题
                keywordsList:[], //添加的关键字
                interruptList:[   //打断
                    {label:"1",name:'是'},
                    {label:"",name: "否"}
                ],
                isbussinessList:[      // 业务问题
                    {label:"1",name:"是"},
                    {label:"",name:"否"}
                ],
                attributeidList:[],  //客户属性
                answerTypeList:[    //答案类型
                    { value: 1, name: "文字" },
                    { value: 2, name: "语音" }
                ],
                qtypeList:[
                    { value: 1, name: "普通问题" },
                    { value: 2, name: "变量问题" }
                ],
                jumpTypeList:[       //跳转类型
                    { value: "0", name: "无" },
                    { value: "1", name: "问题跳转" },
                    { value: "3", name: "转人工服务" },
                    { value: "4", name: "转号码" },
                    { value: "5", name: "机器人跳转" },
                    { value: "9", name: "多轮会话" },
                    { value: "2", name: "结束" }
                ],
                serviceTableList: [], // 服务列表
                showcontentList: [], // 情景列表
                audioList:[],          //录音列表
                answerTextList:[],     //添加的答案列表
                typeidList:[],            //问题类型 树选择下路列表
                remark_divList:[],         //录音 变量时  ===>答案列表
                shows:{
                    showAnswer:false,                 //文字 / 录音  => 录音答案
                    showAddAnswer: true,
                    showAnswerList: true,            //文本      答案（大div）
                    showRecordDescrible: false,      //语音      答案 （大div）
                    showBL: false,                  //变量
                    showRecordRemark: false,      //当选择  语音、变量  答案
                    showRecordText: false,        //当选择  语音、文字  答案
                    showAnswerText: true,       // 当选择 普通 、 文字时 答案
                    showAnswerDiv: false,        //  当选择 普通 、 变量时  答案

                    showAnswerRecordBL: false,  //变量，语音 ==> 答案

                    showService: false,          //服务
                    showScene : false ,          //场景
                    showRobotJump: false,         //机器人跳转
                    showNumber: false   ,         //转号码
                    showQuestionContent: false,    //问题内容

                }

            }
        },
        created() {
            this.getZtCustomerAttr();    //获取客户属性
            this.getKnowTypeTreeByTypeIdList(); //获取问题类型    树选择下拉
            this.getServiceTableList();   //获取服务
            // this.getCustomerItem();
        },
        mounted() {

        },
        computed:{
            //变量
            ...mapState(["customerItemList"])
        },
        methods:{

            //接收父组件传过来的数据
            parentMsg(e) {
                this.serviceid = e.onserviceid;
                console.log(this.serviceid);

                // let data = {
                //     serviceid: this.serviceid,
                //     "pagebean.pageSize": 10,
                //     "pagebean.pageNo": 1
                // };
                // this.getKnowQuestion(data);
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
               // 获取场景  对应的选择    ===> 问题列表
                getHoodleMobileList(data3).then(res => {
                    console.log(res);
                    if (res.code == "10000") {
                        this.showcontentList = res.content;
                    }
                });
            },
          // 获取问题类型
          getKnowTypeTreeByTypeIdList() {
            getKnowTypeTreeByTypeId({ usetype: 1 }).then(res => {
              console.log("问题类型");
              console.log(res);
              console.log(res.content)
              console.log("测试树形数据")
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
          //树选择 下拉

          treeselectChange(e){
            let m = {typeid: this.formData.typeid ? String(this.formItem.typeid) : null}
             console.log(e)
             console.log(e.id)
             console.log("---------------------------------")
             console.log(this.typeid)
            console.log(m)
          },
            //搜索关键字
            search(){

            },
            //新增问题
            addQustion(){
                this. questionDrawer = true
            },
            //编辑问题
            editor(){

            },
            //删除问题
            del(){

            },
          //页码
            changePageSize(){  // 	切换每页条数时的回调，返回切换后的每页条数   返回值page-size

            },
            changePage(){   //   	页码改变的回调，返回改变后的页码    返回值  页码

           },
        /* ***************新增问题 表单 ************ */
            //添加相同问题
            addSameQuestion(){
             this.sameQuestionList.push({
                 question:""
             })
            },
            //删除相同问题
            removeSameQuestion(index){
               this.sameQuestionList.splice(index,1)
            },
            //添加关键字
            addKeywords(){
               this.keywordsList.push("")
            },
            //删除关键字
            removeKeywords(index){
                this.keywordsList.splice(index,1)
            },
            //添加录音
            addReords(){
                this.audioList.push("")
                this.remark_divList.push("")
            },
            //删除录音
            removeReords(index){
                this.audioList.splice(index,1)
                this.remark_divList.splice(index,1)
            },
            //业务问题选择
            selectChange(){

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
            //获取服务列表    转人工服务 ----> 服务列表
            getServiceTableList() {
                getServiceTable({"ztChannel.channelid": 5}).then(res => {
                    if (res.code == "10000") {
                        console.log(res);
                        this.serviceTableList = res.content;
                    }
                });
            },
          //
          //答案类型选择
            selectChange2(e){
                console.log(e)
                if(e==2){
                    this.shows.showAnswer = true     // 选择语音时  显示
                    this.shows.showRecordDescrible = true
                    this.shows. showRecordText= true

                    this.shows.showAnswerList = false       //文本时   录音答案隐藏  (大div)
                    this.shows.showAnswerText   = false
                }else{
                    this.shows.showAnswer = false
                    this.shows.showAnswerList = true              //     （大div）
                    this.shows.showAnswerText   = true
                    this.shows.showRecordDescrible = false   //语音时    文本 答案隐藏
                    this.shows. showRecordText= false

                }

            },
            //问题类型选择
            selectChange3(type){
               if(type==1){
                   this.shows.showBL = false
                   this.shows.showAnswerDiv = false
                   this.shows.showAnswerText   = true
                   this.shows. showRecordText=  true
                   this.shows. showRecordRemark = false

                   this.shows.showAnswerRecordBL = false
                   this.shows.showAnswer = true
               }else{
                   this.shows.showBL = true
                   this.shows.showAnswerDiv = true
                   this.shows.showAnswerText   = false
                   this.shows. showRecordText=  false
                   this.shows. showRecordRemark = true

                   this.shows.showAnswerRecordBL = true
                   this.shows.showAnswer = false

               }
            },
            //点击变量
            clickVariate(){

            },
         // 跳转类型
            initshows(){
                this.shows.showQuestionContent = false
                this.shows.showService = false
                this.shows.showNumber = false
                this.shows.  showRobotJump = false
                this.shows.showScene = false
            },
            selectChange4(type){
               this.initshows()
               if(type==1){
                   this.shows.showQuestionContent = true
               }else if(type==3){
                   this.shows.showService = true
               }else if(type==4){
                   this.shows.showNumber = true
               }else if(type==5){
                   this.shows.  showRobotJump = true
                }else if(type==9){
                   this.shows.showScene = true
               }
            },


            // 上传成功
            handleSuccess(response, file, fileList) {
                console.log(response);
                if (response.code == "10000") {
                    this.$Message.success("上传成功");
                    this.formData.src = response.content.returnUrl;
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

            //添加答案
            addAnswer(){
               this.answerTextList.push({
                   answer:""
               })
            },
            //删除答案
            removeAnswer(index){
                this.answerTextList.splice(index,1)
            },
            onDivInput(){

            },
            changeText(){

            },
            editBlur(){

            },

            //保存
            saveBtn(){

            },


        }
    }
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
