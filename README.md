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

1. register component

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

2. use the registered component as a Custom Element in HTML
    ```xml
    <x-box header="Hello">
        <p>World</p>
    </x-box>
    ```

3. import Custom Elements v1 polyfills
    ```xml
    <script src="/xeact/dist/env.min.js"></script>
    ```

4. done

    ![](https://raw.githubusercontent.com/pengzhanlee/xeact/master/docs/image/quickStart.png)


## API

### xeact(name, options)

define a custom element and connect it to React component.

- **tagName** `string`

    define tag name of the element.

- **options.isContainer** `boolean`

    the custom element can own childNodes or not.

    ```js
    import xeact from 'xeact';

    @xeact('tag')
    export default class Box extends Component {
        ...
    }
    ```

### observed

observe an dom attribute change

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

    the box component will receive prop header: 'new header'

### exposed

expose react method to dom api.

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

dispatch an event from react component

- **context** `object`

    always point to the component instance

- **name** `string`

    event name

- **eventData** `object`

    An object containing data that will be passed to the event handler

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


