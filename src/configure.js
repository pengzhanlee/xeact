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
                                 }) {

  config.store = store;
  config.dispatch = dispatch;
};
