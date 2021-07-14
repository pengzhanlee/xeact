import React from "react";
import reactConnector from './connector';
import logger from '../utils/logger';
import {findPropTypesFromHOC, getDisplayName} from "../utils/react";
import paddingContainer from "./paddingContainer";
import {componentNamespace, observedSymbol, reactWebComponentDisplayName} from "../identifiers";
import {dropClassName, raiseClassName as raiseClassNameFn} from './dom';
import {moveStyles} from "../styles";


/**
 * 创建 React 组件为 WebComponents
 *
 * 职责：
 * 1. 装载子元素
 * 2. 记录可观察属性
 * 3. 发起到 WebComponent 的连接
 *
 * @param {string} name 组件名
 * @param {boolean} isContainer 容器组件
 * @param {boolean} raiseClassName 提升组件 className 层级关系
 * 由于大多数三方 UI 框架总是由一个根元素包裹 (早期 React 要求),
 * 由 xeact 解析过后会形成如: <x-tag><div>xx</div></x-tag> 的结构,
 * 在这种前提下，如果这样的三方 UI 框架，使用了 flex 布局样式，或者使用子代选择器(child combinator)来描述样式，
 * 那么对于被嵌套的子标签样式会失效，其结构如下:
 * <x-parent>
 *     <div class="parent">
 *         <x-child>
 *             <div class="child"></div>
 *         </x-child>
 *     </div>
 * </x-parent>
 * 框架中所定义的 css 如下:
 * .parent>.child{...}
 * 样式在此种情况下不会生效。
 * 通过 raiseClassName， 将组件的 class 属性提升到 CustomElement 之上来解决这一问题
 *
 * @returns {ReactWebComponentFactory}
 * @constructor
 */
export function register(name, {
  isContainer = false,
  raiseClassName = false,
} = {}) {

  return function ReactWebComponentFactory(WrappedComponent) {
    // console.dir(WrappedComponent);

    // class WrappedComponentClass extends React.Component {
    //   render() {
    //     return <WrappedComponent {{...this.props}}/>
    //   }
    // }

    WrappedComponent.propTypes = WrappedComponent.propTypes || {};

    const displayName = `${reactWebComponentDisplayName}(${getDisplayName(WrappedComponent)})`;

    /*
        class WebComponentsHOC extends WrappedComponent {

          static displayName = `${displayName}`;

          static tagName = name;

          static getWrappedComponent() {
            return WrappedComponent;
          }

          _id = this.props._id;

          // raiseClassName, 过程中被移出的 className
          movedClass = raiseClassName ? new Set() : undefined;

          componentDidMount(...args) {
            logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidMount`);

            // 容器类组件装载
            if (isContainer) {
              this.__HasAppendChild = paddingContainer(this);
            }

            if (raiseClassName) {
              raiseClassNameFn(this);
            } else {
              // style 位置应该与 class 位置保持一致
              // 对于未提升 className 的标签, 移动 style 属性到真正的容器 ref=body
              // TODO: 样式应该如何控制更合理
              moveStyles(this);
              dropClassName(this);
            }

            super.componentDidMount && super.componentDidMount(...args);

            this.didMount = true;
          }

          componentDidUpdate(...args) {
            logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidUpdate`);

            // 更新后，对于失败的 paddingContainer 进行重试
            if (isContainer && !this.__HasAppendChild) {
              this.__HasAppendChild = paddingContainer(this);
            }

            if (raiseClassName) {
              raiseClassNameFn(this);
            } else {
              moveStyles(this);
              dropClassName(this);
            }

            super.componentDidUpdate && super.componentDidUpdate(...args);
          }

          componentDidCatch(errorString, errorInfo) {
            logger.error(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - error: ${errorString} ${errorInfo}`);
          }

          render() {
            logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - render`);
            return super.render();
          }
        }

    */
    class WebComponentsHOC extends React.Component {

      static propTypes = WrappedComponent.propTypes;

      static displayName = `${displayName}`;

      static tagName = name;

      static getWrappedComponent() {
        return WrappedComponent;
      }

      _id = this.props._id;

      // raiseClassName, 过程中被移出的 className
      movedClass = raiseClassName ? new Set() : undefined;

      componentDidMount(...args) {
        logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidMount`);

        // 容器类组件装载
        if (isContainer) {
          this.__HasAppendChild = paddingContainer(this);
        }

        if (raiseClassName) {
          raiseClassNameFn(this);
        } else {
          // style 位置应该与 class 位置保持一致
          // 对于未提升 className 的标签, 移动 style 属性到真正的容器 ref=body
          // TODO: 样式应该如何控制更合理
          moveStyles(this);
          dropClassName(this);
        }

        super.componentDidMount && super.componentDidMount(...args);

        this.didMount = true;
      }

      componentDidUpdate(...args) {
        logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidUpdate`);

        // 更新后，对于失败的 paddingContainer 进行重试
        if (isContainer && !this.__HasAppendChild) {
          this.__HasAppendChild = paddingContainer(this);
        }

        if (raiseClassName) {
          raiseClassNameFn(this);
        } else {
          moveStyles(this);
          dropClassName(this);
        }

        super.componentDidUpdate && super.componentDidUpdate(...args);
      }

      render() {
        return React.createElement(WrappedComponent, this.props);
      }
    }

    // let observedAttributes = (WrappedComponent.observedAttributes = WrappedComponent.propTypes[observedSymbol] || []);

    // parse observedAttributes

    let ComponentPropTypes = findPropTypesFromHOC(WrappedComponent);

    // let observedAttributes = (WrappedComponent.observedAttributes = ComponentPropTypes[observedSymbol] || []);
    let observedAttributes = Object.keys(WrappedComponent.observedAttributes || {});
    console.log(observedAttributes);
    // let observedProps = [];
    // try {
    //     /*
    //     优先从 mui 中获取
    //      */
    //     debugger;
    //     observedProps = WrappedComponent.Naked.propTypes[observedSymbol] || [];
    // }catch(e) {
    //     observedProps = WrappedComponent.propTypes[observedSymbol] || [];
    // }
    // let observedAttributes = (WrappedComponent.observedAttributes = observedProps);

    reactConnector(`${componentNamespace}-${name}`, WebComponentsHOC, observedAttributes);

    logger.info(`register *${componentNamespace}-${name}* with attributes ( ${observedAttributes.length ? observedAttributes.join(' | ') : 'null'} ) observed...`);
    return WebComponentsHOC;
  }

}

let logId = (id) => {
  return id || 'native';
};
