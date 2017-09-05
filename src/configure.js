import {defaultComponentNamespace} from './identifiers';

export let config = {};

/**
 * 配置
 * @param store
 * @param dispatch
 * @param namespace
 */
export let configure = function ({
                                     store,
                                     dispatch,
                                     namespace = defaultComponentNamespace
                                 }) {

    config.store = store;
    config.dispatch = dispatch;
    config.namespace = namespace;
};
