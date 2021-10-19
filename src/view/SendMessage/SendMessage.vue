<template>
  <div class="list-main">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="标题" prop="messageTitle">
        <el-input class="activity-name" v-model="form.messageTitle"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="messageContent">
        <el-input
          type="textarea"
          class="activity-name"
          v-model="form.messageContent"
          :rows="8"></el-input>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-radio-group v-model="sendType">
          <el-radio :label="true">单独发送</el-radio>
          <el-radio :label="false">群发</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="sendType" label="单独发送" prop="userIds">
        <el-select
          v-model="form.userIds"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入姓名搜索"
          :remote-method="remoteMethod">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.trueName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="群发" prop="broadcastTag">
        <el-radio-group v-model="form.broadcastTag">
          <el-radio label="user">所有学生</el-radio>
          <el-radio label="teacher">所有专家</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="establish">立即发送</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from '@/assets/axios/SendMessage.js'
  const Qs = require('qs');
  export default {
    data() {
      return {
        // data: [],
        // value4: [1],
        form: {
          messageTitle: '',
          messageContent: '',
          userIds: [],
          broadcastTag: ''
        },
        sendType: true,
        options: [],
        rules: {
          messageTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
          messageContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
          userIds: [{ type: 'array', required: true, message: '请至少选择一个用户', trigger: 'change' }],
          broadcastTag: [{ required: true, message: '请选择群发群体', trigger: 'change' }],
        }
      };
    },
    mounted() {
    },
    methods: {
      // 立即发送
      establish() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          } else {
            let query
            if (this.sendType) {
              query = new FormData()
              query.append('messageTitle', this.form.messageTitle)
              query.append('messageContent', this.form.messageContent)
              delete query.broadcastTag
              for(let i of this.form.userIds){
                  query.append('userId',i)
              }
            } else {
              query = { ...this.form }
              delete query.userIds
              query = `?${Qs.stringify(query)}`
            }
            axios.sendMessage(query)
            .then(() => {
              this.$message.success('发送成功')
            })
            .catch(() => {
              this.$message.error('发送失败')
            })
          }
        });
      },
      // 单独发送搜索
      remoteMethod(query) {
        axios.getUserList(0, 100, {trueName: query})
        .then(({data}) => {
          this.options = data.result
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .list-main{
    height: 94%;
    overflow: auto;
    background-color: white;
    .transfer-footer {
      margin-left: 20px;
      padding: 6px 5px;
    }
    .activity-name {
      width: 400px;
    }
  }
</style>