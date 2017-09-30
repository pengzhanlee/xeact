/**
 * 递归标记 _webComponentTemp
 * @param el
 */
const markTemp = (el) => {
    if(el) {
        el._webComponentTemp = true;
        if (el.children && el.children.length) {
            for(let i = 0, j = el.children.length; i < j; i++) {
                let child = el.children[i];
                markTemp(child);
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
    while (el.children.length) {
        let node = el.children[0];
        markTemp(node);
        fragment.appendChild(node);
    }

    return fragment;
};
