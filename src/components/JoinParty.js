import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class JoinParty extends Component {
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
    message: "Please enter the party name you would like to join",
    errorMessage: ""
  });

  handleClose = () => this.setState({modalOpen: false});

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); // retrieves the current metamask account.
    let currentAccount = accounts[0];
    //console.log(currentAccount);

    if (!this.state.loading) {
      if (this.state.partyName !== "") {
        if (await consent.methods
            .profileDoesNotExist() // Profile must exist to join party
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: You must create a profile before joining a party",
            message: ""
          });
        } else if (await consent.methods
            .partyDoesNotExist(this.state.partyName)
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: Party must exist to be joinable",
            message: ""
          });
        } else if (!await consent.methods
            .partyInitialized(this.state.partyName) // Party must exist to join it
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: Party must not be closed to be joinable",
            message: ""
          });
        } else if (await consent.methods
            .partyOwner(this.state.partyName)
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: You cannot join the party you created, owner in party by default",
            message: ""
          });
        } else if (!await consent.methods
            .notYetAddedToParty(this.state.partyName)
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: Already in party, cannot join again",
            message: ""
          })
        } else if (await consent.methods
            .partyFull(this.state.partyName)
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: Party is full, unable to join",
            message: ""
          })
        } else if (await consent.methods
            .partyHasExpired(this.state.partyName)
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: This party has expired, no longer able to join",
            message: ""
          })
        } else {

          this.setState({
            loading: true,
            errorMessage: "",
            message: "waiting for blockchain transaction to complete..."
          });
          try {
            await consent.methods.addGuestToParty(this.state.partyName)
                .send({
                  from: currentAccount
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                  this.setState({
                    loading: false,
                    partyName: "",
                    errorMessage: "",
                    message: "Success: You have joined the party" // show the user the transaction was successful
                  });
                  document.getElementById('party_name').value = "";
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
        // first name field is empty.
        this.setState({
          message: "Please enter the party name."
        });
      }
    } else {
      // User clicked while loading icon is still spinning.
      this.setState({
        message: "Sorry for the delay, the transaction is still processing."
      });
    }
  };

  render() {
    return (
        <Modal
            trigger={
              <Button color="blue" onClick={this.handleOpen} inverted>
                Join a Party
              </Button>
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
        >

          <Header icon="browser" content="Join a Party"/>
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

              <Message error header="Oops!" content={this.state.errorMessage}/>
              <Button primary type="submit" loading={this.state.loading}>
                <Icon name="check"/>
                Join the Party!
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

export default JoinParty;