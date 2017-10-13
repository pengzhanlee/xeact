import reactConnector from './connector';
import logger from '../utils/logger';
import {findPropTypesFromInHOC, getDisplayName} from "../utils/react";
import paddingContainer from "./paddingContainer";
import {componentNamespace, observedSymbol, reactWebComponentDisplayName} from "../identifiers";


/**
 * 创建 React 组件为 WebComponents
 *
 * 职责：
 * 1. 装载子元素
 * 2. 记录可观察属性
 * 3. 发起到 WebComponent 的连接
 *
 * @param name 组件名
 * @param isContainer 容器组件
 * @returns {ReactWebComponentFactory}
 * @constructor
 */
export function register(name, {
    isContainer = false
} = {}) {

    return function ReactWebComponentFactory(WrappedComponent) {

        WrappedComponent.propTypes = WrappedComponent.propTypes || {};

        const displayName = `${reactWebComponentDisplayName}(${getDisplayName(WrappedComponent)})`;

        class WebComponentsHOC extends WrappedComponent {

            static displayName = `${displayName}`;

            static getWrappedComponent() {
                return WrappedComponent;
            }

            _id = this.props._id;

            componentWillMount(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentWillMount`);
                super.componentWillMount && super.componentWillMount(...args);
            }

            componentDidMount(...args) {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - componentDidMount`);

                // 容器类组件装载
                if (isContainer) {
                    paddingContainer(this);
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
                super.componentDidUpdate && super.componentDidUpdate(...args);
            }


            render() {
                logger.debug(`React Lifecycle - ${displayName} - _${logId(this._id)}_ - render`);
                return super.render();
            }

        }



        // let observedAttributes = (WrappedComponent.observedAttributes = WrappedComponent.propTypes[observedSymbol] || []);

        // parse observedAttributes

        let ComponentPropTypes = findPropTypesFromInHOC(WrappedComponent);

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
