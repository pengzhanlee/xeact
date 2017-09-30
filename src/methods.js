import {exposedSymbol, exposedGetterSetterSymbol} from "./identifiers";

/**
 * 暴露组件内部方法到 dom 方法
 * @param internalInstance 内部组件
 * @param root
 */
export let exposeMethods = (internalInstance, root) => {

    // FIXME: hack for react 16
    if(!internalInstance) return;

    let methodsList = internalInstance[exposedSymbol] || [];
    for (let method of methodsList) {
        root[method] = internalInstance[method];
    }

    let getterSetterList = internalInstance[exposedGetterSetterSymbol] || [];
    for (let name of getterSetterList) {
        Object.defineProperty(root, name, {
            get: internalInstance.__lookupGetter__(name),
            set: internalInstance.__lookupSetter__(name),
        });
    }

};


let recordBySymbol = (instance, name, symbol) => {
    instance[symbol] = instance[symbol] || new Set();
    instance[symbol] = instance[symbol].add(name);
};

/**
 * 暴露方法到 dom api (仅记录)
 *
 * 注意:
 * 对于同时实现了 getter 和 setter 的组件
 * getter / setter 只能成对暴露
 * 即 只要暴露了 getter ，则 setter 也会暴露
 *
 * @param instance
 * @param name
 * @param descriptor
 */
export let exposed = (instance, name, descriptor) => {

    if (descriptor.get || descriptor.set) {
        recordBySymbol(instance, name, exposedGetterSetterSymbol);
    }

    if (descriptor.value) {
        recordBySymbol(instance, name, exposedSymbol);
    }

};
