
import {
  GETINDUSTRYLIST,
  GETVOICEROBOT,
  GETLABELLIST,
  GETINFORMANTLIST,
  GETIMAINSLIST,
  GETHOODLEMOBILELIST,
  GETCUSTOMERITEMLIST,
  RESLOGIN     ,       //登录
} from "./mutation-type"
import Vue from 'vue'
import label from "../pages/nav2/components/label";
export  default  {
  [GETVOICEROBOT](state,voiceRobotList){
      state.voiceRobotList=voiceRobotList
  },
  [GETINDUSTRYLIST](state,industryList){
      state.industryList = industryList
  },
  [GETLABELLIST](state,labelList) {
    state.labelList = labelList
  },
  [GETINFORMANTLIST](state,informantList){
     state.informantList=informantList
  },
  [GETIMAINSLIST](state,imainsList){
    state.imainsList=imainsList
  },
  [GETHOODLEMOBILELIST](state,question){
     state.question =  question
  },
  [GETCUSTOMERITEMLIST](state,customerItemList){
     state.customerItemList = customerItemList
  },
  [RESLOGIN](state,userMsg){
      state.userMsg = userMsg
  },

  setUserInfo(state, value) { //设置用户信息
    for (let key in value) {
      Vue.set(state.userInfo, key, value[key]);
    }
    let time = new Date();
    Vue.set(state.userInfo, "lastTime", {
      date: time.toLocaleString(),
      second: time.getTime()
    });
    console.log(state.userInfo)
    console.log("mutations")
  },
  deleteUserInfo(state, value) {
    Vue.delete(state.userInfo, value.key);
  },
  setOtherInfo(state, value) { //设置其他信息
    for (let key in value) {
      Vue.set(state.otherInfo, key, value[key]);
    }
    let time = new Date();
    Vue.set(state.otherInfo, "lastTime", {
      date: time.toLocaleString(),
      second: time.getTime()
    });
  },
  deleteOtherInfo(state, value) {
    Vue.delete(state.otherInfo, value.key);
  },
  setLanguage(state, value) {
    for (let key in value) {
      Vue.set(state.language, key, value[key]);
    }
    let time = new Date();
    Vue.set(state.language, "lastTime", {
      date: time.toLocaleString(),
      second: time.getTime()
    });
  },
  clearVuex(state) {
    state.userInfo = {};
    state.otherInfo = {};
  }
}
