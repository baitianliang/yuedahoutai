import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 所有评审列表
    getAllScoreList(offset, limit, scoreStatus, form) {
        form = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/public/score/list/${offset}/${limit}?scoreStatus=${scoreStatus}${form}`)
    },
    // 所有评审列表
    getAdminAllScoreList(offset, limit, form) {
        form = Qs.stringify(form) ? `?${Qs.stringify(form)}` : ''
        return instance.get(`${host}/public/enroll/list/score/${offset}/${limit}${form}`)
    },
    // 评审作品列表
    getScoreList(offset, limit, userId, scoreStatus, form) {
        form = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/public/score/list/${offset}/${limit}?userId=${userId}&scoreStatus=${scoreStatus}${form}`)
    },
    // 获取作品详情
    getScoreDetail(scoreId) {
        return instance.get(`${host}/public/score/detail/${scoreId}`)
    },
    // 管理员修改评审内容
    adminScoreGrade(form) {
        return instance.post(`${host}/admin/score/grade`, Qs.stringify(form))
    },
    // 评委修改评审内容
    adminExpertGrade(form) {
        return instance.post(`${host}/expert/score/grade?status=active`, Qs.stringify(form))
    },
    // 评审内容存为草稿
    teacherSaveGrade(form) {
        return instance.post(`${host}/expert/score/grade?status=inactive`, Qs.stringify(form))
    },
    // 发布评审内容
    publish(list) {
        let queryList = new FormData()
        for(let i of list){
            queryList.append('enrollIds',i)
        }
        return instance.post(`${host}/admin/enroll/publish`, queryList)
    },
    // 保存加星减星
    changeStar(enrollId, mark) {
        return instance.post(`${host}/admin/enroll/mark`, Qs.stringify({enrollId, mark}))
    },
    // 获取上次参赛作品
    getBeforeWork(enrollId) {
        return instance.get(`${host}/public/enroll/detail/score/${enrollId}`)
    },
    
    //七牛上传带文件名  视频格式转换
    getqiniuFops(data) {
        return axios.get(`${host}/public/util/qiniu/fops/token?key=${data}`)
    },
    //获取七牛转码状态
    getPersistent(id){
        return axios.get(`${host}//public/util/qiniu/query?persistentId=${id}`)
    },
}