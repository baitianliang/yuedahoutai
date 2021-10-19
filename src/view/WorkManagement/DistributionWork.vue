<template>
    <div class="team">
        <!-- <p class="title">作品分配</p> -->
        <div class="toolbar">
            <div class="search-input">
                <!-- <el-input placeholder="用户名/手机号" v-model="form.mobileId"></el-input>
                <el-input placeholder="作品名称" v-model="form.workName"></el-input>
                <el-select v-model="form.workStatus" placeholder="审核状态">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> -->
                <el-select clearable v-model="searchForm.activityId" @change="activityChange" placeholder="请选择活动">
                    <el-option
                        v-for="(item, index) in activityList"
                        :key="index"
                        :label="item.activityName"
                        :value="item.activityId">
                    </el-option>
                </el-select>
                <el-select clearable v-if="searchForm.activityId" @change="offset = 1; getTableData()" v-model="searchForm.activityLevelId" placeholder="请选择组别">
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
                    placeholder="请选择省份"
                    @change="offset = 1; searchForm.cityId = ''; searchForm.districtId = ''; getCityList(searchForm.provinceId, 'cityOptions', true)">
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
                    placeholder="请选择市区"
                    @change="offset = 1; searchForm.districtId = ''; getDistrictList(searchForm.cityId, 'districtOptions', true)">
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
                    @change="offset = 1; getTableData()"
                    placeholder="请选择县区">
                    <el-option
                        v-for="item in districtOptions"
                        :key="item.districtId"
                        :label="item.districtName"
                        :value="item.districtId">
                    </el-option>
                </el-select>
                <!-- <el-button @click="offset = 1; getTableData()">搜索</el-button> -->
            </div>
            <el-button type="mini" class="batchAddTeacher" @click="allAddTeacher">批量绑定评审老师</el-button>
        </div>
        <el-table
            ref="multipleTable"
            border
            :max-height="height"
            :height="height"
            :data="tableData"
            @select-all="workSelectAll"
            @select="workSelect"
            tooltip-effect="dark">
            <el-table-column
                header-align="center"
                align="center"
                type="selection"
                width="55">
            </el-table-column>
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
                width="148"
                header-align="center"
                align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="addTeacher(scope.row)">绑定评审老师</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-size="limit"
            :current-page="offset"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog
            v-if="dialogFormVisible"
            :close-on-click-modal="false"
            title="添加评审教师"
            :visible.sync="dialogFormVisible"
            width="1246px">
            <div class="table-title">
                <span v-if="teacherList.length">已选评审老师:</span>
                <el-tag
                    v-for="(el, index) in teacherList"
                    :key="index"
                    @close="handleClose(index)"
                    closable>
                    {{el.trueName}}
                </el-tag>
            </div>
            <div class="search-input">
                <el-input placeholder="请输入姓名" v-model="searchDialogForm.trueName" clearable></el-input>
                <el-select
                    v-model="searchDialogForm.provinceId"
                    clearable
                    placeholder="请选择省份"
                    @change="searchDialogForm.cityId = ''; searchDialogForm.districtId = ''; getCityList(searchDialogForm.provinceId, 'searchCityOptions')">
                    <el-option
                        v-for="item in provinceOptions"
                        :key="item.provinceId"
                        :label="item.provinceName"
                        :value="item.provinceId">
                    </el-option>
                </el-select>
                <el-select
                    v-if="searchDialogForm.provinceId"
                    v-model="searchDialogForm.cityId"
                    clearable
                    placeholder="请选择市区"
                    @change="searchDialogForm.districtId = ''; getDistrictList(searchDialogForm.cityId, 'searchDistrictOptions')">
                    <el-option
                        v-for="item in searchCityOptions"
                        :key="item.cityId"
                        :label="item.cityName"
                        :value="item.cityId">
                    </el-option>
                </el-select>
                <el-select
                    v-if="searchDialogForm.cityId"
                    v-model="searchDialogForm.districtId"
                    clearable
                    placeholder="请选择县区">
                    <el-option
                        v-for="item in searchDistrictOptions"
                        :key="item.districtId"
                        :label="item.districtName"
                        :value="item.districtId">
                    </el-option>
                </el-select>
                <el-button @click="dialogPage = 1; getExpertData()">搜索</el-button>
            </div>
            <el-table
                ref="dialogTable"
                :data="expertList"
                max-height="340"
                height="340"
                @row-click="rowClick"
                border>
                <!-- <el-table-column
                    header-align="center"
                    align="center"
                    type="selection"
                    width="55">
                </el-table-column> -->
                <el-table-column header-align="center" align="center" label="序号" type="index" width="80">
                    <template slot-scope="scope">
                        <span>{{20 * (dialogPage - 1) + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(item, index) in teacherTableHead"
                    :key="index"
                    header-align="center"
                    align="center"
                    :label="item.name"
                    :prop="item.prop"
                    :width="item.width">
                    <template slot-scope="scope">
                        <div v-if="item.prop==='userSex'">{{ scope.row.userSex === 1?'男':'女'}}</div>
                        <div v-else>{{ scope.row[item.prop]}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="姓名" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column> -->
            </el-table>
            <el-pagination
                background
                @current-change="dialogHandleCurrentChange"
                :current-page="dialogPage"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="dialogTotal">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 认</el-button>
            </div>
        </el-dialog>
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
            activityList: [],
            levelList: [],
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],
            searchCityOptions: [],
            searchDistrictOptions: [],
            searchForm: {
                activityId: '',
                activityLevelId: '',
                provinceId: '',
                cityId: '',
                districtId: '',
            },
            searchDialogForm: {
                trueName: '',
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
                width: '130'
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
            offset: 1,
            limit: 20,
            total: 0,
            workStatus: {
                'active': '通过',
                'inactive': '待审核',
                'delete': '驳回'
            },

            enrollIdList: [],
            teacherList: [],
            expertList: [],
            dialogFormVisible: false,
            dialogPage: 1,
            dialogTotal: 0,//总条数
            teacherTableHead: [{
                name: '真实姓名',
                prop: 'trueName',
                width: '90'
            }, {
                name: '性别',
                prop: 'userSex',
                width: '50'
            }, {
                name: '电话',
                prop: 'mobileId',
                width: '120'
            }, {
                name: '邮箱',
                prop: 'userEmail',
                width: '170'
            }, {
                name: '地区',
                prop: 'userPlaceName',
                width: '175'
            }, {
                name: '工作单位',
                prop: 'userUnit',
                width: '200'
            }, {
                name: '毕业学校',
                prop: 'userGraduate',
                width: '190'
            }, {
                name: '最高学历',
                prop: 'userEducation',
                width: '100'
            }],
        }
    },
    mounted() {
        this.getProvince()
        this.getActivityList()
        this.getExpertData()
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
            axios.getForallocList(offset, search)
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
        // 活动列表
        getActivityList() {
            activityAxios.getActivityList()
            .then(res => {
                this.activityList = JSON.parse(JSON.stringify(res.data.result));
                this.searchForm.activityId = this.activityList[0].activityId
                this.getTableData()
                this.activityChange(1)
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
        getCityList(val, name, bool) {
            if (!val) {
                if(bool) return this.getTableData()
                else return
            }
            provinceAxios.getCityList(val)
            .then(res => {
                this[name] = res.data.result
                if(bool) this.getTableData()
            })
        },
        // 获取县区列表
        getDistrictList(val, name, bool) {
            if (!val) {
                if(bool) return this.getTableData()
                else return
            }
            provinceAxios.getDistrictList(val)
            .then(res => {
                this[name] = res.data.result
                if(bool) this.getTableData()
            })
        },
        // 查看作品
        handleEdit(index, val) {
            let { activityName, activityLevelName, workName, workContent } = val
            this.title = activityName + activityLevelName + '—' + workName
            this.videoUrl = workContent
            this.dialogFormVisible = true
        },
        // 选中赛事
        activityChange(val) {
            this.offset = 1
            if(!val) return this.getTableData()
            levelAxios.getActivityLevelList(this.searchForm.activityId)
            .then(res => {
                this.levelList = JSON.parse(JSON.stringify(res.data.result));
                this.searchForm.activityLevelId = ''
                this.getTableData()
            })
        },
        // 分页
        handleCurrentChange(val) {
            this.offset = val
            this.getTableData()
        },
        // 通过
        pass(index, val) {
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
        // 驳回
        nopass(index, val) {
            let workId = val.workId
            axios.workOff(workId)
            .then(res => {
                this.getTableData()
                this.$message.success('驳回成功')
            })
            .catch(err => {
                console.log(err)
            })
        },

        // 作品全选
        workSelectAll(list, val) {
            this.enrollIdList = []
            list.every(({enrollId}) => this.enrollIdList.push(enrollId))
        },
        // 作品选中
        workSelect(list, val) {
            this.enrollIdList = []
            list.every(({enrollId}) => this.enrollIdList.push(enrollId))
        },

        // 批量添加老师
        allAddTeacher() {
            if(!this.enrollIdList.length) 
            return this.$message.error('未选中作品');
            this.scoreNum = 5
            this.dialogFormVisible = true
        },
        // 添加老师
        addTeacher(val) {
            this.dialogFormVisible = true
            this.enrollIdList = [val.enrollId]
            this.scoreNum = val.activityScoreNum
        },
        // 确认添加评委老师
        confirm() {
            if(this.teacherList.length < this.scoreNum)
            return this.$message.error(`评委老师不得小于${this.scoreNum}位`)
            let teacherIds = []
            this.teacherList.every(({userId}) => teacherIds.push(userId))
            let form = {enrollIds: this.enrollIdList, teacherIds}
            levelAxios.bindingTeacher(form, this.scoreNum)
            .then(res => {
                this.enrollIdList = []
                this.cancel()
                this.$message.success('分配成功')
            })
            .catch(err => {
                this.$message.error('分配失败')
            })
        },
        // 取消添加评委老师
        cancel() {
            this.getTableData()
            this.teacherList = []
            this.dialogFormVisible = false
        },
        //获取所有老师列表
        getExpertData() {
            let search = {}
            for(let item in this.searchDialogForm) {
                if(!!this.searchDialogForm[item]) {
                    search[item] = this.searchDialogForm[item]
                }
            }
            provinceAxios.getExpertList((this.dialogPage - 1) * 20, search)
            .then(res => {
                this.dialogTotal = res.data.totalCount;
                this.expertList = JSON.parse(JSON.stringify(res.data.result))
                for (let val in this.expertList) {
                    this.expertList[val].userPlaceName
                    = this.expertList[val].userProvinceName||''
                    + this.expertList[val].userCityName||''
                    + this.expertList[val].userDistrictName||''
                }
                // this.expertList.
            })
        },
        // 表格分页
        dialogHandleCurrentChange(val) {
            this.dialogPage = val
            this.getExpertData()
        },
        // 点击表格行选中老师
        rowClick(val) {
            let bool = false
            this.teacherList.forEach(({mobileId}) => {
                if (val.mobileId === mobileId) 
                return bool = true
            })
            if(bool)
            return this.$message.error('请勿重复添加同一名老师')
            this.teacherList = [...this.teacherList, val]
        },
        // 删除已选老师
        handleClose(index) {
            this.teacherList.splice(index, 1);
        },
        // // 选中老师
        // select(list, val) {
        //     this.teacherList = list
        //     console.log(this.teacherList)
        // },
        // // 全选
        // selectAll(list) {
        //     this.teacherList = list
        //     console.log(this.teacherList)
        //     console.log(this.teacherList)
        // }
    }
}
</script>

<style lang="scss">

.team {
    height: 100%;
    width: 100%;
    background-color: white;
    .el-dialog__wrapper {
        .el-dialog {
            .table-title {
                margin: 0px 20px;
                margin-bottom: 10px;
            }
            .el-table {
                margin-bottom: 50px;
            }
            .el-pagination {
                position: absolute;
                bottom: 80px;
            }
        }
    }
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

.toolbar {
    width: auto;
    display: flex;
    justify-content: space-between;
    .batchAddTeacher {
        margin: 0px;
        margin-right: 20px;
        height: 45px;
    }
}

    .operation {
        width: 100%;
        text-align: center;
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
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
