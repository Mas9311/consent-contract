import React, { Component } from "react";
import { Menu, Header } from "semantic-ui-react";

class NavigationBar extends Component {

  render() {
    return (
        <Menu style={{marginTop: "10px"}}>
          <Menu.Menu>
            <Menu.Item postion="left">
              <img style={{width: 100, height: 86}}
                   src="CYA_Logo.png"
                   alt="CYA logo"
              />
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu>
            <Menu.Item position="right">
              <Header size="large">Welcome to the Consent-saving application!</Header>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
    );
  }
}

export default NavigationBar;