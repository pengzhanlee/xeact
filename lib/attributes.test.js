'use strict';

var _getOwnPropertySymbols = require('babel-runtime/core-js/object/get-own-property-symbols');

var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _attributes = require('./attributes');

var _identifiers = require('./identifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('isAttrIgnored()', function () {

    test('ignored attr', function () {
        expect((0, _attributes.isAttrIgnored)('id')).toBe(true);
    });

    test('not ignored attr', function () {
        expect((0, _attributes.isAttrIgnored)('header')).toBe(false);
    });

    test('DOM Level 0 Event', function () {
        global['onclick'] = true;
        expect((0, _attributes.isAttrIgnored)('onclick')).toBe(true);
    });

    test('DOM Level 0 Event, 仅满足字符特征', function () {
        delete global['onclick'];
        expect((0, _attributes.isAttrIgnored)('onclick')).toBe(false);
    });
});

describe('attrValueGuesser & attrNameParser', function () {

    test('自然数', function () {
        var guess = (0, _attributes.attrValueGuesser)('285');
        expect(guess.value).toBe(285);
        expect(guess.type).toBe(Number);
    });

    test('浮点数', function () {
        expect((0, _attributes.attrValueGuesser)('28.5').value).toBe(28.5);
    });

    test('带符号', function () {
        expect((0, _attributes.attrValueGuesser)('-28.5').value).toBe(-28.5);
    });

    test('科学计数', function () {
        expect((0, _attributes.attrValueGuesser)('1.2e4').value).toBe(12000);
    });

    test('standard JSON', function () {
        expect((0, _attributes.attrValueGuesser)((0, _stringify2.default)({
            field1: 1,
            filed2: 'string'
        })).value).toEqual({
            field1: 1,
            filed2: 'string'
        });
    });

    test('non-standard JSON (JSON Object)', function () {
        expect((0, _attributes.attrValueGuesser)('{\n            field1: 1,\n            filed2: \'string\',\n        }').value).toEqual({
            field1: 1,
            filed2: 'string'
        });
    });

    test('String', function () {
        expect((0, _attributes.attrValueGuesser)('aqr-123').value).toBe('aqr-123');
    });

    test('Function', function () {
        expect((0, _attributes.attrValueGuesser)(' function() {\n            console.log(3434)\n        } ').type).toBe(Function);
    });

    test('non-value', function () {
        var guess = (0, _attributes.attrValueGuesser)('');
        expect(guess.type).toBe(String);
        expect(guess.value).toBe('');
    });

    test('parse attribute name', function () {
        expect((0, _attributes.attrNameParser)('some-thing')).toBe('someThing');
        expect((0, _attributes.attrNameParser)('something')).toBe('something');
        expect((0, _attributes.attrNameParser)('data-something')).toBe('something');
    });
});

describe('属性转对象', function () {

    test('单个', function () {
        expect((0, _attributes.attrToProp)('attr', 3)).toEqual({
            key: 'attr',
            prop: 3
        });
    });

    test('原生属性', function () {
        global['onclick'] = true;
        expect((0, _attributes.attrToProp)('onclick', 'foo();')).toEqual({
            key: 'onclick',
            prop: 'foo();'
        });
    });

    test('组', function () {
        expect((0, _attributes.attrsToProps)([{
            name: 'attr1',
            value: 'attr1'
        }, {
            name: 'attr2',
            value: 2
        }])).toEqual({
            attr1: 'attr1',
            attr2: 2
        });
    });
});

describe('observed', function () {

    var obj = {
        key1: 1,
        key2: 2,
        key3: 3,
        key4: 4
    };

    test('单个', function () {
        (0, _attributes.observed)(obj, 'key1');
        expect(obj[_identifiers.observedSymbol]).toEqual(['key1']);
    });

    test('多个', function () {
        (0, _attributes.observed)(obj, 'key3');
        expect(obj[_identifiers.observedSymbol]).toEqual(['key1', 'key3']);
    });

    test('原型链', function () {
        expect((0, _getOwnPropertySymbols2.default)(obj)).toEqual(expect.arrayContaining([_identifiers.observedSymbol]));
    });
});