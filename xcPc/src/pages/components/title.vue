<template>
    <Row>
      <Col span="24" style="display:flex;justify-content:space-between;margin:10px 0 20px 0;align-items: center">
        <div class="title">{{title}}</div>
        <div style="margin-left:-500px"><slot name="sub"></slot></div>

         <slot name="button-group"></slot>

      </Col>
    </Row>
</template>
<script>
export default {
   props: {
      title: String,
      required: true
    },
  data() {
    return {};
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
