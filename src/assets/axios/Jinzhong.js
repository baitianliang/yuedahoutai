import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
import axios from 'axios'
const Qs = require('qs');

export default {
    // 金钟奖评委列表
    getJinzhongUserList(offset, form) {
        let str = Qs.stringify(form) ? `?${Qs.stringify(form)}` : ''
        return instance.get(`${host}/admin/jinzhong/user/list/${offset}/20${str}`)
    },
    // 添加金钟奖评委
    addJinzhongUser(userId) {
        return instance.get(`${host}/admin/jinzhong/user/add/${userId}`)
    },
    // 删除金钟奖评委
    deleteJinzhongUser(userId) {
        return instance.get(`${host}/admin/jinzhong/user/delete/${userId}`)
    },
    // 金钟奖报名列表(未评分)
    getJinzhongEnrollList(offset, form) {
        let str = Qs.stringify(form) ? `?${Qs.stringify(form)}` : ''
        return instance.get(`${host}/admin/jinzhong/enroll/list/${offset}/20${str}`)
    },
    // 分配评委
    allocJinzhongScore(enrollId) {
        return instance.post(`${host}/admin/jinzhong/score/alloc/${enrollId}`)
    },
    // 金钟奖评审列表
    getAdminJinzhongEnrollScoreList(offset, form) {
        let str = Qs.stringify(form) ? `?${Qs.stringify(form)}` : ''
        return instance.get(`${host}/public/jinzhong/score/list/${offset}/20${str}`)
    },
    // 金钟奖评审列表
    getJinzhongEnrollScoreList(offset, userId, form) {
        form = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/public/jinzhong/score/list/${offset}/20?userId=${userId}${form}`)
    },
    // 保存草稿
    teacherSaveScore(form) {
        return instance.post(`${host}/teacher/jinzhong/score/grade?status=inactive`, Qs.stringify(form))
    },
    // 专家打分
    expertGrade(form) {
        return instance.post(`${host}/teacher/jinzhong/score/grade?status=active`, Qs.stringify(form))
    },
    // 管理员打分
    adminGrade(form) {
        return instance.post(`${host}/admin/jinzhong/score/grade?status=active`, Qs.stringify(form))
    },
    // 金钟奖报名列表(已评分)
    getAdminJinzhongScoreList(offset, form) {
        let str = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/admin/jinzhong/enroll/score/list/${offset}/20?scoreNum=9${str}`)
    },
}