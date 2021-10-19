<template>
    <div class="upload">
        <el-upload
            class="avatar-uploader"
            ref="uploadImage"
            action="http://up-z2.qiniup.com" 
            bucket="videoslist"
            :show-file-list="false"
            :limit="basicPackDefault.maxLength"
            :accept="basicPackDefault.acceptImage"
            :multiple="basicPackDefault.multiple"
            :before-upload="beforeUpload"
            :on-success="success"
            :before-remove="deleteUpload"
            :on-error="uploadError"
            :auto-upload="true"
            :data="dataObj">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button @click="deleteUpload" v-if="imageUrl" type="danger" icon="el-icon-delete" circle></el-button>
    </div>
</template>

<script>
import axios from '@/assets/axios/EventManagement.js'
export default {
    data() {
        return {
            basicPackDefault: {
                maxLength: 1,   //最大图片数量
                multiple: true, //可否上传多张
                acceptImage: "image/gif,image/jpeg,image/jpg,image/png",
            },
            dataObj: {token: '', key: '',name:''},
            imageUrl: this.imgUrl||'',
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        imgUrl: {
            type: String,
            default: ''
        }
    },
    mounted() {
        setTimeout(() => {
            this.imageUrl = this.imgUrl
        }, 300);
    },
    methods: {
        // 删除上传图片
        deleteUpload() {
            this.imageUrl = ''
            this.$refs.uploadImage.clearFiles()
            this.$emit('onloadSuccess', '', this.imageUrl)
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
        success: function (res, file, files) {
            var privateBucketDomain = 'http://video.yuedamusic.com/';
            this.imageUrl = privateBucketDomain + res.key
            this.$emit('onloadSuccess', this.name, this.imageUrl)
        },
        //上传失败后
        uploadError: function (response, file, fileList) {
            this.$message.error("上传失败，请检查文件名是否重复，重新上传！！！")
        },
    }
}
</script>

<style lang="scss">
.upload {
    display: flex;
    align-items: center;
    .activity-name {
        width: 400px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .el-button{
        height: 50px;
        width: 50px;
        margin-left: 20px;
    }
}
</style>