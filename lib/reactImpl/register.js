'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get7 = require('babel-runtime/helpers/get');

var _get8 = _interopRequireDefault(_get7);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.register = register;

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _ReactUtils = require('../utils/ReactUtils');

var _paddingContainer = require('./paddingContainer');

var _paddingContainer2 = _interopRequireDefault(_paddingContainer);

var _identifiers = require('../identifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 创建 React 组件为 WebComponents
 *
 * 职责：
 * 1. 装载子元素
 * 2. 记录可观察属性
 * 3. 发起到 WebComponent 的连接
 *
 * @param name 组件名
 * @param isContainer 容器组件
 * @returns {ReactWebComponentFactory}
 * @constructor
 */
function register(name) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$isContainer = _ref.isContainer,
        isContainer = _ref$isContainer === undefined ? false : _ref$isContainer;

    return function ReactWebComponentFactory(WrappedComponent) {
        var _class, _temp2;

        var displayName = _identifiers.reactWebComponentDisplayName + '(' + (0, _ReactUtils.getDisplayName)(WrappedComponent) + ')';

        var WebComponentsHOC = (_temp2 = _class = function (_WrappedComponent) {
            (0, _inherits3.default)(WebComponentsHOC, _WrappedComponent);

            function WebComponentsHOC() {
                var _ref2;

                var _temp, _this, _ret;

                (0, _classCallCheck3.default)(this, WebComponentsHOC);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = WebComponentsHOC.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC)).call.apply(_ref2, [this].concat(args))), _this), _this._id = _this.props._id, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
            }

            (0, _createClass3.default)(WebComponentsHOC, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _get2;

                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - componentWillMount');

                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillMount', this) && (_get2 = (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillMount', this)).call.apply(_get2, [this].concat(args));
                }
            }, {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var _get3;

                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - componentDidMount');

                    // 容器类组件装载
                    if (isContainer) {
                        (0, _paddingContainer2.default)(this);
                    }

                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentDidMount', this) && (_get3 = (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentDidMount', this)).call.apply(_get3, [this].concat(args));

                    this.didMount = true;
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    var _get4;

                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - componentWillUnmount');

                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                    }

                    (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillUnmount', this) && (_get4 = (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillUnmount', this)).call.apply(_get4, [this].concat(args));
                }
            }, {
                key: 'componentWillUpdate',
                value: function componentWillUpdate() {
                    var _get5;

                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - componentWillUpdate');

                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillUpdate', this) && (_get5 = (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentWillUpdate', this)).call.apply(_get5, [this].concat(args));
                }
            }, {
                key: 'componentDidUpdate',
                value: function componentDidUpdate() {
                    var _get6;

                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - componentDidUpdate');

                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentDidUpdate', this) && (_get6 = (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'componentDidUpdate', this)).call.apply(_get6, [this].concat(args));
                }
            }, {
                key: 'render',
                value: function render() {
                    _logger2.default.debug('React Lifecycle - ' + displayName + ' - _' + logId(this._id) + '_ - render');
                    return (0, _get8.default)(WebComponentsHOC.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebComponentsHOC.prototype), 'render', this).call(this);
                }
            }], [{
                key: 'getWrappedComponent',
                value: function getWrappedComponent() {
                    return WrappedComponent;
                }
            }]);
            return WebComponentsHOC;
        }(WrappedComponent), _class.displayName = '' + displayName, _temp2);

        // parse observedAttributes

        var observedAttributes = WrappedComponent.observedAttributes = WrappedComponent.propTypes[_identifiers.observedSymbol] || [];

        (0, _connector2.default)(_identifiers.componentNamespace + '-' + name, WebComponentsHOC);

        _logger2.default.info('register *' + _identifiers.componentNamespace + '-' + name + '* with attributes ( ' + (observedAttributes.length ? observedAttributes.join(' | ') : 'null') + ' ) observed...');
        return WebComponentsHOC;
    };
}

var logId = function logId(id) {
    return id || 'native';
};