import React from 'react';
import {addIdToInstanceConnection, EXPOSED_METHODS_ID_KEY, getExposedInstance} from "../methods";


export class Component extends React.Component {

    constructor(...args) {
        super(...args);

        const exposedId = this[EXPOSED_METHODS_ID_KEY];

        const exposedInstance = getExposedInstance(exposedId);

        if(exposedInstance) {
            const {_id: id} = this.props;

            addIdToInstanceConnection(id, exposedInstance, exposedId);
        }
    }

}

