import ReactDOM from 'react-dom';
import {getDisplayName} from "../utils/common";

/**
 * 填充 children 到容器组件
 * rules:
 * 1. isContainer = true
 * 2. a `body` ref in elements
 * @param component
 */
export default function (component) {
    let {children, _id} = component.props;
    let body = ReactDOM.findDOMNode(component.refs.body);
    if (children) {
        if (!body) {
            throw new Error(`body ref not found, check component [${getDisplayName(component.constructor.getWrappedComponent())}]`);
        }

        // debugger;

        // console.log(children)
        let {childNodes} = children;
        childNodes.forEach((node) => {
            node._webComponentTemp = false;
        });
        ReactDOM.findDOMNode(component.refs.body).appendChild(children);
    }
}
