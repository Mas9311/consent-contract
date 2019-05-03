import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

let latestFirstName = "";
let latestLastName = "";
let latestBlockNumber = 0;


class CreateAccount extends Component {
  state = {
    modalOpen: false,
    loading: false,
    message: "",
    errorMessage: "",
    firstName: "",
    lastName: ""
  };

  // Upon opening the Create Account modal, clear everything to a clean slate.
  handleOpen = () => this.setState({
    modalOpen: true,
    loading: false,
    firstName: "",
    lastName: "",
    message: "Please enter your first and last name to create an account.",
    errorMessage: ""
  });

  handleClose = () => this.setState({modalOpen: false});

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); // retrieves the current metamask account.
    let currentAccount = accounts[0];

    if (!this.state.loading) {
      if (this.state.firstName !== "") { // notStringEmpty(firstName)
        if (this.state.lastName !== "") { // notStringEmpty(lastName)
          if (await consent.methods
              .profileExists() // You have already created a Profile
              .call({
                from: currentAccount
              })) {

            this.setState({
              loading: false,
              firstName: "", // Clear the first name field so they don't click it again.
              lastName: "", // Clear the last name field.
              message: "You have already created an Account and cannot create another."
            });
            if (this.state.modalOpen) {
              document.getElementById('first_input').value = "";
              document.getElementById('last_input').value = "";
            }
          } else { // No problems with requirements
            this.setState({
              loading: true,
              errorMessage: "",
              message: "waiting for blockchain transaction to complete..."
            });
            try {
              await consent.methods
                  .createProfile(this.state.firstName, this.state.lastName) // stores the user's first and last name.
                  .send({
                    from: currentAccount
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    if (receipt.blockNumber > latestBlockNumber) {
                      latestBlockNumber = receipt.blockNumber;
                      latestFirstName = this.state.firstName;
                      latestLastName = this.state.lastName;

                      this.setState({
                        loading: false,
                        firstName: "", // Clear the first name field so they don't click it again.
                        lastName: "", // Clear the last name field.
                        message: "Success: Your account has been created under " +
                            latestFirstName + " " + latestLastName + "."
                      });
                      if (this.state.modalOpen) {
                        document.getElementById('first_input').value = "";
                        document.getElementById('last_input').value = "";
                      }
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
          // last name field is empty.
          this.setState({
            message: "Please enter your last name into the correct field."
          });
        }
      } else {
        // first name field is empty.
        this.setState({
          message: "Please enter your first name into the correct field."
        });
      }
    } else {
      // User clicked while loading icon is still spinning.
      this.setState({
        message: "Sorry for the delay, the transaction is still processing..."
      });
    }
  };

  render() {
    return (
        <Modal
            trigger={
              <Button color="green" onClick={this.handleOpen} inverted>
                Create an Account
              </Button>
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
        >
          <Header icon="browser" content="Create an Account"/>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>First Name</label>
                <input id="first_input"
                       placeholder="First Name"
                       onChange={event => this.setState({firstName: event.target.value})}
                />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <input id="last_input"
                       placeholder="Last Name"
                       onChange={event => this.setState({lastName: event.target.value})}
                />
              </Form.Field>
              <Message error header="Oops!" content={this.state.errorMessage}/>
              <Button primary type="submit" loading={this.state.loading} centered={true}>
                <Icon name="check"/>
                Create Your Account!
              </Button>

              <hr/>
              <h2>{this.state.firstName} {this.state.lastName}</h2>
              <h2>{this.state.message}</h2>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleClose} inverted>
              <Icon name="cancel"/>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
    );
  }
}

export default CreateAccount;