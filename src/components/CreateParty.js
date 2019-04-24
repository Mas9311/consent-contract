import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CreateParty extends Component {
  state = {
    modalOpen: false,
    partyName: "",
    maxNumberOfGuests: "",
    timeLimit: "",
    errorMessage: "",
    loading: false
  };

  handleOpen = () => this.setState({
    modalOpen: true,
    partyName: "",
    maxNumberOfGuests: "",
    timeLimit: "",
    message: "",
    errorMessage: ""
  });

  handleClose = () => this.setState({ modalOpen: false });

  onSubmit = async event => {
    event.preventDefault();
    if (!this.state.loading && this.state.partyName !== "") {
      this.setState({
        loading: true,
        errorMessage: "",
        message: "waiting for blockchain transaction to complete..."
      });
      try {
        // console.log(consent.jsonInterface.getMethods());
        const accounts = await web3.eth.getAccounts();

        // No max number of guests specified.
        // No time limit specified.
        if (this.state.maxNumberOfGuests === "" && this.state.timeLimit === "") {
          await consent.methods
              .createParty1A(this.state.partyName)
              .send({
                from: accounts[0]
              });
          this.setState({
            loading: false,
            message: "Transaction approved. Party name: " + this.state.partyName +
                " without a maximum number of guests " +
                " that will close in 5 minutes."
          });
        }

        // No max number of guests specified.
        // Time limit is specified.
        else if (this.state.maxNumberOfGuests === "" && this.state.timeLimit !== "") {
          await consent.methods
              .createParty1B(this.state.partyName, this.state.timeLimit)
              .send({
                from: accounts[0]
              });
          this.setState({
            loading: false,
            message: "Transaction approved. Party name: " + this.state.partyName +
                " without a maximum number of guests " +
                " that will close in " + this.state.timeLimit + " minutes."
          });
        }

        // Max number of guests is specified.
        // No time limit specified.
        else if (this.state.maxNumberOfGuests !== "" && this.state.timeLimit === "") {
          await consent.methods
              .createParty1C(this.state.partyName, this.state.maxNumberOfGuests)
              .send({
                from: accounts[0]
              });
          this.setState({
            loading: false,
            message: "Transaction approved. Party name: " + this.state.partyName +
                " with a maximum number of " + this.state.maxNumberOfGuests+ " guests " +
                " that will close in 5 minutes."
          });
        }

        // Max number of guests is specified.
        // Time limit is specified.
        else if (this.state.maxNumberOfGuests !== "" && this.state.timeLimit !== "") {
          await consent.methods
              .createParty1D(this.state.partyName, this.state.timeLimit, this.state.maxNumberOfGuests)
              .send({
                from: accounts[0]
              });
          this.setState({
            loading: false,
            message: "Transaction approved. Party name: " + this.state.partyName +
                " with a maximum number of " + this.state.maxNumberOfGuests+ " guests " +
                " that will close in " + this.state.timeLimit + " minutes."
          });
        }
      } catch (err) {
        this.setState({
          loading: false,
          errorMessage: err.message,
          message: "Error: Transaction rejected."
        });
      }
    }
  };

  render() {
    return (
        <Modal
            trigger={
              <Button color="purple" onClick={this.handleOpen} inverted>
                Create a New Party
              </Button>
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
        >
          <Header icon="browser" content="Create a New Party" />
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
                <label>Maximum Guests permitted to join your party</label>
                <input
                    placeholder="(optional) defaults to no limit"
                    onChange={event =>
                        this.setState({
                          maxNumberOfGuests: event.target.value
                        })}
                />
              </Form.Field>

              <Form.Field>
                <label>Time Limit until the Party Closes (in minutes)</label>
                <input
                    placeholder="(optional) defaults to 5 minutes"
                    onChange={event =>
                        this.setState({
                          timeLimit: event.target.value
                        })}
                />
              </Form.Field>

              <Message error header="Oops!" content={this.state.errorMessage} />
              <Button primary type="submit" loading={this.state.loading}>
                <Icon name="check" />
                Open the party!
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

export default CreateParty;