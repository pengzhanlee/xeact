import ReactDOM from "react-dom";
import {componentNamespace} from "./identifiers";

/**
 * TODO: 通过解析树获取而非dom关系
 * 获取父节点
 * @param context
 * @return {{customElement: Node | SVGElementInstance, root: *, id: string|*}}
 */
export let getParent = (context) => {
    const node = ReactDOM.findDOMNode(context);
    const target = node.parentNode.parentNode.parentNode;

    return {
        customElement: target,
        root: target._reactElement.__child,
        id: target._id,
    }
};

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
