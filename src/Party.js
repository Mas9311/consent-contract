import React from 'react';
import ReactDOM from 'react-dom';
import web3 from "./web3";


class Party extends Component {
  state = {
    participants: [],
    partyName: "",
    partyCreator: ""
  }

  formatParticipants() {
    var str = "";
    for(p in this.state.participants) {
      str += p + " "
    }
  }

  render() {
    return (
      <Card color="green" header={this.state.partyName} centered="true"><Card.Content>
        <h4>
          Created by {this.state.partyCreator}
        </h4>
        <h5>
          Participants: {this.formatParticipants()}
        </h5>
        <CreateParty />
      </Card.Content>
      </Card>
    );
  }
}