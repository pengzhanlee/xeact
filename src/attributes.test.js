import {isAttrIgnored, attrValueGuesser, attrNameParser, attrToProp, attrsToProps, observed} from './attributes';
import {observedSymbol} from "./identifiers";

describe('isAttrIgnored()', () => {

    test('ignored attr', () => {
        expect(isAttrIgnored('id')).toBe(true);
    });

    test('not ignored attr', () => {
        expect(isAttrIgnored('header')).toBe(false);
    });


    test('DOM Level 0 Event, 仅满足字符特征', () => {
        expect(isAttrIgnored('onclick')).toBe(false);
    });

    test('DOM Level 0 Event', () => {
        global['onclick'] = true;
        expect(isAttrIgnored('onclick')).toBe(true);
    });

});

describe('attrValueGuesser & attrNameParser', () => {

    test('自然数', () => {
        let guess = attrValueGuesser('285');
        expect(guess.value).toBe(285);
        expect(guess.type).toBe(Number);
    });

    test('浮点数', () => {
        expect(attrValueGuesser('28.5').value).toBe(28.5);
    });

    test('带符号', () => {
        expect(attrValueGuesser('-28.5').value).toBe(-28.5);
    });

    test('科学计数', () => {
        expect(attrValueGuesser('1.2e4').value).toBe(12000);
    });

    test('standard JSON', () => {
        expect(attrValueGuesser(JSON.stringify({
            field1: 1,
            filed2: 'string',
        })).value).toEqual({
            field1: 1,
            filed2: 'string',
        });
    });

    test('non-standard JSON (JSON Object)', () => {
        expect(attrValueGuesser(`{
            field1: 1,
            filed2: 'string',
        }`).value).toEqual({
            field1: 1,
            filed2: 'string',
        });
    });

    test('String', () => {
        expect(attrValueGuesser(`aqr-123`).value).toBe(`aqr-123`);
    });

    test('Function', () => {
        expect(attrValueGuesser(` function() {
            console.log(3434)
        } `).type).toBe(Function);
    });

    test('non-value', () => {
        let guess = attrValueGuesser('');
        expect(guess.type).toBe(String);
        expect(guess.value).toBe('');
    });

    test('parse attribute name', () => {
        expect(attrNameParser('some-thing')).toBe('someThing');
        expect(attrNameParser('something')).toBe('something');
        expect(attrNameParser('data-something')).toBe('something');
    });

});

describe('属性转对象', () => {

    test('单个', () => {
        expect(attrToProp('attr', 3)).toEqual({
            key: 'attr',
            prop: 3
        });
    });

    test('原生属性', () => {
        global['onclick'] = true;
        expect(attrToProp('onclick', 'foo();')).toEqual({
            key: 'onclick',
            prop: 'foo();'
        });
    });

    test('组', () => {
        expect(attrsToProps([{
            name: 'attr1',
            value: 'attr1',
        }, {
            name: 'attr2',
            value: 2,
        }])).toEqual({
            attr1: 'attr1',
            attr2: 2
        });
    });

});

describe('observed', () => {

    let obj = {
        key1: 1,
        key2: 2,
        key3: 3,
        key4: 4,
    };

    test('单个', () => {
        observed(obj, 'key1');
        expect(obj[observedSymbol]).toEqual(['key1']);
    });

    test('多个', () => {
        observed(obj, 'key3');
        expect(obj[observedSymbol]).toEqual(['key1', 'key3']);
    });

    test('原型链', () => {
        expect(Object.getOwnPropertySymbols(obj)).toEqual(expect.arrayContaining([ observedSymbol ]));
    });

});
