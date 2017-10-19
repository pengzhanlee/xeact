# xeact

[![Build Status](https://travis-ci.org/pengzhanlee/xeact.svg?branch=master)](https://travis-ci.org/pengzhanlee/xeact)
[![Coverage Status](https://coveralls.io/repos/github/pengzhanlee/xeact/badge.svg?branch=master)](https://coveralls.io/github/pengzhanlee/xeact?branch=master)

xeact is a JavaScript library for connecting [React Components](https://reactjs.org/docs/react-component.html) and [Web Components - Custom Elements](https://w3c.github.io/webcomponents/spec/custom/)

[README 中文](README-zh_CN.md)

## Installation

```sh
npm install xeact --save
```

## Quick Start

1. Register component

    ```js
    import xeact, {observed, exposed, dispatchEvent, Component} from "xeact";

    // register a Component with tag name 'box'
    @xeact('box')

    export default class Box extends Component {

        static propTypes = {

            // observe 'header' attribute change from dom
            @observed
            header: PropTypes.string,
        };

        @exposed
        method() {
            // this method can be called from dom api
        }

        headerClick() {
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

2. Use the registered component as a Custom Element in HTML
    ```xml
    <x-box header="Hello">
        <p>World</p>
    </x-box>
    ```

3. Import Custom Elements v1 polyfills
    ```xml
    <script src="/xeact/dist/env.min.js"></script>
    ```

4. Done

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


