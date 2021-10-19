<template>
    <div class="team">
        <!-- <p class="title">参赛作品</p> -->
        <div class="search-input">
            <el-input @keyup.enter.native="offset = 1; getTableData()" placeholder="手机号" v-model="searchForm.mobileId"></el-input>
            <el-input @keyup.enter.native="offset = 1; getTableData()" placeholder="作品名称" v-model="searchForm.workName"></el-input>
            <el-select @keyup.enter.native="offset = 1; getTableData()" v-model="searchForm.workStatus" placeholder="审核状态">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select @keyup.enter.native="offset = 1; getTableData()" v-model="searchForm.activityId" @change="activityChange" clearable placeholder="请选择活动">
                <el-option
                    v-for="(item, index) in activityList"
                    :key="index"
                    :label="item.activityName"
                    :value="item.activityId">
                </el-option>
            </el-select>
            <el-select @keyup.enter.native="offset = 1; getTableData()" v-if="searchForm.activityId" v-model="searchForm.activityLevelId" clearable placeholder="请选择组别">
                <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.activityLevelName"
                    :value="item.activityLevelId">
                </el-option>
            </el-select>
            <el-select
                v-model="searchForm.provinceId"
                clearable
                @keyup.enter.native="offset = 1; getTableData()"
                placeholder="请选择省份"
                @change="searchForm.cityId = ''; searchForm.districtId = ''; getCityList(searchForm.provinceId)">
                <el-option
                    v-for="item in provinceOptions"
                    :key="item.provinceId"
                    :label="item.provinceName"
                    :value="item.provinceId">
                </el-option>
            </el-select>
            <el-select
                v-if="searchForm.provinceId"
                v-model="searchForm.cityId"
                clearable
                @keyup.enter.native="offset = 1; getTableData()"
                placeholder="请选择市区"
                @change="searchForm.districtId = ''; getDistrictList(searchForm.cityId)">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
                </el-option>
            </el-select>
            <el-select
                v-if="searchForm.cityId"
                v-model="searchForm.districtId"
                clearable
                @keyup.enter.native="offset = 1; getTableData()"
                placeholder="请选择县区">
                <el-option
                    v-for="item in districtOptions"
                    :key="item.districtId"
                    :label="item.districtName"
                    :value="item.districtId">
                </el-option>
            </el-select>
            <!-- <el-select v-model="form.provinceId" placeholder="请选择地区">
                <el-option
                v-for="item in provinceOptions"
                :key="item.provinceId"
                :label="item.provinceName"
                :value="item.provinceId">
                </el-option>
            </el-select> -->
            <el-button @click="offset = 1; getTableData()">搜索</el-button>
        </div>
        <el-table
            ref="multipleTable"
            border
            :max-height="height"
            :height="height"
            :data="tableData"
            tooltip-effect="dark">
            <!-- <el-table-column
                header-align="center"
                align="center"
                label="序号"
                :prop="index*2"
                type="index"
                width="100">
            </el-table-column> -->
            <el-table-column header-align="center" align="center" label="序号" type="index" width="50">
                <template slot-scope="scope">
                    <span>{{limit * (offset - 1) + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-for="(item, index) in tableHead"
                :key="index"
                header-align="center"
                align="center"
                :label="item.name"
                :prop="item.prop"
                :width="item.width"></el-table-column>
            <el-table-column
                class-name="operation"
                label="操作"
                width="203"
                header-align="center"
                align="center">
                <template slot-scope="scope">
                    <img src="@/assets/img/write.png" alt="添加备注" style="width:20px;height:20px;color:#495A80">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)">查看作品</el-button>
                    <el-dropdown>
                        <el-button class="audit-status" type="text">
                            审核状态
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :disabled="scope.row.workStatus==='通过'" command="a">
                                <div class="dropdown-span" @click="pass(scope.$index, scope.row)">通过</div>
                            </el-dropdown-item>
                            <el-dropdown-item :disabled="scope.row.workStatus==='驳回'" command="b">
                                <div class="dropdown-span" @click="nopass(scope.$index, scope.row)">驳回</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!-- <el-button
                        class="audit-status"
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)">
                        查看备注
                    </el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" width="850px">
            <div class="dialog-content">
                <video :src="videoUrl" controls autoplay class="video" ref="dialogVideo" width="800px"></video>
            </div>
            <!-- <div v-if="scoreStatus === 'inactive' || roleId === '2'" slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="affirm">确 认</el-button>
            </div> -->
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
const Qs = require('qs');
import axios from '@/assets/axios/WorkManagement.js'
import provinceAxios from '@/assets/axios/Expert.js'
import activityAxios from '@/assets/axios/RegistrationManagement.js'
import levelAxios from '@/assets/axios/EventManagement.js'
import height from '@/mixins/heightMixin.js'
export default {
    mixins: [height],
    data() {
        return {
            searchForm: {
                mobileId: '',
                workName: '',
                workStatus: '',
                activityId: '',
                activityLevelId: '',
                provinceId: '',
                cityId: '',
                districtId: '',
            },
            tableHead: [{
                name: '作品名称',
                prop: 'workName',
                width: '200'
            }, {
                name: '所属赛事',
                prop: 'activityName',
                // width: '450'
            }, {
                name: '组别',
                prop: 'activityLevelName',
                width: '90'
            }, {
                name: '用户号',
                prop: 'mobileId',
                width: '150'
            }, {
                name: '上传用户',
                prop: 'enrollTrueName',
                width: '100'
            }, {
                name: '作品所属',
                prop: 'workTag',
                width: '100'
            }, {
                name: '上传时间',
                prop: 'workCreateTime',
                width: '190'
            }, {
                name: '审核状态',
                prop: 'workStatus',
                width: '100'
            }],
            tableData: [],
            options: [{
                label: '全部',
                value: ''
            },{
                label: '通过',
                value: 'active'
            },{
                label: '待审核',
                value: 'inactive'
            },{
                label: '驳回',
                value: 'delete'
            }],
            activityList: [],
            levelList: [],
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],
            offset: 1,
            limit: 20,
            total: 0,
            title: '',
            dialogFormVisible: false,
            videoUrl: '',
            workStatus: {
                'active': '通过',
                'inactive': '待审核',
                'delete': '驳回'
            },
        }
    },
    mounted() {
        this.getActivityList()
        this.getProvince()
    },
    destroyed() {
        localStorage.activityId = ''
    },
    methods: {
        getTableData() {
            let search = {}
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    search[item] = this.searchForm[item]
                }
            }
            let offset = this.limit * (this.offset - 1)
            axios.getActivityWorkList(offset, this.limit, search)
            .then(res => {
                this.tableData = res.data.result
                this.total = res.data.totalCount
                for (let val in this.tableData) {
                    this.tableData[val].workStatus = this.workStatus[this.tableData[val].workStatus]
                }
            })
            .catch(err =>{
                console.log(err)
            })
        },
        // 选中赛事
        activityChange() {
            if(!this.searchForm.activityId) return
            levelAxios.getActivityLevelList(this.searchForm.activityId)
            .then(res => {
                this.levelList = JSON.parse(JSON.stringify(res.data.result));
                this.searchForm.activityLevelId = ''
            })
        },
        // 活动列表
        getActivityList() {
            activityAxios.getActivityList()
            .then(res => {
                this.activityList = JSON.parse(JSON.stringify(res.data.result));
                this.searchForm.activityId = localStorage.activityId ? localStorage.activityId : this.activityList[0].activityId
                this.getTableData()
                this.activityChange()
            })
        },
        //获取省份
        getProvince() {
            provinceAxios.getProvinceList()
            .then(res => {
                this.provinceOptions = res.data.result;
            })
        },
        // 获取市区列表
        getCityList(val) {
            if(!val) return
            provinceAxios.getCityList(val)
            .then(res => {
                this.cityOptions = res.data.result
            })
        },
        // 获取县区列表
        getDistrictList(val) {
            if(!val) return
            provinceAxios.getDistrictList(val)
            .then(res => {
                this.districtOptions = res.data.result
            })
        },
        // searchList() {
        //     this.getTableData()
        // },
        // 查看作品
        handleEdit(index, val) {
            let { activityName, activityLevelName, workName, workContent } = val
            this.title = activityName + activityLevelName + '—' + workName
            this.videoUrl = workContent
            this.dialogFormVisible = true
        },
        // 分页
        handleCurrentChange(val) {
            this.offset = val
            this.getTableData()
        },
        pass(index, val) {
            if(val.workStatus === "通过")
            return;
            let workId = val.workId
            axios.workOn(workId)
            .then(res => {
                this.getTableData()
                this.$message.success('审核成功')
            })
            .catch(err => {
                console.log(err)
            })
        },
        nopass(index, val) {
            if(val.workStatus === "驳回")
            return;
            let workId = val.workId
            axios.workOff(workId)
            .then(res => {
                this.getTableData()
                this.$message.success('驳回成功')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style lang="scss">

.team {
    height: 100%;
    width: 100%;
    background-color: white;
}
.el-dropdown-menu__item{
    padding: 0px;
    width: 70px;
}
.el-dropdown-menu__item .dropdown-span{
    display: flex;
    justify-content: center;
}
.el-dropdown-menu__item.is-disabled .dropdown-span {
    color: #bbb;
    width: 100%;
}

    .operation {
        width: 100%;
        text-align: center;
        .cell {
            display: flex;
            align-items: center;
        }
        // justify-content: flex-end;
        .el-button--text {
            padding: 0px;
            font-size: 15px;
            padding-bottom: 3px;
            border-radius: 0px;
            border-bottom: 1px solid #495A80;
            span {
                padding: 0px;
                color: #495A80;
            }
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
            margin-left: 40px;
        }
    }
    .el-dropdown-menu__item {
        padding: 0px 20px;
        width: auto;
    }
</style>
