import host from '../js/common'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 全部作品列表
    getAllWorklList(offset, search) {
        let str = Qs.stringify(search) ? `?${Qs.stringify(search)}` : ''
        return instance.get(`${host}/admin/work/list/${offset}/20${str}`)
    },
    // 参赛作品列表
    getActivityWorkList(offset, limit, search, str) {
        if(str) {
            if(Qs.stringify(search)) {
                str = `?${str}&${Qs.stringify(search)}`
            } else {
                str = `?${str}`
            }
        } else {
            if(Qs.stringify(search)) {
                str = `?${Qs.stringify(search)}`
            }
        }
        return instance.get(`${host}/admin/activity/work/list/${offset}/${limit}${str}`)
    },
    // 未分配作品列表
    getForallocList(offset, search) {
        let str = Qs.stringify(search) ? `?${Qs.stringify(search)}` : ''
        return instance.get(`${host}/admin/enroll/listforalloc/${offset}/20${str}`)
    },
    // 审核通过
    workOff(workId) {
        return instance.get(`${host}/admin/work/del/${workId}`)
    },
    // 审核失败
    workOn(workId) {
        return instance.get(`${host}/admin/work/on/${workId}`)
    }
}