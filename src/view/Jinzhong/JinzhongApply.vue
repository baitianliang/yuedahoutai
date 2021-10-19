<template>
  <div class="team">
    <!-- 报名列表 -->
    <!-- <div class="reg_toolbar">
      <div class="search-input">
        <el-input @keyup.enter.native="offset = 1;getTableData()" v-model="searchForm.enrollName" placeholder="请输入姓名"></el-input>
        <el-input @keyup.enter.native="offset = 1;getTableData()" v-model="searchForm.mobileId" placeholder="请输入报名手机号"></el-input>
        <el-input @keyup.enter.native="offset = 1;getTableData()" v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
        <el-select @keyup.enter.native="offset = 1;getTableData()" v-model="searchForm.isOrder" placeholder="是否支付">
          <el-option
            label="全部"
            :value="0">
          </el-option>
          <el-option
            label="已支付"
            :value="1">
          </el-option>
          <el-option
            label="未支付"
            value="meiyou">
          </el-option>
        </el-select>
        <el-select @keyup.enter.native="offset = 1;getTableData()" v-model="searchForm.isWork" placeholder="是否上传作品">
          <el-option
            label="全部"
            :value="0">
          </el-option>
          <el-option
            label="已上传"
            :value="1">
          </el-option>
          <el-option
            label="未上传"
            value="meiyou">
          </el-option>
        </el-select>
        <el-button @click="offset = 1;getTableData()">搜索</el-button>
      </div>
    </div> -->
    <div class="tabs" >
      <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
        <el-tab-pane label="待分配" name="-1"></el-tab-pane>
        <el-tab-pane label="已分配" name="0"></el-tab-pane>
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
        label="所在城市">
        <template slot-scope="scope">
          {{ `${scope.row.enrollProvinceName}/${scope.row.enrollCityName}` }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollAddr"
        label="居住地">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollPhone"
        label="联系电话">
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="enrollTeacher"
        label="推荐老师姓名">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollTeacherPhone"
        label="推荐老师电话">
      </el-table-column> -->
      <!--      <el-table-column
        header-align="center"
        align="center"-->
      <!--        prop="userEducation"-->
      <!--        label="钢琴等级"-->
      <!--      </el-table-column>-->
      <el-table-column
        header-align="center"
        align="center"
        prop="enrollIdCard"
        label="身份证号"
        width="200">
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
            查看详情
          </el-button>
          <el-button
            v-if="searchForm.scoreNum === '-1'"
            class="audit-status"
            size="mini"
            type="text"
            @click.stop="onsubmit(scope.row.enrollId)">
            确认分配
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
          <div v-if="userInfoForm.enrollIdCard">身份证号: {{userInfoForm.enrollIdCard}}</div>
          <div v-if="userInfoForm.enrollPhone">手机号: {{userInfoForm.enrollPhone}}</div>
        </div>
        <div>
          <div v-if="userInfoForm.enrollMail">电子邮箱: {{userInfoForm.enrollMail}}</div>
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="searchForm.scoreNum === '-1'"
          @click="onsubmit(userInfoForm.enrollId)">分 配</el-button>
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
        searchForm: {
          scoreNum: '-1'
        },
        activeName: '-1',
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
      this.getTableData();
    },
    methods: {
      //获取列表数据
      getTableData() {
        let offset = this.limit * (this.offset - 1)
        axios.getJinzhongEnrollList(offset, this.searchForm)
        .then(res => {
          this.total = res.data.totalCount
          this.tableData = res.data.result
        })
      },
      changeTab(val) {
        this.searchForm.scoreNum = val.name
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.offset = val
        this.getTableData()
      },
      //查看详情
      tabRowClick(val) {
        this.userInfoForm = {...val}
        this.userInfoVisible = true
      },
      onsubmit(enrollId) {
        axios.allocJinzhongScore(enrollId)
        .then(res => {
          if(res && res.data && res.data.status === 0) {
            this.getTableData()
            this.$message.success('分配成功')
            this.userInfoVisible = false
          }
        })
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
