import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CancelParty extends Component {
  state = {
    modalOpen: false,
    partyName: "",
    errorMessage: "",
    loading: false
  };

  //Upon opening the Create Party modal, clear everything to a clean slate.
  handleOpen = () => this.setState({
    modalOpen: true,
    partyName: "",
    reason: "",
    message: "Please enter the party name you would like to cancel",
    errorMessage: ""
  });

  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); // retrieves the current metamask account.
    let currentAccount = accounts[0];
    //console.log(currentAccount);


    if (!this.state.loading) {
      if (this.state.partyName !== "" && this.state.reason !== "") {
        if (await consent.methods
            .profileDoesNotExist() // Profile must exist to cancel party
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: You cannot cancel a party without a profile",
            message: ""
          });
        }
        else if(await consent.methods
            .partyDoesNotExist(this.state.partyName)
            .call({from: currentAccount})) {
          this.setState({
            loading: false,
            errorMessage: "Error: Party must exist to be cancelable",
            message: ""
          });
        }
        else if (!await consent.methods
            .partyInitialized(this.state.partyName) // Party must exist to join it
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: Party must not be closed to be cancelable",
            message: ""
          });
        } else if (!await consent.methods
            .partyOwner(this.state.partyName)
            .call({from: currentAccount})) {
          this.setState({
            loading: false,
            errorMessage: "Error: You cannot cancel a party you did not create",
            message: ""
          });
        } else if(await  consent.methods
            .partyFull(this.state.partyName)
            .call({from: currentAccount})) {
          this.setState({
            loading: false,
            errorMessage: "Error: Party is full, cannot cancel full party",
            message: ""
          })
        } else if (await consent.methods
            .partyHasExpired
            .call({from: currentAccount})) {
          this.setState({
            loading: false,
            errorMessage: "Error: This party has expired, no longer able to cancel",
            message: ""
          })
        } else {
          this.setState({
            loading: true,
            errorMessage: "",
            message: "waiting for blockchain transaction to complete..."
          });
          await consent.methods.addGuestToParty(this.state.partyName)
            .call({from: currentAccount})
            .on('confirmation', (confirmationNumber, receipt) => {
              this.setState({
                loading: true,
                partyName: "",
                errorMessage: "",
                message: "Success: You have canceled the party" // show the user the transaction was successful
              })
            });
        }
      } else {
        this.setState({
          message: "Must specify party to cancel and reason for cancelling" // show the user the transaction was successful
        })
      }
    }
  };

  render() {
    return (
      <Modal
        trigger={
          <Button color="red" onClick={this.handleOpen} inverted>
            Create a New Party
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Header icon="browser" content="Cancel a Party" />
        <Modal.Content>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Your Party Name</label>
              <input
                placeholder="Party Name"
                onChange={event =>
                  this.setState({
                    partyName: event.target.value
                  })}
              />
            </Form.Field>
            <Form.Field>
              <label>Your Party Name</label>
              <input
                placeholder="Reason for cancelling"
                onChange={event =>
                  this.setState({
                    reason: event.target.value
                  })}
              />
            </Form.Field>

            <Message error header="Oops!" content={this.state.errorMessage} />
            <Button primary type="submit" loading={this.state.loading}>
              <Icon name="check" />
              Cancel a Party
            </Button>
            <hr />
            <h2>{this.state.partyName}</h2>
            <h2>{this.state.message}</h2>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.handleClose} inverted>
            <Icon name="cancel" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CancelParty;