<template>
  <div class="team">
    <!-- <p class="title">报名信息列表</p> -->
    <div class="reg_toolbar">
      <div class="search-input">
        <el-select  @change="changeActivity" v-model="activity" clearable placeholder="请选择活动">
          <el-option
            v-for="(item, index) in activityList"
            :key="index"
            :label="item.activityName"
            :value="index">
          </el-option>
        </el-select>
        <el-button @click="getTableData()">搜索</el-button>
      </div>
      <div class="reg_toolbar_right">
        <div class="expertExcel" @click="exportExcel">{{exportButton}}</div>
      </div>
    </div>
    <el-table
      :data="tableData"
      :max-height="height"
      :height="height"
      border>
      <el-table-column header-align="center" align="center" prop="id" label="序号" type="index" width="60">
          <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enroll_true_name"
        label="真实姓名"
        width="100">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="性别"
        width="60">
        <template slot-scope="scope">
          {{ scope.row.enroll_sex === 1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="activity_level_name"
        label="组别">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enroll_teacher"
        label="推荐老师姓名">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enroll_teacher_phone"
        label="推荐老师电话">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enroll_id_card"
        label="身份证号"
        width="200">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enroll_phone"
        label="报名手机号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="work_name"
        label="作品名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="work_num"
        label="作品号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="average"
        label="评星平均分">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="score_point_not_zero"
        label="评分平均分">
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="enrollCreateTime"
        label="报名日期">
        <template slot-scope="scope">
          {{ scope.row.enrollCreateTime ? scope.row.enrollCreateTime.substr(0,10) : ''}}
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="offset"
      :page-size="limit"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
  </div>
</template>

<script>
  import axios from '@/assets/axios/Export.js'
  import activityAxios from '@/assets/axios/RegistrationManagement.js'
  import height from '@/mixins/heightMixin.js'
  export default {
    mixins: [height],
    data() {
      return {
        searchForm: {
          activityId: '',//活动id
          activityScoreNum: ''
        },
        activity: 0,
        enrollCityList: [],
        enrollDistrictList: [],
        enrollId: '',

        activityList: [],//活动数据列表
        tableData: [],//报名列表
        // offset: 1,
        // limit: 20,
        // total: 0,
        exportButton: '全部导出'
      }
    },
    mounted() {
      this.getActivityList();
    },
    methods: {
      //获取列表数据
      getTableData() {
        this.searchForm.activityId = this.activityList[this.activity].activityId
        this.searchForm.activityScoreNum = this.activityList[this.activity].activityScoreNum
        axios.getExportDate(this.searchForm.activityId ,this.searchForm.activityScoreNum)
        .then(res => {
        //   this.total = res.data.totalCount
          this.tableData = res.data.result
        })
      },
      changeActivity(val) {
          this.activity = val
          this.getTableData();
      },
      //获取活动列表
      getActivityList() {
        activityAxios.getActivityList()
        .then(res => {
          this.activityList = JSON.parse(JSON.stringify(res.data.result));
          this.getTableData();
        })
      },
      handleCurrentChange(val) {
        // this.offset = val
        this.getTableData()
      },
      // 导出
      exportExcel() {
        if (this.exportButton !== "全部导出") return this.$message.error('正在导出,请稍后...')
        let data = [], params = {}
        // , offset = 0;
        for(let item in this.searchForm) {
          if(!!this.searchForm[item]) {
            params[item] = this.searchForm[item]
          }
        }
        // this.getAllExcelTable(params)
        // .then((res) => {
          this.exportButton = '正在导出...'
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../lib/Export2Excel");
            // const tHeader = ["真实姓名", "性别", "出生日期", "组别", "开始学琴时间", "推荐老师姓名", "推荐老师电话", "身份证号", "报名手机号", "报名日期"];// 上面设置Excel的表格第一行的标题
            // const filterVal = ["enrollTrueName", "enrollSex", "enrollBirthday", "activityLevelName",
            //   "enrollStudyTime", "enrollTeacher", "enrollTeacherPhone", "enrollIdCard",
            //   "enrollPhone", "enrollCreateTime",]; // 上面的index、nickName、name是tableData里对象的属性
            const tHeader = ["真实姓名", "性别", "组别", "省", "市", "手机号",
            "身份证号", "教师", "教师手机号", "学校",
            "作品名称", "作品号", "作品链接", "乐段乐章", "作曲家", "评星平均分", "评分平均分", "管理员加减分", "观看次数", "喜欢次数"];// 上面设置Excel的表格第一行的标题
            const filterVal = ["enroll_true_name", "enroll_sex", "activity_level_name", "enroll_province_name", "enroll_city_name", "enroll_phone",
            "enroll_id_card", "enroll_teacher", "enroll_teacher_phone", "enroll_gov",
            "work_name", "work_num", "work_content", "work_article", "work_author", "average", "score_point_not_zero", "enroll_mark", "work_view", "work_hit"]; // 上面的index、nickName、name是tableData里对象的属性
            const list = this.tableData;              //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "导出数据");   //标题，数据，文件名
            this.exportButton = '全部导出'
          });
        // })
      },
    //   async getAllExcelTable(params) {
    //     let arrAll = []
    //     for(let i = 0; i <= parseInt(this.total / 100); i++) {
    //       let res = await this.getExcelTable()
    //       arrAll = [...arrAll, ...res.data.result]
    //     }
    //     return arrAll
    //   },
      formatJson(filterVal, jsonData) {
        const arr = []
        jsonData.map(v => {
          let arrChild = []
          filterVal.map(j => {
            if (j === "enroll_sex") {
              arrChild.push(v[j] === 1 ? '男' : '女')
            } else {
              arrChild.push(v[j])
            }
          })
          arr.push(arrChild)
          arrChild = []
        });
        return arr
      },
    //   async getExcelTable() {
    //     return axios.getExportDate()
    //   },
    }
  }
</script>
<style lang="scss" >

  .team {
    height: 100%;
    width: 100%;
    background-color: white;
    .reg_toolbar {
      display: flex;
      justify-content: space-between;
      .search-input {
        width: 85%;
        .el-input,.el-select{
          margin-right: 1%;
          width: 10%
        }
        .el-select .el-input {
          width: 100%!important;
        }
      }
      .reg_toolbar_right {
        // width: 20%;
        // min-width: 10%;
        .expertExcel {
          width: auto;
          margin-right: 20px;
          margin-bottom: 10px;
          padding: 4px 20px;
          font-size: 18px;
          line-height: 35px;
          text-align: center;
          box-shadow: 0 0 5px gainsboro;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
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

        span {
          border-bottom: 1px solid #495A80;
        }
      }
    }
  }
  .from-sec {
    width: 100%;
    display: flex;
    justify-content: space-between;

    > div:first-child {
      width: 350px;
    }

    > div:last-child {
      width: 500px;
    }

    .el-select, .el-date-editor.el-input {
      width: 100%;
    }
  }

  .el-icon-circle-close {
    color: white
  }
</style>
