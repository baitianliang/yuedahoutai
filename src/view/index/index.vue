<template>
    <div class="index">
        <div class="index_search">
            <el-form>
                <div class="search_content">
                    <div class="index_search_left">
                        <el-form-item label="选择活动">
                                <el-select class="active_select" @change="activityChange" v-model="searchForm.activityId" clearable placeholder="请选择活动">
                                    <el-option
                                    v-for="item in activityList"
                                    :key="item.activityId"
                                    :label="item.activityName"
                                    :value="item.activityId">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="选择地区">
        <el-select
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
        </el-select>
                        </el-form-item> -->
                    </div>
                    <!-- <div class="index_search_right">
                        <el-form-item label="选择时间">
                            <el-radio v-model="radio" label="1">今日</el-radio>
                            <el-radio v-model="radio" label="2">本周</el-radio>
                            <el-radio v-model="radio" label="3">本月</el-radio>
                            <el-radio v-model="radio" label="4">本年</el-radio>
                        </el-form-item>
                    </div> -->
                </div>
            </el-form>
        </div>
        <div class="statistics_data">
            <div class="statistics_content" v-for="(item, index) in statisticsData" :key="index" @click="changeStatistics(item)">
                <el-image style="width: 35px; height: 35px" :src="item.url" alt=""></el-image>
                <!-- <div style="width: 20px; height: 20px; background: red"></div> -->
                <div class="statistics_text">
                    <p>{{item.name}}</p>
                    <p>{{item.num}}</p>
                </div>
            </div>
        </div>
        <div class="echarts">
            <div class="echarts_left">
                <el-form>
                    <el-form-item label="筛选">
        <el-select v-model="searchForm.activityLevelId" clearable placeholder="请选择组别" @change="getStatEnroll">
          <el-option
            v-for="(item, index) in levelList"
            :key="index"
            :label="item.activityLevelName"
            :value="item.activityLevelId">
          </el-option>
        </el-select>
                    </el-form-item>
                </el-form>
                <div id="annulus"></div>
            </div>
            <div class="echarts_right">
                <div class="background"></div>
                <div id="brokenLine"></div>
            </div>
        </div>
        <div class="echarts_columnar">
            <div id="columnar"></div>
        </div>
        <div class="index_table">
            <index-table></index-table>
        </div>
    </div>
</template>

<script>
const Qs = require('qs');
import axios from '@/assets/axios/Index.js'
import regisAxios from '@/assets/axios/RegistrationManagement.js'
import levelAxios from '@/assets/axios/EventManagement.js'
import provinceAxios from '@/assets/axios/Expert.js'
// import echarts from '@/utils/echarts.min.js'
let { echarts } = require('@/utils/echarts.js');
// import height from '@/mixins/heightMixin.js'
export default {
    // mixins: [height],
    data() {
        return {
            searchForm: {
                activityId: '',
                activityLevelId: '',
                // provinceId: '',
                // cityId: '',
                // districtId: '',
            },
            activityList: [],
            levelList: [],
            provinceOptions: [],
            cityOptions: [],
            districtOptions: [],
            statisticsData: [{
                name: '注册人数',
                num: '',
                url: require('@/assets/img/38.png'),
                AllocList: '',
                brokenLineList: 'userListDateMap'
            },{
                name: '报名人数',
                num: '',
                url: require('@/assets/img/39.png'),
                AllocList: 'enrollListProvinceNameMap',
                brokenLineList: 'enrollListDateMap'
            },{
                name: '缴费人数',
                num: '',
                url: require('@/assets/img/40.png'),
                AllocList: 'enrollListWithOrderProvinceNameMap',
                brokenLineList: 'enrollListWithOrderDateMap'
            },{
                name: '上传作品',
                num: '',
                url: require('@/assets/img/41.png'),
                AllocList: 'enrollListWithOrderWorkProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkDateMap'
            },{
                name: '未分配评审',
                num: '',
                url: require('@/assets/img/42.png'),
                AllocList: 'enrollListWithOrderWorkUnAllocProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkUnAllocDateMap'
            },{
                name: '评审中',
                num: '',
                url: require('@/assets/img/43.png'),
                AllocList: 'enrollListWithOrderWorkInScoreProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkInScoreDateMap'
            },{
                name: '已评审',
                num: '',
                url: require('@/assets/img/44.png'),
                AllocList: 'enrollListWithOrderWorkScoredProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkScoredDateMap'
            },{
                name: '晋级作品',
                num: '',
                url: require('@/assets/img/45.png'),
                AllocList: 'enrollListWithOrderWorkScoreUpGradeProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkScoreUpGradeDateMap'
            },{
                name: '未晋级作品',
                num: '',
                url: require('@/assets/img/46.png'),
                AllocList: 'enrollListWithOrderWorkScoreDownGradeProvinceNameMap',
                brokenLineList: 'enrollListWithOrderWorkScoreDownGradeDateMap'
            }],
            // orderDate: [],
            // orderProvince: [],
            // radio: '1',
            AllocList: [],
            brokenLineList: [],
            // 注册用户
            userListDateMap: [],
            // 评审专家地区
            enrollListWithOrderWorkUnAllocProvinceNameMap: [],
            enrollListDateMap: [],
            enrollListProvinceNameMap: [],
            enrollListWithOrderDateMap: [],
            enrollListWithOrderProvinceNameMap: [],
            enrollListWithOrderWorkDateMap: [],
            enrollListWithOrderWorkProvinceNameMap: [],
            enrollListWithOrderWorkUnAllocDateMap: [],
            enrollListWithOrderWorkInScoreDateMap: [],
            enrollListWithOrderWorkInScoreProvinceNameMap: [],
            enrollListWithOrderWorkScoredDateMap: [],
            enrollListWithOrderWorkScoredProvinceNameMap: [],
            enrollListWithOrderWorkScoreUpGradeDateMap: [],
            enrollListWithOrderWorkScoreUpGradeProvinceNameMap: [],
            enrollListWithOrderWorkScoreDownGradeDateMap: [],
            enrollListWithOrderWorkScoreDownGradeProvinceNameMap: [],
            enrollListWithOrderWorkScoreUpGradeCount: 0,
            enrollListWithOrderWorkScoreDownGradeCount: 0,
            enrollListWithOrderWorkCount: 0,
            enrollListWithOrderCount: 0,
            enrollListCount: 0,
        }
    },
    mounted() {
        regisAxios.getActivityList()
        .then(res => {
            this.activityList = JSON.parse(JSON.stringify(res.data.result));
            this.searchForm.activityId = this.activityList[0].activityId
            this.getStatUser()
            this.getStatEnroll()
            this.getProvince()
        })
        // this.getEchartsColumnar()
        // this.getEchartsBrokenLine()
        // this.getEchartsAnnulus()
    },
    methods: {
        getStatUser() {
            axios.getStatUser()
            .then(res => {
                this.statisticsData[0].num = res.data.result.userListCount + '人'
                // this.statisticsData[4].num = res.data.result.teacherListCount + '人'
                this.userListDateMap = res.data.result.userListDateMap
                // this.teacherListProvinceNameMap = res.data.result.teacherListProvinceNameMap
                // this.userListCount = res.data.userListCount
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
                this.statisticsData[1].num = res.data.result.enrollListCount + '人'
                this.statisticsData[2].num = res.data.result.enrollListWithOrderCount + '人'
                this.statisticsData[3].num = res.data.result.enrollListWithOrderWorkCount + '人'
                this.statisticsData[4].num = res.data.result.enrollListWithOrderWorkUnAllocCount + '人'
                this.statisticsData[5].num = res.data.result.enrollListWithOrderWorkInScoreCount + '人'
                this.statisticsData[6].num = res.data.result.enrollListWithOrderWorkScoredCount + '人'
                this.statisticsData[7].num = res.data.result.enrollListWithOrderWorkScoreUpGradeCount + '人'
                this.statisticsData[8].num = res.data.result.enrollListWithOrderWorkScoreDownGradeCount + '人'
                this.enrollListWithOrderWorkScoreUpGradeCount = Number(res.data.result.enrollListWithOrderWorkScoreUpGradeCount)
                this.enrollListWithOrderWorkScoreDownGradeCount = Number(res.data.result.enrollListWithOrderWorkScoreDownGradeCount)
                this.enrollListWithOrderWorkCount = Number(res.data.result.enrollListWithOrderWorkCount)
                this.enrollListWithOrderCount = Number(res.data.result.enrollListWithOrderCount)
                this.enrollListCount = Number(res.data.result.enrollListCount)
                this.enrollListDateMap = res.data.result.enrollListDateMap
                this.enrollListProvinceNameMap = res.data.result.enrollListProvinceNameMap
                this.enrollListWithOrderDateMap = res.data.result.enrollListWithOrderDateMap
                this.enrollListWithOrderProvinceNameMap = res.data.result.enrollListWithOrderProvinceNameMap
                this.enrollListWithOrderWorkDateMap = res.data.result.enrollListWithOrderWorkDateMap
                this.enrollListWithOrderWorkProvinceNameMap = res.data.result.enrollListWithOrderWorkProvinceNameMap
                this.enrollListWithOrderWorkUnAllocDateMap = res.data.result.enrollListWithOrderWorkUnAllocDateMap
                this.enrollListWithOrderWorkUnAllocProvinceNameMap = res.data.result.enrollListWithOrderWorkUnAllocProvinceNameMap
                this.enrollListWithOrderWorkInScoreDateMap = res.data.result.enrollListWithOrderWorkInScoreDateMap
                this.enrollListWithOrderWorkInScoreProvinceNameMap = res.data.result.enrollListWithOrderWorkInScoreProvinceNameMap
                this.enrollListWithOrderWorkScoredDateMap = res.data.result.enrollListWithOrderWorkScoredDateMap
                this.enrollListWithOrderWorkScoredProvinceNameMap = res.data.result.enrollListWithOrderWorkScoredProvinceNameMap
                this.enrollListWithOrderWorkScoreUpGradeDateMap = res.data.result.enrollListWithOrderWorkScoreUpGradeDateMap
                this.enrollListWithOrderWorkScoreUpGradeProvinceNameMap = res.data.result.enrollListWithOrderWorkScoreUpGradeProvinceNameMap
                this.enrollListWithOrderWorkScoreDownGradeDateMap = res.data.result.enrollListWithOrderWorkScoreDownGradeDateMap
                this.enrollListWithOrderWorkScoreDownGradeProvinceNameMap = res.data.result.enrollListWithOrderWorkScoreDownGradeProvinceNameMap
                this.brokenLineList = this.enrollListDateMap
                this.AllocList = this.enrollListProvinceNameMap
                this.getEchartsAnnulus()
                this.getEchartsColumnar()
                this.getEchartsBrokenLine()
            })
        },
        changeStatistics(val) {
            this.AllocList = val.AllocList ? this[val.AllocList] : this.enrollListProvinceNameMap
            this.brokenLineList = val.brokenLineList ? this[val.brokenLineList] : this.enrollListDateMap
            this.getEchartsColumnar()
            this.getEchartsBrokenLine()
        },
        getEchartsAnnulus() {
            let myChart = echarts.init(document.getElementById('annulus')),
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    bottom: 40,
                    itemGap: 25,
                    data: ['晋级人数', '未晋级人数', '上传作品', '缴费人数', '报名人数']
                },
                color: ['#ff5722', '#15d385', '#2196f3', '#ffeb3b', '#673ab7'],
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: this.enrollListWithOrderWorkScoreUpGradeCount, name: '晋级人数'},
                        {value: this.enrollListWithOrderWorkScoreDownGradeCount, name: '未晋级人数'},
                        {value: this.enrollListWithOrderWorkCount, name: '上传作品'},
                        {value: this.enrollListWithOrderCount, name: '缴费人数'},
                        {value: this.enrollListCount, name: '报名人数'}
                    ]
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        getEchartsBrokenLine() {
            let XData = [], data = []
            for(let i in this.brokenLineList) {
                XData.push(i)
            }
            XData = XData.sort(this.sortDownDate)
            if (XData.length > 30) XData = XData.slice(-30)
            for(let i of XData) {
                data.push(this.brokenLineList[i])
            }
            let myChart = echarts.init(document.getElementById('brokenLine')),
            option = {
                tooltip: {
                    formatter: function(params, ticket, callback) {
                        return "日期: " + params.name + "<br/>人数: " + params.data
                    }
                },
                xAxis: {
                    type: 'category',
                    data: XData,
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                yAxis: {
                    type: 'value',
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                series: [{
                    itemStyle:{
                        normal:{
                            color:'#ff5722',
                            borderColor:'#407bed',  //拐点边框颜色
                        }
                    },
                    data: data,
                    type: 'line'
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        getEchartsColumnar() {
            let XData = [], NumData = []
            for(let item in this.AllocList) {
                XData.push(item)
                NumData.push(this.AllocList[item])
            }
            let myChart = echarts.init(document.getElementById('columnar')),
            option = {
                color: ['#7ac0f8'],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: XData,
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        formatter:function(value){
                            return value.split("").join("\n")
                        },
                        color:'#808080'
                    }
                },
                yAxis: {
                    type: 'value',
                    // max: 20,
                    //坐标轴颜色
                    axisLine:{
                        lineStyle:{
                            color:'#407bed'
                        }
                    },
                    axisLabel:{
                        color:'#808080'
                    }
                },
                series: [{
                    data: NumData,
                    type: 'bar',
                    barWidth : 20,
                    barGap:50
                }],
                tooltip: {
                    // show: true,
                    // trigger: 'axis',
                    // //show: true,   //default true
                    // showDelay: 0,//显示延时，添加显示延时可以避免频繁切换
                    // hideDelay: 50,//隐藏延时
                    // transitionDuration: 0,//动画变换时长
                    // backgroundColor: 'rgba(0,0,0,0.7)',//背景颜色（此时为默认色）
                    // borderRadius: 8,//边框圆角
                    padding: 10,    // [5, 10, 15, 20] 内边距
                    position: function (p) {
                        // 位置回调
                        return [p[0] + 10, p[1] - 10];
                    },
                    formatter(params, ticket, callback) {
                        return "人数: " + params.data;
                        // setTimeout(function () {
                        // //     // 仅为了模拟异步回调
                        //     callback(ticket, res);
                        // }, 10)
                        // return '请等候...';
                    }
                },
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        sortDownDate(a, b) {
            return Date.parse(a) - Date.parse(b);
        },
        sortUpDate(a, b) {
            return Date.parse(b) - Date.parse(a);
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
    }
}
</script>

<style lang="scss" scoped>

.main {
    padding-top: 0px!important;
}
.index {
    overflow: auto;
}
.index_search {
    height: auto;
    width: 100%;
    background-color: white;
    .el-form {
        height: auto;
        .search_content {
            display: flex;
            .index_search_left {
                margin-top: 20px;
                margin-left: 20px;
                width: 50%;
            }
            .index_search_right {
                width: 50%;
                margin-top: 20px;
            }
            .active_select {
                width: auto;
            }
        }
    }
}
.statistics_data {
    height: auto;
    width: 100%;
    margin-top: 20px;
    background-color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .statistics_content {
        margin: 10px 0px;
        padding: 10px;
        display: flex;
        align-items: center;
        border-radius: 20px;
        cursor: pointer;
        .statistics_text {
            margin-left: 10px;
        }
    }
    .statistics_content:hover {
        background-color: #eee;
    }
    .statistics_content:active {
        background-color: #ccc;
    }
}
.echarts {
    height: auto;
    width: 100%;
    margin-top: 20px;
    display: flex;
    // justify-content: space-around;
    align-items: center;
    .echarts_left {
        width: 30%;
        background-color: white;
        height: 380px;
        .el-form {
            margin-top: 20px;
            margin-left: 30px;
        }
        #annulus {
            width: 100%;
            height: 300px
        }
    }
    .echarts_right {
        // margin-left: 20px;
        background-color: white;
        width: 70%;
        height: 380px;
        display: flex;
        .background {
            width: 20px;
            height: 100%;
            background-color: #eee;;
        }
        #brokenLine {
            width: 100%;
            height: 370px
        }
    }
}
.echarts_columnar {
    height: 400px;
    width: 100%;
    margin-top: 20px;
    background-color: white;
    #columnar {
        width: 100%;
        height: 400px;
    }
}
.index_table {
    width: 100%;
    margin-top: 20px;
    background-color: white;
}

// span {
//     padding: 0px;
//     color: #495A80;
// }
.table_title {
    margin: 20px;
    font-size: 25px;
}
</style>
