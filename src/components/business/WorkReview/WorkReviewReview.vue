<template>
    <div class="work-review-main">
        <div class="search-input head-left">
            <!-- <el-input
                suffix-icon="el-icon-search"
                v-model="searchText"
                ></el-input> -->
            <el-input v-if="roleId === '2'" @keyup.enter.native="offset = 1; search()" placeholder="作品名称" v-model="searchForm.workName"></el-input>
            <el-input v-if="roleId === '2'" @keyup.enter.native="offset = 1; search()" v-model="searchForm.enrollTrueName" placeholder="请输入姓名"></el-input>
            <el-input v-if="roleId === '2'" @keyup.enter.native="offset = 1; search()" v-model="searchForm.mobileId" placeholder="请输入手机号"></el-input>
            <el-select @keyup.enter.native="search" v-model="searchForm.activityId" @change="activityChange" placeholder="请选择活动">
                <el-option
                    v-for="(item, index) in activityList"
                    :key="index"
                    :label="item.activityName"
                    :value="item.activityId">
                </el-option>
            </el-select>
            <el-select @keyup.enter.native="search" v-if="searchForm.activityId" v-model="searchForm.activityLevelId" placeholder="请选择组别">
                <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.activityLevelName"
                    :value="item.activityLevelId">
                </el-option>
            </el-select>
            <el-button @click="search">筛选</el-button>
            <a style="margin-left: auto; font-size: 20px" target="_blank" :href="link">查看规则</a>
        </div>
        <div class="work-review-review-list">
            <div class="every-data" v-for="(item, index) in dataList" :key="index">
                <img :src="item.workAvatar" @click="review(item)">
                <i class="el-icon-caret-right icon" @click="review(item)"></i>
                <p class="activity-name">{{item.activityName}}</p>
                <div class="activit-leve-name">
                    <p>{{item.activityLevelName}}</p>
                    <p v-if="roleId === '2'">评委：{{item.trueName}}</p>
                </div>
                <el-button round size="mini" @click="review(item)">{{scoreStatus === "active" && roleId === '3' ? '查看' : '评审'}}</el-button>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" width="1100px">
            <div class="dialog-content">
                <video id="video" :src="videoUrl" controls autoplay class="video" ref="dialogVideo" width="700px"></video>
                <div class="dialog-right">
                    <p>{{enrollTrueName}} — <b>{{workName}}</b></p>
                    <el-form :model="form" label-position="left">
                        <el-form-item label="技术水平" :label-width="formLabelWidth">
                            <el-rate :disabled="scoreStatus === 'active' && roleId === '3'" v-model="form.scoreItem1" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="规格规范" :label-width="formLabelWidth">
                            <el-rate :disabled="scoreStatus === 'active' && roleId === '3'" v-model="form.scoreItem2" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="音乐表现" :label-width="formLabelWidth">
                            <el-rate :disabled="scoreStatus === 'active' && roleId === '3'" v-model="form.scoreItem3" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="能力基础" :label-width="formLabelWidth">
                            <el-rate :disabled="scoreStatus === 'active' && roleId === '3'" v-model="form.scoreItem4" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="演奏状态" :label-width="formLabelWidth">
                            <el-rate :disabled="scoreStatus === 'active' && roleId === '3'" v-model="form.scoreItem5" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item v-if="roleId === '2'" label="评审教师" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.trueName"></el-input>
                        </el-form-item>
                        <el-form-item label="评语：" label-width="300px">
                        </el-form-item>
                        <el-form-item label-width="0px">
                            <el-input :readonly="scoreStatus === 'active' && roleId === '3'" type="textarea" :rows="5" v-model="form.scoreComment"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="dialog-bottom">
                <el-form :model="form" label-position="left">
                    <el-form-item label="综合评分" :label-width="formLabelWidth">
                        <el-input
                            placeholder="请输入0~100之间的整数"
                            oninput="if(value > 100 || value < 0 ){alert('请输入0~100之间的数字！');value = ''}"
                            :disabled="scoreStatus === 'active' && roleId === '3'"
                            v-model.number="form.scorePoint"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="scoreStatus === 'inactive' || roleId === '2'" slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button v-if="roleId === '3'" type="primary" @click="saveState">存为草稿</el-button>
                <el-button type="primary" @click="affirm">提 交</el-button>
            </div>
        </el-dialog>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-size="limit"
            :current-page="offset"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
import axios from '@/assets/axios/WorkReview.js'
import activityAxios from '@/assets/axios/RegistrationManagement.js'
import levelAxios from '@/assets/axios/EventManagement.js'
export default {
    data() {
        return {
            link: "http://h5.yuedamusic.com/attach/pingshenshuoming.pdf",
            dataList: [],
            activityList: [],
            levelList: [],
            searchForm: {
                workName: '',
                enrollTrueName: '',
                mobileId: '',
                activityId: '',
                activityLevelId: '',
            },
            userId: '',
            roleId: '',
            offset: 1,
            limit: 48,
            total: 0,
            dialogFormVisible: false,
            formLabelWidth: '100px',
            videoUrl: '',
            title: '',
            enrollTrueName: '',
            workName: '',
            searchText: '',
            form: {
                scoreId: '',
                scoreItem1: 0,
                scoreItem2: 0,
                scoreItem3: 0,
                scoreItem4: 0,
                scoreItem5: 0,
                scoreComment: '',
                scorePoint: ''
            },
        }
    },
    mounted() {
        this.userId = localStorage.userId
        this.roleId = localStorage.roleId
        activityAxios.getActivityList()
        .then(res => {
            this.activityList = JSON.parse(JSON.stringify(res.data.result));
            this.searchForm.activityId = this.activityList[0].activityId
            this.activityChange()
            if (this.roleId === "2") {
                this.getAllList()
            } else {
                this.getDataList()
            }
        })
    },
    props: {
        scoreStatus: {
            type: String,
            default: ''
        }
    },
    methods: {
        search() {
            this.offset = 1
            if (this.roleId === "2") {
                this.getAllList()
            } else {
                this.getDataList()
            }
        },
        // 获取全部作品
        getAllList() {
            let offset = this.limit * (this.offset - 1)
            let form = {}
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    form[item] = this.searchForm[item]
                }
            }
            axios.getAllScoreList(offset, this.limit, this.scoreStatus, form)
            .then(res => {
                this.dataList = res.data.result
                this.total = res.data.totalCount
            })
            .catch(err =>{
                console.log(err)
            })
        },
        // 获取老师评审列表
        getDataList() {
            let offset = this.limit * (this.offset - 1)
            let form = {}
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    form[item] = this.searchForm[item]
                }
            }
            axios.getScoreList(offset, this.limit, this.userId, this.scoreStatus, form)
            .then(res => {
                this.dataList = res.data.result
                this.total = res.data.totalCount
            })
            .catch(err =>{
                console.log(err)
            })
        },
        activityChange() {
            levelAxios.getActivityLevelList(this.searchForm.activityId)
            .then(res => {
                this.levelList = JSON.parse(JSON.stringify(res.data.result));
                this.searchForm.activityLevelId = ''
            })
        },
        // 分页
        handleCurrentChange(val) {
            this.offset = val
            if (this.roleId === "2") {
                this.getAllList()
            } else {
                this.getDataList()
            }
        },
        // 评审/查看按钮
        review(val) {
            axios.getScoreDetail(val.scoreId)
            .then(({data}) => {
                let { workContent, activityName, activityLevelDesc, enrollTrueName, workName, scoreItem1, scoreItem2, scoreItem3, scoreItem4, scoreItem5,
                scoreComment, scoreId, trueName, scorePoint} = data.result
                this.videoUrl = workContent
                this.title = activityName + activityLevelDesc
                this.workName = workName
                this.enrollTrueName = enrollTrueName
                scorePoint = scorePoint === 0 ? '' : scorePoint
                this.form = { scoreItem1, scoreItem2, scoreItem3, scoreItem4, scoreItem5, scoreComment, scoreId, trueName, scorePoint }
            })
            // this.title = val.activityName + val.activityLevelDesc
            this.dialogFormVisible = true
        },
        // 保存草稿
        saveState() {
            axios.teacherSaveGrade(this.form)
            .then(res => {
                this.getDataList()
                this.$message.success('保存草稿成功')
                this.cancle()
            })
        },
        // 确认按钮
        affirm() {
            if(!this.form.scoreComment) return this.$message.error('请输入评语')
            this.$confirm('是否提交评价信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.roleId === "2") {
                    axios.adminScoreGrade(this.form)
                    .then(res => {
                        this.getAllList()
                        this.$message.success('评分成功')
                        this.cancle()
                    })
                    .catch(err => {
                        this.$message.error('评分失败')
                    })
                } else {
                    axios.adminExpertGrade(this.form)
                    .then(res => {
                        this.getDataList()
                        this.$message.success('评分成功')
                        this.cancle()
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });          
            });
        },
        // 取消按钮
        cancle() {
            this.dialogFormVisible = false
            this.videoUrl = ''
            this.title = ''
            this.form = {
                scoreEnrollId: '',
                scoreItem1: 0,
                scoreItem2: 0,
                scoreItem3: 0,
                scoreItem4: 0,
                scoreItem5: 0,
                scoreComment: ''
            }
        },
    }
}
</script>

<style lang="scss">
.work-review-main {
    width: 100%;
    height: 100%;
}
.head-left {
    padding-left: 0px!important;
    display: flex;
    .el-select {
        margin-right: 20px
    }
}
.work-review-review-list {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    // align-content: space-around;
    // flex-direction: row;
    .every-data {
        box-sizing: border-box;
        flex: 0 0 14%;
        height: auto;
        max-height: 250px;
        width: 14%;
        margin: 0.5% 2% 0.5% 0px;
        border: 1px solid #F2F0EE;
        position: relative;
        img{
            width: 100%;
            height: 100px;
            cursor:pointer
        }
        .activity-name {
            margin: 5px;
            font-size: 15px;
        }
        .activit-leve-name {
            margin: 0px 5px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        }
        .icon {
            position: absolute;
            top: 32px;
            left: 40%;
            font-size: 38px;
            color: #ffffff;
            border-radius: 50%;
            border: 2px solid #ffffff;
            opacity: 0.4;
            cursor:pointer
        }
        .icon:hover {
            opacity: 1;
        }
        .icon:active {
            opacity: 0.3;
        }
        .el-button {
            margin: 0px 35%;
            margin-top: 5px;
        }
    }
}
.dialog-content {
    display: flex;
    .dialog-right {
        margin-left: 20px;
        p {
            margin: 0px;
            font-size: 20px;
        }
        .el-form {
            margin-top: 20px;
            .el-form-item {
                margin-bottom: 0px;
                .el-form-item__label {
                    font-size: 17px;
                }
                .el-form-item__content {
                    .el-rate {
                        .el-rate__item {
                            .el-rate__icon {
                                font-size: 30px;
                                margin-right: 0px;
                            }
                        }
                    }
                }
            }
        }
    }
}
.dialog-bottom {
    margin-top: 20px;
    width: 300px;
    .el-form-item {
        margin-bottom: 0px;
    }
}
</style>