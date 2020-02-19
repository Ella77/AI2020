import React, { Component } from "react";
import STT from "../components/stt/STT";

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        hello world
        <STT />
      </div>
    );
  }
}

export default index;
