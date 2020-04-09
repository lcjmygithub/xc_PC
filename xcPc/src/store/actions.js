import {
  GETINDUSTRYLIST,
  GETVOICEROBOT,
  GETLABELLIST,
  GETINFORMANTLIST,
  GETIMAINSLIST,
  GETHOODLEMOBILELIST,
  GETCUSTOMERITEMLIST,
  RESLOGIN           //登录
} from "./mutation-type"
import {
  getVoiceRobotList,
  getIndustryList,
  getCmpRobotLevel,
  getInformant,
  getZtIntentionMainList,
  getHoodleMobileList,
  getCustomerItemList,
  resLogin
} from "../api/api"

import store from './index'

export default {
  // 获取话术列表
  getVoiceRobot({ commit, state }, data) {
    let voiceRobotList
    let _this = data[3]
    if (data[1] == undefined) {
      data[1] = ''
    } else if (data[2] == undefined) {
      data[2] = ''
    }
    if (data[4] == 1) {
      data[0] = 1
      state.voiceRobotList = []
    } else {
      data[0] = data[0]
    }
    getVoiceRobotList(data[0], data[1], data[2]).then(res => {
      console.log("话术模板");
      console.log(res);
      if (data[0] > res.content.totalPages) {
        _this.$Message.info("没有更多数据了");
        return false;
      }
      if (res.code == "10000") {
        voiceRobotList = state.voiceRobotList.concat(res.content.list)
        if (res.content.pageNo > 1) {
          _this.$Message.success("加载更多成功");
        }
      } else {
        _this.$Message.error("加载数据失败");
      }
      commit(GETVOICEROBOT, voiceRobotList)
    });
  },

  //获取行业列表
  getIndustry({ commit, state }) {
    let industryList
    getIndustryList().then(res => {
      console.log("话术行业");
      console.log(res);
      if (res.code == "10000") {
        industryList = res.content;
      }
      commit(GETINDUSTRYLIST, industryList)
    });
  },

  //获取标签
  getCmpRobotLevelList({ commit, state }) {
    let labelList
    getCmpRobotLevel().then(res => {
      console.log("标签");
      console.log(res);
      if (res.code == "10000") {
        labelList = res.content;
      }
      commit(GETLABELLIST, labelList)
    });
  },

  //获取发音人列表
  getInformantList({ commit, state }) {
    let informantList
    getInformant().then(res => {
      console.log("发音人");
      console.log(res);
      if (res.code == "10000") {
        informantList = res.content.list;
      }
      commit(GETINFORMANTLIST, informantList)
    });
  },
  //  获取意图
  getZtIntentionMain({ commit }) {
    let imainsList
    getZtIntentionMainList().then(res => {
      console.log("意图");
      console.log(res);
      if (res.code == "10000") {
        imainsList = res.content;
      }
      commit(GETIMAINSLIST, imainsList)
    });
  },


  //获取变量
  getCustomerItem({ commit, state }) {
    getCustomerItemList().then(res => {
      if (res.code == "10000") {
        console.log("变量列表哈哈哈")
        console.log(res.content)
        const customerItemList = res.content;
        console.log("变量列表哈哈哈")
        console.log(customerItemList)
        commit(GETCUSTOMERITEMLIST, customerItemList)
      }


    });

  },

  //获取登录 角色信息
  getResLogin({ commit, state }, data) {
    // let that = this
    resLogin(data[0]).then(res => {
      const _this = data[1]
      if (res.code == "10000") {
        console.log("获取角色信息")
        console.log(this.state)
        // console.log(this.state.userInfo)
        const userMsg = res.content
        console.log(userMsg)
        console.log("角色信息")
        setUserInfo({
          "token": res.content.authorization,
          "photoUp": res.content.ztGuser.photo,
          "userId": res.content.ztGuser.userId,
          "userName": res.content.ztGuser.name,
          "ismanage": res.content.ztCompany.ismanage,
          "role": JSON.stringify(res.content.role),
          "ztCompany": JSON.stringify(res.content.ztCompany)
        })
        console.log("actions")
        console.log(res.content.ztCompany.calltype)
        console.log(this.state.userInfo)
        // localStorage.setItem("token", res.content.authorization);
        // localStorage.setItem("photoUp", res.content.ztGuser.photo);
        // localStorage.setItem("userId", res.content.ztGuser.userId);
        // localStorage.setItem("userName", res.content.ztGuser.name);
        // localStorage.setItem("ismanage", res.content.ztCompany.ismanage);
        // localStorage.setItem("role", JSON.stringify(res.content.role));
        localStorage.setItem("ztCompany", JSON.stringify(res.content.ztCompany));
        _this.$Message.success("登录成功!");
        console.log("测试登录成功返回的数据")
        console.log(data)
        _this.$router.push({ path: "/home" });
        commit(RESLOGIN, userMsg)
        // window.location.reload()   //重新加载 路由权限
      } else {
        _this.$Message.error(res.content);
      }
    });
  },
  upVuex(context, data) { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    context.commit(data.mutations, data.value);
  }

}


function deleteOtherInfo(k) {
  //删除其他的信息
  store.dispatch("upVuex", {
    mutations: "deleteOtherInfo",
    value: {
      key: k
    }
  });
}
function setOtherInfo(v) {
  //设置其他的信息
  store.dispatch("upVuex", {
    mutations: "setOtherInfo",
    value: v
  });
}
function deleteUserInfo(k) {
  //删除用户的信息
  store.dispatch("upVuex", {
    mutations: "deleteUserInfo",
    value: {
      key: k
    }
  });
}
function setUserInfo(v) {
  //设置用户的信息
  store.dispatch("upVuex", {
    mutations: "setUserInfo",
    value: v
  });
}

