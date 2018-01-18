import reactConnector from './connector';
import logger from '../utils/logger';
import {findPropTypesFromHOC, getDisplayName} from "../utils/react";
import paddingContainer from "./paddingContainer";
import {componentNamespace, observedSymbol, reactWebComponentDisplayName} from "../identifiers";
import {raiseClassName as raiseClassNameFn} from './dom';
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

        WrappedComponent.propTypes = WrappedComponent.propTypes || {};

        const displayName = `${reactWebComponentDisplayName}(${getDisplayName(WrappedComponent)})`;

        class WebComponentsHOC extends WrappedComponent {

            static displayName = `${displayName}`;

            static tagName = name;

            static getWrappedComponent() {
                return WrappedComponent;
            }

            _id = this.props._id;

            // raiseClassName, 过程中被移出的 className
            movedClass = raiseClassName ? new Set() : undefined;

            componentWillMount(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentWillMount`);
                super.componentWillMount && super.componentWillMount(...args);
            }

            componentDidMount(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidMount`);

                // 容器类组件装载
                if (isContainer) {
                    this.__HasAppendChild = paddingContainer(this);
                }

                // moveStyles(this);

                if(raiseClassName) {
                    raiseClassNameFn(this);
                }

                super.componentDidMount && super.componentDidMount(...args);

                this.didMount = true;
            }

            componentWillUnmount(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentWillUnmount`);
                super.componentWillUnmount && super.componentWillUnmount(...args);
            }

            componentWillUpdate(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentWillUpdate`);
                super.componentWillUpdate && super.componentWillUpdate(...args);
            }

            componentDidUpdate(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidUpdate`);

                // 更新后，对于失败的 paddingContainer 进行重试
                if (isContainer && !this.__HasAppendChild) {
                    this.__HasAppendChild = paddingContainer(this);
                }

                if(raiseClassName) {
                    raiseClassNameFn(this);
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



        // let observedAttributes = (WrappedComponent.observedAttributes = WrappedComponent.propTypes[observedSymbol] || []);

        // parse observedAttributes

        let ComponentPropTypes = findPropTypesFromHOC(WrappedComponent);

        let observedAttributes = (WrappedComponent.observedAttributes = ComponentPropTypes[observedSymbol] || []);

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

        reactConnector(`${componentNamespace}-${name}`, WebComponentsHOC);

        logger.info(`register *${componentNamespace}-${name}* with attributes ( ${observedAttributes.length ? observedAttributes.join(' | ') : 'null'} ) observed...`);
        return WebComponentsHOC;
    }

}

let logId = (id) => {
    return id || 'native';
};
