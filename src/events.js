import ReactDOM from "react-dom";

export let dispatchEvent = function (context, eventName, detail = {}, eventMeta = {}) {

  let event = new CustomEvent(eventName, Object.assign({
    detail,
  }), detail, eventMeta);

  ReactDOM.findDOMNode(context).parentNode.dispatchEvent(event);

};
