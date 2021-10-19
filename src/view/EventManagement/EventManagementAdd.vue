<template>
    <div class="list-main">
        <!-- <p class="title">赛事管理列表<span style="font-size: 15px">—添加</span></p> -->
        <el-form label-position="left" ref="form" :model="form" label-width="100px">
            <el-form-item label="赛事名称">
                <el-input class="activity-name" v-model="form.activityName" placeholder="请输入赛事名称"></el-input>
            </el-form-item>
            <el-form-item label="评委数量">
                <el-input type="number" class="activity-name" v-model="form.activityScoreNum" placeholder="请输入评委数量"></el-input>
            </el-form-item>
            <el-form-item label="赛事缩略图">
                <Onload
                    @onloadSuccess="onloadSuccess"
                    :name="'activityAvatar'"></Onload>
            </el-form-item>
            <el-form-item label="活动开始时间">
                <el-date-picker
                    v-model="form.activityStartTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请输入开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动结束时间">
                <el-date-picker
                    v-model="form.activityEndTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请输入结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="比赛类型">
                <el-select
                    v-model="form.activitySeasonType"
                    placeholder="请选择比赛类型">
                    <el-option
                        v-for="(item, index) in activitySeasonTypeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.activitySeasonType !== ''" label="赛季名">
                <el-input class="activity-name" v-model="form.activitySeason" placeholder="请输入赛季名"></el-input>
            </el-form-item>
            <el-form-item v-if="form.activitySeasonType === 'm'" label="晋级名额">
                <el-input type="number" class="activity-name" v-model="form.activityPassScore" placeholder="请输入晋级名额"></el-input>
            </el-form-item>
            <el-form-item v-else label="及格分数">
                <el-input type="number" class="activity-name" v-model="form.activityPassScore" placeholder="请输入及格分数"></el-input>
            </el-form-item>
            
            <el-form-item label="赛事介绍">
                <!-- <Onload
                    @onloadSuccess="onloadSuccess"
                    :name="'activityDescPic1'"></Onload> -->
                <el-upload
                    class="avatar-uploader"
                    ref="eventInfo"
                    list-type="picture-card"
                    action="http://up-z2.qiniup.com" 
                    bucket="videoslist"
                    :accept="basicPackDefault.acceptImage"
                    :multiple="basicPackDefault.multiple"
                    :before-upload="beforeUpload"
                    :on-success="success"
                    :auto-upload="true"
                    :data="dataObj">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <p>若有多张图片，请按顺序上传</p>
            </el-form-item>
            <el-form-item label="报名须知">
                <el-upload
                    class="avatar-uploader"
                    ref="admissionInformation"
                    list-type="picture-card"
                    action="http://up-z2.qiniup.com" 
                    bucket="videoslist"
                    :accept="basicPackDefault.acceptImage"
                    :multiple="basicPackDefault.multiple"
                    :before-upload="beforeUpload"
                    :on-success="success"
                    :auto-upload="true"
                    :data="dataObj">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <p>若有多张图片，请按顺序上传</p>
                <!-- <el-input type="textarea" :rows="5" v-model="form.activityDescPic2"></el-input> -->
            </el-form-item>
            <el-form-item>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from '@/assets/axios/EventManagement.js'
export default {
    data() {
        return {
            form: {
                activityName: '',
                activityStartTime: '',
                activityEndTime: '',
                activityAvatar: '',
                activityDescPic1: [],
                activityDescPic2: [],
                activityScoreNum:5 ,
                activityPassScore: 17,
                activitySeason: '',
                activitySeasonType: ''
                // activityAvatar: 'http://video.yuedamusic.com/101d9c48a438e3393992ef9502b2b606.mp4?vframe/jpg/offset/1',
                // activityDescPic1: 'http://video.yuedamusic.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200712145321.jpg',
                // activityDescPic2: 'http://video.yuedamusic.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200712145343.jpg'
            },
            dataList: ['','','',''],
            activitySeasonTypeList: [{
                label: '普通赛事',
                value: ''
            }, {
                label: '月赛',
                value: 'm'
            }, {
                label: '决赛',
                value: 'y'
            }],
            currentPage: 1,
            basicPackDefault: {
                maxLength: 1,   //最大图片数量
                multiple: true, //可否上传多张
                acceptImage: "image/gif,image/jpeg,image/jpg,image/png",
            },
            dataObj: {token: '', key: '',name:''},
            url: '',
        }
    },
    mounted() {
    },
    methods:{
        // 上传成功后赋值参数
        onloadSuccess(name, val) {
            this.form[name] = val
        },
        //TODO 上传之前 获取TOKEN
        async beforeUpload(file) {
            this.dataObj.key = file.name;
            this.basicPackDefault.multiple=true;
            // 获取七牛token
            let token = await axios.getQiniuToken()
            this.dataObj.token = token.data
        },
        //上传成功后
        success: function (name, res, fileList) {
        },
        // 确认
        onSubmit() {
            if(!this.form.activityName) {
                return this.$message.error('请输入赛事名称');
            } else if(!this.form.activityStartTime) {
                return this.$message.error('请输入截止报名时间');
            } else if(!this.form.activityEndTime) {
                return this.$message.error('请输入截止评审时间');
            } else if(Number(this.form.activityStartTime.replace(/[-|:|\s]/g,"")) > Number(this.form.activityEndTime.replace(/[-|:|\s]/g,""))) {
                return this.$message.error('报名结束时间不得超过评审结束时间');
            }
            if(!!this.$refs.eventInfo.uploadFiles.length) {
                this.$refs.eventInfo.uploadFiles.forEach(el => {
                    this.form.activityDescPic1.push(`http://video.yuedamusic.com/${el.name}`)
                })
            }
            if(!!this.$refs.admissionInformation.uploadFiles.length) {
                this.$refs.admissionInformation.uploadFiles.forEach(el => {
                    this.form.activityDescPic2.push(`http://video.yuedamusic.com/${el.name}`)
                })
            }
            this.form.activityDescPic1 = JSON.stringify(this.form.activityDescPic1)
            this.form.activityDescPic2 = JSON.stringify(this.form.activityDescPic2)
            let obj = { ...this.form }
            if (obj.activitySeasonType === '') {
                delete obj.activitySeasonType
                delete obj.activitySeason
            }
            if (!!localStorage.activityId) {
                obj.preActivityId = localStorage.activityId
                axios.addSeriesActivity(obj)
                .then(res => {
                    this.$message.success("添加成功")
                    this.cancel()
                })
                .catch(err => {
                    if(err.response.status === 500) {
                        this.$message.error("赛事重名，请更换赛事名再次添加！")
                    }
                })
            } else {
                axios.addActivity(obj)
                .then(res => {
                    this.$message.success("添加成功")
                    this.cancel()
                })
                .catch(err => {
                    if(err.response.status === 500) {
                        this.$message.error("赛事重名，请更换赛事名再次添加！")
                    }
                })
            }
        },
        // 取消
        cancel() {
            localStorage.activityId = ''
            this.$router.back(-1)
        },
    },
    destroyed() {
        localStorage.activityId = ''
    },
}
</script>
<style lang="scss" scoped>
p {
    margin: 0px;
    color: #495A80;
}
.el-input__inner {
    padding-left: 10px!important
}
.el-input__prefix {
    width: 0px;
    display: none;
}
.list-main {
    height: 94%;
    overflow: auto;
    background-color: white;
    span {
        padding: 0px;
        color: #495A80;
    }
    .el-form {
        margin-left: 20px;
    }
    .activity-name {
        width: 400px;
    }
    .avatar-uploader-icon {
        width: 148px;
        height: 148px;
        line-height: 148px;
    }
}
</style>