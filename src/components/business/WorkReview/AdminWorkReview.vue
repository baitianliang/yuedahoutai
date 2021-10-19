<template>
    <div class="work-review-main">
        <div class="search-input head-left">
            <!-- <el-input
                suffix-icon="el-icon-search"
                v-model="searchText"
                ></el-input> -->
            <el-input @keyup.enter.native="offset = 1; getAllList()" placeholder="作品名称" v-model="searchForm.workName"></el-input>
            <el-input @keyup.enter.native="offset = 1; getAllList()" v-model="searchForm.enrollName" placeholder="请输入姓名"></el-input>
            <el-input @keyup.enter.native="offset = 1; getAllList()" v-model="searchForm.enrollPhone" placeholder="请输入手机号"></el-input>
            <el-select @keyup.enter.native="getAllList" v-model="searchForm.activityId" @change="activityChange" placeholder="请选择活动">
                <el-option
                    v-for="(item, index) in activityList"
                    :key="index"
                    :label="item.activityName"
                    :value="item.activityId">
                </el-option>
            </el-select>
            <el-select @keyup.enter.native="getAllList" v-if="searchForm.activityId" v-model="searchForm.activityLevelId" placeholder="请选择组别">
                <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.activityLevelName"
                    :value="item.activityLevelId">
                </el-option>
            </el-select>
            <el-button @click="offset = 1; getAllList()">筛选</el-button>
            <!-- <el-button :disabled="!checkList.length" type="primary" @click="batch()">批量发布</el-button> -->
        </div>
        <div class="work-review-review-list">
            <div class="every-data" v-for="(item, index) in dataList" :key="index">
                <img :src="item.workAvatar" @click="review(item)">
                <i class="el-icon-caret-right icon" @click="review(item)"></i>
                <p class="activity-name">{{item.activityName}}</p>
                <div class="activit-leve-name">
                    <p>{{item.activityLevelName}}</p>
                    <p style="color: #67C23A" v-if="item.enrollMark===1"> 已加分 </p>
                    <p style="color: red" v-if="item.enrollMark===-1"> 已减分 </p>
                    <!-- <el-checkbox v-model="item.checked" @change='changeCheck(item)'></el-checkbox> -->
                </div>
                <div class="data_button">
                    <!-- <div></div> -->
                    <!-- <el-button round size="mini" @click="review(item)">发布</el-button> -->
                    <!-- <el-checkbox-button size="mini" :label="city" :key="city">选中</el-checkbox-button> -->
                </div>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" width="1100px" @close="dialogClose">
            <div class="dialog-head" v-if="beforeWorkForm.workName">
                <div class="dialog-head-top">
                    <div class="dialog-head_player">选手: {{beforeWorkForm.enrollTrueName}}</div>
                    <el-button type="text" @click="beforeWork">上阶段曲目: {{beforeWorkForm.workName}}</el-button>
                </div>
                <div class="dialog-head-bottom">所属组别: {{beforeWorkForm.activityLevelName}}</div>
                <!-- <div>该组规则: {{}}</div> -->
            </div>
            <div class="dialog-content">
                <video id="video" :src="videoUrl" controls autoplay class="video" ref="dialogVideo" width="700px"></video>
                <div class="dialog-right">
                    <p>{{enrollTrueName}} — <b>{{workName}}</b></p>
                    <el-form :model="form" label-position="left">
                        <el-form-item label="技术水平" :label-width="formLabelWidth">
                            <el-rate disabled show-score v-model="form.item1" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="规格规范" :label-width="formLabelWidth">
                            <el-rate disabled show-score v-model="form.item2" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="音乐表现" :label-width="formLabelWidth">
                            <el-rate disabled show-score v-model="form.item3" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="能力基础" :label-width="formLabelWidth">
                            <el-rate disabled show-score v-model="form.item4" :max="7"></el-rate>
                        </el-form-item>
                        <el-form-item label="演奏状态" :label-width="formLabelWidth">
                            <el-rate disabled show-score v-model="form.item5" :max="7"></el-rate>
                        </el-form-item>
                        <!-- <el-form-item label="评审教师" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.trueName"></el-input>
                        </el-form-item> -->
                        <el-form-item label="评星总分" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.average"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-top: 20px;" label="加星减星" :label-width="formLabelWidth">
                            <div class="display: flex; justify-content: space-between; flex-direction: column;">
                                <el-input-number size="small" v-model="form.enrollMark" :min="-1" :max="1" label="描述文字"></el-input-number>
                                <el-button size="small" @click="changeStar">保存</el-button>
                            </div>
                        </el-form-item>
                        <!-- <el-form-item style="margin-top: 20px" label="综合评分" :label-width="formLabelWidth">
                            <el-input
                                type="number"
                                placeholder="请输入0~100之间的数字"
                                oninput="if(value > 100 || value < 0 ){alert('请输入0~100之间的数字！');value = ''}"
                                :disabled="scoreStatus === 'active'"
                                v-model="form.scorePoint"></el-input>
                        </el-form-item> -->
                        <!-- <el-form-item label="评语：" label-width="300px">
                        </el-form-item>
                        <el-form-item label-width="0px">
                            <el-input :readonly="scoreStatus === 'active'" type="textarea" :rows="5" v-model="form.scoreComment"></el-input>
                        </el-form-item> -->
                    </el-form>
                </div>
            </div>
            <!-- <div class="dialog-bottom">
                <el-form :model="form" label-position="left">
                </el-form>
            </div> -->
            <!-- <div v-if="scoreStatus === 'inactive'" slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="affirm">发 布</el-button>
            </div> -->
        </el-dialog>
        <el-dialog @close="dialogBeforeWorkClose" :close-on-click-modal="false" v-if="dialogBeforeWork" :title="beforeWorkForm.workName" :visible.sync="dialogBeforeWork" width="750px">
            <div class="dialog-content">
                <video :src="beforeWorkForm.workContent" controls autoplay class="video" ref="dialogVideo" width="700px"></video>
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
import workAxios from '@/assets/axios/WorkManagement.js'
import activityAxios from '@/assets/axios/RegistrationManagement.js'
import levelAxios from '@/assets/axios/EventManagement.js'
export default {
    data() {
        return {
            dataList: [],
            checkList: [],
            activityList: [],
            levelList: [],
            searchForm: {
                workName: '',
                enrollName: '',
                enrollPhone: '',
                activityId: '',
                activityLevelId: '',
            },
            userId: '',
            offset: 1,
            limit: 48,
            total: 0,
            dialogFormVisible: false,
            dialogBeforeWork: false,
            formLabelWidth: '100px',
            videoUrl: '',
            title: '',
            enrollTrueName: '',
            workName: '',
            searchText: '',
            form: {
                scoreId: '',
                item1: 0,
                item2: 0,
                item3: 0,
                item4: 0,
                item5: 0,
                scoreComment: '',
                scorePoint: ''
            },
            beforeWorkForm: {}
        }
    },
    mounted() {
        this.userId = localStorage.userId
        activityAxios.getActivityList()
        .then(res => {
            this.activityList = JSON.parse(JSON.stringify(res.data.result));
            this.searchForm.activityId = this.activityList[0].activityId
            this.activityChange()
            this.getAllList()
        })
    },
    props: {
        scoreStatus: {
            type: String,
            default: ''
        }
    },
    methods: {
        // 获取全部作品
        getAllList() {
            let offset = this.limit * (this.offset - 1)
            let form = {}
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    form[item] = this.searchForm[item]
                }
            }
            // workAxios.getActivityWorkList(offset, this.limit, form, 'publishStatus=5')
            // workAxios.getActivityWorkList(offset, this.limit, form)
            axios.getAdminAllScoreList(offset, this.limit, form)
            .then(res => {
                this.dataList = res.data.result
                this.dataList.forEach( el => {
                    this.checkList.includes(el.enrollId) ? el.checked = true : el.checked = false
                })
                this.total = res.data.totalCount
            })
            .catch(err =>{
                console.log(err)
            })
        },
        // 切换选中状态
        changeCheck(val) {
            if(this.checkList.includes(val.enrollId)) {
                this.checkList.splice(val.enrollId, 1)
            } else {
                this.checkList.push(val.enrollId)
            }
        },
        // 批量发布
        batch() {
            this.$confirm('是否发布选中作品评价信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.publish(this.checkList)
                .then(res => {
                    this.getAllList()
                    this.$message.success('发布成功')
                    this.checkList = []
                })
            })
        },
        // 切换活动
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
            this.getAllList()
        },
        // 评审/查看按钮
        review(val) {
            if(val.enrollSong) {
                axios.getBeforeWork(val.enrollSong)
                .then(({data}) => {
                    let { enrollTrueName, workName, activityLevelName, workContent } = data.result
                    this.beforeWorkForm = { enrollTrueName, workName, activityLevelName, workContent }
                })
            }
            let { workContent, activityName, activityLevelDesc, enrollTrueName, workName, item1, item2, item3, item4, item5,
            scoreComment, scoreId, trueName, scorePoint, average, enrollMark, enrollId} = val
            this.videoUrl = workContent
            this.title = activityName + activityLevelDesc
            this.workName = workName
            this.enrollTrueName = enrollTrueName
            this.form = { item1, item2, item3, item4, item5, scoreComment, scoreId, trueName, scorePoint, average, enrollMark, enrollId }
            this.dialogFormVisible = true
        },
        beforeWork() {
            let myVideo = document.getElementById("video")
            myVideo.pause()
            this.dialogBeforeWork = true
        },
        dialogBeforeWorkClose() {
            let myVideo = document.getElementById("video")
            myVideo.play()
        },
        // 加星减星
        changeStar() {
            axios.changeStar(this.form.enrollId, this.form.enrollMark)
            .then(res => {
                this.getAllList()
                this.$message.success('保存成功')
                // this.cancle()
            })
        },
        // 确认按钮
        affirm() {
            this.$confirm('是否发布评价信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.publish([this.form.enrollId])
                .then(res => {
                    this.getAllList()
                    this.$message.success('发布成功')
                    this.cancle()
                })
            })
        },
        dialogClose() {
            this.videoUrl = ''
            this.title = ''
            this.form = {
                scoreEnrollId: '',
                item1: 0,
                item2: 0,
                item3: 0,
                item4: 0,
                item5: 0,
                scoreComment: ''
            }
            this.beforeWorkForm = {
                enrollTrueName: '',
                workName: '',
                activityLevelName: ''
            }
        },
        // 取消按钮
        cancle() {
            this.dialogFormVisible = false
            this.videoUrl = ''
            this.title = ''
            this.form = {
                scoreEnrollId: '',
                item1: 0,
                item2: 0,
                item3: 0,
                item4: 0,
                item5: 0,
                scoreComment: ''
            }
            this.beforeWorkForm = {
                enrollTrueName: '',
                workName: '',
                activityLevelName: ''
            }
        },
    }
}
</script>

<style lang="scss" scoped>
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
.dialog-head {
    color: #00B1FD!important;
    font-size: 17px;
    text-align: left;
    span {
        color: #00B1FD;
    }
    .dialog-head-top {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .el-button {
            font-size: 17px;
        }
        .dialog-head_player {
            margin-right: 20px;
        }
    }
}
.dialog-head:hover {
    color: #00B1FD!important;
}
.dialog-head:active {
    color: #00B1FD!important;
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
    // flex-direction: column;
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
        .data_button {
            display: flex;
            // justify-content: space-between;
            justify-content: center;
            margin-top: 5px;
            .el-button {
                margin: 0px;
            }
        }
        // .el-button {
        //     // display: inline;
        //     margin: 0px 35%;
        //     margin-top: 5px;
        // }
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