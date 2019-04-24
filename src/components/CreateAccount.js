import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CreateAccount extends Component {
  state = {
    modalOpen: false,
    firstName: "",
    lastName: "",
    errorMessage: "",
    loading: false
  };

  // Upon opening the Create Account modal, clear everything to a clean slate.
  handleOpen = () => this.setState({
    modalOpen: true,
    firstName: "",
    lastName: "",
    message: "",
    errorMessage: ""
  });

  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = async event => {
    event.preventDefault();
    const currentAccount = await web3.eth.getAccounts()[0]; // retrieves the current metamask account.

    if (!this.state.loading) {
      if (this.state.firstName !== "") {
        if (this.state.lastName !== "") {
          if (await consent.methods
              .profileDoesNotExist() // The "modifier-function" that returns a boolean.
              .call({ from: currentAccount })) {
            // Only able to reach this point if the user has not created an account for their current metamask address.
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
                    // Can only update this.state's first/last/message once the transaction has been approved.
                    this.setState({
                      loading: false,
                      firstName: "", // Clear the first name field so they don't click it again.
                      lastName: "", // Clear the last name field.
                      message: "Success: Your account has been created." // show the user the transaction was successful
                    })
                  });
            } catch (err) {
              // User clicked the reject button in the metamask popup window.
              this.setState({
                loading: false,
                errorMessage: err.message,
                message: "Error: Transaction rejected."
              });
            }
          } else {
            // this is when the "modifier-function", profileDoesNotExist(), returns false.
            this.setState({
              message: "You have already created an account and cannot create another."
            });
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
        message: "Sorry for the delay, the transaction is still processing."
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
        <Header icon="browser" content="Create an Account" />
        <Modal.Content>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>First Name</label>
              <input
                placeholder="First Name"
                onChange={event => this.setState({ firstName: event.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input
                placeholder="Last Name"
                onChange={event => this.setState({ lastName: event.target.value })}
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <Button primary type="submit" loading={this.state.loading} centered={true}>
              <Icon name="check" />
              Create Your Account!
            </Button>

            <hr />
            <h2>{this.state.firstName + " " + this.state.lastName}</h2>
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

export default CreateAccount;