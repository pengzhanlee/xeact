import {defaultComponentNamespace} from './identifiers';

export let config = {
    namespace: defaultComponentNamespace
};

/**
 * 配置
 * @param store
 * @param dispatch
 * @param namespace
 */
export let configure = function ({
                                     store,
                                     dispatch,
                                     namespace
                                 }) {

    config.store = store;
    config.dispatch = dispatch;
    config.namespace = namespace;
};
