import React from "react";
import {shallow} from "enzyme";
import Sample from "./sample";

console.debug = jest.genMockFunction();
console.log = jest.genMockFunction();
console.info = jest.genMockFunction();
console.warn = jest.genMockFunction();
console.error = jest.genMockFunction();

test('render a basic component', () => {
    const wrapper = shallow(
        <Sample />
    );
    expect(wrapper.length).toBe(1);
});
