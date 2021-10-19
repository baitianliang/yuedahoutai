<template>
  <div class="team">
    <!-- <p class="title">报名信息列表</p> -->
    <div class="reg_toolbar">
      <div class="search-input">
        <el-input @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.enrollName" placeholder="请输入姓名"></el-input>
        <el-input @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.mobileId" placeholder="请输入报名手机号"></el-input>
        <el-input @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
        <el-select @keyup.enter.native="offset = 1;searchList()" @change="activityChange" v-model="searchForm.activityId" clearable placeholder="请选择活动">
          <el-option
            v-for="item in activityList"
            :key="item.activityId"
            :label="item.activityName"
            :value="item.activityId">
          </el-option>
        </el-select>
        <el-select @keyup.enter.native="offset = 1;searchList()" v-if="searchForm.activityId" v-model="searchForm.activityLevelId" clearable placeholder="请选择组别">
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
            @keyup.enter.native="offset = 1;searchList()"
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
            @keyup.enter.native="offset = 1;searchList()"
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
            @keyup.enter.native="offset = 1;searchList()"
            placeholder="请选择县区">
            <el-option
              v-for="item in districtOptions"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
        </el-select>
        <!-- <el-select v-model="searchForm.provinceId" placeholder="请选择地区">
          <el-option
            v-for="item in provinceOptions"
            :key="item.provinceId"
            :label="item.provinceName"
            :value="item.provinceId">
          </el-option>
        </el-select> -->
        <el-select @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.isOrder" placeholder="是否支付">
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
        <el-select @keyup.enter.native="offset = 1;searchList()" v-model="searchForm.isWork" placeholder="是否上传作品">
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
        <el-button @click="offset = 1;searchList()">搜索</el-button>
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
        prop="activityLevelName"
        label="组别">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="开始学琴时间">
        <template slot-scope="scope">
          {{ scope.row.enrollStudyTime ? scope.row.enrollStudyTime.substr(0,10) : '' }}
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
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
        prop="enrollPhone"
        label="报名手机号">
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
      <!-- <el-table-column
        header-align="center"
        align="center"
        prop="enrollMail"
        label="邮箱">
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        prop="workStatus"
        label="作品审核状态"
        width="120">
        <template slot-scope="scope">
          {{ workStatus[scope.row.workStatus] }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="110"
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
        </template>
      </el-table-column>
      <!--      <el-table-column
        header-align="center"
        align="center"-->
      <!--        prop="userEducation"-->
      <!--        label="更多详细信息"-->
      <!--        width="163">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button plain @click="detail(scope.row)">点击查看</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column
        header-align="center"
        align="center"-->
      <!--        prop="userEducation"-->
      <!--        label="审核状态"-->
      <!--        width="120">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{scope.row.status?'审核成功':'审核失败'}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column
        header-align="center"
        align="center"-->
      <!--        label="操作"-->
      <!--        width="141"-->
      <!--        header-align="center"-->
      <!--        align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            class="audit-status"-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            @click="handleDelete(scope.$index, scope.row)">-->
      <!--            查看备注-->
      <!--            <i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

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
                    title="报名信息"
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
                              <el-form-item label="真实姓名">
                                <el-input v-model="form.enrollTrueName" placeholder="请输入真实姓名"></el-input>
                              </el-form-item>
                              <el-form-item label="性别">
                                <el-select class="sex" v-model="form.enrollSex" placeholder="请选择性别">
                                  <el-option label="男" :value="1"></el-option>
                                  <el-option label="女" :value="0"></el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="邮箱">
                                <el-input v-model="form.enrollMail" placeholder="请输入邮箱"></el-input>
                              </el-form-item>
                              <el-form-item label="手机号码">
                                <el-input v-model="form.enrollPhone" placeholder="请输入手机号"></el-input>
                              </el-form-item>
                              <el-form-item label="居住地">
                                <el-input v-model="form.enrollAddr" placeholder="请输入居住地"></el-input>
                              </el-form-item>
                              <el-form-item label="省份">
                                <el-select v-model="form.enrollProvinceId" clearable placeholder="请选择省份" @change="provinceChange">
                                  <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.provinceId"
                                    :label="item.provinceName"
                                    :value="item.provinceId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item v-if="form.enrollProvinceId" label="市区">
                                <el-select v-model="form.enrollCityId" clearable placeholder="请选择市区" @change="cityChange">
                                  <el-option
                                    v-for="item in enrollCityList"
                                    :key="item.cityId"
                                    :label="item.cityName"
                                    :value="item.cityId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item v-if="form.enrollCityId" label="县区">
                                <el-select v-model="form.enrollDistrictId" clearable placeholder="请选择县区" @change="districtChange">
                                  <el-option
                                    v-for="item in enrollDistrictList"
                                    :key="item.districtId"
                                    :label="item.districtName"
                                    :value="item.districtId">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="作品名" v-if="enrollWorkDesc.activitySeasonType === 'y'">
                                <el-input readonly v-model="enrollWorkDesc.workName"></el-input>
                              </el-form-item>
                              <el-form-item label="作品号" v-if="enrollWorkDesc.activitySeasonType === 'y'">
                                <el-input readonly v-model="enrollWorkDesc.workNum"></el-input>
                              </el-form-item>
                              <el-form-item label="作曲家" v-if="enrollWorkDesc.activitySeasonType === 'y'">
                                <el-input readonly v-model="enrollWorkDesc.workAuthor"></el-input>
                              </el-form-item>
                              <el-form-item label="乐段乐章" v-if="enrollWorkDesc.activitySeasonType === 'y'">
                                <el-input readonly v-model="enrollWorkDesc.workArticle"></el-input>
                              </el-form-item>
                            </div>
                            <div>
                              <!-- <el-form-item label="组别">
                                <el-select v-model="form.enrollActivityLevelId" placeholder="请选择组别">
                                  <el-option
                                    v-for="(item, index) in enrollActivityLevelList"
                                    :key="index"
                                    :label="item.activityLevelName"
                                    :value="item.activityLevelId">
                                  </el-option>
                                </el-select>
                              </el-form-item> -->
                              <el-form-item label="出生日期">
                                <el-date-picker
                                  v-model="form.enrollBirthday"
                                  type="date"
                                  placeholder="请输入出生日期"
                                  value-format="yyyy-MM-dd hh:mm:ss">
                                </el-date-picker>
                              </el-form-item>
                              <el-form-item label="开始学琴时间">
                                <el-date-picker
                                  v-model="form.enrollStudyTime"
                                  type="date"
                                  placeholder="请输入开始学琴时间"
                                  value-format="yyyy-MM-dd hh:mm:ss">
                                </el-date-picker>
                              </el-form-item>
                              <!-- <el-form-item label="曲目">
                                <el-input v-model="form.enrollSong" placeholder="请输入曲目"></el-input>
                              </el-form-item> -->
                              <el-form-item label="身份证号">
                                <el-input v-model="form.enrollIdCard" placeholder="请输入身份证号"></el-input>
                              </el-form-item>
                              <el-form-item label="身份证照片">
                                <Onload
                                  @onloadSuccess="onloadSuccess"
                                  :name="'enrollIdCardPic'"
                                  :imgUrl="form.enrollIdCardPic"></Onload>
                              </el-form-item>
                              <el-form-item v-if="form.enrollSupplement" label="证书照片">
                                <el-image 
                                  style="width: 100px; height: 100px"
                                  :src="form.enrollSupplement"
                                  :preview-src-list="[form.enrollSupplement]">
                                </el-image>
                              </el-form-item>
                              <!-- <el-form-item label="推荐单位名称">
                                <el-input v-model="form.enrollGov1" placeholder="请输入推荐单位名称"></el-input>
                              </el-form-item>
                              <el-form-item label="推荐机构名称">
                                <el-input v-model="form.enrollGov2" placeholder="请输入推荐机构名称"></el-input>
                              </el-form-item> -->
                              <el-form-item label="指导教师姓名">
                                <el-input v-model="form.enrollTeacher" placeholder="请输入指导教师姓名"></el-input>
                              </el-form-item>
                              <el-form-item label="指导教师电话">
                                <el-input v-model="form.enrollTeacherPhone" placeholder="指导教师电话"></el-input>
                              </el-form-item>
                              <!-- <el-form-item label="个人简介">
                                <el-input
                                  type="textarea"
                                  :rows="4"
                                  resize="none"
                                  placeholder="请输入个人简介"
                                  v-model="form.userDesc">
                                </el-input>
                              </el-form-item> -->
                            </div>
                          </div>
                        </el-form>
                      </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="cancel">取 消</el-button>
                      <el-button type="primary" @click="onsubmit">修 改</el-button>
                    </span>
                  </el-dialog>
  </div>
</template>

<script>
  import axios from '@/assets/axios/RegistrationManagement.js'
  import levelAxios from '@/assets/axios/EventManagement.js'
  import provinceAxios from '@/assets/axios/Expert.js'
  import height from '@/mixins/heightMixin.js'
  export default {
    mixins: [height],
    data() {
      return {
        searchForm: {
          enrollName: '',
          mobileId: '',//报名手机号
          activityId: '',//活动id
          activityLevelId: '',//组别id
          isOrder: null,
          isWork: null,
          provinceId: '',
          cityId: '',
          districtId: '',
          idCard: ''
        },
        form: {
          enrollId: '', //报名id
          // enrollActivityId: '', //赛事id
          // enrollActivityLevelId: '', //组别id
          enrollTrueName: '', //真实姓名
          enrollSex: '', //性别
          enrollProvinceId: '', //省区id
          enrollProvinceName: '', //省区名称
          enrollCityId: '', //市区id
          enrollCityName: '', //市区名称
          enrollDistrictId: '', //县区id
          enrollDistrictName: '', //县区名称
          enrollPhone: '', //联系方式
          enrollMail: '', //邮箱号
          enrollBirthday: '', //出生日期
          enrollAddr: '', //居住地
          // enrollSong: '', //曲目
          enrollStudyTime: '',  //开始学琴时间
          enrollIdCard: '', //身份证号
          enrollIdCardPic: '',
          // enrollGov1: '', //推荐单位名称
          // enrollGov2: '', //推荐机构名称
          enrollTeacher: '', //指导教师姓名
          enrollTeacherPhone: '', //指导教师电话
        },
        enrollWorkDesc: {
          activitySeasonType: ''
        },
        enrollActivityLevelList: [],
        enrollCityList: [],
        enrollDistrictList: [],
        enrollId: '',
        rules: [
          {name: 'enrollTrueName', rule: '请输入真实姓名'},
          {name: 'enrollAddr', rule: '请输入居住地'},
          // {name: 'enrollSong', rule: '请输入曲目'},
          {name: 'enrollIdCard', rule: '请输入身份证号'},
          {name: 'enrollPhone', rule: '请输入联系方式'},
          {name: 'enrollMail', rule: '请输入邮箱'},
          {name: 'enrollProvinceId', rule: '请选择所在地省份'},
        ],

        activityList: [],//活动数据列表
        levelList: [],//组别列表
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
        tableData: [],//报名列表
        offset: 1,
        limit: 20,
        total: 0,
        workStatus: {
            'active': '通过',
            'inactive': '待审核',
            'delete': '驳回'
        },
        userInfoVisible: false,
        exportButton: '导出'
      }
    },
    mounted() {
      this.getActivityList();
      this.getProvince()
    },
    destroyed() {
        localStorage.activityId = ''
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
        params.enrollStatus = 'active'
        let offset = this.limit * (this.offset - 1)
        axios.getEnrollList(offset, this.limit, params)
        .then(res => {
          this.total = res.data.totalCount
          this.tableData = res.data.result
        })
      },
      // 上传七牛成功后赋值参数
      onloadSuccess(name, val) {
          this.form[name] = val
      },
      //获取活动列表
      getActivityList() {
        let activityStatus = 'active'
        axios.getActivityList()
        .then(res => {
          this.activityList = JSON.parse(JSON.stringify(res.data.result));
          this.searchForm.activityId = localStorage.activityId ? localStorage.activityId : this.activityList[0].activityId
          this.getTableData();
          this.getActivityLevelList(this.searchForm.activityId, 'levelList')
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
      activityChange() {
        this.searchForm.activityLevelId = ''
        this.getActivityLevelList(this.searchForm.activityId, 'levelList')
        .then(() => {
          this.searchForm.activityLevelId = ''
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
      handleCurrentChange(val) {
        this.offset = val
        this.getTableData()
      },
      //选择省区变化
      provinceChange(val) {
        if(!val) return this.form.enrollProvinceName = ''
        this.provinceOptions.forEach(el => {
          if (el.provinceId === val) {
            this.form.enrollProvinceName = el.provinceName;
          }
        })
        this.form.enrollCityId = ''
        this.form.enrollCityName = ''
        this.form.enrollDistrictId = ''
        this.form.enrollDistrictName = ''
        this.getCityList(val, 'enrollCityList')
      },
      // 市区变化
      cityChange(val) {
        if(!val) return this.form.enrollCityName = ''
        this.enrollCityList.forEach(el => {
          if (el.cityId === val) {
            this.form.enrollCityName = el.cityName;
          }
        })
        this.form.enrollDistrictId = ''
        this.form.enrollDistrictName = ''
        this.getDistrictList(val, 'enrollDistrictList')
      },
      // 县区变化
      districtChange(val) {
        if(!val) return this.form.enrollDistrictName = ''
        this.enrollDistrictList.forEach(el => {
          if (el.districtId === val) {
            this.form.enrollDistrictName = el.districtName;
          }
        })
      },
      // 导出
      exportExcel() {
        if (this.exportButton !== "导出") return this.$message.error('正在导出,请稍后...')
        let data = [], params = {}, offset = 0;
        for(let item in this.searchForm) {
          if(!!this.searchForm[item]) {
            params[item] = this.searchForm[item]
          }
        }
        this.getAllExcelTable(params)
        .then((res) => {
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../lib/Export2Excel");
            const tHeader = ["真实姓名", "性别", "出生日期", "组别", "开始学琴时间", "推荐老师姓名", "推荐老师电话", "身份证号", "报名手机号", "报名日期"];// 上面设置Excel的表格第一行的标题
            const filterVal = ["enrollTrueName", "enrollSex", "enrollBirthday", "activityLevelName",
              "enrollStudyTime", "enrollTeacher", "enrollTeacherPhone", "enrollIdCard",
              "enrollPhone", "enrollCreateTime",]; // 上面的index、nickName、name是tableData里对象的属性
            const list = res;              //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "报名信息列表");   //标题，数据，文件名
            this.exportButton = '导出'
          });
        })
      },
      async getAllExcelTable(params) {
        let arrAll = []
        for(let i = 0; i <= parseInt(this.total / 100); i++) {
          let res = await this.getExcelTable(params, 100 * i)
          this.exportButton = '正在导出 ' + parseInt(100 * arrAll.length / this.total) + '%'
          arrAll = [...arrAll, ...res.data.result]
        }
        return arrAll
      },
      formatJson(filterVal, jsonData) {
        const arr = []
        jsonData.map(v => {
          let arrChild = []
          filterVal.map(j => {
            if (j === "enrollSex") {
              arrChild.push(v[j] === 1 ? '男' : '女')
            } else if (j === "enrollBirthday" || j === "enrollStudyTime" || j === "enrollCreateTime") {
              arrChild.push(v[j] ? v[j].substr(0,10) : '')
            } else {
              arrChild.push(v[j])
            }
          })
          arr.push(arrChild)
          arrChild = []
        });
        return arr
      },
      async getExcelTable(params, offset) {
        return axios.getEnrollList(offset, 100, params)
      },
      //查看详情
      tabRowClick(row) {
        this.enrollId = row.enrollId
        // axios.detailEnroll(row.enrollId)
        let arr = ['enrollId',
          // 'enrollActivityId',
          // 'enrollActivityLevelId',
          'enrollTrueName',
          'enrollSex',
          'enrollProvinceId',
          'enrollProvinceName',
          'enrollCityId',
          'enrollCityName',
          'enrollDistrictId',
          'enrollDistrictName',
          'enrollPhone',
          'enrollMail',
          'enrollBirthday',
          'enrollAddr',
          // 'enrollSong',
          'enrollStudyTime',
          'enrollIdCard',
          // 'enrollGov1',
          // 'enrollGov2',
          'enrollTeacher',
          'enrollTeacherPhone',
          'enrollSupplement'
        ]
        arr.forEach(el => {
          this.form[el] = row[el]
        })
        this.enrollWorkDesc = { ...JSON.parse(row.enrollWorkDesc), ...this.enrollWorkDesc }
        this.enrollWorkDesc.activitySeasonType = row.activitySeasonType
        this.form.enrollIdCardPic = row.enrollIdCardPic === '无' ? '' : row.enrollIdCardPic
        // if (this.form.enrollActivityId) {
        //   this.getActivityLevelList(this.form.enrollActivityId, 'enrollActivityLevelList')
        // }
        if (this.form.enrollProvinceId) {
          this.getCityList(this.form.enrollProvinceId, 'enrollCityList')
        }
        if (this.form.enrollCityId) {
          this.getDistrictList(this.form.enrollCityId, 'enrollDistrictList')
        }
        this.userInfoVisible = true
      },
      onsubmit() {
        // for(let item of this.rules) {
        //   if(!this.form[item.name]) return this.$message.error(item.rule)
        // }
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
        this.enrollId = ''
        this.enrollWorkDesc = {
          activitySeasonType: ''
        }
        for(let item in this.form) {
          this.form[item] = ''
        }
      }
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
