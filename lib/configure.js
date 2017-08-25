"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = exports.config = {};

/**
 * 配置
 * @param store
 * @param dispatch
 */
var configure = exports.configure = function configure(_ref) {
  var store = _ref.store,
      dispatch = _ref.dispatch;


  config.store = store;
  config.dispatch = dispatch;
};