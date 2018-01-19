import ReactDOM from 'react-dom';
import {findWrappedComponentFromHOC} from "./utils/react";

const styleEl = document.createElement('style');
styleEl.setAttribute('type', 'text/css');
document.head.appendChild(styleEl);

/**
 * 设置自定义标签的初始显示模式
 * @param elementName
 * @param ReactComponent
 */
export const registerTagDisplayMode = (elementName, ReactComponent) => {
    let displayMode = findWrappedComponentFromHOC(ReactComponent).DISPLAY_MODE || 'block';
    styleEl.innerHTML += `${elementName}{display:${displayMode};}`
};

/**
 * 移动样式， 从 CE 移动到 React 渲染根节点 (下移)
 *
 * 问题
 *
 *      为什么?
 *      1. CE 调用者无法直接通过 class, style 控制组件样式
 *
 *      副作用?
 *      1. 规则依赖: 用于 js 操作的 class 和用于样式控制的 class 应分离
 *      2. 规则依赖: 不能使用 id 给 CE 添加样式
 *
 *
 *
 * @param component
 */
export const moveStyles = (component) => {

    const root = component.props.container;
    const node = ReactDOM.findDOMNode(component);

    const styles = root.getAttribute('style');


    if(styles && node) {
        root.removeAttribute('style');
        node.setAttribute('style', styles);
    }

};
