'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.attrToProp = exports.attrsToProps = exports.attrNameParser = exports.attrValueGuesser = exports.isAttrIgnored = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.observed = observed;

var _identifiers = require('./identifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ignores = ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'itemprop', 'lang', 'slot', 'spellcheck', 'style', 'tabindex', 'title'];

/**
 * 需要保留的属性
 * @param attr
 * @returns {boolean}
 */
/**
 * 不解析的属性
 * HTML 全局属性、原样保留
 * see: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
var isAttrIgnored = exports.isAttrIgnored = function isAttrIgnored(attr) {

    // 过滤 DOM Level 0 事件
    if (/^on\w+$/i.test(attr) && window.hasOwnProperty(attr)) {
        return true;
    }

    return ignores.includes(attr);
};

/**
 * 属性值解析
 * @param attrValue
 * @returns {*}
 */
var attrValueGuesser = exports.attrValueGuesser = function attrValueGuesser(attrValue) {
    // if( (attr.startsWith('\'') && attr.endsWith('\'')) || (attr.startsWith('"') && attr.endsWith('"'))){
    //     // string
    //     return attr.replace(/^["']/, "").replace(/["']$/, "");
    // }

    if (!attrValue) return {
        // 模仿原生
        type: String,
        value: ''
    };

    var guess = {
        type: null,
        value: null
    };

    try {
        // standard JSON / Number
        var result = JSON.parse(attrValue);
        guess.value = result;

        if (!isNaN(result)) {
            guess.type = Number;
        } else {
            guess.type = JSON;
        }
    } catch (e) {
        if (/^[\s\n\r]*function\s*\(.*?\)\s*\{/.test(attrValue)) {
            // function

            var matcher = attrValue.match(/function\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}/);
            // argument string list

            var args = matcher[1];

            var body = matcher[2];

            args = args.split(',');

            guess.value = new (Function.prototype.bind.apply(Function, [null].concat((0, _toConsumableArray3.default)(args), [body])))();
            guess.type = Function;
        } else {
            // non-standard JSON
            try {
                var _result = new Function('return ' + attrValue)();

                // chrome 中, 如果一个属性值与某个元素的 id 相等
                // 则此处会被解析为 element
                if (!_result instanceof HTMLElement) {
                    guess.value = _result;
                    guess.type = JSON;
                }
            } catch (e) {
                // console.error('参数所有数据类型推断错误，请检查参数正确性...', attr, e);
                // String 为第一要素，此处不能推导失败
            }
        }
    }

    if (!guess.type) {
        guess.type = String;
        guess.value = attrValue;
    }

    return guess;
};

/**
 * 属性名解析
 * @param attrName
 */
var attrNameParser = exports.attrNameParser = function attrNameParser(attrName) {
    return attrName.replace(/^(x|data)[-_:]/i, '').replace(/[-_:](.)/g, function (x, chr) {
        return chr.toUpperCase();
    });
};

/**
 * 解析 Attributes 为 props
 * @param attributes
 * @returns {{}}
 */
var attrsToProps = exports.attrsToProps = function attrsToProps(attributes) {
    var props = {};
    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];

        var _attrToProp = attrToProp(attribute.name, attribute.value),
            key = _attrToProp.key,
            prop = _attrToProp.prop;

        props[key] = prop;
    }

    return props;
};

/**
 * 解析 attr 为 prop
 * @param originAttrName
 * @param attrValue
 * @returns {{key, prop: string}}
 */
var attrToProp = exports.attrToProp = function attrToProp(originAttrName, attrValue) {

    var key = void 0,
        prop = void 0;

    if (isAttrIgnored(originAttrName)) {
        key = originAttrName;
        prop = attrValue;
    } else {
        key = attrNameParser(originAttrName);
        prop = attrValueGuesser(attrValue).value;
    }

    return { key: key, prop: prop };
};

/**
 * 记录可观察的 prop
 * 与 attr 映射
 * @param propTypes
 * @param key
 * @param property
 */
function observed(propTypes, key, property) {

    var existsObserved = propTypes[_identifiers.observedSymbol] || [];

    key = key.replace(/[A-Z]/g, function (c) {
        return '-' + c.toLowerCase();
    });

    (0, _defineProperty2.default)(propTypes, _identifiers.observedSymbol, {
        value: existsObserved.concat(key),
        configurable: true,

        // 复制有效
        enumerable: true
    });
}