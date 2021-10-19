import host from '../js/common'
import axios from 'axios'

import baseAxios from '../js/base_axios'
let instance = baseAxios.instance
const Qs = require('qs');

export default {
    // 专家列表
    getExpertList(offset, form) {
        let str = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/admin/user/list/${offset}/20${str}?roleId=3&userType=3`)
    },
    // 省份列表
    getProvinceList() {
        return axios.get(`${host}/public/area/province/list`)
    },
    // 市区列表
    getCityList(provinceId) {
        return axios.get(`${host}/public/area/city/list/${provinceId}`)
    },
    // 县区列表
    getDistrictList(cityId) {
        return axios.get(`${host}/public/area/district/list/${cityId}`)
    },
    // 修改专家信息
    editTeacher(form) {
        return instance.post(`${host}/admin/teacher/update`, Qs.stringify(form))
    },
    // 添加专家
    addTeacher(form) {
        return instance.post(`${host}/admin/teacher/add`, Qs.stringify(form))
    },
    // 增加权限
    addRole(userId) {
        return instance.get(`${host}/admin/user/role/delete/${userId}/3`)
    },
    // 教师列表
    getTeacherList(offset, form) {
        let str = Qs.stringify(form) ? `&${Qs.stringify(form)}` : ''
        return instance.get(`${host}/admin/user/list/${offset}/20?roleId=3&userType=31${str}`)
    },
}