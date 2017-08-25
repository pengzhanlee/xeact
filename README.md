# xeact

connect your React Components to [Web Components - Custom Elements](https://w3c.github.io/webcomponents/spec/custom/)


Installation
------------

```sh
npm install xeact --save
```

Quick Start
-----------

1. register component

```js
import xeact, {observed, exposed, dispatchEvent} from "xeact";

// register your Component with tag name 'chart'
@xeact('chart')

export default
class Box extends Component {

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

            {/* childNodes of the <x-box> will be append to element which has a `body` ref attribute. */}
            <div className="box-body" ref="body" />
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

3. reload page

![](https://raw.githubusercontent.com/pengzhanlee/xeact/master/docs/image/quickStart.png)
