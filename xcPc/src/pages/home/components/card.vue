<template>
  <Row :gutter="16" style="display:flex;">
    <Col span="6" style="flex:1">
      <Card style="padding:10px 45px;height:100%">
        <div style="display:flex;padding:0 30px">
          <div style="margin-right:40px" class="imgBox">
            <img src="../../../assetss/images/slice1.png" alt />
          </div>
          <div>
            <div>
              <span style="font-size:30px;font-weight:bold">{{RobatData.totalCallNum}}</span>位
            </div>
            <div>外呼客户总量</div>
          </div>
        </div>
      </Card>
    </Col>
    <Col span="6" style="flex:1;">
      <Card style="padding:10px 45px;height:100%">
        <div style="display:flex;padding:0 30px">
          <div style="margin-right:40px" class="imgBox">
            <img src="../../../assetss/images/slice2.png" alt />
          </div>
          <div>
            <div>
              <span style="font-size:30px;font-weight:bold">{{RobatData.connectCount}}</span>位
            </div>
            <div>接通客户总量</div>
          </div>
        </div>
      </Card>
    </Col>
    <Col span="6" style="flex:1;">
      <Card style="padding:10px 45px;height:100%">
        <div style="display:flex;padding:0 42px">
          <div style="margin-right:30px" class="imgBox">
            <img src="../../../assetss/images/slice3.png" alt />
          </div>
          <div>
            <div>
              <span style="font-size:30px;font-weight:bold">{{(RobatData.callRate *100).toFixed(2)}}</span>%
            </div>
            <div>接通率</div>
          </div>
        </div>
      </Card>
    </Col>
    <Col span="6" style="flex:1;">
      <Card style="padding:10px 45px;height:100%">
        <div style="display:flex;padding:0 42px">
          <div style="margin-right:30px" class="imgBox">
            <img src="../../../assetss/images/slice4.png" alt />
          </div>
          <div>
            <div>
              <span style="font-size:30px;font-weight:bold">{{RobatData.iclevelCount}}</span>位
            </div>
            <div>意向客户</div>
          </div>
        </div>
      </Card>
    </Col>
  </Row>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      RobatData: {}
    };
  },
  methods: {
    init(res) {
      // console.log(res.toy);
      console.log(this.RobatData.iclevelCount);
      this.RobatData = res.toy;
    }
  },
  mounted() {}
};
</script>
<style scoped>
.imgbox {
  line-height: 40px;
}
.imgBox img {
  margin-top:16px;
  width: 40px;
}
</style>
