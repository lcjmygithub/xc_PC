var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) { s = '0' + s; }
  return s;
};
let common = {}
// common.baseUrlPort = 'http://47.94.89.73:5432/'
// common.baseUrlStatic = 'http://47.94.89.73:8080/'
// common.baseUrlStatic = 'http://47.94.89.73:8080/'
// common.baseUrl = 'http://47.94.89.73/'
// common.baseYuMing = 'http://47.94.89.73/'
//
// common.nowVideoURL = 'http://47.94.89.73' // 录音前缀
// common.upLoadVideoURL = 'http://47.94.89.73:37179/zrobot' // 上传录音前缀
// common.audioUrl = 'https://zvoice.oss-cn-beijing.aliyuncs.com/cezrobot' // 测试库片段录音地址
// common.AllaudioUrl = 'https://zvoice.oss-cn-beijing.aliyuncs.com/cerec' // 测试库整段录音地址

//测试库

// common.baseUrlPort = 'http://39.107.30.51:5438/'
// common.baseUrlStatic = 'http://39.107.30.51:8080/'
// common.baseUrl = 'http://39.107.30.51/'
// common.baseYuMing = 'http://39.107.30.51/'

// common.nowVideoURL = 'http://47.94.89.73' // 录音前缀
// common.upLoadVideoURL = 'http://47.94.89.73:37179/zrobot' // 上传录音前缀
// common.audioUrl = 'https://zvoice.oss-cn-beijing.aliyuncs.com/cezrobot' // 测试库片段录音地址
// common.AllaudioUrl = 'https://zvoice.oss-cn-beijing.aliyuncs.com/cerec' // 测试库整段录音地址

// 小诚机器人地址：47.94.161.241:8090
// 小诚TTS地址: 39.106.25.179:8045
// 小诚asr地址：47.95.227.218:8081

//39服务器  正式库
common.baseUrlPort = 'http://39.107.30.51:5432/'
common.baseUrlStatic = 'http://39.107.30.51:8080/'     //用户头像地址
common.baseUrl = 'http://39.107.30.51/'                 //添加微信
common.baseYuMing = 'http://www.yizeai.com/'        

common.nowVideoURL = "http://39.106.25.179"; //录音前缀
common.upLoadVideoURL = 'http://39.106.25.179:37179/zrobot' // 上传录音前缀
common.audioUrl = "https://zvoice.oss-cn-beijing.aliyuncs.com/zrobot" //正式库片段录音前缀
common.AllaudioUrl = "https://zvoice.oss-cn-beijing.aliyuncs.com/rec"   //整段录音前缀

//common.baseUrlPort = 'http://api.yizeai.com/'    //导入数据



export default {
  common
};
