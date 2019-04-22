import React, { Component } from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Message from "semantic-ui-react/dist/commonjs/collections/Message";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import web3 from "web3";
// import consent from "./consent";


class CreateAccount extends Component {
  state = {
    modalOpen: false,
    firstName: "",
    lastName: "",
    partyName: "",
    error: "",
    loading: false
  };
  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      error: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      const accounts = await web3.eth.getAccounts();
      // await consent.methods
      //   .createProfile(this.state.firstName, this.state.lastName) // contains the user account name
      //   .send({
      //     from: accounts[0]
      //   });
      this.setState({
        loading: false,
        message: "Your account has been created!"
      });
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "User rejected account already exists or first and last name must be non empty."
      });
    }
  };

  render() {
    return (
      <Modal
        trigger={
          <Button  color="green" onClick={this.handleOpen}>
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
            <Button primary type="submit" loading={this.state.loading}>
              <Icon name="check" />
              Create Your Account!
            </Button>
            <hr />
            <h2>{this.state.firstName} {this.state.lastName}</h2>
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