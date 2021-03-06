/**
 * 递归标记 _webComponentTemp
 * @param el
 * @param reverse 反转标记
 */
import ReactDOM from "react-dom";
import {childrenAttrTag, childrenAttrValue} from "../identifiers";

export const markTemp = (el, reverse = false) => {
  if (el) {
    el._webComponentTemp = !reverse;
    // if (el.children && el.children.length) {
    //     for (let i = 0, j = el.children.length; i < j; i++) {
    //         let child = el.children[i];
    //         markTemp(child, reverse);
    //     }
    // }
  }
};

/**
 * 获取 customElement 的子元素
 * 对与容器类组件，需要在适当的时机插入组件
 * @param el
 * @returns {DocumentFragment}
 */
export let getChildren = (el) => {
  let fragment = document.createDocumentFragment();
  // TODO: text node
  while (el.childNodes.length) {
    let node = el.childNodes[0];
    markTemp(node);
    fragment.appendChild(node);
  }

  return fragment;
};

/**
 * 获取 CE 的容器
 * @param reactElement
 * @returns {*}
 */
export let getOperableContextRoot = (reactElement) => {
  let context = ReactDOM.findDOMNode(reactElement);

  if (!context) return null;

  const childrenAttr = context.getAttribute(childrenAttrTag);
  if (childrenAttr !== childrenAttrValue) {

    // reactElement 的容器在子元素 或 reactElement 不是容器类组件
    // 若 reactElement 不是容器类组件，则 querySelector 的结果为 null
    // 若 reactElement 存在多个嵌套后代容器类组件，则 querySelector 返回子代
    context = context.querySelector(`[${childrenAttrTag}=${childrenAttrValue}]`);
  } else {
    // reactElement 是容器本身
  }

  return context;
};

/**
 * 将组件的 className 由组件根元素移动到 CE
 * @param context
 */
export let raiseClassName = (context) => {
  const node = ReactDOM.findDOMNode(context);

  if (!node.className) return;

  const nodeClassNames = node.className.split(' ');
  const parentNode = node.parentNode;

  // 避免重复添加
  for (let className of context.movedClass) {
    parentNode.classList.remove(className);
  }

  for (let className of nodeClassNames) {
    parentNode.classList.add(className);
    context.movedClass.add(className);
    node.classList.remove(className);
  }
};


/**
 * 将组件的 className 由 CE 移动到组件根元素
 * @param context
 */
export let dropClassName = (context) => {
  const root = context.props.container;
  const node = ReactDOM.findDOMNode(context);
  const classList = root.classList;

  for (let className of classList) {
    root.classList.remove(className);
    node.classList.add(className);
  }
};
