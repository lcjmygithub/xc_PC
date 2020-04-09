<template>
  <Row style="margin-bottom: 120px">
    <i-col>
      <title-text :title="title"></title-text>
    </i-col>
    <!-- 顶部form表单 -->
    <Card class="formBox">
      <Form :model="formItem" :label-width="60">
        <Row>
          <Col span="4">
            <div style="width:100%;height:100%;">
              <Form-item label="任务名称" label-position="left">
                <i-input v-model="searchFields.taskname" placeholder="请输入任务名称" style="width:170px"></i-input>
              </Form-item>
            </div>
          </Col>
          <Col span="4">
            <Form-item label="任务状态">
              <i-select v-model="searchFields.state" placeholder="请选择任务状态" style="width:170px">
                <i-option value="1">已开启</i-option>
                <i-option value="2">暂停</i-option>
                <i-option value="4">拨打结束</i-option>
                <i-option value="0">全部</i-option>
              </i-select>
            </Form-item>
          </Col>
          <Col span="4" offset>
            <Button class="search clear1" type="primary" @click="search_01">搜索</Button>
            <Button @click="clearFrom" class="clear">清空</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Row :gutter="16" >
      <!-- 侧边栏 -->
      <i-col :span="5" gutter="16" style="margin-top:16px">
        <Card style="height:600vh">
          <Button type="primary" long @click="addTaskBtn">+新建任务</Button>
          <i-col style="display:flex;justify-content:space-between;margin-top:10px;">
            <Button
              type="text"
              long
              style="margin-right:10px;background:#1EBA93;color:#fff"
              @click="allOpenTask"
            >全部开始</Button>
            <Button type="text" long @click="allStopTask" style="background:#FE6C53;color:#fff">全部暂停</Button>
          </i-col>
          <Scroll :on-reach-bottom="handleReachBottom" height="600" style="margin:10px 0;">
            <i-col
              dis-hover
              style="margin-right:15px;"
              v-for="(item, index) in saletaskList"
              :key="index"
              :class="itemIndex === index ? 'activeClass' : 'noActiveClass'"
            >
              <div
                @click="
                  getTaskDetail(
                    {
                      taskname: item.taskname,
                      state: item.state,
                      callflag: item.callflag,
                      salenum: item.salenum,
                      taskid: item.taskid,
                      flag: item.flag,
                      yesnum: item.salecall.yesnum,
                      closenum: item.salecall.closenum,
                      errornum: item.salecall.errornum,
                      nocustnum: item.salecall.nocustnum,
                      busynum: item.salecall.busynum,
                      rejecttnum: item.salecall.rejecttnum,
                      nonum: item.salecall.nonum,
                      total: item.salecall.total,

                      harrynum: item.salecall.harrynum,
                      recalltime: item.recalltime
                    },
                    index
                  )
                "
              >
                <div style="display:flex;justify-content:space-between">
                  <p style="color:#000;font-weight:bold">{{ item.taskname }}</p>
                  <p>
                    <!-- <Button type="ghost" size="small">Ghost</Button> -->
                    <Button
                      :type="
                        item.state == '4'
                          ? 'text'
                          : item.callflag == '1'
                          ? 'primary'
                          : 'error'
                      "
                      size="small"
                      ghost
                      :class="item.state == 4 ? 'activeButton smallBtn' : 'smallBtn'"

                    >
                      {{
                      item.state == "4"
                      ? "拨打结束"
                      : item.callflag == "1"
                      ? "进行中"
                      : "已暂停"
                      }}
                    </Button>
                  </p>
                  <p
                    v-if="item.istest == ''"
                    style="cursor: pointer;"
                    @click.stop="confirm(item.taskid)"
                  >
                    <Icon type="ios-trash-outline" style="font-size:24px" />
                  </p>
                </div>
                <div style="margin-top:10px">
                  创建人:
                  <span>{{ item.ztGuser.name ? item.ztGuser.name : "" }}</span>
                </div>
                <div>
                  创建时间:
                  <Time :time="item.createtime" type="datetime" />
                </div>
                <div>
                  进度:
                  <span>
                    {{ item.salecall.total - item.salecall.nonum }}/{{
                    item.salecall.total
                    }}
                  </span>
                </div>
                <div>
                  <Progress
                    status="active"
                    :percent="
                      item.salecall.total
                        ? ((item.salecall.total - item.salecall.nonum) /
                            item.salecall.total) *
                            100 ==
                          100
                          ? Number(
                              ((item.salecall.total - item.salecall.nonum) /
                                item.salecall.total) *
                                100
                            )
                          : Number(
                              (
                                ((item.salecall.total - item.salecall.nonum) /
                                  item.salecall.total) *
                                100
                              ).toFixed(2)
                            )
                        : 0
                    "
                  ></Progress>
                </div>
              </div>
            </i-col>
          </Scroll>
        </Card>
      </i-col>
      <!-- 右边动态数据 -->
      <i-col :span="19">
        <Card style="margin-top:16px;height:600vh">
          <div class="tabs_div" style="height:30px;position: relative">
            <div style="position: absolute;top:0px;right:0px;z-index:5">
              <Button
                class="search clear1"
                :disabled="openLoading.disabled"
                @click="openCall"
                v-if="itemId != '1' && status != '4'"
              >开始</Button>
              <Button
                class="search clear1"
                :disabled="openLoading.disableds"
                @click="openCall"
                v-if="itemId == '1' && status != '4'"
              >暂停</Button>
              <Button @click="exportTape" class="search clear1" v-if="checkTab == 'name2'">下载通话录音</Button>
              <Button @click="exportCallRecord" class="search clear1" v-if="checkTab == 'name2'">导出通话记录</Button>
              <Button class="search clear1"  type="primary" @click="addGads">导入客户</Button>
              <Button @click="editTaskBtn" type="primary" class="search clear1">编辑</Button>
            </div>
            <Tabs style="overflow: visible" :animated="false" :value="checkTab" @on-click="flagTab">
              <Tab-pane label="呼叫情况" name="name1" style="font-size: 12px;">
                <Row>
                  <i-col :span="24" style="margin-bottom:4px">
                    <span style="color:#000;font-size:14px;font-weight: bold;">{{ taskDetailData.taskname }}</span>
                    <Button
                      :type="
                        taskDetailData.state == '拨打结束'
                          ? 'text'
                          : taskDetailData.state == '进行中'
                          ? 'primary'
                          : 'error'
                      "
                      size="small"
                      ghost
                      :class="
                        taskDetailData.state == '拨打结束' ? 'activeButton smallBtn' : 'smallBtn'
                      "
                    >{{ taskDetailData.state }}</Button>
                  </i-col>
                  <i-col :span="15" style="margin-bottom:4px;margin-top:8px">
                    <span style="color:#444">任务最近更新时间：</span>
                    <span style="color:#999;margin-right:10px">
                      {{
                      taskDetailData.createtime
                      ? formatDate(new Date(taskDetailData.createtime))
                      : ""
                      }}
                    </span>
                    <span>重呼 :</span>
                    <span style="color:#999">{{ taskDetailData.recalltime }}</span>
                  </i-col>
                  <i-col :span="3" style="margin-bottom:4px;text-align: right">
                    可拨打时间段：
                    <!-- <span
                        style="color:#999;display:inline-block;text-align:center;width:150px;margin-bottom:5px;"
                        v-for="(item, index) in taskDetailData.saleCalltime"
                        :key="index"
                      >
                        {{ item.startime }}&nbsp;-&nbsp;{{
                          item.endtime
                        }}&nbsp;&nbsp;
                    </span>-->
                  </i-col>
                  <i-col
                    v-if="!taskDetailData.saleCalltime.length"
                    :span="6"
                    style="text-align: left"
                  >
                    <span
                      style="color:#999;display:inline-block;text-align:center;width:150px;margin-bottom:5px;"
                    >08:30:00&nbsp;-&nbsp;20:30:00</span>
                  </i-col>
                  <i-col
                    v-if="taskDetailData.saleCalltime.length"
                    :span="6"
                    style="text-align: left"
                  >
                    <span
                      style="color:#999;display:inline-block;text-align:center;width:150px;margin-bottom:5px;"
                      v-for="(item, index) in taskDetailData.saleCalltime"
                      :key="index"
                    >
                      {{ item.startime }}&nbsp;-&nbsp;{{
                      item.endtime
                      }}&nbsp;&nbsp;
                    </span>
                  </i-col>
                  <i-col :span="17" style="text-algin:right">
                    任务描述：
                    <span style="color:#999">
                      {{
                      taskDetailData.remark
                      ? taskDetailData.remark
                      : "暂无描述"
                      }}
                    </span>
                  </i-col>

                  <!-- <div></div> -->
                </Row>
                <Row>
                  <i-col
                    :span="24"
                    class="call-warp"
                    style="background:#f0faff;padding-top:15px;margin-bottom:10px"
                  >
                    <div>
                      <span class="text-title">话术模板：</span>
                      <span class="text-content">{{ taskDetailData.talkingSkillTemplate }}</span>
                    </div>
                    <div>
                      <span class="text-title">外呼方式：</span>
                      <span class="text-content">主叫号码</span>
                    </div>
                    <div>
                      <span class="text-title">平均通话时长：</span>
                      <span class="text-content">{{ taskDetailData.phonetime }}秒</span>
                    </div>
                    <div>
                      <span class="text-title">启动方式：</span>
                      <span class="text-content">
                        {{
                        taskDetailData.flag == "1"
                        ? "定时开启"
                        : taskDetailData.flag == "3"
                        ? "延时开启"
                        : "立即开启"
                        }}
                      </span>
                    </div>
                    <div>
                      <span class="text-title">AI数量：</span>
                      <span class="text-content">{{ taskDetailData.occurs }}个</span>
                    </div>
                    <div>
                      <span class="text-title">外呼线路：</span>
                      <span class="text-content">{{ taskDetailData.calloutnum }}</span>
                    </div>
                  </i-col>
                </Row>
                <Row style="padding:20px 0">
                  <div style="display:flex; justify-content:space-between;">
                    <Card style="width:300px;margin-top:-15px">
                      <div style="display:flex;justify-content: space-around">
                        <i-circle
                          :percent="Number(taskDetailData.callProgress)"
                          :size="60"
                          stroke-color="#219480"
                        >
                          <span
                            class="demo-Circle-inner"
                            style="font-size:16px"
                          >{{ taskDetailData.callProgress }}%</span>
                        </i-circle>
                        <div style="margin-top:0px">
                          <p>
                            <span
                              style="font-size:28px;font-weight:bold"
                            >{{ taskDetailData.callProgress }}</span>%
                          </p>
                          <p>外呼进度</p>
                        </div>
                      </div>
                    </Card>
                    <Card style="width:300px;margin-top:-15px">
                      <div style="display:flex;justify-content: space-around">
                        <i-circle
                          :percent="Number(taskDetailData.callRate)"
                          :size="60"
                          stroke-color="#219480"
                        >
                          <span
                            class="demo-Circle-inner"
                            style="font-size:16px"
                          >{{ taskDetailData.callRate }}%</span>
                        </i-circle>
                        <div style="margin-top:0px">
                          <p>
                            <span
                              style="font-size:28px;font-weight:bold"
                            >{{ taskDetailData.callRate }}</span>%
                          </p>
                          <p>电话接通率</p>
                        </div>
                      </div>
                    </Card>
                    <Card style="width:300px;margin-top:-15px">
                      <div style="display:flex;justify-content: space-around">
                        <i-circle
                          :percent="Number(taskDetailData.saleMap.a)"
                          :size="60"
                          stroke-color="#219480"
                        >
                          <span class="demo-Circle-inner" style="font-size:16px">
                            {{
                            taskDetailData.saleMap.aCount
                            ? taskDetailData.saleMap.aCount
                            : 0
                            }}人
                          </span>
                        </i-circle>
                        <div style="margin-top:0px">
                          <p>
                            <span style="font-size:28px;font-weight:bold">
                              {{
                              taskDetailData.saleMap.aCount
                              ? taskDetailData.saleMap.aCount
                              : 0
                              }}
                            </span>人
                          </p>
                          <p>A客户数</p>
                        </div>
                      </div>
                    </Card>
                    <Card style="width:300px;margin-top:-15px">
                      <div style="display:flex;justify-content: space-around">
                        <i-circle
                          :percent="Number(taskDetailData.saleMap.b)"
                          :size="60"
                          stroke-color="#219480"
                        >
                          <span class="demo-Circle-inner" style="font-size:16px">
                            {{
                            taskDetailData.saleMap.bCount
                            ? taskDetailData.saleMap.bCount
                            : 0
                            }}人
                          </span>
                        </i-circle>
                        <div style="margin-top:0px">
                          <p>
                            <span style="font-size:28px;font-weight:bold">
                              {{
                              taskDetailData.saleMap.bCount
                              ? taskDetailData.saleMap.bCount
                              : 0
                              }}
                            </span>人
                          </p>
                          <p>B客户数</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Row>
                <!-- </Card> -->
                <!-- echarts 表格 -->
                <Card style="height: 320px;overflow-y:scroll;">
                  <!-- <i-col :span="24" offset="4" style="margin:20px;"> -->
                  <!-- <div id="chartPie" style="width:100%; height:400px;"></div> -->
                  <div style="padding-bottom:50px;height: 350px;position: relative">

                      <div
                        style="font-size:16px;font-family: MicrosoftYaHei-Bold;font-weight: bold;color: rgba(34, 34, 34, 1);margin-bottom:30px;"
                      >接听状态</div>
                      <EChartsView
                        v-if="this.echartsIsShow"
                        id="chartPie"
                        :data="chartBarData"
                        height="300"
                      ></EChartsView>
                      <div class="callDetail" v-if="this.echartsIsShow" style="position: absolute;left: 70%;top: 150px">
                        <!-- 已接听: {{this.taskDetailData.saleCall.yesnum}} -->
                        <div >
                          用户忙碌: &nbsp;&nbsp;{{
                          this.taskDetailData.saleCall.busynum
                          }}
                          <br />
                          用户关机: &nbsp;&nbsp;{{
                          this.taskDetailData.saleCall.closenum
                          }}
                        </div>

                        <div>
                          号码错误: &nbsp;&nbsp;{{
                          this.taskDetailData.saleCall.errornum
                          }}
                          <br />
                        </div>
                        <div>
                          无人应答: &nbsp;&nbsp;{{
                          this.taskDetailData.saleCall.nocustnum
                          }}
                          <br />
                          拒接: {{
                          this.taskDetailData.saleCall.rejecttnum
                          }}
                        </div>
                        <!-- <div></div> -->
                      </div>
                    </div>

                  <div v-if="!this.echartsIsShow" class="activeEchart">您还没有选中任务,暂无数据哦!</div>
                  <!-- </i-col> -->
                </Card>
              </Tab-pane>

              <Tab-pane label="客户列表" name="name2">
                <Row style="margin-top:10px">
                  <Row style="margin-top:10px">
                    <Form :model="gadList" :label-width="85" label-position="right">
                      <Row :gutter="30">
                        <Col span="5">
                          <Form-item style="min-width:300px" label="联系电话">
                            <i-input
                              v-model="gadList.callPhone"
                              placeholder="请输入手机号码"
                              style="width:170px"
                            ></i-input>
                          </Form-item>
                        </Col>
                        <Col span="5">
                          <Form-item style="min-width:200px" label="已读/未读">
                            <i-select v-model="gadList.isSelect" placeholder="请选择状态">
                              <i-option value="1">已读</i-option>
                              <i-option value="2">未读</i-option>
                              <i-option value="0">全部</i-option>
                            </i-select>
                          </Form-item>
                        </Col>
                        <Col span="4">
                          <Form-item label="最近通话时长">
                            <i-input
                              v-model="gadList.sTimeSmall"
                              placeholder="最短时间      秒"
                              style="width:150px"
                            ></i-input>
                          </Form-item>
                        </Col>
                        <Col span="4" style="margin-left:-30px">
                          <Form-item label="-">
                            <i-input
                              v-model="gadList.sTimeLong"
                              placeholder="最长时间      秒"
                              style="width:150px"
                            ></i-input>
                          </Form-item>
                        </Col>
                        <Col span="2" style="margin-top:8px;font-size:12px" offset="1">
                          <div style="cursor: pointer" @click="isMoreSearch = !isMoreSearch">
                            <span style="margin-top:10px;">更多</span>
                            <Icon type="md-arrow-dropdown" style="font-size:20px" />
                          </div>
                        </Col>
                        <Col span="3">
                          <div style="margin-left:-30px">
                            <Button class="search clear1" type="primary"  @click="searchGadList">搜索</Button>
                            <Button @click="clearGadList" class="clear">清空</Button>
                          </div>
                        </Col>
                      </Row>
                      <div v-if="isMoreSearch">
                        <Col span="24">
                          <!-- <Form-item label="客户等级"> -->
                          <FormItem label="意向标签">
                            <CheckboxGroup v-model="gadList.iclevelname">
                              <Checkbox
                                v-for="(item, index) in IcLevelList"
                                :key="index"
                                :label="item.iclevelid"
                              >{{ item.iclevelname }}</Checkbox>
                              <!-- <Checkbox label="90">A级(有明确意向)</Checkbox>
                              <Checkbox label="91">B级(可能有意向)</Checkbox>
                              <Checkbox label="192">C级(明确拒绝)</Checkbox>
                              <Checkbox label="193">D级(用户忙碌)</Checkbox>
                              <Checkbox label="232">E级(拨打失败)</Checkbox>
                              <Checkbox label="233">F级(无效客户)</Checkbox>
                              <Checkbox label="446">S级(忠实客户)</Checkbox>-->
                            </CheckboxGroup>
                          </FormItem>
                        </Col>
                        <Col span="5">
                          <Form-item label="数据ID">
                            <i-input
                              v-model="gadList.saleid"
                              placeholder="请输入数据ID"
                              style="width:170px"
                            ></i-input>
                          </Form-item>
                        </Col>
                        <Col span="5">
                          <Form-item label="拨打时间" :label-width="85">
                            <DatePicker
                              v-model="gadList.stime"
                              format="yyyy-MM-dd HH:mm:ss"
                              type="datetime"
                              placeholder="开始时间"
                              style="width: 170px"
                            ></DatePicker>
                          </Form-item>
                        </Col>
                        <Col span="5" style="margin-left:5px;">
                          <Form-item label="-" :label-width="20">
                            <DatePicker
                              v-model="gadList.etime"
                              format="yyyy-MM-dd HH:mm:ss"
                              type="datetime"
                              placeholder="结束时间"
                              style="width: 170px"
                            ></DatePicker>
                          </Form-item>
                        </Col>
                      </div>
                    </Form>
                  </Row>
                </Row>
                <Row>
                  <Table
                    ref="selection"
                    max-height="400"
                    :context="self"
                    :data="tableData"
                    :loading="loadings"
                    :columns="tableColumns"
                    @on-selection-change="changeData"
                    @on-row-dblclick="callDetails"
                  ></Table>
                </Row>
                <Row style="padding:20px 0">
                  <Col :span="4" style="padding-top:0px;padding-left:0px">
                    <!-- <Button @click="handleSelectAll(true)">全选</Button> -->
                    <Button class="search clear1" @click="deleteBatch">批量删除</Button>
                    <!-- <Button class="search">批量设置分类</Button> -->
                  </Col>
                  <Col :span="18">
                    <div style="margin: 0px;overflow: hidden">
                      <div style="float: right;">
                        <Page
                          :total="total"
                          :current="page"
                          @on-change="changePage1"
                          @on-page-size-change="changePageSize1"
                          show-elevator
                          show-sizer
                          show-total
                          size="small"
                        ></Page>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Tab-pane>
              <Tab-pane label="操作记录" name="name3">
                <Row style="margin-top:20px">
                  <Form :model="formItem" :label-width="80">
                    <Row>
                      <Col span="6">
                        <Form-item label="操作类型">
                          <i-select
                            v-model="searchOperate.operate"
                            placeholder="请选择操作类型"
                            @on-change="selectOperateType"
                          >
                            <i-option value="create_call">新增任务</i-option>
                            <i-option value="update_call">编辑任务</i-option>
                            <i-option value="delete_call">删除任务</i-option>
                            <i-option value="open_call">开启任务</i-option>
                            <i-option value="stop_call">暂停任务</i-option>
                          </i-select>
                        </Form-item>
                      </Col>
                      <Col span="6">
                        <Form-item label="操作人">
                          <i-select
                            v-model="searchOperate.userId"
                            placeholder="请选择操作人"
                            @on-change="cmpUserChange"
                          >
                            <i-option
                              v-for="(item, index) in cmpUserList"
                              :key="index"
                              :value="item.userId"
                            >{{ item.name }}</i-option>
                          </i-select>
                        </Form-item>
                      </Col>
                      <Col span="6">
                        <Form-item label="执行日期">
                          <Date-picker
                            type="date"
                            placeholder="选择日期"
                            style="width: 200px"
                            ref="selectTimes"
                            @on-change="selectTime"
                            format="yyyy-MM-dd"
                          ></Date-picker>
                        </Form-item>
                      </Col>
                      <Col span="3" offset="1">
                        <Button class="search clear1" @click="search_03">搜索</Button>
                        <Button @click="clearRecord" class="clear">清空</Button>
                      </Col>
                    </Row>
                  </Form>
                </Row>
                <Row>
                  <Table
                    ref="selection"
                    max-height="400"
                    :context="self"
                    :data="tableData2"
                    :columns="tableColumnsCustomer"
                  ></Table>
                </Row>
                <Col :span="24">
                  <div style="margin-top:10px;overflow: hidden">
                    <div style="float: right;">
                      <Page
                        :total="total1"
                        :current="page"
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
              </Tab-pane>
            </Tabs>
          </div>
        </Card>
      </i-col>
    </Row>
    <!-- 抽屉组件 -->
    <Drawer :title="title" :closable="true" v-model="addDrawer" width="600">
      <i-col span="18">
        <Form v-model="formItem" :label-width="70" label-position="left" style="margin-left: 15px;">
          <FormItem label="任务名称:" style="margin-top: 15px">
            <Input :disabled="formItem.disabled" v-model="formItem.taskname" placeholder="请输入任务名称"></Input>
          </FormItem>
          <FormItem label="话术模板:">
            <Select :disabled="formItem.disabled_02" v-model="formItem.robotid">
              <Option
                v-for="(item, index) in formItem.robotidList"
                :key="index"
                :value="item.robotid"
              >{{ item.nickname }}</Option>
            </Select>
          </FormItem>
          <FormItem label="主叫号码:">
            <Select v-model="formItem.calloutnum">
              <Option
                v-for="(item, index) in formItem.calloutNumList"
                :key="index"
                :label="item.phone"
                :value="item.phone"
              >{{ item.phone }}</Option>
            </Select>
          </FormItem>
          <FormItem v-show="visible" label="机器人数:">
            <span>
              机器人数共{{ maxNum.maxOccurs }}个,已用{{
              maxNum.useOccurs
              }}个,空闲{{ maxNum.surplusOccurs }}个
            </span>
            <Input type="number" v-model="formItem.occurs" placeholder="请填写机器人数"></Input>
          </FormItem>
          <FormItem label="开启方式:">
            <RadioGroup @on-change="radioChange" v-model="formItem.flag">
              <Radio :disabled="formItem.disabled" label>立即开启</Radio>
              <Radio :disabled="formItem.disabled" label="3">延时开启</Radio>
              <Radio :disabled="formItem.disabled" label="1">定时开启</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="visible1" label="开启时间">
            <Date-picker
              :disabled="formItem.disabled"
              :options="optionsTime"
              v-model="formItem.presentTime"
              type="datetime"
              placeholder="选择开启时间"
              style="width: 200px"
            ></Date-picker>
          </FormItem>
          <i-col v-if="isMore">
            <FormItem label="重呼次数">
              <Select :disabled="formItem.disabled" v-model="formItem.recalltime" placeholder="不重呼">
                <!-- <Option value=''>不重呼</Option>
                <Option value="1">重呼一次</Option>-->
                <Option
                  v-for="(item,index) in sexList"
                  :value="item.value"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="任务备注">
              <Input
                v-model="formItem.remark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder
              ></Input>
            </FormItem>
          </i-col>
          <!-- <i-col :span="12" offset="10"> -->
          <div style="display:flex">
            <Button
              @click="isMore = true"
              type="text"
              icon="ios-arrow-up"
              v-if="!isMore"
              class="grop"
            >查看更多</Button>
            <Button
              @click="isMore = false"
              type="text"
              icon="ios-arrow-down"
              v-if="isMore"
              class="grop"
            >关闭更多</Button>
          </div>
          <!-- <Button @click="isMore = true" type="primary" icon="ios-arrow-up" v-if="!isMore">查看更多</Button>
          <Button @click="isMore = false" type="primary" icon="ios-arrow-down" v-if="isMore">关闭更多</Button>-->
          <!-- </i-col> -->
          <FormItem style="margin-top:20px;text-align: center;">
            <Button
              @click="save_btn"
              :disabled="saveLoading.disabled"
              :loading="saveLoading.loading"
              class="search clear1"
            >{{ saveLoading.text }}</Button>
          </FormItem>
        </Form>
      </i-col>
    </Drawer>
    <!-- 弹框 -->
    <Modal :mask-closable="false" v-model="alertModel" title="导入数据">
      <Form :model="formTop" label-position="right">
        <FormItem label="导入文件:" :label-width="100">
          <Upload
            ref="upload"
            :format="['xlsx', 'xls']"
            :on-format-error="handleFormatError"
            :on-progress="progressFile"
            :before-upload="handleUpload"
            :show-upload-list="showFile"
            :on-success="handleSuccess"
            :data="importData"
            :action="common.common.baseUrlPort + 'sale/manyAddSaleDataV2'"
          >
            <Button icon="ios-cloud-upload-outline" class="search clear1">选择文件</Button>
          </Upload>
          <div>{{ loadingData.filename }}</div>
        </FormItem>
        <div style="display: inline-flex;">
          <FormItem label="自动去重" :label-width="100">
            <Checkbox @on-change="chNum" v-model="isdistinct"></Checkbox>
          </FormItem>
          <FormItem label="去除靓号" :label-width="100">
            <Checkbox @on-change="chPhone" v-model="isNicePhone"></Checkbox>
          </FormItem>
          <FormItem label="去除座机" :label-width="100">
            <Checkbox @on-change="chLandline" v-model="isRemoveLandline"></Checkbox>
          </FormItem>
        </div>
        <FormItem :label-width="100">
          <p @click="downloadSampleFiles" style="color:#e36159;cursor:pointer">点击此处下载示范文件</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="alertModel = false">取消</Button>
        <Button
          class="search clear1"
          :disabled="loadingData.disabled"
          :loading="loadingData.loading"
          @click="importFile"
        >{{ loadingData.text }}</Button>
      </div>
    </Modal>
    <Drawer
      title="通话详情"
      :closable="true"
      v-model="addDrawer1"
      width="1400"
      @on-close="hideEven"
      style="z-index:9999"
    >
      <i-col span="14">
        <i-col>
          <i-col style="display:flex;justify-content:space-around;">
            <div style="margin-top:20px">
              <span>数据id:</span>
              {{ formDatas.saleid }}
            </div>
            <div>
              <audio controls="controls" :src="formDatas.voxfile"  id="audioVocie1"  />
            </div>
            <div style="margin-top:13px">
              跟进状态:
              <Button type="primary" size="small" ghost>进行中</Button>
            </div>
          </i-col>
          <i-col
            style="height:75vh;text-align:center;padding-top:20px;color:#9D9D9D;overflow:auto;background:#F8F8F9"
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
              style="font-size:16px;color:#F8F8F9;padding:10px;overflow:hidden"
            >
              <span
                :class="
                  item.ifornotrobot == '1' ? 'spanRobot fl' : 'spanPeo fr'
                "
                style="display:inline-block;width:60px;line-height:60px;border-radius:50%;text-align:center;margin-top:10px"
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
                  style="display:inline-block;width:25px;height:25px;margin-bottom:5px;cursor: pointer;vertical-align: middle"
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
        <h3 class="gadLabel">客户标签</h3>
        <p>
          <span>姓名: {{ formDatas.tempcustomername }}</span>
        </p>
        <p>
          <span>电话: {{ formDatas.tempmobilephone }}</span>
        </p>
        <p>
          <span>微信: {{ formDatas.weixin }}</span>
        </p>
        <p>
          <span>客户来源: {{ formDatas.clientSource }}</span>
        </p>
        <p>
          <span>客户分组: {{ formDatas.clientGroup }}</span>
        </p>
        <p>
          <span>
            创建时间:
            {{
            formDatas.createtime
            ? formatDate(new Date(formDatas.createtime))
            : ""
            }}
          </span>
        </p>
        <p v-if="formDatas.focus">
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
    <Modal v-model="openModal" title="开启并发数设置">
      <Form :model="formItems" :label-width="80">
        <FormItem label="并发数">
          <Input
            v-model="formItems.occurs"
            type="number"
            :placeholder="'并发数不能大于' + maxNum.surplusOccurs"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="openModal = false">取消</Button>
        <Button class="search" @click="addOccurs">创建</Button>
      </div>
    </Modal>
    <!-- 片段录音 -->
    <audio
      @ended="palyEnded"
      :src="audio_src"
      preload="auto"
      id="audio_play"
      hidden
      controls="controls"
    ></audio>
    <!-- 通话情况 -->
  </Row>
</template>
<script>
import titleText from "../components/title";
import EChartsView from "../components/EChartsView";
import chartPieData from "./chartPie.js";
import echarts from "echarts";
import { setSelectSecond } from "../../common/MyFormatTime";
import {
  getSaletask,
  getCallSituation,
  getSaleDatas,
  getOperateRecord,
  getCmpUserPage,
  addSurplusOccurs,
  getCmpCallOutNumber,
  getVoiceRobotUnionShare,
  deleteZtCmpSaletask,
  getVoiceRobotChatList,
  readSaleData,
  addZtCmpSaletask,
  getOneTask,
  startTask,
  stopTask,
  EditTask,
  updateCallFlag,
  manyDeleteSaleDate,
  manyAddSaleData,
  getIcLevelList,
  getSaleDataMatch,
  updateSaleDateIcLevel,
  getSurplusOccurs,
  getSaleDateCustomerAttrLinks,
  checkTaskIsInCallTime
} from "../../api/api";
export default {
            mixins: [require("@/mymixins").default],
  components: {
    titleText,
    EChartsView
  },
  computed: {
    chartBarData() {
      // this.xData = [
      //   "已接听数",
      //   "用户关机",
      //   "号码错误",
      //   "无人应答",
      //   "用户忙碌",
      //   "尚未拨打",
      //   "拒接"
      // ];
      this.xData = ["已接听", "无应答"];
      this.sData = this.pieData;
      console.log(this.sData);
      return chartPieData("", this.xData, this.sData);
    }
  },
  data() {
    return {
      gifOpen: require("../../assetss/images/gifOpen.gif"),
      closeCon: require("../../assetss/images/closeCon.png"),
      isAudio: false,
      maxRobot: 0, // 最大并发数
      saleidsList: [], //
      audiourlList: [], // 通话录音url
      audio_src: "", // 片段录音src
      isMoreSearch: false, //是否搜索更多
      loadings: false,
      openModal: false, // 开启并发数弹窗
      iclevelid: null,
      IcLevelList: [], // 意向客户等级列表
      isdistinct: false,
      isNicePhone:false,
      isRemoveLandline:false,
      importData: {
        validtime: "2099-07-01 23:59:59",
        isdistinct: 2, // 文件去重 1为去重  2为否
        isNicePhone:2 ,  //
        isRemoveLandline:2 ,
        Authorization: "",
        taskid: ""
      },
      callflag: "", // 任务状态
      inputOccurs: 0, //
      loadingData: {
        loading: false,
        text: "确定",
        disabled: false,
        filename: ""
      },
      sexList: [
        {
          label: "不重呼",
          value: ""
        },
        {
          label: "重呼一次",
          value: 1
        }
      ],
      saveLoading: {
        loading: false,
        text: "保存",
        disabled: false
      },
      openLoading: {
        disabled: false,
        disableds: false
      },
      maxNum: {
        maxOccurs: 0, // 最大机器人数
        surplusOccurs: 0, // 空闲机器人数
        useOccurs: 0 // 已用机器人数
      },
      files: null,
      showFile: false,
      uploadFile: [],
      echartsIsShow: false,
      pieData: [], //接听饼状图数据
      itemId: 1, //开启单个暂停开始的状态
      status: 4, // 显示单个开启
      checkTab: "name1", //选中的tabs的name
      isMore: false,
      title: "新增任务",
      alertModel: false,
      visible: true, // 并发数输入框是否可见
      visible1: false, // 开启时间选择器是否可见
      itemIndex: "",
      // sData:[],
      optionsTime: {
        disabledDate: date => {
          // this成功指向vue实例
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      RobotNum: 0, //并发总数
      addDrawer1: false, //是否显示通话记录抽屉
      pageNo: 1, //记录加载的第几页数据
      maxPageNo: 1, // 最大页码
      title: "机器人外呼",
      selectCallData: {
        // 选中的数据
        taskid: "",
        salenum: "",
        flag: "",
        state: ""
      },
      selectClientNumList: [], // 客户列表选中的数组
      searchFields: {
        // 销售任务搜索
        // 搜索
        state: "", // 任务状态
        taskname: "" // 任务名称
      },
      formDatas: {
        //抽屉数据
        saleid: "",
        voxfile: "", //录音文件
        createtime: "", // 创建时间
        tempcustomername: "", //姓名
        weixin: "", //微信
        tempmobilephone: "", // 号码
        clientSource: "", //客户来源
        clientGroup: "", //客户分组
        focus: [], //客户关注点
        clientAttr: "", // 客户属性
        message: [] // 消息对话
      },
      gadList: {
        // 客户列表搜索
        callPhone: "", //电话号码
        isSelect: "", //已呼/未呼
        sTimeLong: "", //最长时间
        sTimeSmall: "", // 最短时间
        saleid: "", //数据id
        iclevelname: [], //意向标签
        pageSize: 10,
        stime: "", // 开始时间
        etime: "" // 结束时间
      },

      searchOperate: {
        // 操作记录搜索
        operate: "", // 操作类型
        userId: "", // 操作人ID
        stime: "", //时间
        etime: "",
        pageSize: 10
      },
      cmpUserList: [], // 操作人列表
      saletaskList: [], // 销售任务数据

      taskDetailData: {
        // 呼叫详情数据
        saleCalltime: [], //可拨打时间段
        createtime: "", //更新时间
        saleMap: {
          a: 0, // A级客户百分比
          b: 0, // B级客户百分比
          aCount: 0, // A级客户
          bCount: 0 // B级客户
        },
        saleCall: {
          //
          yesnum: 0, // 已接听数
          closenum: 0, // 用户关机
          errornum: 0, // 号码错误
          nocustnum: 0, // 无人应答
          busynum: 0, // 用户忙碌
          nonum: 0, // 尚未拨打
          rejecttnum: 0, // 拒接
          total: 0 // 总数
        },
        remark: "暂无描述",
        talkingSkillTemplate: "", // 话术模板
        phonetime: 0, // 通话时长
        flag: "", // 启动方式
        occurs: 0, // AI数量
        calloutnum: "", // 外呼线路
        callProgress: 0, //外呼进度
        callRate: 0, //接通率
        taskname: "",
        state: "进行中",
        recalltime: "否" // 是否重呼
      },
      formItem: {
        //新建任务数据
        disabled: false, // 是否可编辑
        disabled_02: false, // 话术是否可编辑
        taskname: "", //任务名称
        robotid: "", // 话术模板
        calloutnum: "", // 主叫号码
        remark: "", // 备注
        recalltime: "", // 重呼次数
        occurs: 2990, // 机器人数
        flag: "", // 定时开启 立即开启
        ordertime: "", // 定时开启的时间 未选择时为当前时间
        calloutNumList: [],
        robotidList: [],
        startime: "", // 当前时间
        presentTime: "" // 获取当前时间
      },
      formItems: {
        occurs: null
      },
      formTop: {
        input2: "",
        radio: ""
      },
      animal: "",
      addDrawer: false,
      self: this,
      circleList: [{}, {}, {}, {}],
      page: 1,
      total: 0, // 客户列表总数
      tableData: [], // 客户列表
      total1: 0, // 操作记录总数
      tableData2: [], // 操作记录
      tableColumns: [
        // 客户列表数据
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "通话ID",
          align: "center",
          key: "saleid"
        },
        {
          title: "拨打时间",
          align: "center",
          width: 200,
          key: "createtime",
          render: (h, params) => {
            let date = "";
            if (!params.row.createtime) {
              date = "";
            } else {
              date = this.formatDate(new Date(params.row.createtime));
            }

            return h("span", {}, date);
          }
        },
        {
          title: "联系电话",
          align: "center",
          tooltip: true,
          key: "tempmobilephone"
        },
        {
          title: "呼叫时长",
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
          title: "通话状态",
          align: "center",
          tooltip: true,
          key: "closeresult",
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
          title: "主叫号码",
          align: "center",
          key: "caller"
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
        },
        {
          title: "通话详情",
          align: "center",
          tooltip: true,
          key: "iclevelname",
          render: (h, params) => {
            const row = params.row;
            let closeresult = row.closeresult;
            if (closeresult >= 3 && closeresult < 11) {
              return h(
                "a",
                {
                  style: {
                    color: "#2589EE"
                  },
                  on: {
                    click: e => {
                      this.callDetails(params.row);
                    }
                  }
                },
                "查看"
              );
            } else {
              return h("span", "");
            }
          }
        }
      ],
      tableColumnsCustomer: [
        // 操作记录列表数据
        {
          title: "操作类型",
          align: "center",
          key: "operate",
          render: (h, params) => {
            const operate = params.row.operate;
            if (operate == "create_call") {
              return h("span", "新增任务");
            } else if (operate == "update_call") {
              return h("span", "编辑任务");
            } else if (operate == "delete_call") {
              return h("span", "删除任务");
            } else if (operate == "open_call") {
              return h("span", "开启任务");
            } else if (operate == "stop_call") {
              return h("span", "暂停任务");
            }
          }
        },
        {
          title: "操作人",
          align: "center",
          key: "username",
          render: (h, params) => {
            console.log(params.row.params);

            if (params.row.username == "undefined") {
              params.row.username = "";
            }
            return h("span", {}, params.row.username);
          }
        },
        {
          title: "执行时间",
          align: "center",
          key: "starttime",
          render: (h, params) => {
            const row = params.row.starttime;
            return h("span", {}, this.formatDate(new Date(row)));
          }
        }
      ]
    };
  },
  watch: {
    "gadList.iclevelname"(oldname, newname) {
      console.log(oldname, newname);
    },
    "formItem.presentTime"(oldname, newname) {
      console.log(oldname, newname);
    }
  },
  mounted() {

  },
  created() {
    // this.getSaletaskList();
    this.getSaletaskListCS()
    this.getIcLevel();
    this.getCmpUser({
      pageNo: 1,
      pageSize: 100000
    });
    this.getCmpCallOutNumberList();
    this.getVoiceRobotUnionShareList();
    this.getTodayZeroTime();
    this.getPresentTime();
    this.getSurplusOccursTotal();
    // this.getTaskDetail()
    this.importData.Authorization = this.userInfo.token;
  },
  methods: {
    // 显示通话详情弹框
    callDetails(sleectEle) {
      console.log(sleectEle);
      if (!(sleectEle.closeresult >= 3 && sleectEle.closeresult < 11)) {
        return false;
      }
      this.clearData();
      this.addDrawer1 = true;
      this.formDatas.saleid = sleectEle.saleid;
      this.iclevelid = sleectEle.iclevelid;
      this.formDatas.voxfile = sleectEle.voxfile
        ? this.common.common.AllaudioUrl + sleectEle.voxfile + ".wav"
        : "";
      this.formDatas.createtime = sleectEle.createtime;
      this.formDatas.tempcustomername = sleectEle.tempcustomername;
      this.formDatas.tempmobilephone = sleectEle.tempmobilephone;
      let data = { saleid: sleectEle.saleid };
      readSaleData(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
        }
      });
      getVoiceRobotChatList(data).then(res => {
        console.log(res);
        if (res.code == "10000") {
          for (let i = 0; i < res.content.length; i++) {
            res.content[i].playState = false;
          }
          this.formDatas.message = res.content;
        }
      });
      getSaleDataMatch(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.formDatas.focus = res.content.queslist;
        }
      });
      getSaleDateCustomerAttrLinks(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          this.formDatas.clientAttr = res.content;
        }
      });
    },
    // 导入任务
    addGads() {
      console.log("this.status")
      console.log(this.status)
      this.files = "";
      this.loadingData.filename = "";
      //测试需求修改 为 拨打已结束状态 也可以导入客户数据
      // if (this.selectCallData.state == "4") {
      //   this.$Message.error("已拨打结束的任务不能导入数据");
      //   return false;
      // }
      if (typeof this.itemIndex != "number") {
        this.$Message.error("请选择任务");
        return false;
      }
      this.alertModel = true;
    },
    // 获取机器人总数
    getSurplusOccursTotal() {
      getSurplusOccurs().then(res => {
        console.log("机器人总数");
        console.log(res);
        if (res.code == "10000") {
          this.maxNum.maxOccurs = res.content.maxOccurs;
          this.maxNum.surplusOccurs = res.content.surplusOccurs;
          this.maxNum.useOccurs = res.content.useOccurs;
          this.maxRobot = res.content.surplusOccurs;
        }
      });
    },
    // 新增任务
    addSurplusOccurs() {
      if (this.formItem.taskname == "") {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请填写任务名称"
        });
      } else if (this.formItem.robotid == "") {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请填写话术模板"
        });
      } else if (this.formItem.calloutnum == "") {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请选择主叫号码"
        });
      } else if (this.formItem.flag != 3 && this.formItem.occurs == "") {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请输入机器人数"
        });
      } else if (this.formItem.flag != 3 && this.formItem.occurs < 1) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "输入的机器人数不能小于0"
        });
      } else if (
        this.formItem.flag != 3 &&
        Number(this.formItem.occurs) > this.maxNum.surplusOccurs
      ) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "输入的机器人数不能大于" + this.maxNum.surplusOccurs
        });
      } else {
        console.log(this.formItem.flag);
        console.log(setSelectSecond(this.formItem.presentTime))
        if (this.formItem.flag != 1 && !this.formItem.ordertime) {
          this.formItem.ordertime = this.formItem.startime;
        } else {
          this.formItem.ordertime = setSelectSecond(this.formItem.presentTime);
        }
        // if(!this.formItem.flag) {
        //   //立即开启

        // }else if (this.formItem.flag == '1') {
        //   //定时开启
        // }else if(this.formItem.flag == '3') {
        //   //延时开启
        // }
        console.log(this.formItem.ordertime);
        let data = {
          type: "json",
          flag: this.formItem.flag,
          calloutnum: this.formItem.calloutnum,
          ordertime: this.formItem.ordertime,
          taskname: this.formItem.taskname,
          robotid: this.formItem.robotid,
          occurs: this.formItem.occurs,
          recalltime: this.formItem.recalltime,
          remark: this.formItem.remark,
          calltype: "3",
          endtime: "2099-06-16 23:59:59",
          startime: setSelectSecond(this.formItem.presentTime),
          week: "1,2,3,4,5,6,7",
          agenttime: "",
          allocationQuantity: "",
          channelnum: "",
          guidevoice: "",
          maxnum: "",
          peopleType: "",
          saleendtime: "23:59:59",
          salegropid: "",
          salemodel: "",
          salenum: "",
          salestarttime: "00:00:00",
          userids: "",
          tasktype: "1",
          peopleType: "0"
        };
        console.log(data);
        this.saveLoading.loading = true;
        this.saveLoading.disabled = true;
        this.saveLoading.text = "loading...";
        addZtCmpSaletask(data).then(res => {
          if (res.code == "10000") {
            console.log(res);
            this.$Message.success("新增成功");
            this.getSaletaskList();
            this.addDrawer = false;
            checkTaskIsInCallTime().then(result => {
              console.log(result);
              if (result.code == "10000") {
                let callflag1state = "";
                callflag1state = result.content;
                if (!callflag1state && this.formItem.flag == "") {
                  this.$Modal.confirm({
                    title: "提示",
                    content:
                      "<p>当前不在您的外呼时间内,任务不会马上进行呼叫</p>",
                    onOk: () => {},
                    onCancel: () => {}
                  });
                }
              }
            });
          } else {
            this.$Message.error({
              top: 50,
              duration: 3,
              content: res.content
            });
          }
          this.saveLoading.loading = false;
          this.saveLoading.disabled = false;
          this.saveLoading.text = "保存";
        });
      }
    },
    // 导入文件
    importFile() {
      console.log(this.files);
      if (!this.files) {
        this.$Message.error("未选择上传的文件");
        return false;
      }
      this.loadingData.loading = true;
      this.loadingData.disabled = true;
      this.loadingData.text = "loading...";
      this.$refs.upload.post(this.files);

    },
    //设置全选
    handleSelectAll(status) {
      console.log(1);

      this.$refs.selection.selectAll(status);
    },
    // 下载示例文件
    downloadSampleFiles() {
      let url = `${
        this.common.common.baseUrlPort
      }manage/toloadexcleCustomer?Authorization=${this.userInfo.token}`;
      window.location.href = url;
    },
    // 下载通话录音
    exportTape() {
      let exportNum = []; // 存储需要导出的id
      let exportUrl = []; // 存储需要导出的url
      if (this.selectClientNumList.length) {
        this.selectClientNumList.forEach(e => {
          exportNum.push(e.saleid);
          exportUrl.push(this.common.common.AllaudioUrl + e.voxfile + ".wav");
        });
      } else {
        exportNum = this.saleidsList;
        exportUrl = this.audiourlList;
      }
      let url = `${
        this.common.common.baseUrlPort
      }manage/downloadFile?saleids=${exportNum.join(",")}&url=${
        this.common.common.AllaudioUrl
      }&calltype=3&Authorization=${this.userInfo.token}`;
      window.location.href = url;
    },

    // 导出通话记录
    exportCallRecord() {
      let exportNum = []; // 存储需要导出的id
      let array =
        "数据id,时间,任务名称,客户名称,客户电话,意向标签,通话时长,拨打结果,通话记录详情";
      // if (this.selectClientNumList.length != []) {
      this.selectClientNumList.forEach(e => {
        exportNum.push(e.saleid);
      });
      let url = `${
        this.common.common.baseUrlPort
      }sale/exportRobotSaleData?array=${array}&saleids=${exportNum.join(
        ","
      )}&calltype=3&ztCustomerTm.mobilephone=${this.gadList.callPhone}&isread=${
        this.gadList.isSelect != "0" ? this.gadList.isSelect : "" // 已读/未读
      }&taskid=${this.selectCallData.taskid}&minCallTime=${
        this.gadList.sTimeSmall
      }
      &maxCallTime=${this.gadList.sTimeLong}
      &Authorization=${this.userInfo.token}`;
      window.location.href = url;
      // } else {
      // this.$Message.error({
      //   top: 50,
      //   duration: 3,
      //   content: "请选择要导出的数据"
      // });
      // }
    },
    //客户列表选中内容时触发
    changeData(selection) {
      console.log(selection);
      if (selection.length == []) {
        console.log("没值");
        this.selectClientNumList = [];
      } else {
        console.log("有值");
        this.selectClientNumList = selection;
      }
    },
    // 新增任务按钮
    addTaskBtn() {
      this.getSurplusOccursTotal();
      this.formItem.disabled = false;
      this.formItem.disabled_02 = false;
      this.emptyData();
      this.title = "新增任务";
      this.getTodayZeroTime();
      if (this.formItem.flag == "3") {
        this.visible = false;
        this.visible1 = false;
      } else if (this.formItem.flag == "1" || this.formItem.flag == "2") {
        this.visible = true;
        this.visible1 = true;
      } else {
        this.visible = true;
        this.visible1 = false;
      }
      // this.saleDatas(data)
    },
    // 立即开启,延时开启,定时开启
    radioChange(e) {
      console.log(e);
      this.formItem.flag = e;
      if (e == "3") {
        this.visible = false;
        this.visible1 = false;
      } else if (e == "1") {
        this.visible = true;
        this.visible1 = true;
      } else {
        this.visible = true;
        this.visible1 = false;
      }
    },
    // 编辑任务按钮
    editTaskBtn() {
      this.getSurplusOccursTotal();
      if (this.selectCallData.taskid == "") {
        // 如果没有选中机器人给出警告
        this.$Message.error("请选择任务");
        return false;
      }
      this.emptyData();
      this.title = "编辑任务";
      this.formItem.disabled = true;
      this.formItem.disabled_02 = false;
      let data = {
        taskid: this.selectCallData.taskid
      };
      getOneTask(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          console.log(res.content.recalltime);
          this.formItem.taskname = res.content.taskname;
          this.formItem.robotid = res.content.robotid;
          this.formItem.calloutnum = res.content.calloutnum;
          this.formItem.remark = res.content.remark;
          this.formItem.recalltime = res.content.recalltime;
          this.formItem.occurs = res.content.occurs;
          this.inputOccurs = res.content.occurs; //
          console.log();
          this.formItem.presentTime = res.content.ordertime;
          this.callflag = res.content.callflag;
          this.formItem.flag =
            res.content.flag == "1" || res.content.flag == "2"
              ? "1"
              : res.content.flag
              ? String(res.content.flag)
              : "";
          if (res.content.flag == "3") {
            this.visible = false;
            this.visible1 = false;
          } else if (res.content.flag == "1" || res.content.flag == "2") {
            this.visible = true;
            this.visible1 = true;
          } else {
            this.visible = true;
            this.visible1 = false;
          }
          if (res.content.istest == "1") {
            this.formItem.disabled_02 = true;
          } else {
            this.formItem.disabled_02 = false;
          }
        }
      });
    },
    save_btn() {
      if (this.formItem.disabled) {
        this.editTask();
      } else {
        this.addSurplusOccurs();
      }
    },
    // 清空已填数据
    emptyData() {
      this.formItem.taskname = "";
      this.formItem.robotid = "";
      this.formItem.calloutnum = "";
      this.formItem.remark = "";
      this.formItem.recalltime = "";
      this.formItem.occurs = 0;
      this.formItem.flag = "";
      this.formItem.startime = "";
      this.addDrawer = true; //显示
    },
    // 清空抽屉数据
    clearData() {
      this.iclevelid = null;
      // this.formDatas.weixin = "";
    },
    // 编辑任务保存
    editTask() {
      console.log(this.formItem.occurs);

      if (this.formItem.flag != 3 && this.formItem.occurs < 1) {
        this.$Message.error("输入的机器人数不能小于0");
      } else if (
        this.formItem.flag != 3 &&
        this.formItem.flag != "1" &&
        this.callflag == "1" &&
        Number(this.formItem.occurs) >
          Number(this.inputOccurs) + Number(this.maxNum.surplusOccurs)
      ) {
        this.$Message.error(
          "输入的机器人数不能大于" +
            (Number(this.inputOccurs) + Number(this.maxNum.surplusOccurs))
        );
      } else if (
        this.formItem.flag != 3 &&
        this.formItem.flag != "1" &&
        this.callflag != "1" &&
        Number(this.formItem.occurs) > this.maxNum.surplusOccurs
      ) {
        this.$Message.error(
          "输入的机器人数不能大于" + this.maxNum.surplusOccurs
        );
      } else if (
        this.formItem.flag == "1" &&
        Number(this.formItem.occurs) >
          Number(this.inputOccurs) + Number(this.maxNum.surplusOccurs)
      ) {
        this.$Message.error(
          "输入的机器人数不能大于" +
            (Number(this.inputOccurs) + Number(this.maxNum.surplusOccurs))
        );
      } else {
        let data = {
          type: "json",
          flag: this.formItem.flag,
          calloutnum: this.formItem.calloutnum,
          ordertime: this.formItem.ordertime,
          taskname: this.formItem.taskname,
          robotid: this.formItem.robotid,
          occurs: this.formItem.occurs,
          recalltime: this.formItem.recalltime,
          remark: this.formItem.remark,
          calltype: "3",
          endtime: "2099-06-16 23:59:59",
          startime: this.formItem.startime,

          week: "1,2,3,4,5,6,7",
          agenttime: "",
          allocationQuantity: "",
          channelnum: "",
          guidevoice: "",
          maxnum: "",
          peopleType: "",
          saleendtime: "23:59:59",
          salegropid: "",
          salemodel: "",
          salenum: "",
          salestarttime: "00:00:00",
          userids: "",
          tasktype: "1",
          peopleType: "0",

          taskid: this.selectCallData.taskid //必传项
        };
        this.saveLoading.loading = true;
        this.saveLoading.disabled = true;
        this.saveLoading.text = "loading...";
        EditTask(data).then(res => {
          if (res.code == "10000") {
            this.$Message.success({
              top: 50,
              duration: 3,
              content: "保存成功"
            });
            this.getSaletaskList();
            this.addDrawer = false;
          } else {
            this.$Message.success({
              top: 50,
              duration: 3,
              content: res.content
            });
          }
          this.saveLoading.loading = false;
          this.saveLoading.disabled = false;
          this.saveLoading.text = "保存";
        });
      }
    },
    // 抽屉关闭事件
    hideEven() {
      // 关闭录音
      let audios = document.getElementById("audioVocie1");
      audios.pause();
      console.log(audios)

      let data = {
        pageSize: this.gadList.pageSize,
        pageNo: this.page,
        calltype: 3,
        "ztCustomerTm.mobilephone": this.gadList.callPhone, // 联系电话
        isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
        minCallTime: this.gadList.sTimeSmall,
        maxCallTime: this.gadList.sTimeLong,
        taskid: this.selectCallData.taskid,
        salenum: this.selectCallData.salenum
      };
      this.saleDatas(data);
    },
    // 获取今天零点时间
    getTodayZeroTime() {
      const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );
      this.formItem.startime = this.formatDate(start);
    },
    // 获取当前时间
    getPresentTime() {
      const start = new Date(new Date(new Date()).getTime());
      this.formItem.presentTime = this.formatDate(start);
    },
    // 获取意向客户等级
    getIcLevel() {
      getIcLevelList().then(res => {
        if (res.code == "10000") {
          console.log("意向客户等级");
          console.log(res);
          this.IcLevelList = res.content;
        }
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
    //下拉加载更多
    handleReachBottom() {
      // let data = {
      //   pageNo: this.pageNo++
      // };
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("当前页码" + this.pageNo);
          console.log("最大页码" + this.maxPageNo);

          if (this.pageNo >= this.maxPageNo) {
            this.$Message.info("没有更多数据了");
            return false;
          }
          let data = {
            // pageNo: this.pageNo++,
            pageNo: ++this.pageNo,
            state: this.searchFields.state ? this.searchFields.state : "",
            taskname: this.searchFields.taskname
          };
          // for(let i = 0;i <= res.content.list.length; i++){
          //   this.saletaskList.push(res.content.list[i])
          // }
          getSaletask(data).then(res => {
            if (res.code == "10000") {
              this.$Message.success("加载更多成功");
              this.saletaskList = this.saletaskList.concat(res.content.list);
              this.maxPageNo = res.content.totalPages;
            } else {
              this.$Message.error("加载失败");
            }
          });
        }, 2000);
      });
    },

    // 播放音频
    playAudio(e, index) {
      let audios = document.getElementById("audio_play");
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
        this.isAudio = true;
      }
    },
    // 播放结束
    palyEnded() {
      console.log("播放结束了");
      this.isAudio = false;
    },
    // 全部开启任务
    allOpenTask() {
      if (this.saletaskList.length == 0) {
        this.$Message.error("未检测到任务");
        return false;
      }
      let activeArr = [];
      for (let i = 0; i < this.saletaskList.length; i++) {
        activeArr.push(this.saletaskList[i].taskid);
      }
      console.log(activeArr);

      let data = {
        taskid: activeArr.join(",")
      };
      startTask(data).then(res => {
        if (res.code == "10000") {
          let data = {
            pageSize: this.pageNo * 10
          };
          this.$Message.success("任务开启成功");
          this.getSaletaskList(data);
        } else {
          this.$Message.error(res.content);
        }
      });
    },
    // 全部暂停任务
    allStopTask() {
      if (this.saletaskList.length == 0) {
        this.$Message.error("未检测到任务");
        return false;
      }
      let stopArr = [];
      for (let i = 0; i < this.saletaskList.length; i++) {
        stopArr.push(this.saletaskList[i].taskid);
      }
      let data = {
        taskid: stopArr.join(",")
      };
      stopTask(data).then(res => {
        if (res.code == "10000") {
          // console.log(res);
          let data = {
            pageSize: this.pageNo * 10
          };
          this.$Message.success("任务暂停成功");
          this.getSaletaskList(data);
        } else {
          this.$Message.error(res.content);
        }
      });
    },
    //开启单个任务
    openCall() {
      console.log(this.selectCallData.flag);
      if (!this.tableData.length) {
        this.$Message.error("没有可外呼的客户数据");
        return false;
      }
      this.formItems.occurs = null;
      this.getSurplusOccursTotal();
      if (this.selectCallData.flag == "3") {
        this.openModal = true;
        return false;
      }
      let data = {
        taskid: this.selectCallData.taskid
      };
      this.updateCallFlags(data);
      this.getCallDetails({
        taskid: this.selectCallData.taskid,
        salenum: this.selectCallData.salenum
      });
    },
    // 开启并发数设置
    addOccurs() {
      if (this.formItems.occurs < 1) {
        this.$Message.error("输入的并发数不能小于1");
        return false;
      }
      if (Number(this.formItems.occurs) > this.maxNum.surplusOccurs) {
        this.$Message.error("输入的并发数不能大于" + this.maxNum.surplusOccurs);
        return false;
      }
      let data = {
        taskid: this.selectCallData.taskid,
        occurs: this.formItems.occurs
      };
      this.updateCallFlags(data);
    },
    //
    updateCallFlags(data) {
      this.openLoading.disabled = true;
      this.openLoading.disableds = true;
      updateCallFlag(data).then(res => {
        if (res.code == "10000") {
          console.log(res);
          var title;
          if (this.itemId == "1") {
            title = "暂停成功";
            this.itemId = "2";
            this.taskDetailData.state = "已暂停";
          } else {
            this.itemId = "1";
            this.taskDetailData.state = "进行中";
            title = "开启成功";
          }
          this.$Message.success(title);
          this.getSaletaskList();
          this.openModal = false;
          this.selectCallData.flag = "";
        } else {
          this.$Message.error(res.content);
        }
        this.openLoading.disabled = false;
        this.openLoading.disableds = false;
      });
    },
    // 删除任务
    confirm(e) {
      let data = {
        ids: e
      };
      this.$Modal.confirm({
        title: "确认删除",
        content: "<p>是否确认删除当条信息</p>",
        onOk: () => {
          deleteZtCmpSaletask(data).then(res => {
            if (res.code == "10000") {
              let that = this;
              this.$Message.success("删除成功");
              this.selectCallData.taskid = "";
              this.selectCallData.salenum = "";
              this.selectCallData.flag = "";
              this.selectCallData.state = "";
              // 清空
              this.taskDetailData.createtime = "";
              this.taskDetailData.saleMap = "";
              this.taskDetailData.remark = "暂无描述";
              this.taskDetailData.talkingSkillTemplate = "";
              this.taskDetailData.phonetime = 0;
              this.taskDetailData.flag = "";
              this.taskDetailData.occurs = 0;
              this.taskDetailData.calloutnum = "";
              this.taskDetailData.saleCalltime = [];
              this.taskDetailData.taskname = "";
              this.taskDetailData.state = "进行中";
              this.tableData2 = []; // 清空操作记录列表
              this.itemIndex = "";
              // 开始按钮状态
              this.itemId = 1;
              this.status = 4;
              this.taskDetailData.callProgress = 0;

              this.getSaletaskList();

              this.saleDatas({
                taskid: this.selectCallData.taskid,
                salenum: this.selectCallData.salenum,
                calltype: 3
              });
            } else {
              this.$Message.error("删除失败");
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    // 批量删除客户列表
    deleteBatch() {
      let removeNum = []; //需要删除的id
      if (!this.selectClientNumList.length) {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "请选择要删除的数据"
        });
      } else {
        this.selectClientNumList.forEach(e => {
          console.log(e);
          removeNum.push(e.saleid);
        });
        let data = {
          saleids: removeNum.join(","),
          calltype: 3,
          "ztCustomerTm.mobilephone": this.gadList.callPhone, // 联系电话
          isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
          minCallTime: this.gadList.sTimeSmall,
          maxCallTime: this.gadList.sTimeLong,
          taskid: this.selectCallData.taskid,
          salenum: this.selectCallData.salenum
        };
        console.log(data);
        this.$Modal.confirm({
          title: "确认删除",
          content: "<p>是否确认删除当前选中的信息</p>",
          onOk: () => {
            manyDeleteSaleDate(data).then(res => {
              if (res.code == "10000") {
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
                  "ztCustomerTm.mobilephone": this.gadList.callPhone, // 联系电话
                  isread:
                    this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
                  minCallTime: this.gadList.sTimeSmall,
                  maxCallTime: this.gadList.sTimeLong,
                  taskid: this.selectCallData.taskid,
                  salenum: this.selectCallData.salenum
                };
                setTimeout(() => {
                  this.saleDatas(data1);
                }, 300);
              } else {
                this.$Message.error({
                  top: 50,
                  duration: 3,
                  content: "删除失败"
                });
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消删除");
          }
        });
      }
    },
    // 获取主叫号码列表
    getCmpCallOutNumberList() {
      getCmpCallOutNumber().then(res => {
        if (res.code == "10000") {
          console.log("主叫号码");
          console.log(res);
          this.formItem.calloutNumList = res.content;
        }
      });
    },
    // 获取话术模板列表
    getVoiceRobotUnionShareList() {
      getVoiceRobotUnionShare().then(res => {
        if (res.code == "10000") {
          console.log("话术模板");
          console.log(res);
          this.formItem.robotidList = res.content;
        }
      });
    },
    //tabs切换时函数
    flagTab(name) {
      this.checkTab = name;
    },
    clearFrom() {
      this.searchFields.state = "";
      this.searchFields.taskname = "";
      console.log(this.searchFields.state);
    },
    // ok() {
    //   this.$Message.info("Clicked ok");
    // },
    cancel() {
      this.$Message.info("取消导入数据");
    },
    // 获取销售列表  初始化
    getSaletaskListCS(data) {
      console.log(data);
      getSaletask(data).then(res => {
        console.log("获取列表")
        console.log(res);
        if (res.code == "10000") {
          this.saletaskList = res.content.list;
          // console.log(this.saletaskList[0]);
          this.maxPageNo = res.content.totalPages;
          this.getTaskDetail(this.saletaskList[0], 0);
        }
      });
    },

    getSaletaskList(data) {
      console.log(data);
      getSaletask(data).then(res => {
        console.log("获取列表")

        console.log(res);

        if (res.code == "10000") {
          this.saletaskList = res.content.list;
          // console.log(this.saletaskList[0]);
          this.maxPageNo = res.content.totalPages;
          console.log("哈哈哈")
          console.log(this.itemIndex)
          console.log("哈哈哈")
          this.getTaskDetail(this.saletaskList[this.itemIndex], this.itemIndex);
        }
      });
    },
    // 销售任务搜索
    search_01() {
      let data = {
        state: this.searchFields.state
          ? this.searchFields.state != "0"
            ? this.searchFields.state
            : ""
          : "",
        taskname: this.searchFields.taskname,
        pageSize: 10,
        pageNo: 1
        // calltype:
      };
      this.getSaletaskList(data);
      this.selectCallData.taskid = "";
    },
    //搜索客户列表
    searchGadList() {
      let data = {
        "ztCustomerTm.mobilephone": this.gadList.callPhone,
        isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
        minCallTime: this.gadList.sTimeSmall,
        maxCallTime: this.gadList.sTimeLong,
        calltype: 3,
        pageSize: 10,
        pageNo: 1,
        taskid: this.selectCallData.taskid,
        salenum: this.selectCallData.salenum,
        level: this.gadList.iclevelname.join(","),
        saleid: this.gadList.saleid,
        stime: this.gadList.stime ? this.formatDate(this.gadList.stime) : "",
        etime: this.gadList.etime ? this.formatDate(this.gadList.etime) : ""
      };
      if (this.gadList.sTimeLong) {
        if (this.gadList.sTimeSmall > this.gadList.sTimeLong) {
          this.$Message.info("最小时长不能大于最大时长哦!");
          return;
        }
      }
      this.page = 1;
      this.saleDatas(data);
    },
    //清空客户列表
    clearGadList() {
      this.gadList.isSelect = "";
      this.gadList.callPhone = "";
      this.gadList.sTimeSmall = "";
      this.gadList.sTimeLong = "";
      this.gadList.iclevelname = [];
      this.gadList.saleid = "";
      this.gadList.stime = "";
      this.gadList.etime = "";
    },
    // 清空操作记录
    clearRecord() {
      this.searchOperate.stime = "";
      this.searchOperate.etime = "";
      this.searchOperate.operate = "";
      this.searchOperate.userId = "";
      this.$refs.selectTimes.handleClear();
    },
    removeEle() {
      console.log(456465465465);
    },
    getTaskDetail(e, index) {
      console.log("测试")
      console.log(e, index);
      console.log("测试")
      this.echartsIsShow = true;
      this.itemIndex = index;
      this.importData.taskid = e.taskid;
      this.selectCallData.taskid = e.taskid;
      this.selectCallData.salenum = e.salenum;
      this.selectCallData.flag = e.flag;
      console.log(this.selectCallData.flag);

      this.itemId = e.callflag;
      this.status = e.state;
      // 将状态传到导入客户成功时
      this.selectCallData.state = e.state;
      //重新调用  lcj
         this.clearGadList()

      // 接听状态饼状图数据
      // this.taskDetailData.saleCall.yesnum = e.yesnum;
      // this.taskDetailData.saleCall.closenum = e.closenum;
      // this.taskDetailData.saleCall.errornum = e.errornum;
      // this.taskDetailData.saleCall.nocustnum = e.nocustnum;
      // this.taskDetailData.saleCall.busynum = e.busynum;
      // this.taskDetailData.saleCall.nonum = e.nonum;
      // this.taskDetailData.saleCall.rejecttnum = e.rejecttnum;
      // this.taskDetailData.saleCall.total = e.total;
      //  未接通
      // e.noCallNum = e.total - e.yesnum - e.nonum
      console.log(e.salecall);
      this.taskDetailData.saleCall = e.salecall || e;
      console.log(this.taskDetailData.saleCall);

      this.pieData = [
        {
          value: this.taskDetailData.saleCall.yesnum,
          name: "已接听"
        },
        // {
        //   value: e.closenum,
        //   name: "用户关机"
        // },
        // {
        //   value: e.errornum,
        //   name: "号码错误"
        // },
        {
          value:
            this.taskDetailData.saleCall.total -
            this.taskDetailData.saleCall.yesnum -
            this.taskDetailData.saleCall.nonum,
          name: "无应答"
        }
        // {
        //   value: e.busynum,
        //   name: "用户忙碌"
        // },
        // {
        //   value: e.nonum,
        //   name: "尚未拨打"
        // },
        // {
        //   value: e.rejecttnum,
        //   name: "拒接"
        // }
      ];

      let that = this;
      // 呼叫情况数据
      let data = {
        taskid: e.taskid,
        salenum: e.salenum
      };
      // 客户列表数据
      let data2 = {
        taskid: e.taskid,
        salenum: e.salenum,
        calltype: 3
      };
      let data3 = {
        showcontent: "record",
        dataid: e.taskid
      };
      console.log(data);
      let callNum =
        this.taskDetailData.saleCall.total - this.taskDetailData.saleCall.nonum; // 拨打数
      let harrynum = this.taskDetailData.saleCall.harrynum; // 防骚扰数
      // if (e.total) {

      //   if (callNum) {

      //     let callProgress = (Number(callNum) / Number(e.total)) * 100;
      //     if (callProgress == "100") {

      //       this.taskDetailData.callProgress = callProgress;
      //     } else {
      //       this.taskDetailData.callProgress = callProgress.toFixed(2); //外呼进度
      //     }
      //   } else {
      //     this.taskDetailData.callProgress =
      //       (Number(callNum) / Number(e.total)) * 100;
      //   }

      //   if (e.yesnum) {
      //     // 接通率
      //     this.taskDetailData.callRate = Math.ceil(
      //       (Number(e.yesnum) / (Number(callNum) - Number(harrynum))) * 100
      //     );
      //     console.log(this.taskDetailData.callRate);
      //   } else {
      //     this.taskDetailData.callRate = 0;
      //   }
      // } else {
      //   this.taskDetailData.callProgress = 0;
      //   this.taskDetailData.callRate = 0;
      // }
      // console.log(this.taskDetailData.callProgress);
      this.taskDetailData.state =
        e.state == "4" ? "拨打结束" : e.callflag == "1" ? "进行中" : "已暂停";
      this.taskDetailData.taskname = e.taskname;
      this.taskDetailData.recalltime = e.recalltime == "" ? "否" : "是";
      this.getCallDetails(data);
      this.saleDatas(data2);
      this.operationRecord(data3);
    },
    // 获取呼叫情况
    getCallDetails(data) {
      getCallSituation(data).then(res => {
        console.log("呼叫情况");
        console.log(res);
        if (res.code == "10000") {
          this.taskDetailData.createtime = res.content.createtime;
          this.taskDetailData.saleMap = res.content.saleMap;
          this.taskDetailData.remark = res.content.remark;
          this.taskDetailData.talkingSkillTemplate =
            res.content.talkingSkillTemplate;
          this.taskDetailData.phonetime = res.content.phonetime;
          this.taskDetailData.flag = res.content.flag;
          this.taskDetailData.occurs = res.content.occurs;
          this.taskDetailData.calloutnum = res.content.calloutnum;
          this.taskDetailData.saleCalltime = res.content.saleCalltime;

          this.taskDetailData.callProgress = res.content.saleMap.callProgress
            ? res.content.saleMap.callProgress
            : 0;
          this.taskDetailData.callRate = res.content.saleMap.callRate
            ? res.content.saleMap.callRate
            : 0;
          this.taskDetailData.saleMap.aCount = res.content.saleMap.aCount
            ? res.content.saleMap.aCount
            : 0;
          this.taskDetailData.saleMap.bCount = res.content.saleMap.bCount
            ? res.content.saleMap.bCount
            : 0;
          this.taskDetailData.saleMap.a = res.content.saleMap.a
            ? res.content.saleMap.a
            : 0;
          this.taskDetailData.saleMap.b = res.content.saleMap.b
            ? res.content.saleMap.b
            : 0;
        }
      });
    },
    // 获取客户列表
    saleDatas(data) {
      this.loadings = true;
      this.saleidsList = [];
      this.audiourlList = [];
      getSaleDatas(data).then(res => {
        console.log("客户列表");
        console.log(res);
        if (res.code == "10000") {
          this.tableData = res.content.list;
          this.total = res.content.totalCount;
          this.loadings = false;
          for (let i = 0; i < res.content.list.length; i++) {
            this.saleidsList.push(res.content.list[i].saleid);
            this.audiourlList.push(
              "https://zvoice.oss-cn-beijing.aliyuncs.com/cerec" +
                res.content.list[i].voxfile +
                ".wav"
            );
          }
        }
      });
    },
    // 导入客户
    // importData() {},

    // 操作记录
    operationRecord(data) {
      getOperateRecord(data).then(res => {
        console.log("操作记录");
        console.log(res);
        if (res.code == "10000") {
          this.tableData2 = res.content.list;
          this.total1 = res.content.totalCount;
        }
      });
    },
    // 操作人
    getCmpUser(data) {
      getCmpUserPage(data).then(res => {
        console.log("操作人");
        console.log(res);
        if (res.code == "10000") {
          this.cmpUserList = res.content.list;
        }
      });
    },
    // 选择操作类型
    selectOperateType(e) {
      console.log(e);
      this.searchOperate.operate = e;
    },
    // 选择操作人
    cmpUserChange(e) {
      console.log(e);
      this.searchOperate.userId = e;
    },
    // 选择日期
    selectTime(e) {
      this.searchOperate.stime = e;
      this.searchOperate.etime = e;

      console.log(this.searchOperate.stime);
      console.log(this.searchOperate.etime);
    },

    // 操作记录搜索
    search_03() {
      let data = {
        operate: this.searchOperate.operate,
        userid: this.searchOperate.userId,
        stime: this.searchOperate.stime,
        etime: this.searchOperate.etime,
        showcontent: "record",
        dataid: this.selectCallData.taskid
      };
      this.operationRecord(data);
    },
    // 文件上传之前的操作
    handleUpload(file) {
      this.files = file;
      this.loadingData.filename = file.name;
      return false;
    },
    // 文件上传中的操作
    progressFile(event, file, fileList) {
      console.log(event);
      console.log(file);
      console.log(fileList);
    },
    // 上传的文件检验
    handleFormatError(file) {
      console.log(file);
      this.$Message.warning({
        top: 50,
        duration: 3,
        content: "文件 " + file.name + " 格式不正确，请上传.xls,.xlsx文件。"
      });
    },
    // 上传成功提示
    handleSuccess(res) {
      console.log("上传成功测试打印")
      console.log(res);
      var errors; //失败条数
      var sucmes; //成功条数
      var errorRow; //失败的行数
      var black; // 黑名单数
      var before; // 靓号
      if (res.code == "10000") {
        for (var i = 0; i < res.content.resultList.length; i++) {
          if (i == 0) {
            errors = res.content.resultList[0];
          }
          if (i == 1) {
            sucmes = res.content.resultList[1];
          }
          if (i == 2) {
            errorRow = res.content.resultList[2];
            console.log(errorRow);
          }
          if (i == 3) {
            black = res.content.resultList[3];
            console.log(black);
          }
          if (i == 4) {
            before = res.content.resultList[4];
          }
        }
        this.$refs.upload.clearFiles();
        this.saleDatas({
          pageSize: 10,
          pageNo: 1,
          calltype: 3,
          "ztCustomerTm.mobilephone": this.gadList.callPhone, // 联系电话
          isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
          minCallTime: this.gadList.sTimeSmall,
          maxCallTime: this.gadList.sTimeLong,
          taskid: this.selectCallData.taskid,
          salenum: this.selectCallData.salenum,
          level: this.gadList.iclevelname.join(","),
          saleid: this.gadList.saleid
        });

        if (sucmes == 0) {
          this.$Message.error({
            top: 50,
            duration: 3,
            content: "导入失败，请核对模板内容"
          });
        } else {
          this.$Message.success({
            top: 50,
            duration: 3,
            content: `成功导入${sucmes}条数据,有${errors}条失败,${errorRow}条数据重复,${black}条数据黑名单,${before}条靓号`
          });


        }
        this.getSaletaskList();
        this.selectCallData.salenum += this.selectCallData.salenum
          ? "," + res.content.salenum
          : res.content.salenum;
        this.saleDatas({
          taskid: this.selectCallData.taskid,
          salenum: this.selectCallData.salenum,
          calltype: 3
        });
        // setTimeout(() => {
        this.getCallDetails({
          taskid: this.selectCallData.taskid,
          salenum: this.selectCallData.salenum
        });
        // }, 3000);
        this.importData.isdistinct = 2;
        this.isdistinct = false;
        this.importData.isNicePhone = 2;
        this.isNicePhone = false
        this.importData.isRemoveLandline = 2 ;
        this.isRemoveLandline = false
        this.alertModel = false;
        this.loadingData.loading = false;
        this.loadingData.disabled = false;
        this.loadingData.text = "确定";
      } else {
        this.$Message.error({
          top: 50,
          duration: 3,
          content: "导入失败,请重试"
        });
        this.loadingData.loading = false;
        this.loadingData.disabled = false;
        this.loadingData.text = "确定";
      }
    },
    // 是否去重
    chNum(e) {
      console.log(e);
      if (e == true) {
        this.importData.isdistinct = "1";
      } else {
        this.importData.isdistinct = "2";
      }
    },
    //去除靓号
    chPhone(e){
       console.log(e)
      if (e == true) {
        this.importData.isNicePhone = "1";
      } else {
        this.importData.isNicePhone = "2";
      }
    },

    chLandline(e){
      console.log(e)
      if (e == true) {
        this.importData.isRemoveLandline= "1";
      } else {
        this.importData.isRemoveLandline = "2";
      }
    },
    // 操作记录分页
    changePage(row) {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
      console.log(row);
      let data = {
        operate: this.searchOperate.operate,
        userid: this.searchOperate.userId,
        stime: this.searchOperate.stime,
        etime: this.searchOperate.etime,
        pageNo: row,
        pageSize: this.searchOperate.pageSize,
        showcontent: "record",
        dataid: this.selectCallData.taskid
      };
      this.operationRecord(data);
    },
    // 客户列表分页
    changePage1(row) {
      this.page = row;
      let data = {
        "ztCustomerTm.mobilephone": this.gadList.callPhone,
        isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
        minCallTime: this.gadList.sTimeSmall,
        maxCallTime: this.gadList.sTimeLong,
        calltype: 3,
        pageSize: this.gadList.pageSize,
        pageNo: row,
        taskid: this.selectCallData.taskid,
        salenum: this.selectCallData.salenum,
        level: this.gadList.iclevelname.join(","),
        saleid: this.gadList.saleid,
        stime: this.gadList.stime ? this.formatDate(this.gadList.stime) : "",
        etime: this.gadList.etime ? this.formatDate(this.gadList.etime) : ""
      };
      this.saleDatas(data);
    },
    // 操作记录pagesize
    changePageSize(row) {
      this.searchOperate.pageSize = row;
      let data = {
        operate: this.searchOperate.operate,
        userid: this.searchOperate.userId,
        stime: this.searchOperate.stime,
        etime: this.searchOperate.etime,
        pageNo: 1,
        pageSize: this.searchOperate.pageSize,
        showcontent: "record",
        dataid: this.selectCallData.taskid
      };
      this.operationRecord(data);
    },
    //客户列表记录分页
    changePageSize1(row) {
      this.gadList.pageSize = row;
      let data = {
        "ztCustomerTm.mobilephone": this.gadList.callPhone,
        isread: this.gadList.isSelect != "0" ? this.gadList.isSelect : "", // 已读/未读
        minCallTime: this.gadList.sTimeSmall,
        maxCallTime: this.gadList.sTimeLong,
        calltype: 3,
        pageSize: this.gadList.pageSize,
        pageNo: 1,
        taskid: this.selectCallData.taskid,
        salenum: this.selectCallData.salenum,
        level: this.gadList.iclevelname.join(","),
        saleid: this.gadList.saleid,
        stime: this.gadList.stime ? this.formatDate(this.gadList.stime) : "",
        etime: this.gadList.etime ? this.formatDate(this.gadList.etime) : ""
      };
      this.saleDatas(data);
    },
    // 修改意向标签
    updateIcLevel(e) {
      console.log(e);
      let data = {
        saledataid: this.formDatas.saleid,
        levelid: e
      };
      updateSaleDateIcLevel(data).then(res => {
        console.log(res);
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
.call-warp {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding-left: 100px;
  margin-top: 25px;
}
.ghost-btn {
  width: 51px;
  height: 20px;
  font-size: 12px;
  padding: 0px;
  color: #39f;
  border-color: #39f;
}
.call-warp .text-content {
  color: #999;
}
.call-warp div {
  padding-bottom: 10px;
  width: 33.33%;
  /* position: absolute; */
}
.spanRobot {
  background: #36AC85;
  display: inline-block;
  line-height: 40px;
  float: left;
  border-radius: 6px;
  text-align: left;
  max-width: 70%;
}
.spanPeo {
  background: #ccc;
  display: inline-block;
  line-height: 40px;
  text-align: right;
  float: right;
  border-radius: 6px;
}
.gadLabelBox p {
  line-height: 40px;
  padding-left: 10px;
  font-size: 14px;
  font-family: "SourceHanSansCN-Regular";
}
.gadLabel {
  width: 100px;
  border-bottom: 1px solid #333;
  text-align: center;
  margin-left: 10px;
}
.activeClass {
  border: 1px solid #2d8cf0;
  margin-top: 10px;
  padding: 10px;
   box-shadow: 0 0 1px #006edd;
  background-color: rgb(240, 250, 255);
  /* margin-right:10px; */
}
.noActiveClass {
  border: 1px solid #999;
  margin-top: 10px;
  padding: 10px;
}
.activeEchart {
  height: 100%;
  /* margin:auto; */
  text-align: center;
  margin-top: 150px;
  font-size: 30px;
}
.formBox .ivu-form-item {
  margin-bottom: 0;
}
.grop {
  color: #999;
}
.callDetail {
  position: relative;
  color: #9d9d9d;
  left: 92vh;
  top: -17vh;
}
.activeButton {
  border: 1px solid #ccc !important;
  color: #ccc!important;
}
.ivu-tabs {
  overflow: none;
}
.smallBtn:hover {
    /* background-color: transparent !important; */
}
</style>
