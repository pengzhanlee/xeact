import ReactDOM from "react-dom";
import {attrFlag, componentNamespace} from "./identifiers";

/**
 * TODO: 通过解析树获取而非dom关系
 * node === self
 * parent === self ce.
 * parent.parent === parent root.
 * parent.parent.parent === parent ce.
 * 获取父节点
 * @param context
 * @return {*}
 */
export function getParent(context){
    const node = ReactDOM.findDOMNode(context);

    const targetContainer = node.parentNode.parentNode;

    const id = targetContainer.parentNode.getAttribute(attrFlag);

    return {
        customElement: targetContainer.parentNode,
        container: targetContainer,
        id: id,
    }
}

/**
 * 是否存在某种自定义标签的子代元素
 * @param context
 * @param tagName
 * @return {boolean}
 */
export function hasChildOfTag(context, tagName) {
    const node = ReactDOM.findDOMNode(context);
    const children = node.children;

    for(const child of children) {
        if(child.nodeName === `${componentNamespace}-${tagName}`.toUpperCase()) {
            return true;
        }
    }

    return false;
}

/**
 * 父元素是否为某种ce
 * @param context
 * @param tagName
 * @return {boolean}
 */
export function parentIsTag(context, tagName) {
    const parent = getParent(context);

    if(parent.customElement) {
        console.log(parent.customElement.nodeName, tagName);
        return parent.customElement.nodeName === `${componentNamespace}-${tagName}`.toUpperCase();
    }

    return false;
}
