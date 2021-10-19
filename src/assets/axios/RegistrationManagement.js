import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 报名列表
    getEnrollList(offset, limit, params) {
        params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
        return instance.get(`${host}/admin/enroll/list/${offset}/${limit}${params}`)
    },
    // 审核列表
    getCheckList(offset, limit, params) {
        params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
        return instance.get(`${host}/admin/enroll/list/check/${offset}/${limit}${params}`)
    },
    // 活动
    getActivityList() {
        return instance.get(`${host}/public/activity/list/0/100`)
    },
    // 报名详情
    detailEnroll(id) {
        return instance.get(`${host}/admin/enroll/detail/${id}`)
    },
    // 报名详情
    updateEnroll(form) {
        // form = Qs.stringify(form) ? `?${Qs.stringify(form)}` : ''
        return instance.post(`${host}/admin/enroll/update`, Qs.stringify(form))
    },
    // 审核通过
    pass(id) {
        return instance.get(`${host}/admin/enroll/pass/${id}`)
    },
    // 审核不通过
    noPass(id) {
        return instance.get(`${host}/admin/enroll/del/${id}`)
    },
}