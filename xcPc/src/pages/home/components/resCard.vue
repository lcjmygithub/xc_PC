<template>
  <Row>
    <Card style="height:70vh">
      <Row>
        <i-col>
          <div class="title">呼叫结果</div>
        </i-col>
        <i-col span="5" offset="19">
          <Button-group>
            <!-- <i-button type="primary">今天</i-button>
            <i-button>昨天</i-button>
            <i-button>前天</i-button>-->
            <Button
            size="small"
              v-for="(item,index) in buttons"
              :type="buttonType==(index+1)?'primary':'default'"
              :key="index"
              @click="clickAjax(index)"
            >{{item.text}}</Button>
          </Button-group>
        </i-col>
        <Col :span="24" style="margin:20px;">
          <!-- <div id="chartColumn" style="width:100%; height:400px;"></div> -->
          <EChartsView id="chartPie" :data="chartBarData" height="50vh" style="margin-buttom:30vh"></EChartsView>
        </Col>
        <!-- <i-col span="12" offset="8">col-12 | offset-8</i-col> -->
      </Row>
    </Card>
  </Row>
</template>
<script>
import EChartsView from "../../components/EChartsView";
// import echarts from "echarts";
import chartBarDataHandler from "./echartsBar";
import { getCallResult } from "../../../api/api";
export default {
  components: {
    EChartsView
  },
  data() {
    return {
      buttons: [
        {
          type: 1,
          text: "今天"
        },
        {
          type: 2,
          text: "昨天"
        },
        {
          type: 3,
          text: "前天"
        }
      ],
      todayStart: "", //今天
      todayEnd: "",
      yesDayStart: "", //昨天
      yesDayEnd: "",
      befDayStart: "", //前天
      befDayEnd: "",
      buttonType: 1,
      xData: [],
      sData: []
    };
  },
  computed: {
    chartBarData() {
      this.xData = ["拒接", "接通总数", "呼叫总数", "未接通数"];
      // this.sData = [32, 21, 36, 10];
      return chartBarDataHandler("", this.xData, this.sData);
    }
  },
  created() {
    // 今天
    var day1 = new Date();
    day1.setTime(day1.getTime());
    // //console.log(day1.getTime());

    var s1 =
      day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    //昨天
    var day2 = new Date();
    day2.setTime(day2.getTime() - 24 * 60 * 60 * 1000);
    var s2 =
      day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();

    //前天
    var day3 = new Date();
    day3.setTime(day3.getTime() - 24 * 60 * 60 * 1000 * 2);
    var s3 =
      day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
    (this.todayStart = `${s1} 00:00:00`),
      (this.yesDayStart = `${s2} 00:00:00`),
      (this.befDayStart = `${s3} 00:00:00`),
      (this.todayEnd = `${s1} 23:59:59`),
      (this.yesDayEnd = `${s2} 23:59:59`),
      (this.befDayEnd = `${s3} 23:59:59`);
      this.clickAjax()
  },
  mounted() {},
  methods: {
    // 呼叫结果
    clickAjax(index) {
      this.sData = []
      if(index || index === 0){
         this.buttonType = index + 1;
      }
      if (this.buttonType == 1) {
        var data = {
          stime: this.todayStart,
          etime: this.todayEnd
        };
      } else if (this.buttonType == 2) {
        //console.log(123);

        var data = {
          stime: this.yesDayStart,
          etime: this.yesDayEnd
        };
      } else if (this.buttonType == 3) {
        var data = {
          stime: this.befDayStart,
          etime: this.befDayEnd
        };
      }

      getCallResult(data).then(res => {
        if (res.code == 10000) {
          //console.log(res.content[0]);
          for (let k in res.content[0]) {
            if (typeof res.content[0][k] == "number") {
              this.sData.push(res.content[0][k]);
            }
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
</style>
