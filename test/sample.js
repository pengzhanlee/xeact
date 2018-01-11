import React from "react";
import xeact, {PureComponent} from "xeact";

@xeact('sample')
export default class Sample extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            sample
        </div>
    }

}
