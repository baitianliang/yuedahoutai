import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // // 报名列表
    // getEnrollList(offset, limit, params) {
    //     params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
    //     return instance.get(`${host}/admin/enroll/list/${offset}/${limit}${params}`)
    // },
    // // 审核列表
    // getCheckList(offset, limit, params) {
    //     params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
    //     return instance.get(`${host}/admin/enroll/list/check/${offset}/${limit}${params}`)
    // },
    // 发送消息
    sendMessage(form) {
        // params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
        return instance.post(`${host}/admin/message/broadcast`, form)
    },
    // 用户列表
    getUserList(offset, limit, params) {
        params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
        return instance.get(`${host}/admin/user/list/${offset}/${limit}${params}`)
    },
}