<template>
    <div class="breadcrumb">
        <i class="el-icon-s-home" style="color:#808080"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>{{form[routeName].second||''}}</el-breadcrumb-item> -->
            <el-breadcrumb-item>{{form[routeName].thirdly||''}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                "Index": {
                    second: '控制台',
                    thirdly: '控制台'
                },
                "EventManagementList": {
                    second: '赛事管理',
                    thirdly: '赛事列表'
                },
                "EventManagementAdd": {
                    second: '赛事管理',
                    thirdly: '赛事列表'
                },
                "EventManagementTeam": {
                    second: '赛事管理',
                    thirdly: '赛事列表'
                },
                "EventManagementModify": {
                    second: '赛事管理',
                    thirdly: '赛事列表'
                },
                "OrderManagementList": {
                    second: '订单管理',
                    thirdly: '订单列表'
                },
                "Userinfo": {
                    second: '用户管理',
                    thirdly: '用户列表'
                },
                "RegistrationManagementList": {
                    second: '报名管理',
                    thirdly: '报名信息列表'
                },
                "RegistrationCheck": {
                    second: '报名管理',
                    thirdly: '报名审核列表'
                },
                "WorkManagementList": {
                    second: '作品管理',
                    thirdly: '赛事作品'
                },
                "AllWorkList": {
                    second: '作品管理',
                    thirdly: '作品列表'
                },
                "DistributionWork": {
                    second: '作品管理',
                    thirdly: '作品分配'
                },
                "WorkReviewList": {
                    second: '作品评审',
                    thirdly: '评审作品'
                },
                "ExpertList": {
                    second: '专家列表',
                    thirdly: '专家列表查看'
                },
                "TeacherList": {
                    second: '教师列表',
                    thirdly: '教师列表查看'
                },
                "SendMessage": {
                    second: '发送消息',
                    thirdly: '发送消息'
                },
                "JinzhongApply": {
                    second: '金钟奖',
                    thirdly: '报名列表'
                },
                "JinzhongReview": {
                    second: '金钟奖',
                    thirdly: '评审列表'
                },
                "JinzhongJudge": {
                    second: '金钟奖',
                    thirdly: '评委列表'
                },
                "ExportData": {
                    second: '导出数据',
                    thirdly: '导出数据'
                }
            },
            // second: '赛事管理',
            // thirdly: '赛事列表'
        }
    },
    props: {
        routeName: {
            type: String,
            default: ''
        }
    },
}
</script>

<style lang="scss">
.breadcrumb {
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    height: 30px;
    width: 87%;
    background-color: white;
    // margin-left: 1%;
    left: 230px;
    margin-bottom: 10px;
    // margin: 20px 0.5% 10px;
    .el-icon-s-home {
        padding-left: 20px;
    }
}
</style>