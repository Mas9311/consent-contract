import React, { Component } from 'react';
import { Container, Card } from "semantic-ui-react";
import CancelParty from "./components/CancelParty";
import CreateParty from "./components/CreateParty";
import CreateAccount from "./components/CreateAccount";
import JoinParty from "./components/JoinParty";
import NavigationBar from "./components/NavigationBar";

class App extends Component {

  render() {
    return (
        <Container>
          <NavigationBar/>
          <div>
            <Card.Group itemsPerRow={2} stackable={true}>

              <Card fluid color="green" header="Sign Up" centered="true" raised="false">
                <Card.Content>
                  <h4>
                    Create an account.
                  </h4>
                  <CreateAccount/>
                </Card.Content>
              </Card>
              <Card fluid color="purple" header="Register to Play" centered="true">
                <Card.Content>
                  <h4>
                    Create a party and invite others.
                  </h4>
                  <CreateParty/>
                </Card.Content>
              </Card>

            </Card.Group>
            <Card.Group itemsPerRow={2} stackable={true}>
              <Card fluid color="blue" header="Add a guest" centered="true">
                <Card.Content>
                  <h4>
                    Join a party.
                  </h4>
                  <JoinParty/>
                </Card.Content>
              </Card>
              <Card fluid color="red" header="Finalize" centered="true">
                <Card.Content>
                  <h4>
                    Cancel a party.
                  </h4>
                  <CancelParty/>
                </Card.Content>
              </Card>

            </Card.Group>
          </div>

        </Container>
    );
  }
}

export default App;
