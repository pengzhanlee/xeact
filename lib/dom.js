"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 递归标记 _webComponentTemp
 * @param el
 */
var markTemp = function markTemp(el) {
    if (el) {
        el._webComponentTemp = true;
        if (el.children && el.children.length) {
            for (var i = 0, j = el.children.length; i < j; i++) {
                var child = el.children[i];
                markTemp(child);
            }
        }
    }
};

/**
 * 获取 customElement 的子元素
 * 对与容器类组件，需要在适当的时机插入组件
 * @param el
 * @returns {DocumentFragment}
 */
var getChildren = exports.getChildren = function getChildren(el) {
    var fragment = document.createDocumentFragment();
    while (el.children.length) {
        var node = el.children[0];
        markTemp(node);
        fragment.appendChild(node);
    }

    return fragment;
};