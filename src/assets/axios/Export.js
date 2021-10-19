import host from '../js/common'

import baseAxios from '../js/base_axios'
// import axios from 'axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 获取导出数据信息
    getExportDate(activityId, activityScoreNum) {
        return instance.get(`${host}/admin/stat/score/result?activityId=${activityId}&scoreNum=${activityScoreNum}`)
    },
}