import axios from 'axios';
import http from './https.js'
let base = '';
// let api = 'http://47.94.89.73:5432'   //测试
  // let api = 'http://39.107.30.51:5432' //正式
  let api = "http://api.yizeai.com/"     //现在统一
  //  let api = "http://39.107.30.51:5438"       // 测试库

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//登录接口 /open/verfilyLoginpassword=${}
export const resLogin = params => { return http.post(`${api}/open/verfilyLogin`, params) };
// 微信二维码 登录 https://open.weixin.qq.com/connect/qrconnect?appid=wxe31cb2a26c8ff6fd&redirect_uri=http://zeec.yuexunai.com/&response_type=code&scope=snsapi_login&state=STATE
export const wxLogin = params => { return http.get(`${api}/open/wxLogin`, { params: params }); };
//首页接口
// 1. 呼叫数据
export const homeRobatData = params => { return http.get(`${api}/count/getRobotCallData`, { params: params }); };
// 2.呼叫结果 getAICallDetailData_count
export const getCallResult = params => { return http.get(`${api}/sale/getRobotCallResult`, { params: params }); };

// 3. 客户意向
export const getGadsCase = params => { return http.post(`${api}/count/getAICallDetailData?type=${params.type}`, params) };

// Home 页面 http://47.94.89.73:5432/manage/getZtTimeNoticeList?pageNo=1&pageSize=10
// 1. 消息中心
export const getNewsMore = params => { return http.get(`${api}/manage/getZtTimeNoticeList`, { params: params }); };
// 2.机器人个数
export const getRobatPeople = params => { return http.get(`${api}/pay/getBalance`, { params: params }); };
// 3.绑定微信 /manage/getShowqrcode
export const addWxChat = params => { return http.get(`${api}/manage/getShowqrcode`, { params: params }); };
// 4. 查询是否绑定微信
export const isWeChat = params => { return http.get(`${api}/manage/checkIsBank`, { params: params }); };
// 5.解绑微信 /manage/unbandWx
export const falseWxChat = params => { return http.get(`${api}/manage/unbandWx`, { params: params }); };
// 6.请求图片
// export const getImage = params => { return http.post('http://123.56.24.229:8080/wx_api2/rest/?action=getYzWXQRCode', params) };
//财务管理
// 1. 财务管理-余额与积分
export const getCmpBalance = params => { return http.post(`${api}/pay/getBalance`, params) };
// 2. 财务管理-本月消费
export const getPresentMonthPay = params => { return http.post(`${api}/pay/getPresentMonthPay`, params) };
// 3. 财务管理-本月拨打数量
export const getPresentMonthTolCount = params => { return http.post(`${api}/pay/getPresentMonthTelCount`, params) };
// 4. 财务管理-本月拨打时长
export const getPresentMonthTelTime = params => { return http.post(`${api}/pay/getPresentMonthTelTime`, params) };
// 5. 账单报表
export const getBillingStatements = params => { return http.post(`${api}/pay/getMonthTelReport?type=1`, params) };
// 6. 账单明细
export const getBillingDetails = params => { return http.post(`${api}/pay/getZtPayBillByCmpid`, params) };
// 7. 充值记录
export const getRechargeRecord = params => { return http.post(`${api}/pay/getPayRechargeLog`, params) };
// 8. 机器人账单
export const getRobotBill = params => { return http.post(`${api}/pay/getZtRobotChargingList`, params) };
  //修改结束时间
export const updateRobotEndTime = params=>{ return http.post(`${api}/pay/updateRobotEndTime?${params}`) };
// AI机器人-通话记录
// 1. 销售记录列表
export const getSaleDatas = params => { return http.get(`${api}/sale/getSaleDataList`, { params: params }) };
// export const getTaskDatas = params => { return http.get(`${api}/sale/getSaleDataListByEs`, { params: params }) };
// 2. 获取意向客户等级
export const getIcLevelList = params => { return http.post(`${api}/channel/getIcLevelList`, params) };
// 3. 机器人通话记录详情
export const getVoiceRobotChatList = params => { return http.post(`${api}/sale/getVoiceRobotChatList`, params) };
// 4. 重新拨打
export const resetCall = params => { return http.post(`${api}/sale/resetSaleDataByResult`, params) };
// 5. 批量删除
// export const manyDeleteSaleDate = params => { return http.get(`${api}/sale/manyDeleteSaleDate`, { params: params }) };
export const manyDeleteSaleDate = params => { return http.get(`${api}/sale/manyDeleteSaleDate`, { params: params }) };
// 6. 机器人测试
export const saveTestSaleData = params => { return http.get(`${api}/sale/saveTestSaleData`, { params: params }) };
// 7. 生成电销数据
export const saveSaleDataByResult = params => { return http.post(`${api}/sale/saveSaleDataByResult`, params) };
// 8.机器人测试 测试任务 getTeskSaleTaskList_sale
export const getRobatDataTask = params => { return http.post(`${api}/sale/getTeskSaleTaskList`, params) };
// 9. 导出通话录音
export const exportTapeFile = params => { return http.get(`${api}/manage/downloadFile`, { params: params }) };
// export const exportTapeFile = params => { return http.post(`${api}/manage/downloadFile`, params) };
// 10. 导出通话记录
export const exportCallRecordFile = params => { return http.get(`${api}/sale/exportRobotSaleData`, { params: params }) };
// 11. 已读/未读
export const readSaleData = params => { return http.get(`${api}/sale/readSaleData`, { params: params }) };

// AI机器人-呼叫任务
// 1. 销售任务列表
export const getSaletask = params => { return http.post(`${api}/sale/getZtCmpSaletaskList?calltype=3`, params) };
// 2. 呼叫情况
export const getCallSituation = params => { return http.get(`${api}/sale/getTaskDetail`, { params: params }) };
// 3.接听情况
export const getCallDetails = params => { return http.post(`${api}/sale/getZtCmpSaletaskList`, params) };
// 4. 操作记录
export const getOperateRecord = params => { return http.get(`${api}/channel/getZtGuserOperateByServiceid`, { params: params }) };
// 5. 操作人
export const getCmpUserPage = params => { return http.get(`${api}/manage/getCmpUserPage`, { params: params }) };
// 6.新增任务getSurplusOccurs_sale addZtCmpSaletask_sale
// export const addSurplusOccurs = params => { return http.post(`${api}/sale/addZtCmpSaletask_sale`, params) };
export const addZtCmpSaletask = params => { return http.post(`${api}/sale/addZtCmpSaletask`, params) };
// 7. 获取主叫号码
export const getCmpCallOutNumber = params => { return http.post(`${api}/im/getCmpCallOutNumberList`, params) };
// 8. 获取话术模板
export const getVoiceRobotUnionShare = params => { return http.post(`${api}/channel/getVoiceRobotUnionShareList`, params) };
// 9. 删除任务
export const deleteZtCmpSaletask = params => { return http.get(`${api}/sale/deleteZtCmpSaletask`, { params: params }) };
// // 10. 获取主叫号码
// export const getCmpCallOutNumber = params => { return http.post(`${api}/im/getCmpCallOutNumberList`, params) };
// // 11. 获取话术模板
// export const getVoiceRobotUnionShare = params => { return http.post(`${api}/channel/getVoiceRobotUnionShareList`, params) };
// // 12. 删除任务
// export const deleteZtCmpSaletask = params => { return http.get(`${api}/sale/deleteZtCmpSaletask`, { params: params }) };
// 11. 编辑任务回显数据
export const getOneTask = params => { return http.post(`${api}/sale/getOneTask`, params) };
// 12. 全部开启任务
export const startTask = params => { return http.get(`${api}/sale/startTask`, { params: params }) };
// 13. 全部暂停任务
export const stopTask = params => { return http.get(`${api}/sale/stopTask`, { params: params }) };
// 14. 编辑任务
export const EditTask = params => { return http.post(`${api}/sale/EditTask`, params) };
// 15.开启单个任务
export const updateCallFlag = params => { return http.get(`${api}/sale/updateCallFlag`, { params: params }) };
// 16.导入文件
export const manyAddSaleData = params => { return http.post(`${api}/sale/manyAddSaleDataV2?validtime=2099-07-01 23:59:59`, params) };
// 17. 查看通话详情
export const getSaleDataMatch = params => { return http.get(`${api}/sale/getSaleDataMatch`, { params: params }) };
// 18. 修改意向标签
export const updateSaleDateIcLevel = params => { return http.post(`${api}/sale/updateSaleDateIcLevel`, params) };
// 19. 获取机器人数
export const getSurplusOccurs = params => { return http.post(`${api}/sale/getSurplusOccurs`, params) };
// 20. 获取客户属性
export const getSaleDateCustomerAttrLinks = params => { return http.get(`${api}/sale/getSaleDateCustomerAttrLinks`, { params: params }) };
// 21. 判断是否在呼叫时间范围内
export const checkTaskIsInCallTime = params => { return http.get(`${api}/sale/checkTaskIsInCallTime`, { params: params }) };

//AI机器人 - 参数设置
// 1. 获取微信消息推送设置
export const getSaveCmpParam = params => { return http.get(`${api}/channel/getCmpPushTime`, { params: params }) };
// 2. 微信消息推送设置
export const setSaveCmpParam = params => { return http.get(`${api}/channel/saveCmpParam`, { params: params }) };
// 3. 获取任务呼叫时间
export const getSaletaskCall = params => { return http.post(`${api}/sale/getSaletaskCalltime`, params) };
// 4. 添加或编辑任务呼叫时间
export const updateSaletaskCalltime = params => { return http.post(`${api}/sale/saveOrUpdateSaletaskCalltime`, params) };
// 5. 删除任务呼叫时间
export const delSaletaskCalltime = params => { return http.get(`${api}/sale/delSaletaskCalltime`, { params: params }) };
// 6.设置手机号显示与隐藏  open/getYzCheckQRCode?userid=2246
// export const getEwm = params => { return http.get(`http://123.56.24.229:8080/wx_api2/rest/?action=getYzCheckQRCode`, { params: params }) };
export const getEwm = params => { return http.get(`${api}/open/getYzCheckQRCode`, { params: params }) };
//7 .设置保存AB级客户手机号隐藏与显示
export const showOrHidePhone = params => { return http.get(`${api}/manage/showOrHidePhone`, { params: params }) };
//8 .获取AB级客户手机号隐藏与显示的状态
export const getShowOrHide = params => { return http.get(`${api}/manage/getShowPhonePermission`, { params: params }) };
//  线路管理
 // 1. 查询线路管理
export const getLineInfo = params => { return http.get(`${api}/channel/getLineInfoV2?${params}`) };
 //2 . 删除线路
export const delNumberConf = params => { return http.get(`${api}/channel/delNumberConf?phone=${params}`) };
//  3. 使用该线路
export const saveNumberConf = params => { return http.get(`${api}/channel/saveNumberConf?phone=${params}`) };

//账号设置 http://47.94.89.73:5432/manage/getUserInfo
// 1. 获取所有表单数据
export const getFromSle = params => { return http.get(`${api}/manage/getUserInfo`, { params: params }) };
// 2. 修改密码 http://47.94.89.73:5432/pay/updatePwd?password=123456
export const changePassword = params => { return http.get(`${api}/manage/updatePwd`, { params: params }) };
// 3.  上传头像
export const updataImg = params => { return http.post(`${api}/open/uploadFile?dir=image`, params) };
//
// 4.保存头像 http://47.94.89.73:5432/manage/updatePhoto?photo=zeefile/attached/20190730java/20190730155551_189.jpg
export const savePhoto = params => { return http.get(`${api}/manage/updatePhoto`, { params: params }) };
// 5.修改基本信息http://localhost:5432/manage/updateUserInfo?sex=2&deptName=技术部1&jobname=Java1&name=李国胜1&phone=18718520784
export const saveSlef = params => { return http.post(`${api}/manage/updateUserInfo`, params) };

// 话术管理 - 话术配置

//  0  获取机器人模板  非代理商
export const  getShareRobotList = params =>{return  http.post(`${api}/channel/getShareRobotList`, params)}
// 1. 获取话术行业列表
export const getIndustryList = params => { return http.post(`${api}/knowBase/getIndustryList`, params) };
// 2. 基本设置 - 标签
export const getCmpRobotLevel = params => { return http.get(`${api}/channel/getCmpRobotLevel`, { params: params }) };
// 3. 获取机器人话术模板
//export const getVoiceRobotList = params => { return http.post(`${api}/channel/getVoiceRobotList`, params) };
export const getVoiceRobotList = (params,nickname,industryid) => { return http.post(`${api}/channel/getVoiceRobotList?pageSize=10&pageNo=${params}&nickname=${nickname}&industryid=${industryid}`) };  //改成下拉刷新

// 4. 基本设置- 发音人
export const getInformant = params => { return http.get(`${api}/channel/getInformant`, { params: params }) };
// 5. 主动发问- 场景
export const getSceneList = params => { return http.post(`${api}/channel/getSceneList`, params) };
// 6. 全局回答- 全局语境类型
export const getZtCmpRobotVtypeList = params => { return http.post(`${api}/channel/getZtCmpRobotVtypeList`, params) };
// 7. 问题库- 问题类型
export const getKnowTypeTreeByTypeId = params => { return http.post(`${api}/knowBase/getKnowTypeTreeByTypeId`, params) };
// 8. 问题库- 问题列表
export const getKnowQuestionList = params => { return http.post(`${api}/knowBase/getKnowQuestionList`, params) };
// 9. 问题库-编辑或新增问题库
//    export const saveOrUpdateKnowQuestion =   params => { return http.post(`${api}/knowBase/saveOrUpdateKnowQuestion`, params,{headers: {"Content-Type": "application/json"}} )};
export const saveOrUpdateKnowQuestion = params => { return http.post(`${api}/knowBase/saveOrUpdateKnowQuestion`, params) };
// 10. 问题库-删除问题getHoodleMobileList
export const deleteKnowQuestion = params => { return http.post(`${api}/knowBase/deleteKnowQuestion`, params) };
// 11. 意向标签- 编辑意向客户
export const saveOrUpdateIcLevel = params => { return http.post(`${api}/channel/saveOrUpdateIcLevel`, params) };
// 12. 更新记录
export const getZtRobotOperate = params => { return http.get(`${api}/channel/getZtRobotOperate`, { params: params }) };
// 13. 删除机器人话术模板
export const deleteVoiceRobot = params => { return http.get(`${api}/channel/deleteVoiceRobot`, { params: params }) };
// 14. 基本设置 - 意图
export const getZtIntentionMainList = params => { return http.get(`${api}/channel/getZtIntentionMainList`, { params: params }) };
// 15. 主动发问 - 多轮会话列表
export const getHoodleMobileList = params => { return http.post(`${api}/channel/getHoodleMobileList`, params) };
// 16. 主动发问 - 新增问题
// export const saveOrUpdateHoodleMobile = params => { return http.post(`${api}/channel/saveOrUpdateHoodleMobile`, params) };
export const saveOrUpdateHoodleMobile = (`${api}/channel/saveOrUpdateHoodleMobile`)
// 17. 主动发问 - 新增答案
// export const saveOrUpdateHoodleMobileAnswer = params => { return http.post(`${api}/channel/saveOrUpdateHoodleMobileAnswer`, params) };
export const saveOrUpdateHoodleMobileAnswer = (`${api}/channel/saveOrUpdateHoodleMobileAnswer`);
// 18. 主动发问 - 删除问题
export const deleteHoodleMobile = params => { return http.post(`${api}/channel/deleteHoodleMobile`, params) };
// 19. 意向标签 - 获取意向规则客户设置
export const getIcRuleList = params => { return http.get(`${api}/channel/getIcRuleList`, { params: params }) };
// 20. 意向标签 - 删除意向规则
export const delteIcRule = params => { return http.post(`${api}/channel/delteIcRule`, params) };
// 21. 主动发问 - 答案
export const getHoodleMobileAnswerList = params => { return http.post(`${api}/channel/getHoodleMobileAnswerList`, params) };
// 22. 主动发问 - 删除答案
export const deleteHoodleMobileAnswer = params => { return http.post(`${api}/channel/deleteHoodleMobileAnswer`, params) };
// 23. 复制话术
export const copySelfVoiceRobot = params => { return http.get(`${api}/channel/copySelfVoiceRobot`, { params: params }) };
// 24. 全局回答 - 获取全局答案
export const getZtCmpRobotGlobalAnswerList = params => { return http.post(`${api}/channel/getZtCmpRobotGlobalAnswerList`, params) };
// 25. 全局回答 - 删除问题
export const deleteZtCmpRobotGlobalAnswerById = params => { return http.post(`${api}/channel/deleteZtCmpRobotGlobalAnswerById`, params) };
// 26. 基本设置 - 新增或编辑话术
export const saveOrUpdateVoiceRobot = params => { return http.post(`${api}/channel/saveOrUpdateVoiceRobot`, params) };
// 27. 主动发问 - 获取变量
export const getCustomerItemList = params => { return http.post(`${api}/sale/getCustomerItemList`, params) };
// 28. 全局回答 - 新增话术模板全局答案
// export const saveOrUpdateZtCmpRobotGlobalAnswer = params => { return http.post(`${api}/channel/saveOrUpdateZtCmpRobotGlobalAnswer`, params) };
export const saveOrUpdateZtCmpRobotGlobalAnswer = (`${api}/channel/saveOrUpdateZtCmpRobotGlobalAnswer`)
// 29. 全局回答 - 获取短信模板
export const getModelNoteList = params => { return http.post(`${api}/sale/getModelNoteList`, params) };
// 30. 全局回答 - 服务
export const getServiceTable = params => { return http.post(`${api}/manage/getServiceTable`, params) };
//全局回答 - 保存
export const getSave = params =>{return http.post(`${api}/channel/updateZtCmpRobotGlobalAnswerSeqencing`,params)};
// 31. 意向标签 - 新增编辑
export const saveOrUpdateIcRule = params => { return http.post(`${api}/channel/saveOrUpdateIcRule`, params) };
// 32. 问题库 - 客户属性
export const getZtCustomerAttrList = params => { return http.post(`${api}/channel/getZtCustomerAttrList`, params) };
// 33. 上传录音
export const updataRobotvoice = params => { return http.post(`${api}/open/uploadFile?dir=robotvoice`, params) };
// 34. 问题库-机器人跳转
export const getVoiceRobotListWithoutMenu = params => { return http.post(`${api}/channel/getVoiceRobotListWithoutMenu`, params) };
// 35. 分享公司列表
export const queryAgent = params => { return http.get(`${api}/manage/queryAgent`, { params: params }) };
// 36. 分享
export const saveOrUpdateCmpShare = params => { return http.post(`${api}/channel/saveOrUpdateCmpShare`, params) };
// 37. 获取已分享的公司
export const getCmpShare = params => { return http.get(`${api}/channel/getCmpShare`, { params: params }) };
