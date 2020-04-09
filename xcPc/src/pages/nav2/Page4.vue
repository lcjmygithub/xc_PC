<template>
  <Row>
    <i-col>
      <title-text :title="title"></title-text>
    </i-col>
    <Card>
      <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="6">
            <div style="width:100%;height:100%;">
              <Form-item style="margin-bottom:0" label="话术名">
                <i-input
                  v-model="formItem.nickname"
                  placeholder="请输入话术名"
                  style="width:150px"
                ></i-input>
              </Form-item>
            </div>
          </Col>
          <Col span="4">
            <div style="width:100%;height:100%;">
              <Form-item style="margin-bottom:0" label="话术行业">
                <i-select
                  v-model="formItem.industryid"
                  placeholder="请选择行业"
                >
                  <i-option
                    v-for="(item, index) in $store.state.industryList"
                    :key="index"
                    :value="item.industryid"
                  >{{ item.name }}</i-option
                  >
                </i-select>
              </Form-item>
            </div>
          </Col>
          <Col span="3" offset="1">
            <Button @click="search" style="margin-right:10px" class="search"
            >搜索</Button
            >
            <Button @click="empty">清空</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Row :gutter="16"  v-if="ismanage==1||ismanage==2">
      <!-- 侧边栏 -->
      <i-col :span="5" gutter="16" style="margin-top:16px">
        <Card style="height:73vh">
          <i-col
            style="display:flex;justify-content:space-between;margin-top:10px;"
          >
            <i-button
              type="warning"
              @click="addVoiceRobot"
              long
              style="margin-right:10px"
            >+ 新建话术</i-button
            >
            <i-button type="success" @click="copyVoiceRobot" long>
              <Icon type="ios-browsers" />复制话术
            </i-button>
          </i-col>
            <Scroll :on-reach-bottom="handleReachBottom" height="400" style="margin-top: 15px">
               <i-col
              style="margin-right:15px;"
              v-for="(item, index) in $store.state.voiceRobotList"
              :key="index"
              :class="flagIndex === index ? 'activeStyle' : 'noActiveStyle'"
            >
              <div @click="getVoiceRobotDetails(item, index)">
                <div style="display:flex;justify-content:space-between">
                  <p style="color:#000;font-weight:bold">{{ item.nickname }}</p>
                  <p style="font-size:20px">
                    <!-- <Icon type="trash-a"></Icon> -->
                    <Icon
                      style="cursor: pointer;font-size:24px"
                      type="ios-trash-outline"
                      @click="detailSelf($event, item.robotid)"
                    />
                    <br />
                    <Icon
                      style="cursor: pointer;font-size:24px"
                      type="ios-redo-outline"
                      @click="shareSelf(item.robotid)"
                    />
                  </p>
                </div>

                <div style="margin-top:0">
                  行业:
                  <span v-show="item.industryid == '1'" style="color:#444"
                  >房产</span
                  >
                  <span v-show="item.industryid == '2'" style="color:#444"
                  >贷款</span
                  >
                  <span v-show="item.industryid == '3'" style="color:#444"
                  >保险</span
                  >
                  <span v-show="item.industryid == '4'" style="color:#444"
                  >催收</span
                  >
                  <span v-show="item.industryid == '5'" style="color:#444"
                  >股票</span
                  >
                  <span v-show="item.industryid == '6'" style="color:#444"
                  >电商</span
                  >
                  <span v-show="item.industryid == '7'" style="color:#444"
                  >其他</span
                  >
                  <span v-show="item.industryid == '8'" style="color:#444"
                  >信用卡</span
                  >
                  <span v-show="item.industryid == '9'" style="color:#444"
                  >减肥回访</span
                  >
                  <span v-show="item.industryid == '17'" style="color:#444"
                  >口音</span
                  >
                  <span v-show="item.industryid == '18'" style="color:#444"
                  >粤语</span
                  >
                </div>
                <div>
                  备注:
                  <span style="color:#444">
                    {{ item.remark ? item.remark : "" }}
                  </span>
                </div>
              </div>
            </i-col>
            </Scroll>

        </Card>
      </i-col>
      <i-col :span="19">
        <Card style="margin-top:16px;height:73vh">
          <i-col>
            <Tabs value="namePar1" name="namePar" ref="tabs">
              <TabPane label="基本设置" name="namePar1" tab="namePar">
                <setting ref="setting" @getVoiceRobot="refashList"></setting>
              </TabPane>
              <TabPane label="主动发问" name="namePar2" tab="namePar">
                <qusetion @childFn="parentFn" ref="qusetion"></qusetion>
              </TabPane>
              <TabPane label="全局回答" name="namePar3" tab="namePar">
                <global @globalAnswer="parentFn_02" ref="global"></global>
              </TabPane>
              <TabPane label="问题库" name="namePar4" tab="namePar">
                <quseAll ref="quseAll"></quseAll>
              </TabPane>
              <TabPane label="意向标签" name="namePar5" tab="namePar">
                <labelTit ref="labelTit"></labelTit>
              </TabPane>
              <TabPane label="更新记录" name="namePar6" tab="namePar">
                <refash ref="refash"></refash>
              </TabPane>
            </Tabs>
          </i-col>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="16" v-else>
      <!-- 侧边栏 -->
      <i-col :span="5" gutter="16" style="margin-top:16px">
        <Card style="height:73vh">
          <i-col
            style="display:flex;justify-content:space-between;margin-top:10px;"
          >
          </i-col>
          <div style="margin-top: 15px;height: 606px">
            <i-col
              style="margin-right:15px;"
              v-for="(item, index) in shareRobotLists"
              :key="index"
              :class="flagIndex === index ? 'activeStyle' : 'noActiveStyle'"
            >
              <div @click="getShareRobotDetails(item, index)">
                <div style="display:flex;justify-content:space-between">
                  <p style="color:#000;font-weight:bold">{{ item.nickname }}</p>
                  <p style="font-size:20px">
                    <!-- <Icon type="trash-a"></Icon> -->
<!--                    <Icon-->
<!--                      style="cursor: pointer;font-size:24px"-->
<!--                      type="ios-trash-outline"-->
<!--                      @click="detailSelf($event, item.robotid)"-->
<!--                    />-->
<!--                    <br />-->
<!--                    <Icon-->
<!--                      style="cursor: pointer;font-size:24px"-->
<!--                      type="ios-redo-outline"-->
<!--                      @click="shareSelf(item.robotid)"-->
<!--                    />-->
                  </p>
                </div>
                <div style="margin-top:0px">
                  行业:
                  <span v-show="item.industryid == '1'" style="color:#444"
                  >房产</span
                  >
                  <span v-show="item.industryid == '2'" style="color:#444"
                  >贷款</span
                  >
                  <span v-show="item.industryid == '3'" style="color:#444"
                  >保险</span
                  >
                  <span v-show="item.industryid == '4'" style="color:#444"
                  >催收</span
                  >
                  <span v-show="item.industryid == '5'" style="color:#444"
                  >股票</span
                  >
                  <span v-show="item.industryid == '6'" style="color:#444"
                  >电商</span
                  >
                  <span v-show="item.industryid == '7'" style="color:#444"
                  >其他</span
                  >
                  <span v-show="item.industryid == '8'" style="color:#444"
                  >信用卡</span
                  >
                  <span v-show="item.industryid == '9'" style="color:#444"
                  >减肥回访</span
                  >
                  <span v-show="item.industryid == '17'" style="color:#444"
                  >口音</span
                  >
                  <span v-show="item.industryid == '18'" style="color:#444"
                  >粤语</span
                  >
                </div>
                <div>
                  备注:
                  <span style="color:#444">
                    {{ item.remark ? item.remark : "" }}
                  </span>
                </div>
              </div>
            </i-col>
          </div>
        </Card>
      </i-col>
      <i-col :span="19">
        <Card style="margin-top:16px;height:73vh">
          <i-col>
            <Tabs value="namePar1" name="namePar" ref="tabs">
              <TabPane label="基本设置" name="namePar1" tab="namePar">
                <setting ref="setting" @getVoiceRobot="refashList"></setting>
              </TabPane>
<!--              <TabPane label="主动发问" name="namePar2" tab="namePar">-->
<!--                <qusetion @childFn="parentFn" ref="qusetion"></qusetion>-->
<!--              </TabPane>-->
<!--              <TabPane label="全局回答" name="namePar3" tab="namePar">-->
<!--                <global @globalAnswer="parentFn_02" ref="global"></global>-->
<!--              </TabPane>-->
<!--              <TabPane label="问题库" name="namePar4" tab="namePar">-->
<!--                <quseAll ref="quseAll"></quseAll>-->
<!--              </TabPane>-->
              <TabPane label="意向标签" name="namePar5" tab="namePar">
                <labelTit ref="labelTit"></labelTit>
              </TabPane>
<!--              <TabPane label="更新记录" name="namePar6" tab="namePar">-->
<!--                <refash ref="refash"></refash>-->
<!--              </TabPane>-->
            </Tabs>
          </i-col>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="showModal"
      width="800"
      title="公司列表(勾选后点击保存即可分享成功!)"
    >
      <Form :model="formItem" label-position="right">
        <FormItem>
          <i-input
            v-model="cmpname"
            placeholder="公司名称"
            style="width:150px"
          ></i-input>
          <Button
            style="margin:0 10px"
            @click="searchAgent"
            class="search"
            type="primary"
          >搜索</Button
          >
          <Button @click="cmpname = ''">重置</Button>
        </FormItem>
        <FormItem>
          <Table
            border
            ref="selection"
            :columns="columns4"
            :data="companyList"
            @on-selection-change="selectShareCmp"
          ></Table>
        </FormItem>
        <FormItem>
          <Page
            :total="total"
            :current="pageNo"
            @on-change="changePage"
            :page-size="page_Size"
            show-elevator
            show-total
            size="small"
          ></Page>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" class="search" @click="shareBtn">分享</Button>
      </div>
    </Modal>

  </Row>
</template>

<script>
    import titleText from "../components/title";
    import setting from "./components/setting"; //基本设置
    import qusetion from "./components/qusetion"; // 主动发问
    import global from "./components/global";
    import quseAll from "./components/qustAll";
    import labelTit from "./components/label"; //意向标签
    import refash from "./components/refash"; //更新记录
    import {
        getVoiceRobotList,
        getIndustryList,
        getCmpRobotLevel,
        getInformant,
        deleteVoiceRobot,
        copySelfVoiceRobot,
        queryAgent,
        saveOrUpdateCmpShare,
        getCmpShare,
         getShareRobotList   // 非代理商机器人列表
    } from "../../api/api";

    import { mapActions ,mapState} from 'vuex'
    export default {
          mixins: [require("@/mymixins").default],
        components: {
            titleText,
            setting,
            qusetion,
            quseAll,
            global,
            labelTit,
            refash
        },
        data() {
            return {
              page:1, //话术页码
              rtype: "",  // rtpe为2 代表 分享后的
              shareRobotLists:[], //分享机器人列表
               ismanage : "",  // 权限 代理商 为 1或2  不是代理商  为 ""
                cmpname: "", // 公司名
                title: "话术配置",
                total: 0, //
                page_Size: 10,
                pageNo: 1,
                childrenData: {
                    sceneid: "", // 主动发问-侧边栏
                    typeid: "" // 全局回答 -侧边栏
                },
                formItem: {
                    //话术搜索
                    nickname: "", // 话术名
                    industryid: "" // 话术行业id
                },
                robotid: "", //话术id
                serviceid: "",
                flagIndex: "", //是否选中样式
                //industryList: [], //话术行业列表
                // voiceRobotList: [], // 机器人话术模板列表

                self: this,
                showModal: false,
                tableData: [{ name: 123 }],
                tableColumns: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "数据ID",
                        key: "name",
                        align: "center",
                        sortable: true
                    },
                    {
                        title: "拨打时间",
                        align: "center",
                        key: "addr",
                        width: 300
                    },
                    {
                        title: "外呼名称",
                        align: "center",
                        key: "age"
                    },
                    {
                        title: "客户姓名",
                        align: "center",
                        key: "birth"
                    },
                    {
                        title: "客户电话",
                        key: "sex",
                        align: "center"
                    },
                    {
                        title: "通话时长",
                        key: "sex",
                        align: "center"
                    },
                    {
                        title: "拨打结果",
                        key: "sex",
                        align: "center",
                        render: function(row, column, index) {
                            return row.sex == 0
                                ? row.sex == 1
                                    ? "未接通"
                                    : "已接通"
                                : "已挂断";
                        }
                    },
                    {
                        title: "意向标签",
                        key: "sex",
                        align: "center",
                        render: function(row, column, index) {
                            return row.sex == 0 ? (row.sex == 1 ? "A级" : "C级") : "B级";
                        }
                    },
                    {
                        title: "已读/未读",
                        key: "sex",
                        align: "center",
                        render: function(row, column, index) {
                            return row.sex == 0 ? "已读" : "未读";
                        }
                    }
                ],
                columns4: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "名称",
                        tooltip: true,
                        key: "cmpname"
                    },
                    {
                        title: "地区",
                        tooltip: true,
                        key: "city",
                        render: (h, params) => {
                            const row = params.row;
                            return h("span", row.province + row.city + row.county);
                        }
                    },
                    {
                        title: "机器人数",
                        key: "maxoccurs"
                    },
                    {
                        title: "状态",
                        key: "state",
                        render: (h, params) => {
                            const state = params.row.state;
                            if (state == null) {
                                return h("span", {}, "非正常");
                            } else if (state == "1") {
                                return h("span", {}, "正常");
                            } else if (state == "2") {
                                return h("span", {}, "停用");
                            }
                        }
                    }
                ],
                companyList: [], // 公司列表
                ShareList: [], // 需要分享的公司列表
                haveShareList: [] // 已经分享的公司
            };
        },
      mounted() {
            this.getShareRobotLists()   //非代理商机器人话术列表
            this.getIsmanage()
            this.getVoiceRobot();
            this.getIndustry();
            this.queryAgentList({ pageNo: 1, pageSize: 10, cmpname: "" });
        },
        methods: {
          //获得是否为代理商角色
           getIsmanage(){
            //  let  ismanage =  localStorage.getItem("ismanage");
             let  ismanage =  this.userInfo.ismanage;
             this.ismanage = ismanage
             this.$bus.emit('passE',this.ismanage)
             console.log('获取ismanage的值')
             console.log( this.ismanage)
           },
            //刷新列表
            refashList() {
                // this.getVoiceRobot();
              const _this=this
              this.$store.dispatch("getVoiceRobot",[this.page,'','',_this,1])
            },
            // 接收子组件主动发问的值
            parentFn(e) {
                this.childrenData.sceneid = e;
                console.log("hahahahh")
                console.log(e);

            },
            parentFn_02(e) {
                this.childrenData.typeid = e;
            },
            //分页
            changePage(row) {
                let data = {
                    pageNo: row,
                    pageSize: 10,
                    cmpname: this.cmpname
                };
                this.queryAgentList(data);
            },

            //获取 非代理商机器人话术模板列表
          getShareRobotLists(data){
              getShareRobotList(data).then(res=>{
                if(res.code=="10000"){
                  this.shareRobotLists =  res.content.filter((v,i)=>{
                         if(v.rtype=='2'){
                           this.rtype = v.rtype
                           return v
                         }
                  })
                  this.$bus.emit("passID",this.rtype)
                  console.log(this.shareRobotLists)
                  console.log("1111")
                }
              })
          },
          //下拉获取更多话术列表
          handleReachBottom(){
              return new Promise(resolve => {
                const _this = this
                 this.page++
                setTimeout(()=>{
                   this.$store.dispatch("getVoiceRobot",[this.page,this.formItem.nickname,this.formItem.industryid,_this])
                   resolve();
                },2000)
              })
          },
          // 获取机器人话术模板
          getVoiceRobot(){
             const _this = this
              if(!this.ismanage){
                this.getShareRobotLists()
              }else{
                this.$store.dispatch('getVoiceRobot',[this.page,'','',_this,1])
              }
          },
            ...mapActions(['getIndustry']),
            // getVoiceRobot(data) {
            //   this.$store.dispatch("voiceRobotList")
            //   getVoiceRobotList(data).then(res => {
            //     console.log("话术模板");
            //     console.log(res);
            //     if (res.code == "10000") {
            //       this.voiceRobotList = res.content;
            //     }
            //   });
            // },
            search() {
             console.log(this.rtype)
                const _this = this
                let data = {
                    nickname: this.formItem.nickname ? this.formItem.nickname : "",
                    industryid: this.formItem.industryid ? this.formItem.industryid : ""
                };
                if(!this.ismanage){
                  this.getShareRobotLists(data)
                }else{
                  this.$store.dispatch('getVoiceRobot',[this.page,this.formItem.nickname,this.formItem.industryid,_this,1])
                }

                console.log("执行了")

            },
            // 清空搜索
            empty() {
                this.formItem.nickname = "";
                this.formItem.industryid = "";
            },
            // 新建话术
            addVoiceRobot() {
              this.$refs.tabs.activeKey = "namePar1";
              this.$refs.setting.removeData(); // 清空基本设置
            },
            // 复制话术
            copyVoiceRobot() {
                const _this = this
                if (!this.robotid) {
                    this.$Message.error({
                        top: 50,
                        duration: 3,
                        content: "请先选择话术"
                    });
                    return false;
                }

                let data = {
                    robotid: this.robotid
                };
                this.$Modal.confirm({
                    title: "复制话术",
                    content: "<p>是否确定复制</p>",
                    loading: true,
                    onOk: () => {
                        copySelfVoiceRobot(data).then(res => {
                            console.log(res);

                            if (res.code == "10000") {
                                setTimeout(() => {
                                    this.$Modal.remove();
                                    this.$Message.success({
                                        top: 50,
                                        duration: 3,
                                        content: "复制成功",

                                    });
                                }, 2000);

                             console.log("执行啦")
                              if(!this.ismanage){
                                this.getShareRobotLists()
                              }else{
                                this.$store.dispatch('getVoiceRobot',[this.page,'','',_this,1])
                              }
                            } else {
                                this.$Message.error({
                                    top: 50,
                                    duration: 3,
                                    content: res.content
                                });
                            }
                            // this.getVoiceRobot();
                        });
                    },
                    onCancel: () => {
                        this.$Message.info("取消复制");
                    }
                });
            },

             //点击获取分享的机器人配置详情
          getShareRobotDetails(e,index){
             this.rtype = e.rtype
             console.log(e)
             this.flagIndex = index;
             this.$refs.setting.parentMsg(e); // 基本设置
             this.$refs.labelTit.parentMsg(e); // 意向标签
          },
            // 点击获取话术配置详情
            getVoiceRobotDetails(e, index) {
                console.log("------e-----");
                console.log(e);
                console.log(index);
                this.flagIndex = index;
                this.robotid = e.robotid;
                this.serviceid = e.onserviceid;
                this.$refs.setting.parentMsg(e); // 基本设置
                this.$refs.global.parentMsg(e); // 全局回答
                this.$refs.refash.parentMsg(e); // 更新记录
                this.$refs.labelTit.parentMsg(e); // 意向标签
                this.$refs.quseAll.parentMsg(e); // 问题库
                this.$bus.emit("pass",e)
                //this.$refs.qusetion.parentMsg(e); // 主动发问

                this.$refs.qusetion.getHoodleMobileLists({
                    serviceid: this.serviceid,
                    remark: "",
                    sceneid: this.childrenData.sceneid
                }); // 主动发问
                this.$refs.global.getZtCmpRobotGlobalAnswer({
                    serviceid: this.serviceid,
                    "ztCmpRobotVtype.typeid": this.childrenData.typeid,
                    pageSize: 100
                });
            },



            // 获取话术行业列表
            // getIndustry() {
            //   getIndustryList().then(res => {
            //     console.log("话术行业");
            //     console.log(res);
            //     if (res.code == "10000") {
            //       this.industryList = res.content;
            //     }
            //   });
            // },
            //删除某一项按钮
            detailSelf(event, robotid) {
             const _this = this
                event.stopPropagation();
                console.log(robotid);
                let data = {
                    robotid: robotid
                };
                this.deleteModel = true;
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "<p>是否确认删除改话术</p>",
                    onOk: () => {
                        deleteVoiceRobot(data).then(res => {
                            console.log(res);
                            if (res.code == "10000") {
                                let that = this;
                                this.$Message.success({
                                    top: 50,
                                    duration: 3,
                                    content: "删除成功"
                                });
                                this.robotid = "";
                                this.flagIndex = "";
                              if(!this.ismanage){
                                this.getShareRobotLists()
                              }else{
                                this.$store.dispatch('getVoiceRobot',[this.page,'','',_this,1])
                              }
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
            },
            // 选择要分享的公司
            selectShareCmp(select) {
                console.log(select);
                if (select.length < 1) {
                    console.log("没选中");
                    this.ShareList = [];
                } else {
                    console.log("选择了");
                    this.ShareList = select;
                }
            },
            // 分享弹窗
            shareSelf(e) {
                console.log(e);
                this.showModal = true;
                this.ShareList = [];
                let data = {
                    robotid: e
                };
                getCmpShare(data).then(res => {
                    console.log("已分享的公司");
                    console.log(res);
                    if (res.code == "10000") {
                        this.haveShareList = res.content;
                        for (let i = 0; i < this.companyList.length; i++) {
                            this.$refs.selection.$refs.tbody.objData[i]._isChecked = false;
                            this.$refs.selection.$refs.tbody.objData[i]._disabled = false;
                            for (let j = 0; j < this.haveShareList.length; j++) {
                                if (
                                    this.companyList[i].companyid === this.haveShareList[j].cmpid
                                ) {
                                    console.log("一致");
                                    this.$refs.selection.$refs.tbody.objData[i]._isChecked = true;
                                    this.$refs.selection.$refs.tbody.objData[i]._disabled = true;
                                }
                            }
                        }
                    }
                });
            },
            // 搜索公司
            searchAgent() {
                let data = {
                    pageNo: 1,
                    pageSize: 10,
                    cmpname: this.cmpname ? this.cmpname : ""
                };
                this.pageNo = 1;
                this.queryAgentList(data);
            },
            // 分享按钮
            shareBtn() {
                if (this.ShareList.length < 1) {
                    this.$Message.error("请选择要分享的公司");
                } else {
                    let selectNum = [];
                    this.ShareList.forEach(e => {
                        console.log(e);
                        selectNum.push(e.companyid);
                    });
                    let data = {
                        robotid: this.robotid,
                        serviceid: this.serviceid,
                        cmpids: selectNum.join(","),
                        type: "json"
                    };
                    this.$Modal.confirm({
                        title: "分享",
                        content: "<p>是否保存分享</p>",
                        onOk: () => {
                            saveOrUpdateCmpShare(data).then(res => {
                                if (res.code == "10000") {
                                    this.$Message.success("分享成功");
                                    this.showModal = false;
                                    this.$refs.selection.selectAll();
                                } else {
                                    this.$Message.error(res.content);
                                }
                            });
                        },
                        onCancel: () => {}
                    });
                }
            },
            // 公司列表
            queryAgentList(data) {
                queryAgent(data).then(res => {
                    console.log("公司列表");
                    console.log(res);
                    if (res.code == "10000") {
                        this.companyList = res.content.list;
                        this.total = res.content.totalCount;
                    }
                });
            }
        },
        computed:{
            ...mapState(["userMsg"])
        }
    };
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
    border: 1px solid #219480;
    box-shadow: 0 0 1px #219480;
    background-color: #E0FFF5;
    /*border: 1px solid #006edd;*/
    /*box-shadow: 0 0 1px #006edd;*/
    /*background-color: rgba(199, 199, 199, 0.1);*/
    margin-top: 10px;
    padding: 10px;


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
