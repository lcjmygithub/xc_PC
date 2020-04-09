<template>
  <div>
       <h2>线路管理</h2>
<!--        搜索-->
       <div class="Search">
           <Row align="middle" style="background-color: #fff;margin-top: 20px;">
             <Col>
                <Form :model="formData" :label-width="100" inline style="margin-top: 20px" >
                   <FormItem label="呼叫地区搜索">
                    <Input v-model="formData.keyWords" placeholder="搜索呼叫地区"></Input>
                   </FormItem>
                    <FormItem style="margin-left: -80px">
                      <Button type="primary" @click="Search">搜索</Button>
                  </FormItem>
                </Form>
              </Col>
           </Row>
       </div>
       <div class="dataList">
         <Table  :columns="columns" :data="dataList" size="small" max-height="520" @on-sort-change="sortPX">
           <template slot-scope="{ row }" slot="lineName">
             <strong>{{ row.lineName }}</strong>
           </template>
           <template slot-scope="{ row, index }" slot="action">
             <span  :style="row.hasLine? 'margin-right: 5px;color:#36ac85' : 'margin-right: 5px;color:#FC7900'" @click="operation(row,index)">{{row.hasLine?"取消该线路":"使用该线路"}}</span>
           </template>
         </Table>
         <div class="">
           <Page
             class-name="page"
             :total="total"
             :current="page"
             :page-size="page_Size"
             show-sizer
             show-total
             @on-page-size-change="changePageSize"
             @on-change="changePage"
           ></Page>
         </div>
       </div>
  </div>
</template>
<script>
import {
    getLineInfo,
    delNumberConf,
    saveNumberConf
} from "../../api/api.js"
    export default {
        name: "lineManagement",
        data(){
          return {
            state:"",
            formData :{
              keyWords:""
            },
            columns:[
              {
                title:"线路名称",
                slot: "lineName",
              },
              {
                title:"价格",
                key: "price",
                 // sortable: true,
                sortable: 'custom',
              },
              {
                title:"呼叫地区",
                key: "place"
              },
              {
                title:"盲区",
                key: "blindArea"
              },
              {
                title:"线路类型",
                key:"type"
              },
              {
               title:"虚拟号码",
                key:"virtualPhone"
              },
              {
                title:"可用数",
                key:"availableNumber",
                sortable: 'custom',
              },
              {
                title:"行业",
                key:"industry"
              },
              {
                title:"接通率",
                key:"rate",
                sortable: 'custom',
              },
              {
                 title:"操作",
                 slot:"action",
              }
            ],
            dataList:[
              {lineName:"线路1",price:"0.01",place:"湖北武汉",blindArea:"北京",type:"4",availableNumber:"3/20",industry:"贷款",rate:"50%"},
            ],
            total: 100,
            page: 1,
            page_Size: 10,
            query: ""  // 查询字段
          }
        },
      methods:{
          //自定义远程排序
        sortPX(o){
          //价格排序
          if(o.key=="price"&&o.order=='asc'){
            this.state = 1
          }
          if(o.key=="price"&&o.order=='desc'){
            this.state = 2
          }
          //可用数排序
          if(o.key=="availableNumber"&&o.order=='asc'){
            this.state = 3
          }
          if(o.key=="availableNumber"&&o.order=='desc'){
            this.state = 4
          }
          //接通率
          if(o.key=="rate"&&o.order=='asc'){
            this.state = 5
          }
          if(o.key=="rate"&&o.order=='desc'){
            this.state = 6
          }
          let query =`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`
              this. getLineInfoList(query)
         },
          getLineInfoList(query,flag){
           if(flag){  //搜索
             query  =  query
           }else{
             // query=`pageNo=${this.page}&pageSize=${this.page_Size}`
             query  =  query
           }
            console.log("字段参数")
            console.log(query)
              getLineInfo(query).then(res=>{
                 if(res.code=="10000"){
                     console.log("打印数据库数据")
                       console.log(res.content.list)
                      this. dataList = res.content.list
                      this.dataList .forEach((item,i)=>{
                         item .lineName =  item.companyname
                         item .price = item .cus_fee
                          item .place = item.call_area
                          item.blindArea = item .remark
                          item.type = item .line_type
                          item .availableNumber = parseInt(item.useOccurs)+"/"+parseInt(item.occurs)
                          item.industry = item . industry
                          item.virtualPhone = item.virtual_phone
                          item . rate = item . call_rate
                      })
                       this. total = res.content.totalCount
                 }
              })
          },
          //搜索
        Search(){
              console.log(this.formData.keyWords)
            // this.state = ''
            let query =`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`
            // let query =`callarea=${this.formData.keyWords}&pageNo=1&pageSize=${this.page_Size}`
            console.log(query)
            this.getLineInfoList(query,1)
        },
        operation(row){
           // 取消线路
            console.log(row.virtual_phone)
            let phone = row.virtual_phone
            if(row.hasLine){
                console.log('取消之前')
                 console.log(row)
                delNumberConf(phone).then(res=>{
                    if(res.code=="10000"){
                        this.$Message.success('线路取消成功');
                        row.hasLine = false
                        console.log('取消之后')
                        console.log(row)
                        this.getLineInfoList(`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`)
                    }
                })
            }else{
                saveNumberConf(phone).then(res=>{
                    if(res.code=="10000"){
                        console.log(row)
                        row.hasLine = true
                        this.$Message.success('线路使用成功');
                        this.getLineInfoList(`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`)
                    }else{
                        console.log(row)
                        this.$Message.warning(res.content);
                    }
                })
            }

        },
        changePageSize(number){  //切换每页条数时的回调，返回切换后的每页条数   返回值 page-size
            this.page_Size = number
            // this.state = ''
            // let query =`callarea=${this.formData.keyWords}&pageNo=${this.page}&pageSize=${this.page_Size}`
              let query =`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`
            this. getLineInfoList(query)
        },
        changePage(page){   //页码改变的回调，返回改变后的页码    返回值页码
           this.page = page
            // this.state = ''
          let query =`callarea=${this.formData.keyWords}&state=${this.state}&pageNo=${this.page}&pageSize=${this.page_Size}`
           // let query =`callarea=${this.formData.keyWords}&pageNo=${this.page}&pageSize=${this.page_Size}`
          this. getLineInfoList(query)
        }
      },
        mounted() {
            this.getLineInfoList()
        }
    }
</script>

<style scoped>
  .warp{
    background-color: #fff;
  }
  .page{
    margin-top: 12px;
    float: right
  }

</style>
