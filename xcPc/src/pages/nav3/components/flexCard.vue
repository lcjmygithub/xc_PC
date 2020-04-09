<template>
  <Row>
    <Card style="padding:30px 0;color:#999">
      <Row type="flex" justify="space-between" class="code-row-bg flexCard" style="">
        <i-col span="5" style="border-right:1px solid #d4d4d2">
          <div><span style="font-size:30px;color:#FC7900;font-weight:bold">{{dataList.balance}}</span>元</div>
          <div>余额</div>
        </i-col>
        <i-col span="5" style="border-right:1px solid #d4d4d2;font-weight:bold">
          <div><span style="font-size:30px;color:#FC7900">{{dataList.monthConsume}}</span>元</div>
          <div>本月消费</div>
        </i-col>
        <i-col span="4" style="border-right:1px solid #d4d4d2;font-weight:bold">
          <div><span style="font-size:30px;color:#1AA57B">{{dataList.callNum}}</span>次</div>
          <div>本月拨打数量</div>
        </i-col>
        <i-col span="5" style="border-right:1px solid #d4d4d2;font-weight:bold">
          <div><span style="font-size:30px;color:#1AA57B">{{dataList.callTime}}</span>分钟</div>
          <div>本月拨打时长</div>
        </i-col>
<!--         科特说注释掉  2019-11-22-->
<!--        <i-col span="5">-->
<!--          <div><span style="font-size:30px;color:#0A6B8D;font-weight:bold">{{dataList.intergral.toFixed(2)}}</span>分</div>-->
<!--          <div>积分</div>-->
<!--        </i-col>-->
      </Row>
    </Card>
  </Row>
</template>
<script>
export default {
            mixins: [require("@/mymixins").default],
  components: {},
  data() {
    return {
      dataList:{}
    };
  },
  props:['financeDatas'],
  created() {
    this.dataList = this.financeDatas;
    console.log(this.dataList)
  },
};
</script>
<style scoped>
.flexCard {
  text-align: center;
}
</style>
