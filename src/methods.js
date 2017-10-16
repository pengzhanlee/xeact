import {exposedSymbol, exposedGetterSetterSymbol} from "./identifiers";

export const EXPOSED_METHODS_ID_KEY = `__EXPOSED_METHODS_KEY`;

// instanceId 与 内部组件实例映射
const componentIdToInstance = new Map();

/**
 * 添加 instanceId 与内部组件实例映射
 * @param instanceId
 * @param instance
 */
export const addIdToInstanceRelation = (instanceId, instance) => {
    componentIdToInstance.set(instanceId, instance);
};


// // 避免重复的记录
// const recordedInstances = new WeakSet();
//
// // 记录 exposeId 与 instance 关系
// // exposeId: instance
// const exposeIdToInstanceMap = new Map();
//
// // 记录 instance Id 与 instance 关系
// // instanceId: instance
// const idToInstanceMap = new Map();
//
// // method 运行上下文
// const idToContextMap = new Map();
//
// let exposeId = 0;

/**
 * 暴露组件内部方法到 dom 方法
 *
 * 每个暴露方法的实例关联一个 exposeId
 * 使用 exposeIdToInstanceMap 记录 exposeId 与 内层 react instance 的关系
 * 使用 Component 关联 exposeId 与 instanceId， 从而穿透多个 HOC
 *
 * @param internalInstance 内部组件
 * @param root
 */
export let exposeMethods = (internalInstance, root) => {

    // FIXME: hack for react 16
    if(!internalInstance) return;

    const id = root._id;
    internalInstance = componentIdToInstance.get(id);

    if(!internalInstance) return;

    // const symbolInternalInstance = idToInstanceMap.get(id);

    // if(!symbolInternalInstance) {
    //     return;
    // }

    // const context = idToContextMap.get(id);

    // clear instance in map
    // idToInstanceMap.delete(id);

    // 映射普通方法到 dom
    let methodsList = internalInstance[exposedSymbol] || [];
    for (let method of methodsList) {
        // 绑定上下文
        root[method] = internalInstance[method];
    }

    // 映射 get / set 到 dom
    let getterSetterList = internalInstance[exposedGetterSetterSymbol] || [];
    for (let name of getterSetterList) {

        const get = internalInstance.__lookupGetter__(name);
        const set = internalInstance.__lookupSetter__(name);

        // 绑定上下文
        Object.defineProperty(root, name, {
            // get: get ? get.bind(context) : get,
            // set: set ? set.bind(context) : set,
            get,
            set
        });
    }

};


let recordBySymbol = (instance, name, symbol) => {
    instance[symbol] = instance[symbol] || new Set();
    instance[symbol] = instance[symbol].add(name);

    // // 一次记录即可找到索引
    // if(recordedInstances.has(instance)) {
    //     // return;
    // }
    //
    // recordedInstances.add(instance);
    //
    // // exposeId 自增后, 添加 exposeId 与 instance 关联
    // exposeIdToInstanceMap.set(++exposeId, instance);
    //
    // // 记录 exposeId 到 instance
    // instance[EXPOSED_METHODS_ID_KEY] = exposeId;
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

// /**
//  * 获取暴露过事件的实例
//  * @param exposedId
//  * @returns {V}
//  */
// export const getExposedInstance = (exposedId) => {
//     return exposeIdToInstanceMap.get(exposedId);
// };
//
// /**
//  * 添加 instance id 与 instance 的关联关系
//  * @param id
//  * @param instance
//  * @param context
//  * @param exposedId
//  */
// export const addIdToInstanceConnection = (id, instance, context, exposedId) => {
//     if(exposedId) {
//         exposeIdToInstanceMap.delete(exposedId);
//     }
//
//     idToContextMap.set(id, context);
//     idToInstanceMap.set(id, instance);
//
// };
