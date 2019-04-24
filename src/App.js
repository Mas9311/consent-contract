import React, { Component } from 'react';
import web3 from "./web3";
import consent from "./consent";
import { Container, Card } from "semantic-ui-react";
import CreateParty from "./components/CreateParty";
import CreateAccount from "./components/CreateAccount";

import NavigationBar from "./components/NavigationBar";

class App extends Component {
  state = {
    value: "",
    message: "",
    userAddress: ""
  };

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: "Waiting for blockchain transaction to complete..."
    });

    // await consent.methods.createParty(this.state.value).send({
    //   from: accounts[0]
    // });
    //
    // this.setState({message: "Your party has been registered!"});
  };

  render() {
    return (
        <Container>
          <NavigationBar />
          <div></div>
          <div>

            <Card.Group>
              <Card color="blue" header="Register to Play" centered="true">
                <Card.Content>
                  <h4>
                    Create a party and invite others.
                  </h4>
                  <CreateParty />
                </Card.Content>
              </Card>

              <Card color="orange" header="Sign Up" centered="true">
                <Card.Content>
                  <h4>
                    Create an account.
                  </h4>
                  <CreateAccount />
                </Card.Content>
              </Card>

            </Card.Group>
          </div>

        </Container>
    );
  }
}

export default App;


/* line 39
              <Card color="red" header="">
                <Card.Content>
                  <h4>We will surely miss you!</h4>
                  <br />
                  <Unregister />
                </Card.Content>
              </Card>
 */