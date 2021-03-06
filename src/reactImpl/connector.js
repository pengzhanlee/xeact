import React from 'react';
import ReactDOM from 'react-dom';
import {attrsToProps, attrToProp} from "../attributes";
import logger from '../utils/logger';
import {exposeMethods} from "../methods";
import {creator, updater} from "./builder";
import * as dom from "./dom";
import {attrFlag, childrenAttrTag, childrenAttrValue} from "../identifiers";
import {suuid} from '../utils/common';
import {registerTagDisplayMode} from "../styles";
import {getOperableContextRoot} from "./dom";
import {findWrappedComponentFromHOC, getDisplayName} from "../utils/react";

/**
 * React 连接器
 * 标准: Custom Elements v1
 * @see https://developers.google.com/web/fundamentals/getting-started/primers/customelements
 *
 * polyfill:
 * https://github.com/webcomponents/webcomponentsjs
 * https://github.com/WebReflection/document-register-element
 *
 * 测试标准：
 *
 * jQuery:
 *      操作: html / empty / append
 *      查询: find
 *
 * diff with v0:
 *
 * 1. The ability to extend by simply defining classes.
 * 2. It is possible to extend native components.
 * 3. Special methods are also slightly different from v0:
 *      the constructor is invoked instead of the createdCallback one
 *      connectedCallback is the new attachedCallback
 *      disconnectedCallback is the new detachedCallback
 *      attributeChangedCallback is sensitive to the public static list of attributes to be notified about
 *
 * @param elementName
 * @param ReactComponent
 */

const definedElements = new Set();

// 对与任意标签，都需要响应 style 和 class 的变动
const defaultObservedAttributes = ['style', 'class'];

const connector = (elementName, ReactComponent, observedAttributes = []) => {

  class NewElement extends HTMLElement {

    static observedAttributes = observedAttributes.concat(defaultObservedAttributes);

    /**
     * 组件连接标记
     * 当为 true， 下列条件同时满足
     * 1. 元素被插入到 dom
     * 2. 内部逻辑组件创建
     * 3. 子元素走完创建相关的全部生命周期
     *
     * 用于:
     * 1. 避免重复 connect (已知 Firefox / Edge) (connectedCallback)
     * 2. 避免属性变化修改到尚未完全创建的组件 (attributeChangedCallback)
     *
     * connectedCallback 且 React 创建标识
     * @type {boolean}
     */
    connected = false;

    /**
     * 临时元素标识
     * 解析子元素时产生的临时元素
     *
     * Notice:
     * 1. 当从容器组件获取子元素时，若子元素中包含自定义标签，则该子元素会中断容器组件的创建而先创建该子元素 (对子元素操作导致)
     * 2. 当子元素创建结束后，容器组件继续创建过程，创建中子元素将被清除 (dom变化被 MutationObserver 识别，disconnected 被执行)
     * 3. 容器组件 DidMount 后，将再次执行创建子元素 （到 ref === 'body' 的节点）的过程
     *
     * 由此:
     * 1. 在子元素获取过程中标记此为 true
     * 2. 在 CE 的各类生命周期方法中忽略此类元素
     *
     * @type {boolean}
     * @private
     */
    _webComponentTemp = false;

    /**
     * id
     * @type {string}
     * @private
     */
    _id = `${suuid()}`;

    /**
     * reactElement, 由 ReactDom 创建
     */
    _reactElement;

    /**
     * props
     */
    _props;

    get props() {
      return this._props;
    }

    set props(props) {
      throw new Error('Props can\'t be set directly...');
    }

    /**
     * 创建或<a href="#upgrades">升级</a>元素的一个实例。
     * 用于初始化状态、设置事件侦听器或<a href="#shadowdom">创建 Shadow DOM</a>。
     * 参见<a href="https://html.spec.whatwg.org/multipage/scripting.html#custom-element-conformance">规范</a>，
     * 了解可在  <code><span>constructor</span></code> 中完成的操作的相关限制。</td>
     * @param self
     */
    constructor() {
      super();
    }

    /**
     * 可连接
     *
     * 1. 忽略已经创建的组件
     * 2. 忽略临时节点
     *
     * @returns {boolean}
     */
    canConnect() {

      return !this.connected && !this._webComponentTemp;
    }

    /**
     * 元素每次插入到 DOM 时都会调用。
     * 用于运行安装代码，例如获取资源或渲染。
     * 一般来说，您应将工作延迟至合适时机执行。
     */
    connectedCallback() {
      if (!this.canConnect()) return;

      // for debug
      this.setAttribute(attrFlag, this._id);

      logger.info(`CE _${this._id}_ (${elementName}) connecting`);

      // props 解析
      this._props = attrsToProps(this.attributes);

      // 子元素解析
      this._props.children = dom.getChildren(this);

      this._props.container = this;
      this._props._id = this._id;

      // create react instance and render dom
      const reactElementPromise = creator(this, ReactComponent, this._props);

      reactElementPromise.then((renderedInstance) => {

        // react dom render

        this._reactElement = renderedInstance;
        this.connected = true;

        exposeMethods(this._reactElement, this);

        logger.info(`CE _${this._id}_ (${elementName}) connected`);
      });
    }

    /**
     * 属性添加、移除、更新或替换。
     * 解析器创建元素时，或者升级时，也会调用它来获取初始值。
     * 注：仅 observedAttributes 属性中列出的特性才会收到此回调。
     *
     * @param name
     * @param oldValue
     * @param newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (this.connected) {
        if (oldValue === newValue) return;
        logger.warn(`CE _${this._id}_ attributeChanged`, name, oldValue, '->', newValue);

        let {key, prop} = attrToProp(name, newValue);
        this._props[key] = prop;

        updater(this, ReactComponent, this._props).then((renderedInstance) => {
          // update react element with new instance
          this._reactElement = renderedInstance;
        });
      }
    }

    adoptedCallback() {

    }

    /**
     * 删除逻辑:
     * 1. 已连接
     * 2. 不是临时节点
     * 3. 无父节点
     *
     * doc:
     * 元素每次从 DOM 中移除时都会调用。
     * 用于运行清理代码（例如移除事件侦听器等）
     *
     * 移动元素也会进入此生命周期，如 document.body.appendChild( document.querySelector('x-button') )
     * 与真正删除逻辑不同是，被操作元素是否依然在文档中存在
     *  判断依据
     *  a) parentNode 删除为 null
     *  b) isConnected (Chrome) 删除为 false
     *
     *
     */
    disconnectedCallback() {

      // if(!this._id) return;

      // return;

      // if (this.isInvalid()) {
      //     return;
      // }
      //
      // if(!this.connected) return;

      if (this.parentNode) return;

      if (this._webComponentTemp) return;

      if (
        this.connected
        // &&
        // !this._webComponentTemp
        // &&
        // !this.parentNode
      ) {

        // let children = this.querySelectorAll(`[${attrFlag}]`);
        // for(let child of children) {
        //     child.remove();
        // }

        logger.info(`CE _${this._id}_ will disconnected`);

        ReactDOM.unmountComponentAtNode(this);
        // this.connected = false;

        logger.info(`CE _${this._id}_ disconnected`);
      }

    }

    /**
     * @override
     *
     * 内容控制
     * 针对 jQuery html / empty 等方法
     *
     * @param value
     * @returns {*}
     */
    set textContent(value) {

      let context = getOperableContextRoot(this._reactElement);

      if (context) {
        return context.textContent = value;
      }
    }

    /**
     * @override
     * 内容控制
     * 针对 native innerHTMl / jQuery html / empty 等方法
     *
     */
    get innerHTML() {

      let context = getOperableContextRoot(this._reactElement);

      if (context) {
        return context.innerHTML;
      }
    }

    /**
     * @override
     * 内容控制
     * 针对 native innerHTMl / jQuery html / empty 等方法
     *
     * @param value
     */
    set innerHTML(value) {

      let context = getOperableContextRoot(this._reactElement);

      if (context) {
        context.innerHTML = value;
      }
    }

    /**
     * @override
     *
     * 内容控制
     *
     * FIXME:
     * 在 React 16 中，不能重写
     * 初步推测与 ReactDOM.render 实现方式变更有关
     * 具体原因需验证
     *
     * @param args
     * @returns {*}
     */
    appendChild(...args) {
      if (this._reactElement) {
        let context = getOperableContextRoot(this._reactElement);
        if (context) {
          return context.appendChild.call(context, ...args);
        } else {
          return super.appendChild(...args);
        }
      } else {
        return super.appendChild(...args);
      }
    }

    /**
     *  -> React Component
     */
    setState() {
      if (this._reactElement) {
        this._reactElement.setState.apply(this._reactElement, arguments);
      }
    }

    /**
     *  -> React Component
     */
    forceUpdate() {
      if (this._reactElement) {
        this._reactElement.forceUpdate();
      }
    }

    get __xeactReactInstance() {
      return this._reactElement;
    }

  }

  // 注册标签样式
  registerTagDisplayMode(elementName, ReactComponent);

  /**
   * 这里发生了什么
   *
   * 模式一:
   *
   *      DOM 后加载 （如 ufs）
   *
   *      不需要在 `DOMContentLoaded` 之后定义组件
   *
   *
   * 模式二:
   *
   *      dom 随页面一同加载
   *
   *      需要 `DOMContentLoaded` 后定义组件
   *      否则 外层标签解析时无法获取内层子元素
   *
   *
   */
  document.addEventListener("DOMContentLoaded", function (event) {

    if (definedElements.has(elementName)) {
      throw new Error(`注册失败: 重复的标签名 ${elementName} 声明 在组件 ${getDisplayName(findWrappedComponentFromHOC(ReactComponent))}`);
    }

    definedElements.add(elementName);

    customElements.define(elementName, NewElement);

  });
};

export default connector;
