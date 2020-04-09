import Axios from 'axios'
import router from '../routes'
import Vue from 'vue'
import store from '../store';
// import Qs from 'qs'

const http = Axios.create({
  timeout: 10 * 1000,
  validateStatus: (status) => {
    return status === 200
  },
})

function startLoading() {
  Vue.prototype.$Spin.show();
}
function endLoading() {
  Vue.prototype.$Spin.hide();
}
function formData(item) {
  //转换成表单
  let form = new FormData();
  for (let key in item) {
    form.append(key, item[key]);
    // //console.log(form.get(key));
  }
  return form;
}

function isFalse(a) {
  if (!a || a == "" || a == "null" || a == "undefined") return true;
  else return false;
}

let reqNum = 0;
http.interceptors.request.use(

  config => {
    // config.headers.Authorization = `${window.localStorage.token ? window.localStorage.token : ''}`
    //console.log(config);
    // console.log(vue.prototype)
    let token = store.state.userInfo.token;
    // let token = this.userInfo.token;
    config.headers.Authorization = `${token ? token : ''}`
    // config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //console.log(config.data);

    if (isFalse(config.data)) {//没有数据    form
      config.method === 'post'
        ? config.data = formData(config.data)
        : config.params = { ...config.params };
    } else {
      if (isFalse(config.data.type)) {//数据没有type  form
        config.method === 'post'
          ? config.data = formData(config.data)
          : config.params = { ...config.params };
      }
      else {
        if (config.data.type != "json") {//type不是json  form
          config.method === 'post'
            ? config.data = formData(config.data)
            : config.params = { ...config.params };
        }
      }
    }
    // config.headers.transformRequest = [function (data) {      //在请求之前对data传参进行格式转换
    //   data = Qs.stringify(data)
    //   return data
    // }],
    // startLoading();
    reqNum++;
    return config
  },
  error => {
    // return Promise.reject(error);
    //请求超时
    reqNum--;
    if (reqNum <= 0)
      endLoading();
    //console.error("请求超时")
    // showBox();
    return Promise.error(error)
  },
)
http.interceptors.response.use(
  response => {
    //console.log(response.data)
    reqNum--;
    if (reqNum <= 0)
      // endLoading(); 11005
    if (response.data.code === 11005) {
      Vue.prototype.$Message.info({
        content: '登录过期,请重新登录',
        duration: 3
      });
      localStorage.clear()
      // console.log(Vue.prototype.router)
      Vue.prototype.router.replace('/login')
    }
    return response.data
  },
  error => {
    //请求错误
    reqNum--;
    const { response } = error
    if (reqNum <= 0)
      endLoading();
    // showBox();
    if (response) {
      switch (response.status) {
        case 404:
          break
        default:
          //console.error("请求错误")
      }
      return Promise.reject(response)
    } else {
      //console.error("请求错误")
      return Promise.reject(error)
    }
  },
)

export default http
