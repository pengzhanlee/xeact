import ReactDOM from 'react-dom';
import {getDisplayName} from "../utils/common";
import {markTemp} from "../dom";

/**
 * 填充 children 到容器组件
 * rules:
 * 1. isContainer = true
 * 2. a `body` x-ref in elements
 * @param component
 */
export default function (component) {
    let {children, _id} = component.props;
    // let body = ReactDOM.findDOMNode(component.refs.body);

    let node = ReactDOM.findDOMNode(component);
    let body = node.querySelector('[x-ref=body]') || ( node.getAttribute('x-ref') === 'body' ? node : null );

    if (children) {
        if (!body) {
            console.error(`'body' x-ref not found in a container Component, please check [${getDisplayName(component.constructor.getWrappedComponent())}]`);
            return;
        }

        // debugger;

        // console.log(children)
        let {childNodes} = children;
        childNodes.forEach((node) => {
            markTemp(node, true);
        });
        body.appendChild(children);
    }
}
