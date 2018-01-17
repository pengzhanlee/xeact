import ReactDOM from 'react-dom';
import {getDisplayName} from "../utils/react";
import {markTemp} from "../dom";
import {childrenAttrTag, childrenAttrValue} from "../identifiers";

/**
 * 填充 children 到容器组件
 * rules:
 * 1. isContainer = true
 * 2. a `body` x-ref in elements
 * @param component
 * @return boolean 填充成功
 */
export default function (component) {
    let {children, _id} = component.props;
    // let body = ReactDOM.findDOMNode(component.refs.body);

    let node = ReactDOM.findDOMNode(component);

    // TODO: 10.26 已修复待验证
    //
    // 可能存在 render 中 return null 的组件
    // 目前不可恢复渲染
    if(!node) return false;

    let body = node.querySelector(`[${childrenAttrTag}=${childrenAttrValue}]`) || ( node.getAttribute(childrenAttrTag) === childrenAttrValue ? node : null );

    if (children) {
        if (!body) {
            console.error(`'${childrenAttrValue}' ${childrenAttrTag} not found in a container Component, please check [${getDisplayName(component.constructor.getWrappedComponent())}]`);
            return false;
        }

        let {childNodes} = children;
        childNodes.forEach((node) => {
            markTemp(node, true);
        });
        body.appendChild(children);

        component.__child = body;

        return true;
    }

    return false;
}
