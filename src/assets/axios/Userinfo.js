import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 学生列表
    getUserList(offset, limit, params) {
        params = Qs.stringify(params) ? `&${Qs.stringify(params)}` : ''
        return instance.get(`${host}/admin/user/list/${offset}/${limit}?roleId=1${params}`)
    },
    // // 报名详情
    // detailEnroll(id) {
    //     return instance.get(`${host}/admin/user/detail/${id}`)
    // },
    // 报名详情
    updateEnroll(form) {
        return instance.post(`${host}/admin/user/update`, Qs.stringify(form))
    },
    // 修改密码
    changePassword(form) {
        return instance.post(`${host}/admin/user/pwd`, Qs.stringify(form))
    }
}