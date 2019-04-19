import React, { Component } from 'react';
import { Container, Card } from "semantic-ui-react";

import web3 from "./web3";
import consent from "./consent";
import logo from './logo.svg';
import './App.css';
import NavigationBar from "./components/NavigationBar";
import CreateParty from "./components/CreateParty";

class App extends Component {
  state = {
    message: ""
  };

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: "Waiting for blockchain transaction to complete..."
    });

  };

  render() {
    return (
        <Container>
          <NavigationBar />
          <div>
            <Card.Group>
              <Card color="blue" header="Register to Play">
                <Card.Content>
                  <h4>
                    Create a party and invite others.
                  </h4>
                  <CreateParty />
                </Card.Content>
              </Card>
/*
              <Card color="red" header="">
                <Card.Content>
                  <h4>We will surely miss you!</h4>
                  <br />
                  <Unregister />
                </Card.Content>
              </Card>
              */
            </Card.Group>

          </div>

        </Container>
    );
  }
}

export default App;
