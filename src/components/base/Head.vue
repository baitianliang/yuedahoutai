<template>
    <div class="head">
        <div v-if="showUser" class="head-right">
            <el-avatar :size="27" :src="avatar"></el-avatar>
            <span style="margin-right: 20px">欢迎您，{{ name }}</span>
            <div class="head-right">
                <slot></slot>
            </div>
            <el-popconfirm
                title="是否确认退出登录？"
                @onConfirm="onConfirm">
                <el-button slot="reference" type="text">
                    <img src="@/assets/img/shutdown.png" alt="退出" style="width:27px;height:27px;margin-left:20px">
                    <span>退出</span>
                </el-button>
            </el-popconfirm>
        </div>
        <div class="head-right" v-else>
            <el-button type="text" @click="showDialog">登录</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'admin',
            avatar: '',
            circleUrl: '',
            searchText: '',
            showUser: false,
        }
    },
    created() {
        let { name, avatar, token, roleId } = localStorage
        this.showUser = !!token
        this.name = name
        this.avatar = avatar
        this.roleId = roleId
    },
    methods: {
        onConfirm() {
            localStorage.clear()
            // this.showUser = false
            this.$router.push('/Login')
        },
        showDialog() {
            this.$router.push('/Login')
            // this.dialogFormVisible = true
        },
    },
}
</script>

<style lang="scss">
.head {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    // height: 40px;
    .head-right {
        display: flex;
        align-items: center;
        margin-right: 30px;
        .head-right_text {
            display: flex;
        }
        span {
            color: #495A80;
            margin-left: 20px;
        }
        .el-button {
            padding: 0px;
            font-size: 12px;
            span {
                display: flex;
                align-items: center;
                margin-left: 0px;
                // color: #000;
            }
        }
    }
}
</style>