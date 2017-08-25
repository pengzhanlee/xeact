"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatchEvent = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatchEvent = exports.dispatchEvent = function dispatchEvent(context, eventName) {
    var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var eventMeta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


    var event = new CustomEvent(eventName, (0, _assign2.default)({
        detail: detail
    }), detail, eventMeta);

    _reactDom2.default.findDOMNode(context).parentNode.dispatchEvent(event);
};