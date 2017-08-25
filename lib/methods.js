"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exposed = exports.exposeMethods = undefined;

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _identifiers = require("./identifiers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 暴露组件内部方法到 dom 方法
 * @param internalInstance 内部组件
 * @param root
 */
var exposeMethods = exports.exposeMethods = function exposeMethods(internalInstance, root) {
    var methodsList = internalInstance[_identifiers.exposedSymbol] || [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(methodsList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var method = _step.value;

            root[method] = internalInstance[method];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var getterSetterList = internalInstance[_identifiers.exposedGetterSetterSymbol] || [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(getterSetterList), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var name = _step2.value;

            (0, _defineProperty2.default)(root, name, {
                get: internalInstance.__lookupGetter__(name),
                set: internalInstance.__lookupSetter__(name)
            });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
};

var recordBySymbol = function recordBySymbol(instance, name, symbol) {
    instance[symbol] = instance[symbol] || new _set2.default();
    instance[symbol] = instance[symbol].add(name);
};

/**
 * 暴露方法到 dom api (仅记录)
 *
 * 注意:
 * 对于同时实现了 getter 和 setter 的组件
 * getter / setter 只能成对暴露
 * 即 只要暴露了 getter ，则 setter 也会暴露
 *
 * @param instance
 * @param name
 * @param descriptor
 */
var exposed = exports.exposed = function exposed(instance, name, descriptor) {

    if (descriptor.get || descriptor.set) {
        recordBySymbol(instance, name, _identifiers.exposedGetterSetterSymbol);
    }

    if (descriptor.value) {
        recordBySymbol(instance, name, _identifiers.exposedSymbol);
    }
};