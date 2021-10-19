<template>
    <div class="team">
        <!-- <p class="title">订单列表<span style="font-size: 15px">—订单管理</span></p> -->
        <div class="search-input">
            <!-- <el-input v-model="search.orderEnrollId" placeholder="订单号查询"></el-input> -->
            <el-select @keyup.enter.native="offset = 1;getTableData()" @change="activityChange" v-model="search.activityId" clearable placeholder="请选择活动">
            <el-option
                v-for="item in activityList"
                :key="item.activityId"
                :label="item.activityName"
                :value="item.activityId">
            </el-option>
            </el-select>
            <!-- <el-select @keyup.enter.native="offset = 1;getTableData()" v-if="search.activityId" v-model="search.activityLevelId" clearable placeholder="请选择组别">
            <el-option
                v-for="(item, index) in levelList"
                :key="index"
                :label="item.activityLevelName"
                :value="item.activityLevelId">
            </el-option>
            </el-select> -->
            <el-input @keyup.enter.native="offset = 1; getTableData()" v-model="search.mobileId" placeholder="注册手机号查询"></el-input>
            <!-- <el-select v-model="value" placeholder="支付方式">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
            <el-table-column header-align="center" align="center" prop="id" label="序号" type="index" width="80">
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
            <!-- <el-table-column
                class-name="operation"
                label="操作"
                header-align="center"
                align="center">
                <template slot-scope="scope">
                    <img src="@/assets/img/write.png" alt="添加备注" style="width:20px;height:20px;color:#495A80">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)">添加备注</el-button>
                    <el-button
                        class="audit-status"
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)">
                        查看备注
                    </el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="offset"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
const Qs = require('qs');
import axios from '@/assets/axios/OrderManagement.js'
import registrationAxios from '@/assets/axios/RegistrationManagement.js'
import levelAxios from '@/assets/axios/EventManagement.js'
import height from '@/mixins/heightMixin.js'
export default {
    mixins: [height],
    data() {
        return {
            search: {
                // orderEnrollId: '',
                mobileId: '',
                activityId: '',
                activityLevelId: ''
            },
            tableHead: [{
                name: '订单号',
                prop: 'orderEnrollId',
                width: '300'
            }, {
                name: '订单名称',
                prop: 'orderName',
                // width: '325'
            }, {
                name: '成交时间',
                prop: 'orderCreateTime',
                width: '210'
            }, {
                name: '订单金额(元)',
                prop: 'activityLevelFee',
                width: '90'
            }, {
                name: '实付金额(元)',
                prop: 'totalMoney',
                width: '90'
            }, {
                name: '支付方式',
                prop: 'orderPayType',
                width: '80'
            }, {
                name: '注册手机号',
                prop: 'mobileId',
                width: '120'
            }, {
                name: '真实姓名',
                prop: 'enrollTrueName',
                width: '80'
            }, {
                name: '订单状态',
                prop: 'orderStatus',
                width: '80'
            }],
            tableData: [],
            options: [],
            value: '',
            offset: 1,
            limit: 20,
            total: 0,
            activityList: [],//活动数据列表
            levelList: [],//组别列表
        }
    },
    mounted() {
        // this.search.activityId = localStorage.activityId
        // this.getActivityList()
        registrationAxios.getActivityList()
        .then(res => {
            this.activityList = JSON.parse(JSON.stringify(res.data.result));
            this.search.activityId = localStorage.activityId ? localStorage.activityId : this.activityList[0].activityId
            this.getTableData()
        })
    },
    destroyed() {
        localStorage.activityId = ''
    },
    methods: {
        getTableData() {
            let offset = this.limit * (this.offset - 1)
            let searchForm = {}
            for(let item in this.search) {
                if(this.search[item] !== '') {
                    searchForm[item] = this.search[item]
                }
            }
            axios.getOrderList(offset, this.limit, searchForm)
            .then(res => {
                this.tableData = res.data.result
                this.total = res.data.totalCount
                for (let val in this.tableData) {
                    this.tableData[val].orderName = this.tableData[val].activityName + this.tableData[val].activityLevelDesc + '报名费'
                    this.tableData[val].totalMoney /= 100
                    this.tableData[val].activityLevelFee /= 100
                    // this.tableData[val].orderPayType = this.tableData[val].orderPayType === 'wx' ? '微信' : this.tableData[val].orderPayType
                    this.tableData[val].orderStatus = this.tableData[val].orderStatus === 'paid' ? '已支付' : '未支付'
                }
            })
            .catch(err =>{
                console.log(err)
            })
        },
        //获取活动列表
        // async getActivityList() {
        //     registrationAxios.getActivityList()
        //     .then(res => {
        //         this.activityList = JSON.parse(JSON.stringify(res.data.result));
        //         this.search.activityId = this.activityList[0].activityId
        //     })
        // },
        activityChange() {
            // this.search.activityLevelId = ''
            // this.getActivityLevelList(this.search.activityId, 'levelList')
            // .then(() => {
            //     this.search.activityLevelId = ''
            // })
        },
        // // 获取赛事组别
        // async getActivityLevelList(id, name) {
        //     if(!id) return
        //     levelAxios.getActivityLevelList(id)
        //     .then(res => {
        //         this[name] = JSON.parse(JSON.stringify(res.data.result));
        //     })
        // },
        // 分页
        handleCurrentChange(val) {
            this.offset = val
            this.getTableData()
        },
        // handleEdit(index,val) {
        //     let { activityLevelName, activityLevelFee, activityLevelDesc } = val
        //     this.title = '编辑组别'
        //     this.form = { activityLevelName, activityLevelFee, activityLevelDesc }
        //     this.dialogFormVisible = true
        // },
    }
}
</script>

<style lang="scss">

.team {
    height: 100%;
    width: 100%;
    background-color: white;
}

// span {
//     padding: 0px;
//     color: #495A80;
// }
    // .operation {
    //     .cell {
    //         display: flex;
    //         align-items: center;
    //     }
        // justify-content: flex-end;
        // .el-button--text {
        //     padding: 0px;
        //     font-size: 15px;
        //     padding-bottom: 3px;
        //     border-radius: 0px;
        //     border-bottom: 1px solid #495A80;
        //     span {
        //         display: flex;
        //         align-items: center;
        //         margin-left: 0px;
        //         // text-decoration: underline;
        //         font-size: 12px;
        //         span{
        //             border-bottom: 1px solid #495A80;
        //         }
        //     }
        // }
    //     .audit-status {
    //         margin-left: 40px;
    //     }
    // }
</style>
