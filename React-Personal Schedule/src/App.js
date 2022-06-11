import React from "react";

import Scheduler from "devextreme-react/scheduler";
import Button from "devextreme-react/button";

import { data } from "./data.js";

const views = ["week", "month"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(2022, 6, 11)
    };
  }
  render() {
    return (
      <React.Fragment>
        <Button text="Change Date" onClick={this.clickHandler} />
        <Scheduler
          onOptionChanged={this.optionChanged}
          dataSource={data}
          views={views}
          defaultCurrentView={"week"}
          currentDate={this.state.currentDate}
          height={600}
          startDayHour={9}
        />
      </React.Fragment>
    );
  }
  clickHandler = e => {
    this.setState({
      currentDate: new Date(2022, 6, 11)
    });
  };
  optionChanged = e => {
    if (e.fullName === "currentDate") {
      this.setState({
        currentDate: e.value
      });
    }
  };
}

export default App;
