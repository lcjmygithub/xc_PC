<template>
  <Modal v-model="modal1" title="修改密码" @on-ok.prevent="comfirmModifyPS" @on-cancel="cancel">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <Form-item label="原密码" prop="oldPassword">
        <Input v-model="formValidate.oldPassword" placeholder="请输入原始密码"></Input>
      </Form-item>
      <Form-item label="新密码" prop="newPassword">
        <Input v-model="formValidate.newPassword" placeholder="请输入新密码"></Input>
      </Form-item>
      <Form-item label="确认新密码" prop="resetPassword">
        <Input v-model="formValidate.resetPassword" placeholder="请再次输入新密码"></Input>
      </Form-item>
    </Form>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      modal1: false,
      formValidate: {
        oldPassword: "",
        newPassword: "",
        resetPassword: ""
      },
      ruleValidate: {
        oldPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        resetPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    comfirmModifyPS() {
      return false;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.modal1 = false;
          //         this.loading = false;
          this.$Message.success("提交成功!");
        } else {
          this.$Message.error("表单验证失败!");
          return false;
        }
      });
      // this.$Message.info('点击了确定');
    },
    cancel() {
      this.modal1 = false;
      this.$Message.info("点击了取消");
    }
  }
};
</script>
<style>
</style>
