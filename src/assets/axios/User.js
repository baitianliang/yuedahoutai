import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
let jsonAxios = baseAxios.jsonAxios
const Qs = require('qs');

export default {
    // 获取用户token
    getUserToken(form) {
        return jsonAxios.post(`${host}/oauth/token`, Qs.stringify(form))
    },
    // 获取用户信息
    getUserInfo() {
        return instance.get(`${host}/common/user/info`)
    },
    // 修改密码
    changePassword(data) {
        data = Qs.stringify(data)
        return instance.post(`${host}/common/user/pwd`, data)
    },
}