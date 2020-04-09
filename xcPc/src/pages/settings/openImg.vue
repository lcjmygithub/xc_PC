<template>
  <Row>
    <Col span="8" v-if="ShowImg" v-for="(item,index) in fileUrlList" :key="index">
      <Dropdown trigger="contextMenu" @on-click="DropdownImg">
        <a href="javascript:void(0)">
          <!-- <viewer> -->
          <img :src="item" style="width: 58px;height:58px;border:1px solid #ccc" />
          <!-- </viewer> -->
        </a>
        <DropdownMenu slot="list">
          <DropdownItem :name="index" style="color: #ed4014">删除</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Col>
    <Col span="8">
      <div style="text-align:center;display: flex;justify-content: center;">
        <Upload
          :show-upload-list="false"
          accept="image/jpg, image/jpeg, image/png"
          :format="['jpg','jpeg','png']"
          :before-upload="handleBeforeUpload"
          :multiple="true"
          type="drag"
          action
          style="width: 58px;height:58px;"
        >
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
    </Col>
  </Row>
</template>

<script>
export default {
  name: "MyUploadImgTools",
  data() {
    return {
      fileList: [], //图片文件
      fileUrlList: [] //图片url
    };
  },
  props: {
    UpNum: {
      //上传数量
      type: Number,
      default: 1
    },
    MyUp: {
      //回调方法 两个参数 一个文件的数组  一个二进制url数组
      type: Function,
      default: null
    },
    ShowImg: {
      //是否显示图片
      type: Boolean,
      default: true
    },
    ImgList: {
      //默认显示的图片
      type: Array,
      default: null
    }
  },
  computed: {},
  watch: {
    ImgList: {
      handler(newValue, oldValue) {
        if (newValue != null) {
          this.fileUrlList = [];
          this.fileList = [];
          newValue.forEach((data, index) => {
            this.fileUrlList.push(data);
            this.fileList.push(data);
          });
          // this.MyUp(this.fileList, this.fileUrlList);
        }
      },
      immediate: true, //最初监听
      deep: true //深度监听
    }
  },
  methods: {
    handleBeforeUpload(file) {
      if (file.size >= 2097152) {
        //判断图片大小
        this.$Notice.error({
          desc: "图片太大了. "
        });
        return false;
      }
      this.$Notice.info({
        desc: "图片右键点击删除. "
      });
      this.fileReader(file).then(response => {
        //图片转换成base64
        if (this.fileUrlList.length < this.UpNum) {
          this.fileUrlList.push(response);
          this.fileList.push(file);
        } else {
          this.fileUrlList.splice(this.UpNum - 1, 1, response);
          this.fileList.splice(this.UpNum - 1, 1, file);
        }
        this.MyUp(this.fileList, this.fileUrlList);
      });
      return false;
    },
    fileReader(file) {
      //异步加载文件
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          // return e.target.result;
          resolve(e.target.result);
        };
      });
    },
    DropdownImg(name) {
      //删除图片
      this.fileUrlList.splice(name, 1);
      this.fileList.splice(name, 1);
      this.MyUp(this.fileList, this.fileUrlList);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
