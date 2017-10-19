# xeact

[![Build Status](https://travis-ci.org/pengzhanlee/xeact.svg?branch=master)](https://travis-ci.org/pengzhanlee/xeact)
[![Coverage Status](https://coveralls.io/repos/github/pengzhanlee/xeact/badge.svg?branch=master)](https://coveralls.io/github/pengzhanlee/xeact?branch=master)

xeact is a JavaScript library for connecting [React Components](https://reactjs.org/docs/react-component.html) and [Web Components - Custom Elements](https://w3c.github.io/webcomponents/spec/custom/)

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

            // observe attribute change from dom
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
                <div className="box-header" onClick={this.headerClick}>{header}</div>
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

### configure(options)

### xeact

### observed

### exposed

### dispatchEvent

### Component && PureComponent
