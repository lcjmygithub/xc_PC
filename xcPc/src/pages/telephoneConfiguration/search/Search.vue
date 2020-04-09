<template>
  <Form :model="formItem" :label-width="80">
    <Row>
      <Col span="6">
        <div style="width:100%;height:100%;">
          <Form-item style="margin-bottom:0" label="话术名">
            <i-input
              v-model="formItem.nickname"
              placeholder="请输入话术名"
              style="width:150px"
            ></i-input>
          </Form-item>
        </div>
      </Col>
      <Col span="4">
        <div style="width:100%;height:100%;">
          <Form-item style="margin-bottom:0" label="话术行业">
            <i-select
              v-model="formItem.industryid"
              placeholder="请选择行业"
            >
              <i-option
                v-for="(item, index) in $store.state.industryList"
                :key="index"
                :value="item.industryid"
              >{{ item.name }}</i-option
              >
            </i-select>
          </Form-item>
        </div>
      </Col>
      <Col span="3" offset="1">
        <Button @click="search"    style="margin-right:10px" class="search"
        >搜索</Button
        >
        <Button @click="empty">清空</Button>
      </Col>
    </Row>
  </Form>
</template>

<script>
  import {mapActions} from "vuex"
    export default {
        name: "Search",
        data(){
            return {
              formItem: {
                //话术搜索
                nickname: "", // 话术名
                industryid: "" // 话术行业id
              },
              flagIndex:"",
            }
        },
        methods:{
            //获取行业列表
          ...mapActions(['getIndustry']),
          // 搜索话术模板
          search() {
            let data = {
              nickname: this.formItem.nickname ? this.formItem.nickname : "",
              industryid: this.formItem.industryid ? this.formItem.industryid : ""
            };
            // this.getVoiceRobot(data);
             this.$store.dispatch('getVoiceRobot',data)   //promise 对象
              this.$bus.$emit("passSearch",data)
            console.log("执行了")

          },
          // 清空搜索
          empty() {
            this.formItem.nickname = "";
            this.formItem.industryid = "";
          },
        },
      mounted(){
          this.getIndustry()
      }
    }
</script>

<style scoped>

</style>
