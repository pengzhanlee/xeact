import React from "react";
import xeact, {PureComponent} from "xeact";
import Enzyme, {shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import Sample from "./sample";

console.debug = jest.genMockFunction();
console.log = jest.genMockFunction();
console.info = jest.genMockFunction();
console.warn = jest.genMockFunction();
console.error = jest.genMockFunction();

Enzyme.configure({ adapter: new Adapter() });

test('render a basic component', () => {
    const wrapper = shallow(
        <Sample />
    );
    expect(wrapper.length);
});
