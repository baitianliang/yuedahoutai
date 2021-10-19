"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = _interopRequireDefault(require("../js/common"));

var _base_axios = _interopRequireDefault(require("../js/base_axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var instance = _base_axios["default"].instance;

var Qs = require('qs');

var _default = {
  // 报名列表
  getUserList: function getUserList(offset, limit, params) {
    params = Qs.stringify(params) ? "&".concat(Qs.stringify(params)) : '';
    return instance.get("".concat(_common["default"], "/admin/user/list/").concat(offset, "/").concat(limit, "?roleId=1").concat(params));
  },
  // // 报名详情
  // detailEnroll(id) {
  //     return instance.get(`${host}/admin/user/detail/${id}`)
  // },
  // 报名详情
  updateEnroll: function updateEnroll(form) {
    return instance.post("".concat(_common["default"], "/admin/user/update"), Qs.stringify(form));
  },
  // 修改密码
  changePassword: function changePassword(form) {
    return instance.post("".concat(_common["default"], "/admin/user/pwd"), Qs.stringify(form));
  }
};
exports["default"] = _default;