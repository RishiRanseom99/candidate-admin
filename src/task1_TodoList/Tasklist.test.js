import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Tasklist from "./Tasklist";

Enzyme.configure({ adapter: new Adapter() });

describe("TaskList:", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Tasklist />);
  });

  test("should render the title correctly", () => {
    expect(wrapper.find("p").text()).toContain("Task List");
  });

  test("should render the tasks count to be zero", () => {
    expect(wrapper.find("p").text()).toContain("0");
  });

  test("should increment the task count on adding new task", () => {
    wrapper.find("form").simulate("submit", {
      preventDefault: () => {},
    });
    expect(wrapper.find("p").text()).toContain("1");
  });

  test("should have empty tasks on start", () => {
    wrapper.find("form").simulate("submit", {
      preventDefault: () => {},
    });
    expect(wrapper.find("ul").exists()).toEqual(true);
  });

  test("should insert the task in tasklist", () => {
    wrapper.setState({ taskItems: ["task1"] });

    expect(wrapper.find("li").length).toBe(1);
  });

  test("should delete the task from tasklist", () => {
    wrapper.setState({ taskItems: ["task1"] });
    wrapper.find("li").simulate("click", {
      inx: 0,
    });
    expect(wrapper.find("li").length).toBe(0);
  });
  test("should delete the passed task and return rest tasks", () => {
    wrapper.setState({ taskItems: ["task1", "task2"] });
    wrapper.find("li").last().simulate("click", {
      inx: 1,
    });
    expect(wrapper.find("li").length).toBe(1);
  });

  test("should update the input on changing", () => {
    wrapper.setState({ value: "" });
    wrapper.find("input").simulate("change", { target: { value: "task1" } });
    expect(wrapper.state().value).toEqual("task1");
  });
});
