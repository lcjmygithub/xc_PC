<template>
  <i-col :span="5" gutter="16" style="margin-top:16px">
    <Card style="height:73vh">
      <i-col
        style="display:flex;justify-content:space-between;margin-top:10px;"
      >
<!--        <i-button-->
<!--          type="warning"-->
<!--          @click="addVoiceRobot"-->
<!--          long-->
<!--          style="margin-right:10px"-->
<!--        >+ 新建话术</i-button-->
<!--        >-->
<!--        <i-button type="success" @click="copyVoiceRobot" long>-->
<!--          <Icon type="ios-browsers" />复制话术-->
<!--        </i-button>-->
      </i-col>
      <div style="height:610px;overflow:auto">
        <i-col
          style="margin-right:15px;"
          v-for="(item, index) in $store.state.voiceRobotList"
          :key="index"
          :class="flagIndex === index ? 'activeStyle' : 'noActiveStyle'"
        >
          <div @click="getVoiceRobotDetails(item, index)" >
            <div style="display:flex;justify-content:space-between">
              <p style="color:#000;font-weight:bold">{{ item.nickname }}</p>
              <p style="font-size:20px">
                <!-- <Icon type="trash-a"></Icon> -->
<!--                <Icon-->
<!--                  style="cursor: pointer;font-size:24px"-->
<!--                  type="ios-trash-outline"-->
<!--                  @click="detailSelf($event, item.robotid)"-->
<!--                />-->
<!--                <br />-->
<!--                <Icon-->
<!--                  style="cursor: pointer;font-size:24px"-->
<!--                  type="ios-redo-outline"-->
<!--                  @click="shareSelf(item.robotid)"-->
<!--                />-->
              </p>
            </div>
            <div style="margin-top:-10px">
              行业:
              <span v-show="item.industryid == '1'" style="color:#444"
              >房产</span
              >
              <span v-show="item.industryid == '2'" style="color:#444"
              >贷款</span
              >
              <span v-show="item.industryid == '3'" style="color:#444"
              >保险</span
              >
              <span v-show="item.industryid == '4'" style="color:#444"
              >催收</span
              >
              <span v-show="item.industryid == '5'" style="color:#444"
              >股票</span
              >
              <span v-show="item.industryid == '6'" style="color:#444"
              >电商</span
              >
              <span v-show="item.industryid == '7'" style="color:#444"
              >其他</span
              >
              <span v-show="item.industryid == '8'" style="color:#444"
              >信用卡</span
              >
              <span v-show="item.industryid == '9'" style="color:#444"
              >减肥回访</span
              >
              <span v-show="item.industryid == '17'" style="color:#444"
              >口音</span
              >
              <span v-show="item.industryid == '18'" style="color:#444"
              >粤语</span
              >
            </div>
            <div>
              备注:
              <span style="color:#444">
                    {{ item.remark ? item.remark : "" }}
                  </span>
            </div>
          </div>
        </i-col>
      </div>
    </Card>
  </i-col>
</template>

<script>
  import {mapActions} from "vuex"
    export default {
        name: "Configuration_Left" ,
        data(){
          return {
            flagIndex: "", //是否选中样式
            sceneid :1,
              fn:'',
          }
        },
      methods:{
        // 获取话术 列表
        ...mapActions(['getVoiceRobot']),


          // 点击左侧 话术列表
        getVoiceRobotDetails(e, index) {
          this.flagIndex = index
            console.log(e)
            // console.log(this.$store.state.voiceRobotList)
            //传e  到 主动发问 *************/
             this.$bus.$emit('pas',e)
            //触发 Question组件里的侧边栏
            // this.$emit("passSceneId",this.sceneid)

        },

          //接收 Qusetion组件侧边栏 传过来的 sceneid
          receiveSceneid(){
            this.$bus.on("pasSceneid",sid=>{
                this.sceneid = sid
            })
          }
      },
      mounted(){
          this.getVoiceRobot();
          this.receiveSceneid();

      }
    }
</script>

<style scoped>
  .activeStyle {
    /* border: 1px solid #006edd; */
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #219480;
    box-shadow: 0 0 1px #219480;
    background-color: #E0FFF5;
  }
  .noActiveStyle {
    border: 1px solid #999;
    margin-top: 10px;
    padding: 10px;
  }
  .ivu-tabs-tabpane {
    height: 65vh;
    overflow: auto;
  }
</style>
