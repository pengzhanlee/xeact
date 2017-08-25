import React from 'react';
import ReactDOM from 'react-dom';
import {config} from '../configure';

/**
 * React Component 创建与更新
 *
 * 对于 react, 在同一容器中，创建与更新具有一致行为
 * https://facebook.github.io/react/docs/rendering-elements.html#updating-the-rendered-element
 * @param root
 * @param Component
 * @param props
 * @returns {*}
 */
const createAndUpdateReact = (root, Component, props = {}) => {
    const {store = {}, dispatch} = config;
    props.store = props.store || store;
    props.dispatch = props.dispatch || dispatch;

    const element = React.createElement(Component, props);
    root._internalInstance = element;

    return ReactDOM.render(element, root);
};


export {createAndUpdateReact as creator};

export {createAndUpdateReact as updater};
