<template>
  <div class="team">
    <!-- 评审列表 -->
    <div class="tabs" v-if="roleId === '2'">
      <el-tabs v-model="activeName" type="card" @tab-click="tableData = []; getTableData()">
        <el-tab-pane label="评分" name="0"></el-tab-pane>
        <el-tab-pane label="最终结果" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="tableData"
      :max-height="height"
      :height="height"
      border>
      <!-- <el-table-column
        header-align="center"
        align="center"
        type="index"
        width="80"
        label="序号"
        :index="1">
      </el-table-column> -->
      <el-table-column header-align="center" align="center" prop="id" label="序号" type="index" width="50">
          <template slot-scope="scope">
              <span>{{limit * (offset - 1) + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollTrueName"
        label="真实姓名"
        width="100">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="性别"
        width="60">
        <template slot-scope="scope">
          {{ scope.row.enrollSex === 1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollBirthday"
        label="出生日期">
        <template slot-scope="scope">
          {{ scope.row.enrollBirthday ? scope.row.enrollBirthday.substr(0,10) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollPhone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollCreateTime"
        label="报名日期">
        <template slot-scope="scope">
          {{ scope.row.enrollCreateTime ? scope.row.enrollCreateTime.substr(0,10) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollMail"
        label="邮箱">
      </el-table-column>
      <el-table-column
        v-if="activeName === '0'"
        header-align="center"
        align="center"
        prop="trueName"
        label="评审教师">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="scorePoint"
        :label="activeName === '1' ? '平均分' : '评分'">
        <template v-if="true" slot-scope="scope">
          {{ scope.row.scorePoint ? Number(scope.row.scorePoint).toFixed(2) : '暂无评分'}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName === '0'"
        header-align="center"
        align="center"
        label="评分状态">
        <template slot-scope="scope">
          {{ scope.row.scoreStatus === "active" ? '已评分' : '未评分'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <el-button
            class="audit-status"
            size="mini"
            type="text"
            @click.stop="tabRowClick(scope.row)">
            {{ (scope.row.scoreStatus === "active" && roleId !== '2') || activeName === '1' ? '查看' : '评分' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="offset"
      :page-size="limit"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      :close-on-click-modal="false"
      title="个人信息"
      v-if="userInfoVisible"
      :visible.sync="userInfoVisible"
      width="900"
      center>
      <div class="personal-information">
        <div>
          <div>
            <span>{{userInfoForm.enrollTrueName}}</span>
            性别: {{userInfoForm.enrollSex === 1 ? '男' : '女'}}
          </div>
        </div>
        <div>
          <div v-if="userInfoForm.enrollBirthday">出生日期: {{userInfoForm.enrollBirthday.substr(0,10)}}</div>
          <div v-if="userInfoForm.enrollIdCard && roleId === '2'">身份证号: {{userInfoForm.enrollIdCard}}</div>
          <div v-if="userInfoForm.enrollPhone && roleId === '2'">手机号: {{userInfoForm.enrollPhone}}</div>
        </div>
        <div>
          <div v-if="userInfoForm.enrollMail && roleId === '2'">电子邮箱: {{userInfoForm.enrollMail}}</div>
          <div v-if="userInfoForm.enrollSchool">毕业院校: {{userInfoForm.enrollSchool}}</div>
          <div v-if="userInfoForm.enrollProvinceName">所在城市: {{`${userInfoForm.enrollProvinceName}/${userInfoForm.enrollCityName}`}}</div>
        </div>
        <div>
          <div v-if="userInfoForm.enrollAddr">居住地: {{userInfoForm.enrollAddr}}</div>
          <div v-if="userInfoForm.enrollWork">所在单位: {{userInfoForm.enrollWork}}</div>
        </div>
      </div>
      <div class="activity-work">
        <div class="title">
          <span>参赛作品</span>
        </div>
        <div class="work-list">
          <div v-if="userInfoForm.enrollWorkUri1">
            <img 
              :src="userInfoForm.enrollWorkUri1+'?vframe/jpg/offset/1'"
              @click="showVideo(userInfoForm.enrollWorkUri1, userInfoForm.enrollWorkName1)">
            <i
              class="el-icon-caret-right icon"
              @click="showVideo(userInfoForm.enrollWorkUri1, userInfoForm.enrollWorkName1)"></i>
            <div>{{ userInfoForm.enrollWorkName1 }}</div>
          </div>
          <div v-if="userInfoForm.enrollWorkUri2">
            <img 
              :src="userInfoForm.enrollWorkUri2+'?vframe/jpg/offset/1'"
              @click="showVideo(userInfoForm.enrollWorkUri2, userInfoForm.enrollWorkName2)">
            <i
              class="el-icon-caret-right icon"
              @click="showVideo(userInfoForm.enrollWorkUri2, userInfoForm.enrollWorkName2)"></i>
            <div>{{ userInfoForm.enrollWorkName2 }}</div>
          </div>
          <div v-if="userInfoForm.enrollWorkUri3">
            <img 
              :src="userInfoForm.enrollWorkUri3+'?vframe/jpg/offset/1'"
              @click="showVideo(userInfoForm.enrollWorkUri3, userInfoForm.enrollWorkName3)">
            <i
              class="el-icon-caret-right icon"
              @click="showVideo(userInfoForm.enrollWorkUri3, userInfoForm.enrollWorkName3)"></i>
            <div>{{ userInfoForm.enrollWorkName3 }}</div>
          </div>
          <div v-if="userInfoForm.enrollWorkUri4">
            <img 
              :src="userInfoForm.enrollWorkUri4+'?vframe/jpg/offset/1'"
              @click="showVideo(userInfoForm.enrollWorkUri4, userInfoForm.enrollWorkName4)">
            <i
              class="el-icon-caret-right icon"
              @click="showVideo(userInfoForm.enrollWorkUri4, userInfoForm.enrollWorkName4)"></i>
            <div>{{ userInfoForm.enrollWorkName4 }}</div>
          </div>
          <div v-if="userInfoForm.enrollWorkUri5">
            <img 
              :src="userInfoForm.enrollWorkUri5+'?vframe/jpg/offset/1'"
              @click="showVideo(userInfoForm.enrollWorkUri5, userInfoForm.enrollWorkName5)">
            <i
              class="el-icon-caret-right icon"
              @click="showVideo(userInfoForm.enrollWorkUri5, userInfoForm.enrollWorkName5)"></i>
            <div>{{ userInfoForm.enrollWorkName5 }}</div>
          </div>
        </div>
        <div class="no-work" v-if="!userInfoForm.enrollWorkUri1 && !userInfoForm.enrollWorkUri2 && !userInfoForm.enrollWorkUri3 && !userInfoForm.enrollWorkUri4 && !userInfoForm.enrollWorkUri5">
          暂无视频
        </div>
        <div class="title score">
          <span>综合评分:</span>
          <el-input
              :readonly="(userInfoForm.scoreStatus === 'active' && roleId !== '2') || activeName === '1'"
              placeholder="请输入70~95之间的整数"
              onchange="if(value > 95 || value < 70 || !Number(value)){alert('请输入70~95之间的数字！');value = ''}
                        else{value = Number(value).toFixed(2)}"
              v-model="userInfoForm.scorePoint"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="userInfoForm.scoreStatus !== 'active' && roleId !== '2'"
          @click="saveState">保存草稿</el-button>
        <el-button
          type="primary"
          v-if="(userInfoForm.scoreStatus !== 'active' || roleId === '2') && activeName !== '1'"
          @click="onsubmit">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" width="850px">
        <div class="dialog-content">
            <video :src="videoUrl" controls autoplay class="video" ref="dialogVideo" width="800px"></video>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from '@/assets/axios/Jinzhong.js'
  // import axios from '@/assets/axios/RegistrationManagement.js'
  import height from '@/mixins/heightMixin.js'
  export default {
    mixins: [height],
    data() {
      return {
        roleId: '',
        searchForm: {
          // scoreNum: ''
        },
        activeName: '0',
        tableData: [],//报名列表
        offset: 1,
        limit: 20,
        total: 0,
        userInfoVisible: false,
        userInfoForm: {},
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.roleId = localStorage.roleId
      this.getTableData();
    },
    methods: {
      //获取列表数据
      getTableData() {
        let offset = this.limit * (this.offset - 1)
        if (this.activeName === '0') {
          if (this.roleId === '2') {
            axios.getAdminJinzhongEnrollScoreList(offset, this.searchForm)
            .then(res => {
              this.total = res.data.totalCount
              this.tableData = [...res.data.result]
            })
          } else {
            axios.getJinzhongEnrollScoreList(offset, localStorage.userId, this.searchForm)
            .then(res => {
              this.total = res.data.totalCount
              this.tableData = [...res.data.result]
            })
          }
        } else {
          axios.getAdminJinzhongScoreList(offset, this.searchForm)
          .then(res => {
            this.total = res.data.totalCount
            this.tableData = [...res.data.result]
          })
        }
      },
      handleCurrentChange(val) {
        this.offset = val
        this.getTableData()
      },
      //查看详情
      tabRowClick(val) {
        this.userInfoForm = {...val}
        this.userInfoForm.scorePoint = this.userInfoForm.scorePoint ? Number(this.userInfoForm.scorePoint).toFixed(2) : ''
        this.userInfoVisible = true
      },
      // 保存草稿
      saveState() {
        let { scoreId, scoreEnrollId, scoreUserId, scorePoint } = this.userInfoForm
        let form = { scoreId, scoreEnrollId, scoreUserId, scorePoint }
        axios.teacherSaveScore(form)
        .then(res => {
          if(res && res.data && res.data.status === 0) {
            this.getTableData()
            this.$message.success('保存草稿成功')
            this.userInfoVisible = false
          }
        })
      },
      onsubmit() {
        let { scoreId, scoreEnrollId, scoreUserId, scorePoint } = this.userInfoForm
        let form = { scoreId, scoreEnrollId, scoreUserId, scorePoint }
        if(this.roleId === '2') {
          axios.adminGrade(form)
          .then(res => {
            if(res && res.data && res.data.status === 0) {
              this.getTableData()
              this.$message.success('评分成功')
              this.userInfoVisible = false
            }
          })
        } else {
          axios.expertGrade(form)
          .then(res => {
            if(res && res.data && res.data.status === 0) {
              this.getTableData()
              this.$message.success('评分成功')
              this.userInfoVisible = false
            }
          })
        }
      },
      showVideo(src, title) {
        this.title = title
        this.videoUrl = src
        this.dialogFormVisible = true
      },
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
  }
  .tabs {
    width: auto;
    margin: 0px 20px;
    .el-tabs--card>.el-tabs__header .el-tabs__item {
      color: #F5A323;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
      background-color: #F5A323;
      border-bottom: 1px solid #F5A323;
      color: #fff;
    }
    .el-tabs__item:hover {
      color: #F5A323;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav {
      border-color: #F5A323;
    }
    .el-tabs--card>.el-tabs__header {
      border-color: #F5A323;
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
  .el-dialog {
    .personal-information {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 7px 0px;
      > div {
        display: flex;
        margin: 7px 0px;
        > div {
          width: 31%;
          padding-left: 2%;
          color: #808080;
          > span {
            color: #333;
            font-size: 17px;
            margin-right: 15px;
          }
        }
      }
      > div:first-child {
        margin-bottom: 18px;
      }
    }
    .activity-work {
      .title {
        border-bottom: 1px solid #eee;
        font-size: 17px;
        line-height: 17px;
        font-weight: bold;
        padding-left: 15px;
      }
      .score {
        border-bottom: 0px;
        display: flex;
        align-items: center;
        > .el-input {
          width: 200px;
          margin-left: 30px;
        }
      }
      .work-list {
        display: flex;
        flex-wrap: wrap;
        > div {
          width: 21%;
          margin: 10px 2%;
          box-shadow: 0px 0px 5px;
          position: relative;
          > img {
            width: 100%;
            height: 120px;
            cursor: pointer
          }
          .icon {
              position: absolute;
              top: 40px;
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
          > div {
            margin: 5px;
            font-size: 15px;
          }
        }
      }
      .no-work {
        text-align: center;
        font-size: 17px;
        color: #808080;
        margin-top: 20px;
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
