<template>
    <div id="login">
        <img src="@/assets/img/ledalogo.png">
        <p><b>乐答系统管理平台</b></p>
        <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input @keyup.enter.native="register" style="width: 400px" v-model="form.username" autocomplete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input @keyup.enter.native="register" style="width: 400px" type="password" v-model="form.password" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item class="button-group">
                <el-button @keyup.enter.native="register" type="primary" @click="register">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from '@/assets/axios/User.js'
export default {
    data() {
        return {
            form: {
                client_id: 'c1',
                client_secret: 'secret',
                grant_type: 'password',
                username: '',
                password: '',
                // username: 'root',
                // password: '111111',
            },
            formLabelWidth: '100px'
        }
    },
    methods: {
        register() {
            let form = {...this.form}
            axios.getUserToken(form)
            .then(res => {
                //全局存储token
                localStorage["token"] = 'Bearer ' + res.data.access_token;
                // this.dialogFormVisible = false
                axios.getUserInfo()
                .then(({data}) => {
                    if(data.supplement.roleId === 1) {
                        form.username += '0'
                        axios.getUserToken(form)
                        .then(res => {
                            //全局存储token
                            localStorage["token"] = 'Bearer ' + res.data.access_token;
                            // this.dialogFormVisible = false
                            axios.getUserInfo()
                            .then(({data}) => {
                                if(data.supplement.roleId === 1)
                                return this.$message.error('权限错误')
                                this.$message.success('登陆成功')
                                localStorage.roleId = data.supplement.roleId
                                localStorage.name = data.result.userName
                                localStorage.avatar = data.result.userAvatar
                                localStorage.userId = data.result.userId
                                this.$router.push('/WorkReviewList')
                            })
                        })
                        .catch(err => {
                            this.$message.error('权限错误')
                        })
                    } else {
                        this.$message.success('登陆成功')
                        localStorage.roleId = data.supplement.roleId
                        localStorage.name = data.result.userName
                        localStorage.avatar = data.result.userAvatar
                        localStorage.userId = data.result.userId
                        this.$router.push('/WorkReviewList')
                    }
                })
            })
            .catch(err => {
                this.$message.error('用户名或密码错误，请重新登录')
            })
        }
    }
}
</script>

<style lang="scss">
#login {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    img {
        margin-top: 100px;
        width: 200px;
        height: 200px;
    }
    p {
        font-size: 25px;
        color: #606266;
    }
    .el-form {
        margin-top: 100px;
        .button-group {
            display: flex;
            // align-items: flex-end;
            justify-content: flex-end;
        }
    }
}
</style>