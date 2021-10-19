import baseAxios from '../js/base_axios'
import host from '../js/common'
// import axios from 'axios'

let instance = baseAxios.instance
let jsonAxios = baseAxios.jsonAxios
const Qs = require('qs');
export default {
    // 赛事列表
    getActivityList(currentPage) {
        return instance.get(`${host}/public/activity/list/${currentPage}/8`)
    },
    // 下架赛事
    offActivity(activityId) {
        return instance.get(`${host}/admin/activity/off/${activityId}`)
    },
    // 上架赛事
    onActivity(activityId) {
        return instance.get(`${host}/admin/activity/on/${activityId}`)
    },
    // 删除赛事
    deleteActivity(activityId) {
        return instance.get(`${host}/admin/activity/del/${activityId}`)
    },
    // 跟新月赛结果
    completeActivity(activityId) {
        return instance.get(`${host}/admin/activity/complete/${activityId}`)
    },
    // 获取七牛上传token
    getQiniuToken() {
        return instance.get(`${host}/public/util/qiniu/token`)
    },
    // 添加赛事
    addActivity(form) {
        return instance.post(`${host}/admin/activity/add`, Qs.stringify(form))
    },
    // 添加后续赛事
    addSeriesActivity(form) {
        return instance.post(`${host}/admin/activity/add/series`, Qs.stringify(form))
    },
    // 赛事详情
    getActivityOption(activityId) {
        return instance.get(`${host}/public/activity/detail/${activityId}`)
    },
    // 修改赛事
    modifyActivity(form) {
        return instance.post(`${host}/admin/activity/update`, Qs.stringify(form))
    },
    // 获取赛事组别列表
    getActivityLevelList(activityLevelActivityId) {
        return instance.get(`${host}/public/activity/level/list/${activityLevelActivityId}`)
    },
    // 添加赛事组别
    addActivityLevel(form) {
        return instance.post(`${host}/admin/activity/level/add`, Qs.stringify(form))
    },
    // 修改赛事组别
    modifyActivityLevel(form) {
        return instance.post(`${host}/admin/activity/level/update`, Qs.stringify(form))
    },
    // 删除组别
    deleteLevel(activityLevelId) {
        return instance.get(`${host}/admin/activity/level/del/${activityLevelId}`)
    },
    // 查询评审老师列表
    getTeacherList(activityId) {
        return instance.get(`${host}/admin/activity/teacher/list?activityId=${activityId}`)
    },
    // 绑定评审老师
    bindingTeacher(form, num) {
        // let teacherList = new FormData(list)
        return jsonAxios.post(`${host}/admin/score/alloc/${num}`, form)
    }
}