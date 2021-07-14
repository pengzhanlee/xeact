import {getChildren} from "../src/reactImpl/dom";

describe("dom", () => {
    const dom = document.createElement('dv');
    dom.innerHTML = `<div><span><a>xx</a></span></div>`;
    test('set _webComponentTemp for every children', () => {
        const fragment = getChildren(dom);

        const div = fragment.querySelector('div');
        expect(div._webComponentTemp).toBe(true);

        const span = div.querySelector('span');
        expect(span._webComponentTemp).toBe(undefined);

        const a = span.querySelector('a');
        expect(a._webComponentTemp).toBe(undefined);
    });

});
