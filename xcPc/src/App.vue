<template>
  <div id="app">
    <!--<transition name="bounce">-->
    <router-view></router-view>
    <!--</transition>-->
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  methods: {},
  mounted() {}
};
</script>

<style>
*{
  margin: 0 ;padding: 0;
}
.v-transfer-dom{              /*  话术配置高度渲染有问题 */
  padding: 0!important 
}
.ivu-checkbox-checked .ivu-checkbox-inner {
  border-color: #219480 !important;
  background-color: #219480 !important;
}
.clear1:hover {
  color: #fff !important;
  background-color: #219480 !important;
  border-color: none !important;
}
.ivu-btn-group:not(.ivu-btn-group-vertical)
  .ivu-btn-primary:first-child:not(:last-child) {
  border-right-color: #219480 !important;
}
.ivu-btn-primary {
  color: #fff;
  background-color: #219480 !important;
  border-color: #219480 !important;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  color: #61bfa3 !important;
  background: #f5f5f5 !important;
  z-index: 2;
}
.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #61bfa3 !important;
}
.ivu-btn-warning {
  color: #fff;
  background-color: #36ac85 !important;
  border-color: #36ac85 !important;
}
.ivu-btn-success {
  color: #fff;
  background-color: #fc7900 !important;
  border-color: #fc7900 !important;
}
.ivu-btn-ghost.ivu-btn-primary {
    /* color: #fff!important; */
}


.ivu-page-item-active {
     background: #36ac85 !important;
}
/* .ivu-page-item{
      background-color: #36AC85!important;
} */
.ivu-page-item-active a,
.ivu-page-item-active:hover a {
  color: #fff !important;
  background-color: #36ac85 !important;
}
/* .ivu-page-item-active a, .ivu-page-item-active:hover a {
    color: #219480;
}
.clear:hover {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #ccc !important;
} */
.ivu-drawer-body {
  padding: 0px !important;
}
.ivu-radio-checked .ivu-radio-inner {
  border-color: #219480 !important;
}
.ivu-radio-inner:after {
  background-color: #219480 !important;
}
.ivu-tabs-nav .ivu-tabs-tab-active {
  color: #219480 !important;
  font-weight: 700;
  /* font-size: 16px !important; */
}
.ivu-tabs-ink-bar {
  background-color: #219480 !important;
}
.ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #219480 !important;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-out 0.2s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
html{
  height: 100%;
}
body {
  /*background-color: #324057;*/
  margin: 0px;
  padding: 0px;
  /*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  /*font-weight: 400;*/
  font-size: 14px !important;
  width: 100%;
  height: 100%;
  background: url(assets/bg.jpg);
  -webkit-font-smoothing: antialiased;

  background: url("assets/bg.jpg");
  repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/bg.jpg', sizingMethod='scale');
  -ms-filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/bg.jpg', sizingMethod='scale');
  background-size: cover;
  -moz-background-size: cover;
  -webkit-background-size: cover;
}
.ghost{
  background:transparent!important;
  border-color:#FC7900!important;
  color:#FC7900!important;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    background-color: #36ac85 !important;
}
.ivu-input-prefix i, .ivu-input-suffix i {
    color: #219480!important;
}
.text-btn[data-v-3dcbd75d] {
    color: #219480!important;
}
#app {
  /* position: absolute;
  top: 0px;
  bottom: 0px; */
  width: 100%;
  height:100%;
  overflow: hidden;
}
</style>
