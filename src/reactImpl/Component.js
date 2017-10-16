import React from 'react';
import {addIdToInstanceConnection, EXPOSED_METHODS_ID_KEY, getExposedInstance} from "../methods";

/**
 * 将 instanceId 与 暴露方法的实例关联
 */
function methodExpose() {
    const exposedId = this[EXPOSED_METHODS_ID_KEY];

    const exposedInstance = getExposedInstance(exposedId);

    if(exposedInstance) {
        const {_id: id} = this.props;

        addIdToInstanceConnection(id, exposedInstance, this, exposedId);
    }
}

export class PureComponent extends React.PureComponent {

    constructor(...args) {
        super(...args);
        this::methodExpose();
    }

}

/**
 * 组件基类, 所有基于本框架的组件均需要继承自该类
 */
export class Component extends React.Component {

    constructor(...args) {
        super(...args);
        this::methodExpose();
    }

}

