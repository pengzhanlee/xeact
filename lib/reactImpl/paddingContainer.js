"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (component) {
    var _component$props = component.props,
        children = _component$props.children,
        _id = _component$props._id;

    var body = _reactDom2.default.findDOMNode(component.refs.body);
    if (children) {
        if (!body) {
            throw new Error("body ref not found, check component [" + (0, _common.getDisplayName)(component.constructor.getWrappedComponent()) + "]");
        }

        // debugger;

        // console.log(children)
        var childNodes = children.childNodes;

        childNodes.forEach(function (node) {
            node._webComponentTemp = false;
        });

        _reactDom2.default.findDOMNode(component.refs.body).appendChild(children);
    }
};

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _common = require("../utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];

/**
 * 填充 children 到容器组件
 * rules:
 * 1. isContainer = true
 * 2. a `body` ref in elements
 * @param component
 */