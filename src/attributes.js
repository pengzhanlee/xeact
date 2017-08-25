/**
 * 不解析的属性
 * HTML 全局属性、原样保留
 * see: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
import {observedSymbol} from "./identifiers";

let ignores = [
    'accesskey',
    'class',
    'contenteditable',
    'contextmenu',
    'dir',
    'draggable',
    'dropzone',
    'hidden',
    'id',
    'itemprop',
    'lang',
    'slot',
    'spellcheck',
    'style',
    'tabindex',
    'title',
];

/**
 * 需要保留的属性
 * @param attr
 * @returns {boolean}
 */
export let isAttrIgnored = (attr) => {

    // 过滤 DOM Level 0 事件
    if (/^on\w+$/i.test(attr) && window.hasOwnProperty(attr)) {
        return true;
    }

    return ignores.includes(attr);
};

/**
 * 属性值解析
 * @param attrValue
 * @returns {*}
 */
export let attrValueGuesser = (attrValue) => {
    // if( (attr.startsWith('\'') && attr.endsWith('\'')) || (attr.startsWith('"') && attr.endsWith('"'))){
    //     // string
    //     return attr.replace(/^["']/, "").replace(/["']$/, "");
    // }

    if (!attrValue)
        return {
            // 模仿原生
            type: String,
            value: ''
        };

    let guess = {
        type: null,
        value: null,
    };

    try {
        // standard JSON / Number
        let result = JSON.parse(attrValue);
        guess.value = result;

        if (!isNaN(result)) {
            guess.type = Number;
        } else {
            guess.type = JSON;
        }

    } catch (e) {
        if (/^[\s\n\r]*function\s*\(.*?\)\s*\{/.test(attrValue)) {
            // function

            let matcher = attrValue.match(/function\s*\(([\s\S]*?)\)\s*\{([\s\S]*)\}/);
            // argument string list

            let args = matcher[1];

            let body = matcher[2];

            args = args.split(',');

            guess.value = new Function(...args, body);
            guess.type = Function;

        } else {
            // non-standard JSON
            try {
                let result = new Function(`return ${attrValue}`)();

                // chrome 中, 如果一个属性值与某个元素的 id 相等
                // 则此处会被解析为 element
                if(!(result instanceof HTMLElement)) {
                    guess.value = result;
                    guess.type = JSON;
                }
            } catch (e) {
                // console.error('参数所有数据类型推断错误，请检查参数正确性...', attr, e);
                // String 为第一要素，此处不能推导失败
            }
        }
    }

    if (!guess.type) {
        guess.type = String;
        guess.value = attrValue;
    }

    return guess;
};

/**
 * 属性名解析
 * @param attrName
 */
export let attrNameParser = (attrName) => {
    return attrName
        .replace(/^(x|data)[-_:]/i, '')
        .replace(/[-_:](.)/g, function (x, chr) {
            return chr.toUpperCase();
        });
};

/**
 * 解析 Attributes 为 props
 * @param attributes
 * @returns {{}}
 */
export let attrsToProps = (attributes) => {
    let props = {};
    for (let i = 0; i < attributes.length; i++) {
        let attribute = attributes[i];

        let {key, prop} = attrToProp(attribute.name, attribute.value);
        props[key] = prop;
    }

    return props;
};

/**
 * 解析 attr 为 prop
 * @param originAttrName
 * @param attrValue
 * @returns {{key, prop: string}}
 */
export let attrToProp = (originAttrName, attrValue) => {

    let key, prop;

    if(isAttrIgnored(originAttrName)) {
        key = originAttrName;
        prop = attrValue;
    }else {
        key = attrNameParser(originAttrName);
        prop = attrValueGuesser(attrValue).value;
    }

    return {key, prop};
};


/**
 * 记录可观察的 prop
 * 与 attr 映射
 * @param propTypes
 * @param key
 * @param property
 */
export function observed(propTypes, key, property) {

    let existsObserved = propTypes[observedSymbol] || [];

    key = key.replace(/[A-Z]/g, (c)=>{ return `-${c.toLowerCase()}` });

    Object.defineProperty(propTypes, observedSymbol, {
        value: existsObserved.concat(key),
        configurable: true,

        // 复制有效
        enumerable: true
    });

}
