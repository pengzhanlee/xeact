
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
