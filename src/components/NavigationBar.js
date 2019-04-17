import React, { Component } from "react";
import { Menu, Header, Dropdown } from "semantic-ui-react";


class NavigationBar extends Component {
    state = {
        contractName: ""
    };

    //add more menu items here
    render() {
        return (
            <Menu style={{ marginTop: "10px" }}>
                <Menu.Item>
                    <Header size="large">Consent Header</Header>
                </Menu.Item>
                <Menu.Item postion="right">
                    <img
                        src="/logo.svg" //insert logo here
                        alt="consent logo"

                    />
                </Menu.Item>
            </Menu>
        );
    }
}

export default NavigationBar;