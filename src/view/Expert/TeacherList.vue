<template>
  <div id="expertList" class="team">
    <div style="width: auto">
      <!-- <div class="title">专家列表<span style="font-size: 15px">—专家列表查看</span></div> -->
      <div style="display: flex; justify-content: space-between;">
        <div class="search-input">
          <el-input @keyup.enter.native="currentPage = 1; getExpertData()" placeholder="真实姓名" v-model="searchForm.trueName"></el-input>
          <el-input @keyup.enter.native="currentPage = 1; getExpertData()" placeholder="用户名/手机号" v-model="searchForm.mobileId"></el-input>
          <el-select
            v-model="searchForm.provinceId"
            clearable
            @keyup.enter.native="currentPage = 1; getExpertData()"
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
            @keyup.enter.native="currentPage = 1; getExpertData()"
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
            @keyup.enter.native="currentPage = 1; getExpertData()"
            placeholder="请选择县区">
            <el-option
              v-for="item in searchDistrictOptions"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
          </el-select>
          <el-button @click="currentPage = 1; getExpertData()">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="expertList"
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
      :close-on-click-modal="false"
      title="教师信息"
      v-if="userInfoVisible"
      :visible.sync="userInfoVisible"
      width="900"
      @close="userInfoClose"
      center>
      <div>
        <!-- <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </div>
      <div>
        <div class="userInfo userInfo-l">
          <el-form ref="form" :model="form" label-width="80px">
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
                  <el-input :disabled="!isAdd" v-model="form.mobileId" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="省份">
                  <el-select v-model="form.userProvinceId" placeholder="请选择省份" @change="provinceChange">
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
                      v-for="item in cityOptions"
                      :key="item.cityId"
                      :label="item.cityName"
                      :value="item.cityId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="form.userCityId" label="县区">
                  <el-select v-model="form.userDistrictId" clearable placeholder="请选择县区" @change="districtChange">
                    <el-option
                      v-for="item in districtOptions"
                      :key="item.districtId"
                      :label="item.districtName"
                      :value="item.districtId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="出生日期">
                  <el-date-picker
                    v-model="form.userBirth"
                    type="date"
                    placeholder="请输入出生日期"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="工作单位">
                  <el-input v-model="form.userUnit" placeholder="请输入工作单位名称"></el-input>
                </el-form-item>
                <el-form-item label="职务">
                  <el-input v-model="form.userJob" placeholder="请输入职务名称"></el-input>
                </el-form-item>
                <el-form-item label="毕业院校">
                  <el-input v-model="form.userGraduate" placeholder="请输入毕业院校名称"></el-input>
                </el-form-item>
                <el-form-item label="最高学历">
                  <el-input v-model="form.userEducation" placeholder="请输入学历"></el-input>
                </el-form-item>
                <el-form-item label="社会任职">
                  <el-input v-model="form.userOffice" placeholder="请输入社会任职"></el-input>
                </el-form-item>
                <el-form-item label="曾经师承">
                  <el-input maxlength="255" show-word-limit v-model="form.userTs" placeholder="请输入曾经师承"></el-input>
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input
                    type="textarea"
                    :rows="4"
                    maxlength="1000"
                    show-word-limit
                    resize="none"
                    placeholder="请输入个人简介"
                    v-model="form.userDesc">
                  </el-input>
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
          <el-button type="primary" @click="onsubmit">确 定</el-button>
        </span>
    </el-dialog>
        <el-dialog
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
        </el-dialog>
  </div>
</template>

<script>
import axios from '@/assets/axios/Expert.js'
import userinfoAxios from '@/assets/axios/Userinfo.js'
import height from '@/mixins/heightMixin.js'
  export default {
    name: "expertList",
    mixins: [height],
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        expertList: [],//表格数据
        currentPage: 1,
        total: 0,//总条数
        userInfoVisible: false,
        form: {
          userName: '',//用户登录账号
          userAvatar: '',//头像
          trueName: '',//真实姓名
          userSex: '',//性别
          userEmail: '',//邮箱
          mobileId: '',//手机号
          userBirth: '',//出生日期 yyyy-mm-hh
          userProvinceId: '',//省区id
          userProvinceName: '',//省区名称
          userCityId: '',//市区id
          userCityName: '',//市区名称
          userDistrictId: '',//县区id
          userDistrictName: '',//县区名称
          userUnit: '',//工作单位名称
          userJob: '',//职务
          userGraduate: '',//毕业院校
          userEducation: '',//学历
          userOffice: '',//社会任职
          userTs: '',//曾经师承
          userDesc: '',//个人简介
        },
        changePwd: false,
        password: '',
        userId: '',
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
        cityOptions: [],
        districtOptions: [],
        isAdd: true,//编辑状态 true为添加  false为编辑
      }
    },

    methods: {
      // 上传七牛成功后赋值参数
      onloadSuccess(name, val) {
          this.form[name] = val
      },
      //获取列表
      getExpertData() {
        let form = {},
        currentPage = (this.currentPage - 1) * 20
        for(let item in this.searchForm) {
            if(!!this.searchForm[item]) {
                form[item] = this.searchForm[item]
            }
        }
        axios.getTeacherList(currentPage, form)
        .then(res => {
          this.total = res.data.totalCount;
          this.expertList = JSON.parse(JSON.stringify(res.data.result))
        })
      },
      //获取省份
      getProvince() {
        axios.getProvinceList()
        .then(res => {
          this.provinceOptions = res.data.result;
        })
      },

      //选择省区变化
      provinceChange(val) {
        this.provinceOptions.forEach(province => {
          if (province.provinceId === val) {
            this.form.userProvinceName = province.provinceName;
          }
        })
        this.form.userCityId = ''
        this.form.userCityName = ''
        this.form.userDistrictId = ''
        this.form.userDistrictName = ''
        this.getCityList(val, 'cityOptions')
      },

      // 获取市区列表
      getCityList(val, name) {
        if (!val) return
        axios.getCityList(val)
        .then(res => {
          this[name] = res.data.result
        })
      },

      // 市区变化
      cityChange(val) {
        this.cityOptions.forEach(el => {
          if (el.cityId === val) {
            this.form.userCityName = el.cityName;
          }
        })
        this.form.userDistrictId = ''
        this.form.userDistrictName = ''
        this.getDistrictList(val, 'districtOptions')
      },

      // 获取县区列表
      getDistrictList(val, name) {
        if (!val) return
        axios.getDistrictList(val)
        .then(res => {
          this[name] = res.data.result
        })
      },
      
      // 县区变化
      districtChange(val) {
        this.districtOptions.forEach(el => {
          if (el.districtId === val) {
            this.form.userDistrictName = el.districtName;
          }
        })
      },
      //table表格点击
      tabRowClick(row){
        this.form = JSON.parse(JSON.stringify(row));
        if (this.form.userProvinceId) {
          this.getCityList(this.form.userProvinceId, 'cityOptions')
        }
        if (this.form.userCityId) {
          this.getDistrictList(this.form.userCityId, 'districtOptions')
        }
        this.userInfoVisible = true;
        this.isAdd = false;
      },

      //分页变化
      handleCurrentChange(val) {
        this.currentPage = val
        this.getExpertData()
      },
      //对话框关闭回调
      userInfoClose() {
        this.form = {
          userName: '',//用户登录账号
          userAvatar: '',//头像
          trueName: '',//真实姓名
          userSex: '',//性别
          userEmail: '',//邮箱
          mobileId: '',//手机号
          userBirth: '',//出生日期 yyyy-mm-hh
          userProvinceId: '',//地区id
          userProvinceName: '',//地区名称
          userUnit: '',//工作单位名称
          userJob: '',//职务
          userGraduate: '',//毕业院校
          userEducation: '',//学历
          userOffice: '',//社会任职
          userTs: '',//曾经师承
          userDesc: '',//个人简介
        };
      },
      //弹框确认按钮
      onsubmit() {
        if (this.isAdd) {
          this.addAjax();
        } else {
          this.editAjax();
        }
      },
      //添加专家ajax
      addAjax() {
        if(!this.form.mobileId) {
          return this.$message.error('请输入手机号')
        }
        if(!this.form.userProvinceId) {
          return this.$message.error('请输入省区')
        }
        let form = {}
        for(let item in this.form) {
            if(!!this.form[item]) {
                form[item] = this.form[item]
            }
        }
        form.userName = form.mobileId;
        // this.form.userBirth = this.form.userBirth ? this.form.userBirth + ' 00:00:00' : '';
        axios.addTeacher(form)
        .then( res =>{
          if (res.data.status === 0){
            this.getExpertData()
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.cancel()
          }else {
            this.$message.error(res.data.statusDesc)
          }
        })
        .catch(err => {
          this.$message.error('添加失败，请重试或联系管理员')
        })
      },
      //编辑专家ajax
      editAjax() {
        let form = {}
        for(let item in this.form) {
            if(!!this.form[item]) {
                form[item] = this.form[item]
            }
        }
        axios.editTeacher(form)
        .then( res =>{
          if (res.data.status === 0){
            this.$message.success('修改成功');
            this.cancel()
            //需要重新获取页面
            this.getExpertData();
          }else {
            this.$message.error(res.data.statusDesc)
          }
        })
        .catch(err => {
          this.$message.error('修改失败，请重试或联系技术人员')
        })
      },
      cancel() {
        for(let item in this.form) {
          this.form[item] = ''
        }
        this.userInfoVisible = false
      },
      // 重置密码
      changePassword(id) {
        this.$confirm('是否确认重置密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'})
        .then(() => {
          userinfoAxios.changePassword({userId:id, newPwd:'123456'})
          .then(() => {
            this.$message.success('修改成功,重置密码为123456')
            this.changePwdCancel()
          })
        //   .catch(() => {
        //     this.$message.error('修改失败')
        //   })
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
      //   userinfoAxios.changePassword({userId:this.userId, newPwd:this.password})
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
    },
    mounted() {
      this.getExpertData();
      this.getProvince();
    },
  }
</script>

<style lang="scss" scoped>
  #expertList {
    background: #ffffff;
    // height: 100%;
    // padding: 0 20px;
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
  #expertList .table-cell .cell{
    cursor: pointer;
  }
</style>
