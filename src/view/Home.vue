<template>
  <div id="home">
    <el-container>
      <el-aside>
        <Nav></Nav>
      </el-aside>
      <el-container>
        <el-header style="height: 45px">
          <Head>
            <template slot="">
              <el-button type="text" @click="showDialog">修改密码</el-button>
            </template>
          </Head>
        </el-header>
        <el-main>
          <Breadcrumb :routeName="routeName"></Breadcrumb>
          <router-view class="main"/>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
        v-if="dialogFormVisible"
        title="修改密码"
        :visible.sync="dialogFormVisible"
        width="500px">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="原密码">
                <el-input v-model="form.oldPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="form.newPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input v-model="form.cNewPwd" show-password></el-input>
            </el-form-item>
            <!-- <el-form-item>
                <el-button round type="warning" @click="onSubmit">确认修改</el-button>
            </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changePassword">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/assets/axios/User.js'
  export default {
    data() {
      return {
        routeName: 'WorkReviewList',
        roleId: '',
        dialogFormVisible: false,
        form: {
            oldPwd: '',
            newPwd: '',
            cNewPwd: ''
        },
        roleId: ''
      }
    },
    created() {
        this.routeName = this.$route.name
    },
    updated() {
        this.routeName = this.$route.name
    },
    methods: {
      showDialog() {
        this.dialogFormVisible = true
      },
      changePassword() {
        if (!this.form.oldPwd) return this.$message.error('请输入原始密码！')
        if (!this.form.newPwd) return this.$message.error('请输入新密码！')
        if (!this.form.cNewPwd) return this.$message.error('请输入确认密码！')
        if (this.form.newPwd !== this.form.cNewPwd) return this.$message.error('两次输入密码不一致！')
        let s = {
          oldPwd:this.form.oldPwd,
          newPwd:this.form.newPwd
        }
        axios.changePassword(s)
        .then(res=>{
          if (res.status == -1){
            this.$message.success('修改失败')
          }else{
            this.$message.success('修改成功，请重新登陆')
            localStorage.clear()
            this.$router.push('/Login')
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>

<style lang="scss">
html {
  overflow: hidden!important
}
#home {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
  .el-header {
    position: fixed;
    right: 0px;
    // padding: 0 10px;
    // margin-left: 210px;
  }

  .el-aside {
    position: fixed;
    background-color: #ffffff;
    height: 100%;
    width: 210px!important;
  }

  .el-main {
    padding: 0;
    margin-top: 50px;
    margin-left: 210px;
    height: 98%;
    overflow: hidden;
    .main {
      width: 98%;
      margin: 0 1%;
      margin-top: 45px;
      padding-top: 20px;
      // margin-top: ;
      height: 95%;
      .title {
        margin: 0px;
        padding: 17px 20px;
        font-size: 20px;
        color: #495A80;
      }
      .search-input {
          padding: 0 20px 10px;
          display: flex;
          .el-input {
              width: 200px;
              margin-right: 20px;
          }
          .el-select {
            margin-right: 20px;
            .el-input {
              width: 160px;
              margin-right: 0px
            }
          }
      }
      .el-table {
        width: auto;
        margin: 0px 20px;
        overflow: hidden;
        .is-center {
          padding: 5px 0px;
        }
      }
      .el-pagination {
        position: fixed;
        right: 40px;
        bottom: 50px;
      }
    }
  }
  .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }
  .el-progress-circle {
    height: 105px!important;
    width: 105px!important;
    margin: auto;
  }
</style>
