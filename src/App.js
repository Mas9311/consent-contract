import React, { Component } from 'react';
// import web3 from "./web3";
// import consent from "./consent";
import { Container, Card } from "semantic-ui-react";
import CreateParty from "./components/CreateParty";
import CreateAccount from "./components/CreateAccount";

import NavigationBar from "./components/NavigationBar";
import JoinParty from "./components/JoinParty";
import CancelParty from "./components/CancelParty";

class App extends Component {
  state = {
    value: "",
    message: "",
    parties: []
    // userAddress: ""
  };

  render() {
    return (
        <Container>
          <NavigationBar />
          <div>
            <Card.Group itemsPerRow={2} stackable={true}>

              <Card fluid color="green" header="Sign Up" centered="true" raised="false">
                <Card.Content>
                  <h4>
                    Create an account.
                  </h4>
                  <CreateAccount />
                </Card.Content>
              </Card>
              <Card fluid color="purple" header="Register to Play" centered="true">
                <Card.Content>
                  <h4>
                    Create a party and invite others.
                  </h4>
                  <CreateParty parties = {this.state.parties}/>
                </Card.Content>
              </Card>

            </Card.Group>
            <Card.Group itemsPerRow={2} stackable={true}>
              <Card fluid color="orange" header="Add a guest" centered="true">
                <Card.Content>
                  <h4>
                    Join the Party.
                  </h4>
                  <JoinParty parties = {this.state.parties}/>
                </Card.Content>
              </Card>
              <Card fluid color="yellow" header="Finalize" centered="true">
                <Card.Content>
                  <h4>
                    Cancel a Party.
                  </h4>
                  <CancelParty parties = {this.state.parties}/>
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