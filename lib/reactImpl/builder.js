'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updater = exports.creator = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _configure = require('../configure');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * React Component 创建与更新
 *
 * 对于 react, 在同一容器中，创建与更新具有一致行为
 * https://facebook.github.io/react/docs/rendering-elements.html#updating-the-rendered-element
 * @param root
 * @param Component
 * @param props
 * @returns {*}
 */
var createAndUpdateReact = function createAndUpdateReact(root, Component) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _config$store = _configure.config.store,
      store = _config$store === undefined ? {} : _config$store,
      dispatch = _configure.config.dispatch;

  props.store = props.store || store;
  props.dispatch = props.dispatch || dispatch;

  var element = _react2.default.createElement(Component, props);
  root._internalInstance = element;

  return _reactDom2.default.render(element, root);
};

exports.creator = createAndUpdateReact;
exports.updater = createAndUpdateReact;