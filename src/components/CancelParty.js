import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CancelParty extends Component {
  state = {
    modalOpen: false,
    partyName: "",
    reason: "",
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

  handleClose = () => this.setState({modalOpen: false});

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); // retrieves the current metamask account.
    let currentAccount = accounts[0];
    //console.log(currentAccount);

    if (!this.state.loading) {
      if (this.state.partyName !== "") { // notStringEmpty(partyName)
        if (this.state.reason !== "") { // notStringEmpty(reason)
          if (!await consent.methods
              .profileExists() // You have not created a Profile
              .call({
                from: currentAccount
              })) {

            this.setState({
              loading: false,
              errorMessage: "Error: You must create an Account before cancelling a Party.",
              message: ""
            });
          } else if (await consent.methods
              .partyFull(this.state.partyName) // Party is at max capacity
              .call({
                from: currentAccount
              })) {
            this.setState({
              loading: false,
              errorMessage: "Error: Party is already full, therefore you cannot cancel the Party.",
              message: ""
            });
          } else if (!await consent.methods
              .partyInitialized(this.state.partyName) // Party either does not exist or is finalized
              .call({
                from: currentAccount
              })) {

            this.setState({
              loading: false,
              errorMessage: "Error: Party cannot be canceled if it has not been created or is already finalized.",
              message: ""
            });
          } else if (!await consent.methods
              .partyOwner(this.state.partyName) // You are the owner of the Party
              .call({
                from: currentAccount
              })) {
            this.setState({
              loading: false,
              errorMessage: "Error: You must be the owner to cancel a Party.",
              message: ""
            });
          } else if (await consent.methods
              .partyHasExpired(this.state.partyName) // Party has already expired (now >= closeTime)
              .call({
                from: currentAccount
              })) {
            this.setState({
              loading: false,
              errorMessage: "Error: This Party has expired, therefore you are not able to cancel.",
              message: ""
            });
          } else { // No problems with requirements
            this.setState({
              loading: true,
              errorMessage: "",
              message: "waiting for blockchain transaction to complete..."
            });
            try {
              await consent.methods.ownerCancels(
                  this.state.partyName,
                  this.state.reason
              )
                  .send({
                    from: currentAccount
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    this.setState({
                      loading: false,
                      partyName: "",
                      reason: "",
                      errorMessage: "",
                      message: "Success: You have canceled the Party." // show the user the transaction was successful
                    });
                    // document.getElementById('party_name').value = "";
                    // document.getElementById('reason_cancel').value = "";
                  });
            } catch (err) {
              // User clicked the reject button in the metamask popup window.
              console.log(err.message);
              this.setState({
                loading: false,
                errorMessage: err.message,
                message: "Error: Transaction rejected."
              });
            }
          }
        } else {
          this.setState({
            message: "Please enter the reason for cancelling into the correct field."
          });
        }
      } else {
        this.setState({
          message: "Please enter a name for your Party into the correct field."
        });
      }
    }
  };

  render() {
    return (
        <Modal
            trigger={
              <Button color="red" onClick={this.handleOpen} inverted>
                Cancel a Party
              </Button>
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
        >
          <Header icon="browser" content="Cancel a Party"/>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Your Party Name</label>
                <input id="party_name"
                       placeholder="Party Name"
                       onChange={event =>
                           this.setState({
                             partyName: event.target.value
                           })}
                />
              </Form.Field>
              <Form.Field>
                <label>Your Party Name</label>
                <input id="reason_cancel"
                       placeholder="Reason for cancelling"
                       onChange={event =>
                           this.setState({
                             reason: event.target.value
                           })}
                />
              </Form.Field>

              <Message error header="Oops!" content={this.state.errorMessage}/>
              <Button primary type="submit" loading={this.state.loading}>
                <Icon name="check"/>
                Cancel a Party
              </Button>
              <hr/>
              <h2>{this.state.partyName}</h2>
              <h2>{this.state.message}</h2>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleClose} inverted>
              <Icon name="cancel"/> Close
            </Button>
          </Modal.Actions>
        </Modal>
    );
  }
}

export default CancelParty;