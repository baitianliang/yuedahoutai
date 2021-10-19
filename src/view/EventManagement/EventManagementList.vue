<template>
    <div class="list-main">
        <!-- <p class="title">赛事管理列表</p> -->
        <el-button class="add" @click="addCompetition">添加</el-button>
        <div class="list-main_content" :style="`height: ${height}px`">
            <div
                v-for="(item,index) in dataList"
                :key="index"
                class="every-data"
                :class="{'last-data': (index+1)%8===0}">
                <div class="details-state">
                    <img :src="item.activityAvatar" alt="" style="width:90px;height:60px;margin-top:5px">
                    <!-- <div style="width:90px;height:70px;background-color:red;margin-top:10px"></div> -->
                    <div class="competition">
                        <h4><b>{{item.activityName}}</b></h4>
                        <div class="competition-details">
                            <div>
                                <p>报名截止时间：{{item.activityStartTime}}</p>
                                <p>赛事状态：{{item.activityStatus==="active" ? '上架' : '下架'}}</p>
                                <p>评审结束时间：{{item.activityEndTime}}</p>
                            </div>
                            <!-- <div class="competition-details_right">
                                <p>创建时间：{{item.activityCreateTime}}</p>
                                <p>赛事状态：{{item.activityStatus==="active" ? '进行中' : '已结束'}}</p>
                                <p>上架下架：{{item.activityStatus==="active" ? '上架' : '下架'}}</p>
                                <p>报名人数：{{item.activityImpUser}}</p>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <div class="button-group_top">
                        <el-button style="marign-left: 20px" type="text" @click="modifyActivity(item)">编辑赛事</el-button>
                        <img src="@/assets/img/write.png" alt="组别管理" style="width:20px;height:20px;color:#495A80">
                        <el-button type="text" @click="teamManagement(item)">组别管理</el-button>
                        <el-dropdown @command="handleCommand(item)">
                            <el-button class="audit-status" type="text">
                                赛事状态
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="item.activityStatus==='active'" command="b">上架</el-dropdown-item>
                                <el-dropdown-item :disabled="item.activityStatus==='inactive'" command="a">下架</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="button-group_bottom">
                        <el-button @click="getOrder(item)">查看订单</el-button>
                        <el-button @click="getEnroll(item)">查看报名</el-button>
                        <el-button @click="getWork(item)">参赛作品</el-button>
                        <el-button @click="addActive(item)">后续赛事</el-button>
                        <el-button v-if="item.activitySeasonType === 'm'" @click="completeActivity(item)">{{ item.activitySeasonEnd === 0 ? '发布结果' : '更新结果'}}</el-button>
                        <!-- <el-button @click="deleteActivity(item)">删除赛事</el-button> -->
                        <!-- <el-button @click="addTeacher(item)">编辑审核老师</el-button> -->
                        <!-- <el-button @click="getPassWork(item)">入围作品</el-button> -->
                    </div>
                </div>
            </div>
        </div>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="8"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
import axios from '@/assets/axios/EventManagement.js'
import expertAxios from '@/assets/axios/Expert.js'
import height from '@/mixins/heightMixin.js'
export default {
    mixins: [height],
    data() {
        return {
            dataList: [],
            currentPage: 1,
            total: 0,
            activityId: ''
        }
    },
    mounted() {
        this.getDataList()
    },
    methods:{
        // 赛事列表
        getDataList() {
            let currentPage = 8 * (this.currentPage - 1)
            axios.getActivityList(currentPage)
            .then(res =>{
                if(res.data.status==0) {
                    this.dataList = res.data.result
                    this.total = res.data.totalCount
                }
            })
        },
        // 列表分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getDataList()
        },
        // 添加按钮
        addCompetition() {
            this.$router.push('/Add')
        },
        // 修改赛事
        modifyActivity(val) {
            localStorage.activityId = val.activityId
            this.$router.push('/EventManagementModify')
        },
        // 组别管理
        teamManagement(val) {
            localStorage.activityLevelActivityId = val.activityId
            this.$router.push('/EventManagementTeam')
        },
        // 审核状态
        handleCommand(val) {
            let { activityId } = val
            if (val.activityStatus === 'active') {
                axios.offActivity(activityId)
                .then(res => {
                    this.$message.success('下架成功')
                    this.getDataList()
                })
                .catch(err => {
                    console.log(err)
                })
            } else {
                axios.onActivity(activityId)
                .then(res => {
                    this.$message.success('上架成功')
                    this.getDataList()
                })
                .catch(err => {
                    console.log(err)
                })
            }
        },
        deleteActivity(val) {
            let { activityId } = val
            axios.deleteActivity(activityId)
            .then(res => {
                if(res && res.data && res.data.status === 0) {
                    this.$message.success('删除成功')
                    this.getDataList()
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        // 公布结果
        completeActivity(val) {
            this.$confirm('是否确认公布最终结果', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let { activityId } = val
                axios.completeActivity(activityId)
                .then(res => {
                    if(res && res.data && res.data.status === 0) {
                        this.$message.success('公布结果成功')
                        this.getDataList()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }).catch(() => { 
            });
        },
        // 查看订单
        getOrder(val) {
            localStorage.activityId = val.activityId
            this.$router.push('/OrderManagementList')
        },
        // 参赛作品
        getWork(val) {
            localStorage.activityId = val.activityId
            this.$router.push('/WorkManagementList')
        },
        // 查看报名
        getEnroll(val) {
            localStorage.activityId = val.activityId
            this.$router.push('/RegistrationManagementList')
        },
        // 添加后续活动
        addActive(val) {
            localStorage.activityId = val.activityId
            this.$router.push('/Add')
        }
        // // 入围作品
        // getPassWork(val) {
        //     localStorage.search = `&activityId=${val.activityId}`
        //     this.$router.push('/WorkManagementList')
        // }
    }
}
</script>

<style lang="scss">

p {
    margin: 0px;
    color: #495A80;
}
.list-main {
    height: auto;
    background-color: white;
    span {
        padding: 0px;
        color: #495A80;
    }
    .title {
        margin: 0px;
        padding: 17px 20px;
        font-size: 20px;
        color: #495A80;
    }
    .add {
        height: 28px;
        line-height: 25px;
        font-size: 13px;
        padding: 0px 15px;
        margin: 0px 20px;
    }
    .list-main_content {
        margin: 0px 20px;
        // height: 75%;
        overflow: auto;
        .every-data {
            display: flex;
            justify-content: space-between;
            border-top: 1px dashed #F2F0EE;
            margin-top: 15px;
            padding-top: 15px;
            .details-state {
                display: flex;
                .competition {
                    margin-left: 20px;
                    font-size: 12px;
                    h4 {
                        padding: 0px;
                        margin: 0px;
                    }
                    .competition-details {
                        display: flex;
                        margin-top: 5px;
                        position: relative;
                        color: #9CA3B5;
                        .competition-details_right {
                            position:absolute;
                            width: 300px;
                            left: 280px;
                        }
                    }
                }
            }
            .button-group {
                .button-group_top {
                    display: flex;
                    justify-content: flex-end;
                    .el-button--text {
                        padding: 0px;
                        font-size: 15px;
                        padding-bottom: 2px;
                        border-radius: 0px;
                        border-bottom: 1px solid #495A80;
                        margin-right: 20px;
                        span {
                            display: flex;
                            align-items: center;
                            margin-left: 0px;
                            // text-decoration: underline;
                            font-size: 12px;
                            span{
                                border-bottom: 1px solid #495A80;
                            }
                        }
                    }
                    .audit-status {
                        // margin-left: 40px;
                        // border-bottom: 1px solid #495A80;
                    }
                }
                .button-group_bottom {
                    .el-button {
                        margin-top: 20px;
                        margin-left: 10px;
                        height: 28px;
                        line-height: 25px;
                        font-size: 12px;
                        padding: 2px 15px;
                        border-radius: 10px;
                    }
                }
            }
        }
    }
    // .last-data {
    //     padding-bottom: 20px;
    //     margin-bottom: 20px;
    //     border-bottom: 1px dashed #F2F0EE;
    // }
    // .el-pagination {
    //     display: flex;
    //     justify-content: flex-end;
    //     margin-top: 10px;
    //     margin-right: 20px;
    // }
}

</style>