<template>
    <div class="team">
        <!-- <p class="title">赛事管理列表<span style="font-size: 15px">—组别管理</span></p> -->
        <el-button class="add" @click="addCompetition">添加</el-button>
        <el-table
            ref="multipleTable"
            border
            :max-height="height"
            :height="height"
            :data="tableData"
            fit
            tooltip-effect="dark">
            <!-- <el-table-column
                header-align="center"
                align="center"
                label=""
                type="selection"
                width="80">
            </el-table-column> -->
            <el-table-column
                header-align="center"
                align="center"
                label="ID"
                type="index"
                width="80">
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
                header-align="center"
                width="160"
                align="center">
                <template slot-scope="scope">
                    <img src="@/assets/img/write.png" alt="编辑" style="width:20px;height:20px;color:#495A80">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        class="audit-status"
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)">
                        删除
                        <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="10">
        </el-pagination> -->
        <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogFormVisible" width="800px">
            <el-form :model="form">
                <el-form-item label="组别名称" :label-width="formLabelWidth">
                    <el-input style="width: 560px" v-model="form.activityLevelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="费用" :label-width="formLabelWidth">
                    <el-input style="width: 560px" type="number" v-model="form.activityLevelFee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组别范围" :label-width="formLabelWidth">
                    <el-input style="width: 560px" v-model="form.activityLevelDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-if="title==='添加组别'" type="primary" @click="addTeam">添 加</el-button>
                <el-button v-else type="primary" @click="modifyTeam">修 改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from '@/assets/axios/EventManagement.js'
import heightMixin from '@/mixins/heightMixin.js'
export default {
    mixins: [heightMixin],
    data() {
        return {
            activityId: '',
            tableHead: [{
                name: '组别名称',
                prop: 'activityLevelName',
                // width: '150'
            }, {
                name: '价格',
                prop: 'activityLevelFee',
                // width: '120'
            }, {
                name: '组别范围',
                prop: 'activityLevelDesc',
                // width: '400'
            }, {
                name: '组别状态',
                prop: 'activityLevelStatus',
                // width: '250'
            }, {
                name: '创建时间',
                prop: 'activityLevelCreateTime',
                // width: '397'
            }],
            tableData: [],
            dialogFormVisible: false,
            title: '添加组别',
            form: {
                activityLevelActivityId: '',
                activityLevelName: '',
                activityLevelFee: '',
                activityLevelDesc: ''
            },
            formLabelWidth: '120px'
        }
    },
    mounted() {
        this.form.activityLevelActivityId = localStorage.activityLevelActivityId
        this.getTableData()
    },
    destroyed() {
        localStorage.removeItem("activityLevelActivityId")
    },
    methods: {
        getTableData() {
            // 获取赛事组别列表
            axios.getActivityLevelList(this.form.activityLevelActivityId)
            .then(res => {
                this.tableData = res.data.result
                this.tableData.map(el => {
                    el.activityLevelStatus = el.activityLevelStatus === "active" ? '上架' : '下架'
                    el.activityLevelFee /= 100
                })
            })
            .catch(err =>{
                console.log(err)
            })
        },
        // 添加按钮
        addCompetition() {
            this.title = '添加组别'
            this.dialogFormVisible = true
        },
        // 修改按钮
        handleEdit(index, val) {
            if(val.activityLevelStatus === '上架') {
                return this.$message.error('活动已开始，请勿修改')
            }
            let { activityLevelId, activityLevelName, activityLevelFee, activityLevelDesc, activityLevelActivityId } = val
            this.title = '编辑组别'
            this.form = { activityLevelId, activityLevelName, activityLevelFee, activityLevelDesc, activityLevelActivityId }
            this.dialogFormVisible = true
        },
        handleDelete(index, val) {
            let { activityLevelId } = val
            this.$confirm('此操作将永久删除此组别, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'})
            .then(() => {
                // 删除组别
                axios.deleteLevel(activityLevelId)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getTableData()
                })
                .catch(err => {
                    this.$message.error('已有报名用户，请勿删除')
                })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 取消
        cancel() {
            this.form = {
                activityLevelActivityId: this.form.activityLevelActivityId,
                activityLevelName: '',
                activityLevelFee: '',
                activityLevelDesc: ''
            }
            this.dialogFormVisible = false
        },
        // 添加组别
        addTeam() {
            let form = this.form
            form.activityLevelFee *= 100
            axios.addActivityLevel(form)
            .then(res => {
                this.$message.success("添加成功")
                this.getTableData()
                this.cancel()
            })
        },
        // 修改组别
        modifyTeam() {
            let form = this.form
            form.activityLevelFee *= 100
            axios.modifyActivityLevel(form)
            .then(res => {
                this.$message.success("修改成功")
                this.getTableData()
                this.cancel()
            })
            .catch(err => {
                console.log(err)
            })
        },
    }
}
</script>

<style lang="scss">

.team {
    height: 100%;
    width: 100%;
    background-color: white;
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
        margin-bottom: 20px;
        span {
            padding: 0px;
            color: #495A80;
        }
    }
    .el-table {
        // height: 400px;
        // width: auto;
        // margin: 0px 20px;
    }
}

    .operation {
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
// .el-pagination {
//     margin-top: 30px;
//     display: flex;
//     justify-content: flex-end;
// }
</style>