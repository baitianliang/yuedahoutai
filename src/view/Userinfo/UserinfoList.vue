<template>
  <div class="team">
    <!-- <p class="title">用户信息列表</p> -->
    <div class="search-input">
      <el-input @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.trueName" placeholder="请输入姓名"></el-input>
      <el-input @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.mobileId" placeholder="请输入报名手机号"></el-input>
      <!-- <el-select
          v-model="searchForm.provinceId"
          clearable
          placeholder="请选择省份"
          @change="searchForm.cityId = ''; searchForm.districtId = ''; getCityList(searchForm.provinceId, 'cityOptions')">
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
          @change="searchForm.districtId = ''; getDistrictList(searchForm.cityId, 'districtOptions')">
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
          placeholder="请选择县区">
          <el-option
          v-for="item in districtOptions"
          :key="item.districtId"
          :label="item.districtName"
          :value="item.districtId">
          </el-option>
      </el-select> -->
      <el-button @click="offset = 1;searchList()">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      :max-height="height"
      :height="height"
      border>
      <el-table-column header-align="center" align="center" prop="id" label="序号" type="index" width="50">
          <template slot-scope="scope">
              <span>{{limit * (offset - 1) + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="trueName"
        label="真实姓名"
        width="100">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="性别"
        width="60">
        <template slot-scope="scope">
          {{ scope.row.userSex === 1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="userBirth"
        label="出生日期">
        <template slot-scope="scope">
          {{ scope.row.userBirth ? scope.row.userBirth.substr(0,10) : ''}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="userAddr"
        label="所在地区">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="userIdCard"
        label="身份证号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="mobileId"
        label="手机号">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createTime"
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.createTime ? scope.row.createTime.substr(0,10) : ''}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="userEmail"
        label="邮箱">
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        prop="userStatus"
        label="用户状态">
        <template slot-scope="scope">
          {{ workStatus[scope.row.userStatus] }}
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
            修改信息
          </el-button>
          <el-button
            class="audit-status"
            size="mini"
            type="text"
            @click.stop="changePassword(scope.row.userId)">
            重置密码
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
                    title="用户信息"
                    v-if="userInfoVisible"
                    :visible.sync="userInfoVisible"
                    width="900"
                    @close="userInfoClose"
                    center>
                    <div>
                      <div class="userInfo userInfo-l">
                        <el-form ref="form" :model="form" label-width="100px">
                          <div class="from-sec">
                            <div>
                              <el-form-item label="头像">
                                <Onload
                                  @onloadSuccess="onloadSuccess"
                                  :name="'userAvatar'"
                                  :imgUrl="form.userAvatar"></Onload>
                              </el-form-item>
                              <el-form-item label="真实姓名">
                                <el-input v-model="form.trueName" placeholder="请输入真实姓名"></el-input>
                              </el-form-item>
                              <el-form-item label="性别">
                                <el-select class="sex" v-model="form.userSex" placeholder="请选择性别">
                                  <el-option label="男" :value="1"></el-option>
                                  <el-option label="女" :value="0"></el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="邮箱">
                                <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
                              </el-form-item>
                              <el-form-item label="手机号码">
                                <el-input v-model="form.mobileId" placeholder="请输入手机号"></el-input>
                              </el-form-item>
                            </div>
                            <div>
                              <el-form-item label="出生日期">
                                <el-date-picker
                                  v-model="form.userBirth"
                                  type="date"
                                  placeholder="请输入出生日期"
                                  value-format="yyyy-MM-dd hh:mm:ss">
                                </el-date-picker>
                              </el-form-item>
                              <el-form-item label="身份证号">
                                <el-input v-model="form.userIdCard" placeholder="请输入身份证号"></el-input>
                              </el-form-item>
                              <el-form-item label="居住地">
                                <el-input v-model="form.userAddr" placeholder="请输入居住地"></el-input>
                              </el-form-item>
                              <el-form-item label="省份">
                                <el-select v-model="form.userProvinceId" clearable placeholder="请选择省份" @change="provinceChange">
                                  <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.provinceId"
                                    :label="item.provinceName"
                                    :value="item.provinceId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item v-if="form.userProvinceId" label="市区">
                                <el-select v-model="form.userCityId" clearable placeholder="请选择市区" @change="cityChange">
                                  <el-option
                                    v-for="item in enrollCityList"
                                    :key="item.cityId"
                                    :label="item.cityName"
                                    :value="item.cityId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item v-if="form.userCityId" label="县区">
                                <el-select v-model="form.userDistrictId" clearable placeholder="请选择县区" @change="districtChange">
                                  <el-option
                                    v-for="item in enrollDistrictList"
                                    :key="item.districtId"
                                    :label="item.districtName"
                                    :value="item.districtId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </div>
                          </div>
                        </el-form>
                      </div>
                      <div class="userInfo userInfo-r">

                      </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="cancel">取 消</el-button>
                      <el-button type="primary" @click="onsubmit">修 改</el-button>
                    </span>
                  </el-dialog>
        <!-- <el-dialog
          :close-on-click-modal="false"
          title="修改密码"
          v-if="changePwd"
          :visible.sync="changePwd"
          width="500">
          <el-form label-width="100px">
            <el-form-item label="新密码">
              <el-input v-model="password" placeholder="请输入新密码"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="changePwdCancel">取 消</el-button>
            <el-button type="primary" @click="updatePwd">修 改</el-button>
          </span>
        </el-dialog> -->
  </div>
</template>

<script>
  import axios from '@/assets/axios/Userinfo.js'
  import levelAxios from '@/assets/axios/EventManagement.js'
  import provinceAxios from '@/assets/axios/Expert.js'
  import height from '@/mixins/heightMixin.js'
  export default {
    mixins: [height],
    data() {
      return {
        searchForm: {
          trueName: '',
          mobileId: '',//报名手机号
          provinceId: '',
          cityId: '',
          districtId: '',
        },
        form: {
          userId: '', //用户id
          userAvatar: '', //用户头像
          trueName: '', //真实姓名
          userSex: '', //性别
          userProvinceId: '', //省区id
          userProvinceName: '', //省区名称
          userCityId: '', //市区id
          userCityName: '', //市区名称
          userDistrictId: '', //县区id
          userDistrictName: '', //县区名称
          mobileId: '', //联系方式
          userEmail: '', //邮箱号
          userBirth: '', //出生日期
          userAddr: '', //居住地
          userIdCard: '', //身份证号
        },
        enrollCityList: [],
        enrollDistrictList: [],
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
        tableData: [],//用户列表
        offset: 1,
        limit: 20,
        total: 0,
        workStatus: {
            'active': '已激活',
            'inactive': '待激活',
            'delete': '停用'
        },
        userInfoVisible: false,
        // userId: '',
        // changePwd: false,
        // password: '',
      }
    },
    mounted() {
      this.getTableData();
      this.getProvince()
    },
    methods: {
      //获取列表数据
      getTableData() {
        let params = {};
        for(let item in this.searchForm) {
          if(!!this.searchForm[item]) {
            params[item] = this.searchForm[item]
          }
        }
        let offset = this.limit * (this.offset - 1)
        axios.getUserList(offset, this.limit, params)
        .then(res => {
          this.total = res.data.totalCount
          this.tableData = res.data.result
        })
      },
      // 上传七牛成功后赋值参数
      onloadSuccess(name, val) {
          this.form[name] = val
      },
      //获取省份
      getProvince() {
        provinceAxios.getProvinceList()
        .then(res => {
          this.provinceOptions = res.data.result;
        })
      },
      // 获取市区列表
      getCityList(val, name) {
        if(!val) return
        provinceAxios.getCityList(val)
        .then(res => {
          this[name] = res.data.result
        })
      },
      // 获取县区列表
      getDistrictList(val, name) {
        if(!val) return
        provinceAxios.getDistrictList(val)
        .then(res => {
          this[name] = res.data.result
        })
      },
      //搜索按钮
      searchList() {
        // this.offset = 0;
        // this.limit = 1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.offset = val
        this.getTableData()
      },
      //选择省区变化
      provinceChange(val) {
        this.provinceOptions.forEach(el => {
          if (el.provinceId === val) {
            this.form.userProvinceName = el.provinceName;
          }
        })
        this.form.userCityId = ''
        this.form.userCityName = ''
        this.form.userDistrictId = ''
        this.form.userDistrictName = ''
        this.getCityList(val, 'enrollCityList')
      },
      // 市区变化
      cityChange(val) {
        this.enrollCityList.forEach(el => {
          if (el.cityId === val) {
            this.form.userCityName = el.cityName;
          }
        })
        this.form.userDistrictId = ''
        this.form.userDistrictName = ''
        this.getDistrictList(val, 'enrollDistrictList')
      },
      // 县区变化
      districtChange(val) {
        this.enrollDistrictList.forEach(el => {
          if (el.districtId === val) {
            this.form.userDistrictName = el.districtName;
          }
        })
      },
      //查看详情
      tabRowClick(row) {
        let arr = ['userId',
          'userAvatar',
          'trueName',
          'userSex',
          'userProvinceId',
          'userProvinceName',
          'userCityId',
          'userCityName',
          'userDistrictId',
          'userDistrictName',
          'mobileId',
          'userEmail',
          'userBirth',
          'userAddr',
          'userIdCard',
        ]
        arr.forEach(el => {
          this.form[el] = row[el]
        })
        if (this.form.userProvinceId) {
          this.getCityList(this.form.userProvinceId, 'enrollCityList')
        }
        if (this.form.userProvinceId) {
          this.getDistrictList(this.form.userProvinceId, 'enrollDistrictList')
        }
        this.userInfoVisible = true
      },
      onsubmit() {
        if(!this.form.mobileId) return this.$message.error('请输入用户手机号码')
        let form = {}
        for(let item in this.form) {
            if(!!this.form[item]) {
                form[item] = this.form[item]
            }
        }
        axios.updateEnroll(form)
        .then(() => {
          this.$message.success('修改成功')
          this.cancel()
        })
        .catch(err => {
          this.$message.error('修改失败，请重试或联系技术人员')
        })
      },
      cancel() {
        this.userInfoVisible = false
        this.getTableData()
      },
      userInfoClose() {
        for(let item in this.form) {
          this.form[item] = ''
        }
      },
      // 重置密码
      changePassword(id) {
        this.$confirm('是否确认重置密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'})
        .then(() => {
          axios.changePassword({userId:id, newPwd:'123456'})
          .then(() => {
            this.$message.success('修改成功,重置密码为123456')
            this.changePwdCancel()
          })
          // .catch(() => {
          //   this.$message.error('修改失败')
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置密码'
          });          
        });
      },
      // changePassword(id) {
      //   this.userId = id
      //   this.changePwd = true
      // },
      // updatePwd() {
      //   if(!this.password) return this.$message.error('请输入新密码')
      //   axios.changePassword({userId:this.userId, newPwd:this.password})
      //   .then(() => {
      //     this.$message.success('修改成功')
      //     this.changePwdCancel()
      //   })
      //   .catch(() => {
      //     this.$message.error('修改失败')
      //   })
      // },
      // changePwdCancel() {
      //   this.userId = '',
      //   this.password = '',
      //   this.changePwd = false
      // }
    }
  }
</script>

<style lang="scss">

  .team {
    height: 100%;
    width: 100%;
    background-color: white;
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

</style>
