import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CreateAccount extends Component {
  state = {
    modalOpen: false,
    firstName: "",
    lastName: "",
    error: "",
    loading: false
  };

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
    const accounts = await web3.eth.getAccounts();
    if (!this.state.loading) {
      if (this.state.firstName !== "") {
        if (this.state.lastName !== "") {
          if (await consent.methods
              .profileDoesNotExist()
              .call({
                from: accounts[0]
              })) {
            this.setState({
              loading: true,
              error: "",
              message: "waiting for blockchain transaction to complete..."
            });
            try {
              await consent.methods
                  .createProfile(this.state.firstName, this.state.lastName) // stores the user's first and last name
                  .send({
                    from: accounts[0]
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    this.setState({
                      loading: false,
                      firstName: "",
                      lastName: "",
                      message: "Success: Your account has been created."
                    })
                  });
            } catch (err) {
              this.setState({
                loading: false,
                errorMessage: err.message,
                message: "Error: Transaction rejected."
              });
            }
          } else {
            this.setState({
              message: "You have already created an account and cannot create another."
            });
          }
        } else {
          this.setState({
            message: "Please enter your last name into the correct field."
          });
        }
      } else {
        this.setState({
          message: "Please enter your first name into the correct field."
        });
      }
    } else {
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
          <Form onSubmit={this.onSubmit} error={!!this.state.error}>
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
            <Message error header="Oops!" content={this.state.error} />
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