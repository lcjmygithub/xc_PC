<template>
  <!-- 卡片 阴影 无内边距 -->
  <div shadow :padding="0" v-bind:id="id" :class="className" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from "echarts";
export default {
  mixins: [],
  name: "ECharts",
  components: {},
  data() {
    // const deID = Math.floor(Math.random() * 104650);//随机ID值 但是还是用传入的吧
    return {
      MyChart: null
    };
  },
  props: {
    className: {
      //传入的样式中设置高和宽就可以 不然就是默认 父容器100% 和 全屏幕的27vh
      type: String,
      default: "echarsCSS"
    },
    id: {
      //id值用来通过此id绑定视图的
      type: String,
      required: true
    },
    data: {
      //配置项 一般只传入配置项和id就能显示
      type: Object,
      default: null
    },
    mFunction: {
      //点击事件 传入点击事件可以点击视图后返回传入的index数据
      type: Function,
      default: null
    },
    width: {
      //额外设置高宽
      type: String,
      default: "100%"
    },
    height: {
      //额外设置高宽
      type: String,
      default: "27.77777vh"
    }
  },
  computed: {},
  methods: {
    initChart() {
      //加载echarts视图
      let _this = this;
      // _this.MyChart = _this.$echarts.init(myChart);
      _this.MyChart = echarts.init(document.getElementById(_this.id));
      _this.setChart();
      _this.MyChart.on("click", function(params) {
        //添加点击事件 判断是否传入 传入的话就回调 可以把判断放在外面 不过无所谓
        if (_this.mFunction) _this.mFunction(params);
      });
      // window.addEventListener("resize", function() {
      //   _this.MyChart.resize;
      // });
      window.addEventListener("resize", _this.__resizeHandler); //添加屏幕监听 监听屏幕的缩小和放大
    },
    setChart() {
      //设置echarts的配置项 对配置项加上动画效果 所以传配置项的时候不需要在配置项中加动画配置
      let _this = this;
      _this.$set(_this.data, "animationEasing", "elasticOut");
      _this.$set(_this.data, "animationEasingUpdate", "elasticOut");
      _this.$set(_this.data, "animationDelay", 200);
      _this.$set(_this.data, "animationDelayUpdate", 200);
      _this.MyChart.setOption(_this.data);
    },
    __resizeHandler() {
      //屏幕缩小放大监听
      if (this.MyChart) {
        this.MyChart.resize();
      }
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        if (newValue) this.initChart();
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // this.initChart();
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    //销毁监听
    window.removeEventListener("resize", this.__resizeHandler);
    if (!this.MyChart) {
      return;
    }
    // if (this.MyChart) this.MyChart.clear();
    this.MyChart.dispose(); //回收
    this.MyChart = null;
  },
  destroyed() {}
};
</script>

<style scoped >
.echarsCSS {
  width: 100%;
  height: 27.77777vh;
}
</style>
