import React from 'react';
import ReactDOM from 'react-dom';
import web3 from "./web3";
import consent from "./consent";



class Parties extends Component {
  state = {
    parties: [],
    address: ""
  };

  constructParties() {
    var partyCard = [];
    for(party in this.state.parties) {
      partyCard.push(<Card color="blue" header= centered="true"><Card.Content>
        <h4>
          Create a party and invite others.
        </h4>
        <CreateParty />
      </Card.Content>
      </Card>);
    }
  }

  getParties = async () => {
    var partyName = await consent.methods.partyContractNotFinalized(address);
    var party = await consent.methods.parties(partyName);
    this.setState({parties: party});
  };

  render() {
    return (
      <Container>
        <div>
          {constructParties}
        </div>
      </Container>
    );
  }

}