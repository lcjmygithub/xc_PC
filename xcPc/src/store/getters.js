
export  default  {
  getUserInfo(state) {
    //获取用户信息
    return state.userInfo;
  },
  getOtherInfo(state) {
    //获取其他信息
    return state.otherInfo;
  },
  getLanguage(state) {
    return state.language;
  }
}
