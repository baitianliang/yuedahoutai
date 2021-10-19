<template>
  <div id="JinzhongJudge" class="team">
    <div style="width: auto">
      <!-- <div class="title">专家列表<span style="font-size: 15px">—专家列表查看</span></div> -->
      <div style="display: flex; justify-content: space-between;">
        <div class="search-input">
          <el-input @keyup.enter.native="currentPage = 1; getJinzhongUserList()" placeholder="真实姓名" v-model="searchForm.trueName"></el-input>
          <el-input @keyup.enter.native="currentPage = 1; getJinzhongUserList()" placeholder="用户名/手机号" v-model="searchForm.mobileId"></el-input>
          <el-select
            v-model="searchForm.provinceId"
            clearable
            @keyup.enter.native="currentPage = 1; getJinzhongUserList()"
            placeholder="请选择省份"
            @change="searchForm.cityId = '';
            searchForm.districtId = '';
            getCityList(searchForm.provinceId, 'searchCityOptions')">
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
            @keyup.enter.native="currentPage = 1; getJinzhongUserList()"
            placeholder="请选择市区"
            @change="searchForm.districtId = ''; getDistrictList(searchForm.cityId, 'searchDistrictOptions')">
            <el-option
              v-for="item in searchCityOptions"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId">
            </el-option>
          </el-select>
          <el-select
            v-if="searchForm.cityId"
            v-model="searchForm.districtId"
            clearable
            @keyup.enter.native="currentPage = 1; getJinzhongUserList()"
            placeholder="请选择县区">
            <el-option
              v-for="item in searchDistrictOptions"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
          </el-select>
          <el-button @click="currentPage = 1; getJinzhongUserList()">搜索</el-button>
        </div>
        <el-button
          type="mini"
          class="batchAddTeacher"
          @click="dialogFormVisible = true; teacherList = [...tableData]">批量操作评审老师</el-button>
        <!-- <div class="expertAddBtn" @click="isAdd = true; userInfoVisible = true">添加</div> -->
      </div>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        fix
        :max-height="height">
        <!-- <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
          width="80"
          :index="1">
        </el-table-column> -->
        <el-table-column header-align="center" align="center" label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{20 * (currentPage - 1) + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="trueName"
          label="真实姓名"
          width="90">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="性别"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.userSex === 1?'男':'女'}}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="userEmail"
          label="邮箱">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="mobileId"
          label="手机号码">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="userProvinceName"
          label="省份/城市">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="userUnit"
          label="工作单位">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="userGraduate"
          label="毕业学校">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="userEducation"
          label="最高学历">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="150"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-button
              class="audit-status"
              size="mini"
              type="text"
              @click.stop="changePassword(scope.row.userId)">
              删除评委
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
        <el-dialog
          v-if="dialogFormVisible"
          :close-on-click-modal="false"
          title="添加评审教师"
          :visible.sync="dialogFormVisible"
          width="1272px">
          <div class="table-title">
            <span v-if="teacherList.length">已选评审老师:</span>
            <el-tag
              v-for="(item, index) in teacherList"
              :key="index"
              @close="handleClose(item, index)"
              closable>
              {{item.trueName}}
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
            <el-button @click="dialogPage = 1; getExpertList()">搜索</el-button>
          </div>
          <el-table
            ref="dialogTable"
            :data="expertList"
            max-height="340"
            height="340"
            border>
            <!-- <el-table-column
              header-align="center"
              align="center"
              type="selection"
              width="55">
            </el-table-column> -->
            <!-- <el-table-column header-align="center" align="center" label="序号" type="index" width="80">
              <template slot-scope="scope">
                <span>{{20 * (dialogPage - 1) + scope.$index + 1}}</span>
              </template>
            </el-table-column> -->
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
            <el-table-column
              label="操作"
              width="80"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                <el-button
                  class="audit-status"
                  size="mini"
                  type="text"
                  @click.stop="rowClick(scope.row)">
                  添加
                </el-button>
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
            <el-button type="primary" @click="confirm">操作结束</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import axios from '@/assets/axios/Jinzhong.js'
import provinceAxios from '@/assets/axios/Expert.js'
// import userinfoAxios from '@/assets/axios/Userinfo.js'
import height from '@/mixins/heightMixin.js'
  export default {
    name: "expertList",
    mixins: [height],
    data() {
      return {
        tableData: [],
        expertList: [],//表格数据
        teacherList: [],
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
        currentPage: 1,
        total: 0,//总条数
        dialogPage: 1,
        dialogTotal: 0,
        dialogFormVisible: false,
        searchDialogForm: {
          trueName: '',
          provinceId: '',
          cityId: '',
          districtId: '',
        },
        searchForm: {
          mobileId: '',
          trueName: '',
          provinceId: '',
          cityId: '',
          districtId: '',
        },
        provinceOptions: [],
        searchCityOptions: [],
        searchDistrictOptions: [],
      }
    },
    mounted() {
      this.getJinzhongUserList();
      this.getExpertList()
      this.getProvince()
    },
    methods: {
      //获取列表
      getJinzhongUserList() {
        let form = {},
        currentPage = (this.currentPage - 1) * 20
        for(let item in this.searchForm) {
            if(!!this.searchForm[item]) {
                form[item] = this.searchForm[item]
            }
        }
        axios.getJinzhongUserList(currentPage, form)
        .then(res => {
          this.total = res.data.totalCount;
          this.tableData = JSON.parse(JSON.stringify(res.data.result))
        })
      },

      //获取所有老师列表
      getExpertList() {
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
          if(bool) return this.getJinzhongUserList()
          else return
        }
        provinceAxios.getCityList(val)
        .then(res => {
          this[name] = res.data.result
          if(bool) this.getJinzhongUserList()
        })
      },
      // 获取县区列表
      getDistrictList(val, name, bool) {
        if (!val) {
          if(bool) return this.getJinzhongUserList()
          else return
        }
        provinceAxios.getDistrictList(val)
        .then(res => {
          this[name] = res.data.result
          if(bool) this.getJinzhongUserList()
        })
      },
      //分页变化
      handleCurrentChange(val) {
        this.currentPage = val
        this.getJinzhongUserList()
      },
      // 确认添加评委老师
      confirm() {
        this.dialogFormVisible = false
        this.getJinzhongUserList()
      },
      // 表格分页
      dialogHandleCurrentChange(val) {
        this.dialogPage = val
        this.getExpertList()
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
        axios.addJinzhongUser(val.userId)
        .then(res => {
          if(res && res.data && res.data.status === 0) {
            this.teacherList = [...this.teacherList, val]
            this.$message.success('添加成功')
          } else {
            this.$message.error('评审已开始')
          }
        })
      },
      // 删除已选老师
      handleClose(val, index) {
        axios.deleteJinzhongUser(val.userId)
        .then(res => {
          if(res ) {
            this.teacherList.splice(index, 1);
            this.$message.success('删除成功')
          }
        })
        .catch(err => {
            this.$message.error('评审已开始')
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #JinzhongJudge {
    background: #ffffff;
    // height: 100%;
    // padding: 0 20px;
    .batchAddTeacher {
        margin: 0px;
        margin-right: 20px;
        height: 45px;
    }
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

  .content {
  }

  .expertAddBtn {
    margin-right: 20px;
    width: 90px;
    height: 35px;
    font-size: 18px;
    line-height: 35px;
    text-align: center;
    box-shadow: 0 0 5px gainsboro;
    border-radius: 4px;
    cursor: pointer;
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

  .avatar-uploader {
    width: 30px;
    height: 30px;
    border: 1px solid #eee;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  /*在公共样式里面写*/
  #JinzhongJudge .table-cell .cell{
    cursor: pointer;
  }
</style>
