<template>
  <Row>
    <Card style="height:70vh">
      <Row style="height:100%">
        <i-col>
          <div class="title">客户意向分级</div>
        </i-col>
        <i-col span="8" offset="17">
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
        <i-col :span="24" offset="4" style="margin:20px;">
          <!-- <div id="chartPie" style="width:100%; height:400px;"></div> -->
          <EChartsView id="chartBar" :data="chartBarData" height="50vh"></EChartsView>
        </i-col>
        <!-- <i-col span="12" offset="8">col-12 | offset-8</i-col> -->
      </Row>
    </Card>
  </Row>
</template>
<script>
import EChartsView from "../../components/EChartsView";
import chartPieDatas from "./echartsPie";
import { getGadsCase } from "../../../api/api";
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
          text: "本周"
        },
        {
          type: 3,
          text: "本月"
        }
      ],
      buttonType: 1,
      // chartPieData: chartPieData("客户意向分级"),
      xData: [],
      sData: [],
      arrName: [] //客户意向数据
    };
  },
  computed: {
    chartBarData() {
      // this.xData = ["呼叫总数", "接通总数", "无法接通", "拒接"];
      // this.sData = [32, 21, 36, 10];
      return chartPieDatas("", this.xData, this.sData);
    }
  },
  created(){
    this.clickAjax()
  },
  mounted() {
  },
  methods: {
    clickAjax(index) {
      this.sData = [];
      this.xData = [];
      if (index || index === 0) {
        this.buttonType = index + 1;
      }
      // this.buttonType = index + 1;
      ////console.log(this.buttonType);
      let data = {
        type: this.buttonType
      };
      // var arrName = []
      getGadsCase(data).then(res => {
        ////console.log(res.content[1]);
        for (let i = 0; i < res.content[1].length; i++) {
          // ////console.log(res.content[1][i].iclevelname);
          this.xData.push(res.content[1][i].iclevelname);
          this.sData.push({
            value: res.content[1][i].num,
            name: res.content[1][i].iclevelname
          });
        }
        // ////console.log(this.xData);
        // ////console.log(this.sData);
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
