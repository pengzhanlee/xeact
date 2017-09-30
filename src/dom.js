/**
 * 递归标记 _webComponentTemp
 * @param el
 * @param reverse 反转标记
 */
export const markTemp = (el, reverse = false) => {
    if(el) {
        el._webComponentTemp = !reverse;
        if (el.children && el.children.length) {
            for(let i = 0, j = el.children.length; i < j; i++) {
                let child = el.children[i];
                markTemp(child, reverse);
            }
        }
    }
};

/**
 * 获取 customElement 的子元素
 * 对与容器类组件，需要在适当的时机插入组件
 * @param el
 * @returns {DocumentFragment}
 */
export let getChildren = (el) => {
    let fragment = document.createDocumentFragment();
    // TODO: text node
    while (el.childNodes.length) {
        let node = el.childNodes[0];
        markTemp(node);
        fragment.appendChild(node);
    }

    return fragment;
};
