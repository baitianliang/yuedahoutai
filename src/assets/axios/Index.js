import host from '../js/common'

// import baseAxios from '../js/base_axios'
import axios from 'axios'
// let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 每日报名人数
    getOrderDate() {
        return axios.get(`${host}/admin/stat/order/date`)
    },
    // 省份报名人数
    getOrderProvince() {
        return axios.get(`${host}/admin/stat/order/province`)
    },
    // 省份未审核人数
    getAllocList() {
        return axios.get(`${host}/admin/stat/alloc/list`)
    },
    // 注册人数
    getStatUser() {
        return axios.get(`${host}/admin/stat/user`)
    },
    // 报名相关人数
    getStatEnroll(params) {
        params = Qs.stringify(params) ? `?${Qs.stringify(params)}` : ''
        return axios.get(`${host}/admin/stat/enroll${params}`)
    }
}