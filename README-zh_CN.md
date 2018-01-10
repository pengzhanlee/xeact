# xeact

[![Build Status](https://travis-ci.org/pengzhanlee/xeact.svg?branch=master)](https://travis-ci.org/pengzhanlee/xeact)
[![Coverage Status](https://coveralls.io/repos/github/pengzhanlee/xeact/badge.svg?branch=master)](https://coveralls.io/github/pengzhanlee/xeact?branch=master)

xeact 旨在建立一种 [React Components](https://reactjs.org/docs/react-component.html) 和 [Web Components - Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) 的友好连接关系和方式

[README in English](README.md)

## 安装

```sh
npm install xeact --save
```

## 快速上手

1. 注册组件

    ```js
    import xeact, {observed, exposed, dispatchEvent, Component} from "xeact";

    // 注册组件为 box 标签
    @xeact('box')

    export default class Box extends Component {

        static propTypes = {

            // 响应标签的 'header' 属性在 dom 中的变化
            @observed
            header: PropTypes.string,
        };

        // 向 dom 暴露的方法
        @exposed
        method() {
            // 该方法允许以 dom api 的方式调用
        }

        headerClick() {
            // 派发 dom 事件
            dispatchEvent(this, 'headerClick' , {
                header: this.props.header
            });
        }

        render() {
            let {header} = this.props;

            return <div className="box">
                {header &&
                <div className="box-header" onClick={()=> {this.headerClick()}}>{header}</div>
                }

                {/* childNodes of the <x-box> will be append to element which has a `body` x-ref attribute. */}
                <div className="box-body" x-ref="body" />
            </div>
        }

    }
    ```


2. 引入 Custom Elements v1 支持

    ```xml
    <script src="/xeact/dist/env.min.js"></script>
    ```

3. 在 HTML 中以标签的形式调用组件

    ```xml
    <x-box header="Hello">
        <p>World</p>
    </x-box>
    ```


4. 完成

    ![](https://raw.githubusercontent.com/pengzhanlee/xeact/master/docs/image/quickStart.png)


## API

### xeact(name, options)

Define a custom element and connect it to React component.

- **tagName** `string`

    Define tag name of an element.

    There are a few notices on this argument:

    - It can only contain lowercase letter `a-z` and `-`.

    - A `x-` prefix will be added to tag name. For example 'box' means 'x-box' will be defined as a custom element name.

- **options.isContainer** `boolean`

    The custom element can own childNodes or not.


    An example of non-container component :

    ```js
    import xeact from 'xeact';

    @xeact('button')
    export default class Button extends Component {

        ...

        render() {
            return <span>Button</span>
        }
    }
    ```

    An example container component:

    ```js
    import xeact from 'xeact';

    @xeact('box')
    export default class Box extends Component {

        ...

        render() {
            return <div>
                <div className="box-header">Header</header>
                <div x-ref="body"></body>
            </div>
        }
    }
    ```



### observed

Observe an dom attribute change.

```js
import {observed} from 'xeact';

static propTypes = {
    @observed
    header: PropTypes.string,
};
```

```xml
<x-box>...</x-box>
<script>
    document.querySelector('x-box').setAttribute('header', 'new header');
</script>
```

The box component header prop will receive new value : 'new header'.


### exposed

Expose react method to dom api.

```js
import {exposed} from 'xeact';

@exposed
method(...args) {
    ...
}
```

```xml
<x-box>...</x-box>
<script>
    document.querySelector('x-box').method(arg);
</script>
```

### dispatchEvent(context, name, eventData)

Dispatch an event from react component.

- **context** `object`

    Always point to the component instance.

- **name** `string`

    Event name.

- **eventData** `object`

    An object containing data that will be passed to the event handler.

    ```js
    import {dispatchEvent} from 'xeact';

    method(...args) {
        dispatch(this, 'catch', {
            data: 'data'
        });
    }
    ```

    ```xml
    <x-box>...</x-box>
    <script>
        document.querySelector('x-box').addEventListener('catch', function(e){
            e.detail.data === 'data';   // true
        });
    </script>
    ```


### Component && PureComponent


