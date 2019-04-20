import React, { Component } from "react";
import { Menu, Header, Dropdown } from "semantic-ui-react";
// import consent from "../consent";

class NavigationBar extends Component {
  state = {
    contractSymbol: "",
    contractName: ""
  };

  async componentDidMount() {
    const contractSymbol = "Hello"; // await consent.methods.symbol().call();
    const contractName = "World"; // await consent.methods.name().call();
    this.setState({ contractSymbol, contractName });
  }

  render() {
    return (
        <Menu style={{marginTop: "10px"}}>
          <Menu.Item position="left">
            <Dropdown item icon="wrench" simple>
              <Dropdown.Menu>
                <Dropdown.Item>Name={this.state.contractSymbol}</Dropdown.Item>
                <Dropdown.Item>Symbol={this.state.contractName}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Header size="large">Welcome to the Consent-saving application!</Header>
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

export default NavigationBar;