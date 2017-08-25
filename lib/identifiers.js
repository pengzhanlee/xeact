'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attrFlag = exports.reactWebComponentDisplayName = exports.componentNamespace = exports.observedSymbol = exports.exposedGetterSetterSymbol = exports.exposedSymbol = undefined;

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 方法暴露注解
 * 组件内部方法 -> dom 方法
 * @type {*|Symbol}
 */
var exposedSymbol = exports.exposedSymbol = (0, _symbol2.default)('ReactWebComponentsExposedMethod');

// for Getter & Setter
var exposedGetterSetterSymbol = exports.exposedGetterSetterSymbol = (0, _symbol2.default)('ReactWebComponentsExposedGetterSetter');

/**
 * 属性观察注解
 * 标识可被观察的属性 (prop in React)
 * @type {*|Symbol}
 */
var observedSymbol = exports.observedSymbol = (0, _symbol2.default)('ReactWebComponentsObservedAttribute');

/**
 * CustomElement 命名空间
 * @type {string}
 */
var componentNamespace = exports.componentNamespace = 'x';

/**
 * WebComponent 包装组件 displayName  (调试用)
 * @type {string}
 */
var reactWebComponentDisplayName = exports.reactWebComponentDisplayName = 'CE';

/**
 * CE 的属性标识
 * @type {string}
 */
var attrFlag = exports.attrFlag = 'xeact';