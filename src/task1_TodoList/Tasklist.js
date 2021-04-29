/* eslint-disable array-callback-return */
import React from "react";
import "./Tasklist.css";
class Tasklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      taskCount: 0,
      taskItems: [],
    };
    this.insertTask = this.insertTask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    this.setState({ value: event.target.value });
  }
  deleteTask(inx) {
    this.setState({
      taskItems: this.state.taskItems.filter((val) => {
        if (val !== this.state.taskItems[inx]) {
          return val;
        }
      }),
    });
  }

  insertTask(event) {
    event.preventDefault();

    this.setState({
     
      taskItems: this.state.taskItems.concat(this.state.value),
      value: "",
    });
  }
  render() {
    return (
      <div className="App">
        <div id="App-header">
          <p>Task List - {this.state.taskItems.length}</p>
          <form onSubmit={this.insertTask}>
            <input
              type="text"
              placeholder="Enter your Task"
              value={this.state.value}
              onChange={this.handleInputChange}
              
            />
          </form>
        </div>
        <div id="App-body">
          <ul>
            {this.state.taskItems.map((task, inx) => {
              return (
                <li onClick={() => this.deleteTask(inx)} id={inx} key={inx}>
                  {task}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
export default Tasklist;
