import React, { Component } from "react";
import { Menu, Header, Dropdown } from "semantic-ui-react";
// import trojanSecret from "../trojanSecret";

class TopBar extends Component {
  state = {
    contractSymbol: "",
    contractName: ""
  };

  // async componentDidMount() {
  //   const contractSymbol = await trojanSecret.methods.symbol().call();
  //   const contractName = await trojanSecret.methods.name().call();
  //   this.setState({ contractSymbol, contractName });
  // }

  render() {
    return (
      <Menu style={{ marginTop: "10px" }}>
        <Menu.Item>
          <Header size="large">Welcome to the Consent saving Application!</Header>
        </Menu.Item>
        <Menu.Item postion="right">
          <img style={{width: 100, height: 86}}
               src="CYA_Logo.png"
               alt="CYA logo"
          />
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopBar;
