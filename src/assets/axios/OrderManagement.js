import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 订单列表
    getOrderList(offset, limit, searchForm) {
        let str = Qs.stringify(searchForm) ? `?${Qs.stringify(searchForm)}` : ''
        return instance.get(`${host}/admin/order/list/${offset}/${limit}${str}`)
    },
}