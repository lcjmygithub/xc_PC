<template>
  <Row>
    <i-col style="margin-top:10px">
      <Table border :columns="columns12" :data="datas" max-height="500">
        <!-- <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="text"
            size="small"
            style="margin-right: 5px;color:##2d8cf0"
            @click=""
            >View</Button
          >
          <Button type="text" size="small" @click="" style="color:#ff3040"
            >Delete</Button
          >
        </template> -->
      </Table>
    </i-col>
    <Col :span="24" style="text-algin:center;margin-top :30px">
      <div style="overflow: hidden">
        <div style="float: right;">
          <Page
            @on-page-size-change="changePageSize"
            :page-size="page_Size"
            :total="total"
            :current="page"
            @on-change="changePage"
            show-sizer
            show-total
            size="small"
          ></Page>
        </div>
      </div>
    </Col>
  </Row>
</template>
<script>
import { getZtRobotOperate } from "../../../api/api";
export default {
  data() {
    return {
      page: 1,
      total: 0,
      page_Size:10,
      serviceid:"",
      columns12: [
        {
          title: "更新时间",
          align: "center",
          key: "createtime",
          render: (h, params) => {
            const createtime = params.row.createtime;
            return h("span",{},this.formatDate(new Date(createtime)))
          }
        },
        {
          title: "更新内容",
          align: "center",
          key: "content"
        }
      ],
      datas: []
    };
  },
  methods: {
     // 时间戳
    formatDate(datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      var year = datetime.getFullYear(),
        month = ("0" + (datetime.getMonth() + 1)).slice(-2),
        date = ("0" + datetime.getDate()).slice(-2),
        hour = ("0" + datetime.getHours()).slice(-2),
        minute = ("0" + datetime.getMinutes()).slice(-2),
        second = ("0" + datetime.getSeconds()).slice(-2);
      // 拼接
      var result =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
      // 返回
      return result;
    },
    // 获取父组件传过来的值
    parentMsg(e) {
      console.log("更新记录");
      console.log(e);
      this.serviceid = e.onserviceid;
      let data = {
        serviceid: e.onserviceid
      };
      this.getZtRobotOperateList(data);
    },
    getZtRobotOperateList(data) {
      // 获取更新记录
      getZtRobotOperate(data).then(res => {
        console.log("更新记录");
        console.log(res);
        if (res.code == "10000") {
          this.datas = res.content.list;
          this.total = res.content.totalCount
        }
      });
    },
    // 分页
    changePage(row){
      let data = {
        serviceid:this.serviceid,
        pageNo:row,
        pageSize:this.page_Size
      }
      this.getZtRobotOperateList(data)
    },
      //页容量的改变
    changePageSize(pageSize) {
      this.page_Size = pageSize;
      this.page=1;
      this.getZtRobotOperateList({
        serviceid: this.serviceid,
        pageSize: this.page_Size,
        pageNo: this.page
      });
    },
  }
};
</script>
<style scoped>
</style>
