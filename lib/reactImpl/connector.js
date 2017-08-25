'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _attributes = require('../attributes');

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _methods = require('../methods');

var _builder = require('./builder');

var _dom = require('../dom');

var dom = _interopRequireWildcard(_dom);

var _identifiers = require('../identifiers');

var _guid = require('../utils/guid');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * React 连接器
 * 标准: Custom Elements v1
 * @see https://developers.google.com/web/fundamentals/getting-started/primers/customelements
 *
 * polyfill:
 * https://github.com/webcomponents/webcomponentsjs
 * https://github.com/WebReflection/document-register-element
 *
 * 测试标准：
 *
 * jQuery:
 *      操作: html / empty / append
 *      查询: find
 *
 * diff with v0:
 *
 * 1. The ability to extend by simply defining classes.
 * 2. It is possible to extend native components.
 * 3. Special methods are also slightly different from v0:
 *      the constructor is invoked instead of the createdCallback one
 *      connectedCallback is the new attachedCallback
 *      disconnectedCallback is the new detachedCallback
 *      attributeChangedCallback is sensitive to the public static list of attributes to be notified about
 *
 * @param elementName
 * @param ReactComponent
 */

var connectedElements = new _set2.default();

var connector = function connector(elementName, ReactComponent) {
    var _class, _temp;

    var reactElement = void 0;
    var props = void 0;

    var NewElement = (_temp = _class = function (_HTMLElement) {
        (0, _inherits3.default)(NewElement, _HTMLElement);
        (0, _createClass3.default)(NewElement, [{
            key: 'props',


            /**
             * 临时元素标识
             * 解析子元素时产生的临时元素
             *
             * Notice:
             * 1. 当从容器组件获取子元素时，若子元素中包含自定义标签，则该子元素会中断容器组件的创建而先创建该子元素 (对子元素操作导致)
             * 2. 当子元素创建结束后，容器组件继续创建过程，创建中子元素将被清除 (dom变化被 MutationObserver 识别，disconnected 被执行)
             * 3. 容器组件 DidMount 后，将再次执行创建子元素 （到 ref === 'body' 的节点）的过程
             *
             * 由此:
             * 1. 在子元素获取过程中标记此为 true
             * 2. 在 CE 的各类生命周期方法中忽略此类元素
             *
             * @type {boolean}
             * @private
             */
            get: function get() {
                return props;
            }

            /**
             * 组件连接标记
             * 当为 true， 下列条件同时满足
             * 1. 元素被插入到 dom
             * 2. 内部逻辑组件创建
             * 3. 子元素走完创建相关的全部生命周期
             *
             * 用于:
             * 1. 避免重复 connect (已知 Firefox / Edge) (connectedCallback)
             * 2. 避免属性变化修改到尚未完全创建的组件 (attributeChangedCallback)
             *
             * connectedCallback 且 React 创建标识
             * @type {boolean}
             */
            ,
            set: function set(props) {
                throw new Error('Props can\'t be set directly...');
            }

            /**
             * 创建或<a href="#upgrades">升级</a>元素的一个实例。
             * 用于初始化状态、设置事件侦听器或<a href="#shadowdom">创建 Shadow DOM</a>。
             * 参见<a href="https://html.spec.whatwg.org/multipage/scripting.html#custom-element-conformance">规范</a>，
             * 了解可在  <code><span>constructor</span></code> 中完成的操作的相关限制。</td>
             * @param self
             */

        }]);

        function NewElement(self) {
            (0, _classCallCheck3.default)(this, NewElement);

            var _this = (0, _possibleConstructorReturn3.default)(this, (NewElement.__proto__ || (0, _getPrototypeOf2.default)(NewElement)).call(this, self));

            _this.connected = false;
            _this._webComponentTemp = false;
            _this._id = '' + (0, _guid.suuid)();
            return _this;
        }

        /**
         * 可连接
         *
         * 1. 忽略已经创建的组件
         * 2. 忽略临时节点
         *
         * @returns {boolean}
         */


        (0, _createClass3.default)(NewElement, [{
            key: 'canConnect',
            value: function canConnect() {

                return !this.connected && !this._webComponentTemp;
            }

            /**
             * 元素每次插入到 DOM 时都会调用。
             * 用于运行安装代码，例如获取资源或渲染。
             * 一般来说，您应将工作延迟至合适时机执行。
             */

        }, {
            key: 'connectedCallback',
            value: function connectedCallback() {

                if (!this.canConnect()) return;

                this.setAttribute(_identifiers.attrFlag, this._id);

                _logger2.default.info('CE _' + this._id + '_ connected');

                props = (0, _attributes.attrsToProps)(this.attributes);
                props._id = this._id;
                props.children = dom.getChildren(this);
                props.container = this;

                reactElement = (0, _builder.creator)(this, ReactComponent, props);
                this.connected = true;
                connectedElements.add(this);

                (0, _methods.exposeMethods)(reactElement, this);
            }

            /**
             * 属性添加、移除、更新或替换。
             * 解析器创建元素时，或者升级时，也会调用它来获取初始值。
             * 注：仅 observedAttributes 属性中列出的特性才会收到此回调。
             *
             * @param name
             * @param oldValue
             * @param newValue
             */

        }, {
            key: 'attributeChangedCallback',
            value: function attributeChangedCallback(name, oldValue, newValue) {
                if (this.connected) {
                    _logger2.default.debug('CE _' + this._id + '_ attributeChanged', name, oldValue, '->', newValue);

                    var _attrToProp = (0, _attributes.attrToProp)(name, newValue),
                        key = _attrToProp.key,
                        prop = _attrToProp.prop;

                    props[key] = prop;

                    reactElement = (0, _builder.updater)(this, ReactComponent, props);
                }
            }

            /**
             * 删除逻辑:
             * 1. 已连接
             * 2. 不是临时节点
             * 3. 无父节点
             *
             * doc:
             * 元素每次从 DOM 中移除时都会调用。
             * 用于运行清理代码（例如移除事件侦听器等）
             *
             *
             */

        }, {
            key: 'disconnectedCallback',
            value: function disconnectedCallback() {

                // if(!this._id) return;

                // return;

                // if (this.isInvalid()) {
                //     return;
                // }
                //
                // if(!this.connected) return;

                if (this.connected
                // &&
                // !this._webComponentTemp
                // &&
                // !this.parentNode
                ) {

                        // let children = this.querySelectorAll(`[${attrFlag}]`);
                        // for(let child of children) {
                        //     child.remove();
                        // }

                        _reactDom2.default.unmountComponentAtNode(this);
                        // this.connected = false;

                        _logger2.default.info('CE _' + this._id + '_ disconnected');
                    }
            }

            /**
             * @override
             *
             * 内容控制
             * 针对 jQuery html / empty 等方法
             *
             * @param value
             * @returns {*}
             */

        }, {
            key: 'appendChild',


            /**
             * @override
             *
             * 内容控制
             *
             * @param args
             * @returns {*}
             */
            value: function appendChild() {
                var context = _reactDom2.default.findDOMNode(reactElement.refs.body);
                if (context) {
                    var _context$appendChild;

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return (_context$appendChild = context.appendChild).call.apply(_context$appendChild, [context].concat(args));
                }
            }

            /**
             *  -> React Component
             */

        }, {
            key: 'setState',
            value: function setState() {
                if (reactElement) {
                    reactElement.setState.apply(reactElement, arguments);
                }
            }

            /**
             *  -> React Component
             */

        }, {
            key: 'forceUpdate',
            value: function forceUpdate() {
                if (reactElement) {
                    reactElement.forceUpdate();
                }
            }
        }, {
            key: 'textContent',
            set: function set(value) {
                var context = _reactDom2.default.findDOMNode(reactElement.refs.body);
                if (context) {
                    return context.textContent = value;
                }
            }

            /**
             * @override
             * 内容控制
             * 针对 native innerHTMl / jQuery html / empty 等方法
             *
             * @param value
             */

        }, {
            key: 'innerHTML',
            set: function set(value) {
                var context = _reactDom2.default.findDOMNode(reactElement.refs.body);
                if (context) {
                    context.innerHTML = value;
                }
            }
        }]);
        return NewElement;
    }(HTMLElement), _class.observedAttributes = ReactComponent.observedAttributes, _temp);


    customElements.define(elementName, NewElement);
};

exports.default = connector;
module.exports = exports['default'];