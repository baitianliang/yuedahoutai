<template>
    <div>
        <div class="toolbar">
            <div class="search_input">
                <el-select @change="activityChange" v-model="searchForm.activityId" clearable placeholder="请选择活动">
                    <el-option
                    v-for="item in activityList"
                    :key="item.activityId"
                    :label="item.activityName"
                    :value="item.activityId">
                    </el-option>
                </el-select>
                <el-select v-if="searchForm.activityId" @change="getStatEnroll" v-model="searchForm.activityLevelId" clearable placeholder="请选择组别">
                    <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.activityLevelName"
                    :value="item.activityLevelId">
                    </el-option>
                </el-select>
            </div>
            <el-button @click="getExcel">导出</el-button>
        </div>
        <el-table
            ref="multipleTable"
            border
            :data="tableData"
            tooltip-effect="dark">
            <!-- <el-table-column header-align="center" align="center" prop="id" label="序号" type="index" width="80">
                <template slot-scope="scope">
                    <span>{{limit * (offset - 1) + scope.$index + 1}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                v-for="(item, index) in tableHead"
                :key="index"
                header-align="center"
                align="center"
                :label="item.name"
                :prop="item.prop"
                :width="item.width"></el-table-column> -->
            <el-table-column
                header-align="center"
                align="center"
                label="省市"
                prop="provinceName"
                width="180"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="报名总人数"
                prop="enrollProvinceNum"></el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                label="未缴费总人数"
                prop="unEnrollOrderProvinceNum"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="已缴费总人数"
                prop="enrollOrderProvinceNum"></el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                label="未上传作品总数"
                prop="unEnrollOrderWorkProvinceNum"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="已上传作品总数"
                prop="enrollOrderWorkProvinceNum"></el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                label="未分配作品总数"
                prop="enrollListWithOrderWorkUnAllocNum"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="评审中作品总数"
                prop="enrollListWithOrderWorkInScoreNum"></el-table-column>
            <!-- <el-table-column
                header-align="center"
                align="center"
                label="未通过作品总数"
                prop="provinceName"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="已通过作品总数"
                prop="provinceName"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="未评审作品总数"
                prop="provinceName"></el-table-column> -->
            <el-table-column
                header-align="center"
                align="center"
                label="已评审作品总数"
                prop="enrollOrderWorkUnScoreProvinceNum"></el-table-column>
            <el-table-column
                header-align="center"
                align="center"
                label="已晋级作品总数"
                prop="enrollOrderWorkScoreUpgradeProvinceNum"></el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                label="未晋级作品总数"
                prop="enrollListWithOrderWorkScoreDownGradeNum"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from '@/assets/axios/Index.js'
import provinceAxios from '@/assets/axios/Expert.js'
import levelAxios from '@/assets/axios/EventManagement.js'
import regisAxios from '@/assets/axios/RegistrationManagement.js'
export default {
    data() {
        return {
            searchForm: {
                activityId: '',
                activityLevelId: '',
            },
            activityList: [],
            levelList: [],
            provinceList: [],
            tableData: [],
            // tableHead: [{
            //     name: '省市',
            //     prop: '',
            //     width: '60'
            // },{
            //     name: '报名总人数',
            //     prop: '',
            // },{
            //     name: '未缴费总人数',
            //     prop: '',
            // },{
            //     name: '已缴费总人数',
            //     prop: '',
            // },{
            //     name: '未上传作品总数',
            //     prop: '',
            // },{
            //     name: '已上传作品总数',
            //     prop: '',
            // },{
            //     name: '未审核作品总数',
            //     prop: '',
            // },{
            //     name: '已审核作品总数',
            //     prop: '',
            // },{
            //     name: '未通过作品总数',
            //     prop: '',
            // },{
            //     name: '已通过作品总数',
            //     prop: '',
            // },{
            //     name: '未评审作品总数',
            //     prop: '',
            // },{
            //     name: '已评审作品总数',
            //     prop: '',
            // },{
            //     name: '未晋级作品总数',
            //     prop: '',
            // },{
            //     name: '已晋级作品总数',
            //     prop: '',
            // }],
        }
    },
    mounted() {
        regisAxios.getActivityList()
        .then(res => {
            this.activityList = JSON.parse(JSON.stringify(res.data.result));
            this.searchForm.activityId = this.activityList[0].activityId
            this.getProvince()
            this.getStatEnroll()
        })
    },
    methods: {
        searchList() {},
        getExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require("../../../lib/Export2Excel");
                const tHeader = ["省市", "报名总人数", "未缴费总人数", "已缴费总人数", "未上传作品总数", "已上传作品总数", "未分配作品总数", "评审中作品总数", "已评审作品总数", "已晋级作品总数", "未晋级作品总数"];// 上面设置Excel的表格第一行的标题
                const filterVal = ["provinceName", "enrollProvinceNum", "unEnrollOrderProvinceNum", "enrollOrderProvinceNum", "unEnrollOrderWorkProvinceNum",
                "enrollOrderWorkProvinceNum", "enrollListWithOrderWorkUnAllocNum", "enrollListWithOrderWorkInScoreNum", "enrollOrderWorkUnScoreProvinceNum",
                "enrollOrderWorkScoreUpgradeProvinceNum", "enrollListWithOrderWorkScoreDownGradeNum"]; // 上面的index、nickName、name是tableData里对象的属性
                const list = this.tableData;              //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, "各省份统计表");   //标题，数据，文件名
                this.exportButton = '导出'
            });
        },
        formatJson(filterVal, jsonData) {
            const arr = []
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        //获取省份
        getProvince() {
            provinceAxios.getProvinceList()
            .then(res => {
                this.provinceList = res.data.result
                this.tableData = this.provinceList
            })
        },
        // 更改查询活动
        activityChange() {
            this.searchForm.activityLevelId = ''
            this.levelList = []
            this.getActivityLevelList(this.searchForm.activityId, 'levelList')
            .then(() => {
                this.searchForm.activityLevelId = ''
                this.getStatEnroll()
            })
        },
        // 获取赛事组别
        async getActivityLevelList(id, name) {
            if(!id) return
            levelAxios.getActivityLevelList(id)
            .then(res => {
                this[name] = JSON.parse(JSON.stringify(res.data.result));
            })
        },
        getStatEnroll() {
            let params = {};
            for(let item in this.searchForm) {
                if(!!this.searchForm[item]) {
                    params[item] = this.searchForm[item]
                }
            }
            axios.getStatEnroll(params)
            .then(res => {
                let arr = this.provinceList
                for(let item in arr) {
                    arr[item].enrollProvinceNum = String(res.data.result.enrollListProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListProvinceNameMap[arr[item].provinceName] : 0)
                    arr[item].enrollOrderProvinceNum = String(res.data.result.enrollListWithOrderProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderProvinceNameMap[arr[item].provinceName] : 0)
                    arr[item].unEnrollOrderProvinceNum = String(arr[item].enrollProvinceNum - arr[item].enrollOrderProvinceNum)
                    arr[item].enrollOrderWorkProvinceNum = String(res.data.result.enrollListWithOrderWorkProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkProvinceNameMap[arr[item].provinceName] : 0)
                    arr[item].unEnrollOrderWorkProvinceNum = String(arr[item].enrollOrderProvinceNum - arr[item].enrollOrderWorkProvinceNum)

                    arr[item].enrollListWithOrderWorkUnAllocNum = String(res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap[arr[item].provinceName] : 0)
                    arr[item].enrollListWithOrderWorkInScoreNum = String(res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap[arr[item].provinceName] : 0)

                    arr[item].enrollOrderWorkUnScoreProvinceNum = String(res.data.result.enrollListWithOrderWorkScoredProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoredProvinceNameMap[arr[item].provinceName] : 0)
                    arr[item].enrollOrderWorkScoreUpgradeProvinceNum = String(res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap[arr[item].provinceName] : 0)
                    
                    arr[item].enrollListWithOrderWorkScoreDownGradeNum = String(res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap[arr[item].provinceName] ? res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap[arr[item].provinceName] : 0)
                    // this.tableData[item]
                }
                this.tableData = [...arr]
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    .search_input {
        margin: 20px;
    }
    .el-button {
        margin: 20px;
    }
}
</style>