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
    message: "Please enter the Party name you would like to join",
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
        if (!await consent.methods
            .profileExists() // Profile has not been created
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: You must create a profile before creating a party.",
            message: ""
          });
        } else if (!await consent.methods
            .partyExists(this.state.partyName) // Party has not been created
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: There is no Party by that name.",
            message: ""
          });
        } else if (!await consent.methods
            .partyInitialized(this.state.partyName) // Party is finalized
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: You cannot join a Party that has already finalized.",
            message: ""
          });
        } else if (await consent.methods
            .partyOwner(this.state.partyName)
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: You cannot join a Party that you created. Owner is in the Party by default.",
            message: ""
          });
        } else if (!await consent.methods
            .notYetAddedToParty(this.state.partyName)
            .call({from: currentAccount})) {

          this.setState({
            loading: false,
            errorMessage: "Error: You cannot re-join a Party that you already joined.",
            message: ""
          })
        } else if (await consent.methods
            .partyFull(this.state.partyName)
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: Cannot join a full Party.",
            message: ""
          })
        } else if (await consent.methods
            .partyHasExpired(this.state.partyName)
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: Party has already expired and no one is able to join anymore.",
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
                  const pn = this.state.partyName;
                  this.setState({
                    loading: false,
                    partyName: "",
                    errorMessage: "",
                    message: "Success: You have joined the " + pn + " party"
                  });
                  if (this.state.modal) {
                    document.getElementById('party_name').value = "";
                  }
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
          message: "Please enter the Party name."
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