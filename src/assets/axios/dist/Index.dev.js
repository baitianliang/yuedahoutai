"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = _interopRequireDefault(require("../js/common"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import baseAxios from '../js/base_axios'
// let instance = baseAxios.instance
var Qs = require('qs');

var _default = {
  // 每日报名人数
  getOrderDate: function getOrderDate() {
    return _axios["default"].get("".concat(_common["default"], "/admin/stat/order/date"));
  },
  // 省份报名人数
  getOrderProvince: function getOrderProvince() {
    return _axios["default"].get("".concat(_common["default"], "/admin/stat/order/province"));
  },
  // 省份未审核人数
  getAllocList: function getAllocList() {
    return _axios["default"].get("".concat(_common["default"], "/admin/stat/alloc/list"));
  },
  // 注册人数
  getStatUser: function getStatUser() {
    return _axios["default"].get("".concat(_common["default"], "/admin/stat/user"));
  },
  // 报名相关人数
  getStatEnroll: function getStatEnroll(params) {
    params = Qs.stringify(params) ? "?".concat(Qs.stringify(params)) : '';
    return _axios["default"].get("".concat(_common["default"], "/admin/stat/enroll").concat(params));
  }
};
exports["default"] = _default;