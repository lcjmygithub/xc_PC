
<template>
  <Row>
    <Row>
      <Col span="12">
        <title-text :title="title"></title-text>
      </Col>
      <Col span="4" offset="8" style="margin-top:20px">
        <DatePicker type="date" :placeholder="newDate" style="width: 200px" disabled></DatePicker>
      </Col>
      <Col :span="24" style="width:100%">
        <cards ref="robat"></cards>
      </Col>
    </Row>
    <Row style="margin-top:15px" :gutter="16">
      <Col span="9">
        <cli-card></cli-card>
      </Col>
      <i-col :span="15">
        <res-card></res-card>
      </i-col>
    </Row>
  </Row>
</template>
<script>
import cards from "./components/card.vue";
import titleText from "../components/title.vue";
import cliCard from "./components/cliCard";
import resCard from "./components/resCard";
import { homeRobatData, getCallResult } from "../../api/api";
export default {
  mixins: [require("@/mymixins").default],
  components: {
    cards,
    cliCard,
    resCard,
    titleText
  },
  data() {
    return {
      title: "今日实时数据",
      robatData: {}, //机器人数据
      callData: [], //呼叫数据
      newDate: "",
      day1: "",
      s1: ""
    };
  },
  created() {
    // window.location.href = window.location.href;
    console.log(this.userInfo);
    this.day1 = new Date();
    this.day1.setTime(this.day1.getTime());
    this.s1 =
      this.day1.getFullYear() +
      "-" +
      (this.day1.getMonth() + 1) +
      "-" +
      this.day1.getDate();
    // this.getResultCall();
    this.newDate = this.s1;
    // this.todayStart = s1 + '00:00:00'
    // this.todayEnd = s1 + '23:59:59'
  },
  mounted() {
    this.getRobatData(1);
  },
  activated() {
    this.getRobatData(2);
    this.getResultCall();
  },
  methods: {
    //今日电话数据
    getRobatData(d) {
      let that = this;
      let para = {
        stime: this.s1 + " 00:00:00",
        etime: this.s1 + " 23:59:59"
      };
      let robat = that.$refs.robat;
      homeRobatData(para).then(res => {
        if (res.code == 10000) {
          that.robatData = res.content;
          robat.init(that.robatData);
        }
      });
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 24px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
</style>
