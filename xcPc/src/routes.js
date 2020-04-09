import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import home from './pages/home/index.vue'
// import Main from './pages/Main.vue'
import Table from './pages/nav1/Table.vue'
import Form from './pages/nav1/Form.vue'
import user from './pages/nav1/user.vue'
import LineManagement from "./pages/nav1/lineManagement"
import Page4 from './pages/nav2/Page4.vue'
// import Page5 from './pages/nav2/Page5.vue'
import Page6 from './pages/nav3/Page6.vue'
// import echarts from './pages/charts/echarts.vue'
import AccountSettings from './pages/settings/AccountSettings.vue'
import store from './store'

// 优化更改
//import TelephoneConfiguration from "./pages/telephoneConfiguration/TelephoneConfiguration.vue"

let routes = [{
  path: '/login',
  component: Login,
  name: '',
  hidden: true
},
{
  path: '/404',
  component: NotFound,
  name: '',
  hidden: true
},
//{ path: '/main', component: Main },
{
  path: '/',
  component: Home,
  name: '首页',
  // hidden: true
  iconCls: 'ios-home',
  leaf: true,
  children: [
    {
      path: '/home', component: home, name: '首页', hidden: true
    }
  ]
},
{
  path: '/aiRobat',
  component: Home,
  name: 'AI机器人',
  iconCls: 'md-ionitron', //图标样式class
  children: [
    // { path: '/main', component: Main, name: 'AI机器人', hidden: true },
    { path: '/table', component: Table, name: '呼叫任务' },
    { path: '/form', component: Form, name: '通话记录' },
    { path: '/user', component: user, name: '呼叫设置' },
    { path: '/lineManagement', component: LineManagement, name: '线路管理', meta: { isShow: true } },
  ]
},
{
  path: '/call',
  component: Home,
  name: '话术管理',
  iconCls: 'logo-twitch',
  children: [
    { path: '/page4', component: Page4, name: '话术配置' },
  ]
},

// 更改 优化
// {
//   path: '/call',
//   component: Home,
//   name: '话术管理',
//   iconCls: 'logo-twitch',
//   children: [
//     { path: '/page4', component: TelephoneConfiguration, name: '话术配置' },
//   ]
// },

{
  path: '/finance',
  component: Home,
  name: '财务管理',
  iconCls: 'logo-yen',
  children: [
    { path: '/page6', component: Page6, name: '财务管理' }
  ]
},
{
  path: '/system',
  component: Home,
  name: '系统设置',
  iconCls: 'md-settings',
  children: [
    { path: '/AccountSettings', component: AccountSettings, name: '账号设置' },
  ]
},
{
  path: '*',
  hidden: true,
  redirect: { path: '/404' }
}
];
// console.log(store)
// let userInfo = store.state.userInfo;
// console.log(userInfo)
// if (userInfo) {
//   console.log("角色信息")
//   let ztCompany = JSON.parse(userInfo.ztCompany)
//   ztCompany = ztCompany ? ztCompany : {}
//   if (ztCompany.calltype == 1) {
//     routes.forEach((v, i) => {
//       if (v.children) {
//         v.children.forEach((item, index) => {
//           if (item.path == "/lineManagement") {
//             console.log(item)
//             v.children.splice(index, 1)
//           }
//         })
//       }

//     })

//   } else {
//     let pathArr = []
//     routes.forEach((v, i) => {
//       if (v.children) {
//         v.children.forEach((item, index) => {
//           pathArr.push(item.path)
//         })
//         if (pathArr.indexOf("/lineManagement") == -1) {
//           v.children.push({ path: '/lineManagement', component: LineManagement, name: '线路管理', meta: { isShow: true } })
//         }
//       }

//     })

//   }

// }

// let ztCompany = JSON.parse(localStorage.getItem('ztCompany'))
// let ztCompany = JSON.parse(this.userInfo.ztCompany)
// ztCompany = ztCompany ? ztCompany : {}
// console.log("角色信息")


export default routes;
