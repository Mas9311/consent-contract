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

  //Upon opening the Create Party modal, clear everything to a clean slate.
  handleOpen = () => this.setState({
    modalOpen: true,
    partyName: "",
    maxNumberOfGuests: "",
    timeLimit: "",
    message: "Please enter your party name, maximum number of guests(optional), and a time limit(optional)",
    errorMessage: ""
  });

  handleClose = () => this.setState({modalOpen: false});

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); // retrieves the current metamask account.
    let currentAccount = accounts[0];

    if (!this.state.loading) {
      if (this.state.partyName !== "") {
        if (await consent.methods
            .profileDoesNotExist() // Profile must exist to join party
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: You must create a profile before creating a party.",
            message: ""
          });
        } else if (!await consent.methods
            .partyDoesNotExist(this.state.partyName) // Party already exists
            .call({
              from: currentAccount
            })) {

          this.setState({
            loading: false,
            errorMessage: "Error: A Party by this name has already been created.",
            message: ""
          });
        } else {

          this.setState({
            loading: true,
            errorMessage: "",
            message: "waiting for blockchain transaction to complete..."
          });
          try {
            // 1A:
            // No max number of guests specified.
            // No time limit specified.
            if (this.state.maxNumberOfGuests === "" && this.state.timeLimit === "") {
              await consent.methods
                  .createParty1A(
                      this.state.partyName
                  )
                  .send({
                    from: currentAccount
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    // Can only update this.state once the transaction has been approved.
                    const pn = this.state.partyName;

                    this.setState({
                      loading: false,
                      partyName: "",
                      message: "Transaction approved. Party name: " + pn +
                          " with a maximum number of 1 guest " +
                          " that will close in 5 minutes."
                    });
                    document.getElementById('party_name').value = "";
                  });
            } // end 1A

            // 1B:
            // No max number of guests specified.
            // Time limit is specified.
            else if (this.state.maxNumberOfGuests === "" && this.state.timeLimit !== "") {
              try {
                this.setState({
                  timeLimit: Number(this.state.timeLimit)
                });
              } catch (err) {
                console.log("timeLimit is not a Number. " + err.message);
              } // end convert timeLimit to a Number

              if (typeof this.state.timeLimit === 'number') {
                if (this.state.timeLimit > 0) {
                  await consent.methods
                      .createParty1B(
                          this.state.partyName,
                          this.state.timeLimit
                      )
                      .send({
                        from: currentAccount
                      })
                      .on('confirmation', (confirmationNumber, receipt) => {
                        // Can only update this.state once the transaction has been approved.
                        const pn = this.state.partyName;
                        const tl = this.state.timeLimit;
                        this.setState({
                          loading: false,
                          partyName: "",
                          timeLimit: "",
                          message: "Transaction approved. Party name: " + pn +
                              " with a maximum number of 1 guest " +
                              " that will close in " + tl + " minutes."
                        });
                        document.getElementById('party_name').value = "";
                        document.getElementById('time_limit').value = "";
                      });
                } else {
                  this.setState({
                    loading: false,
                    errorMessage: "Error: Time Limit must be greater than 0 minutes.",
                    message: ""
                  });
                } // end timeLimit > 0 check
              } else {
                this.setState({
                  loading: false,
                  errorMessage: "Error: Time Limit is not a Number.",
                  message: ""
                });
              } // end timeLimit is a Number check
            } // end 1B

            // 1C:
            // Max number of guests is specified.
            // No time limit specified.
            else if (this.state.maxNumberOfGuests !== "" && this.state.timeLimit === "") {
              try {
                this.setState({
                  maxNumberOfGuests: Number(this.state.maxNumberOfGuests)
                });
              } catch (err) {
                console.log("maxNumberOfGuests is not a Number. " + err.message);
              } // end convert maxNumberOfGuests to a Number

              if (typeof this.state.maxNumberOfGuests === 'number') {
                if (this.state.maxNumberOfGuests > 0) {
                  await consent.methods
                      .createParty1C(
                          this.state.partyName,
                          this.state.maxNumberOfGuests
                      )
                      .send({
                        from: currentAccount
                      })
                      .on('confirmation', (confirmationNumber, receipt) => {
                        // Can only update this.state once the transaction has been approved.
                        this.setState({
                          loading: false,
                          message: "Transaction approved. Party name: " + this.state.partyName +
                              " with a maximum number of " + this.state.maxNumberOfGuests + " guests " +
                              " that will close in 5 minutes."
                        });
                        document.getElementById('party_name').value = "";
                        document.getElementById('max_guests').value = "";
                      });
                } else {
                  this.setState({
                    loading: false,
                    errorMessage: "Error: Max Number of Guests must be greater than 0.",
                    message: ""
                  });
                } // end maxNumberOfGuests > 0 check
              } else {
                this.setState({
                  loading: false,
                  errorMessage: "Error: Max Number of Guests is not a Number.",
                  message: ""
                });
              } // end maxNumberOfGuests is a Number check
            } // end 1C

            // 1D
            // Max number of guests is specified.
            // Time limit is specified.
            else if (this.state.maxNumberOfGuests !== "" && this.state.timeLimit !== "") {
              try {
                this.setState({
                  maxNumberOfGuests: Number(this.state.maxNumberOfGuests)
                });
              } catch (err) {
                console.log("maxNumberOfGuests is not a Number. " + err.message);
              } // end convert maxNumberOfGuests to a Number

              try {
                this.setState({
                  timeLimit: Number(this.state.timeLimit)
                });
              } catch (err) {
                console.log("timeLimit is not a Number. " + err.message);
              } // end convert timeLimit to a Number

              if (typeof this.state.timeLimit === 'number') {
                if (this.state.timeLimit > 0) {
                  if (typeof this.state.maxNumberOfGuests === 'number') {
                    if (this.state.maxNumberOfGuests > 0) {
                      await consent.methods
                          .createParty1D(
                              this.state.partyName,
                              this.state.timeLimit,
                              this.state.maxNumberOfGuests
                          )
                          .send({
                            from: currentAccount
                          })
                          .on('confirmation', (confirmationNumber, receipt) => {
                            // Can only update this.state once the transaction has been approved.
                            this.setState({
                              loading: false,
                              message: "Transaction approved. Party name: " + this.state.partyName +
                                  " with a maximum number of " + this.state.maxNumberOfGuests + " guests " +
                                  " that will close in " + this.state.timeLimit + " minutes."
                            });
                            document.getElementById('party_name').value = "";
                            document.getElementById('time_limit').value = "";
                            document.getElementById('max_guests').value = "";
                          });
                    } else {
                      this.setState({
                        loading: false,
                        errorMessage: "Error: Max Number of Guests must be greater than 0.",
                        message: ""
                      });
                    } // end maxNumberOfGuests > 0 check
                  } else {
                    this.setState({
                      loading: false,
                      errorMessage: "Error: Max Number of Guests is not a Number.",
                      message: ""
                    });
                  } // end maxNumberOfGuests is a Number check
                } else {
                  this.setState({
                    loading: false,
                    errorMessage: "Error: Time Limit must be greater than 0 minutes.",
                    message: ""
                  });
                } // end timeLimit > 0 check
              } else {
                this.setState({
                  loading: false,
                  errorMessage: "Error: Time Limit is not a Number.",
                  message: ""
                });
              } // end timeLimit is a Number check
            } // end 1D
          } catch (err) {
            // User clicked the reject button in the metamask popup window.
            console.log(err.message);
            this.setState({
              loading: false,
              errorMessage: err.message,
              message: "Error: Transaction rejected."
            });
          } // end try catch
        } // end valid create party criteria
      } else {
        // party name field is empty.
        this.setState({
          message: "Please enter a name for your party into the correct field."
        });
      } // end party name is empty check
    } else {
      // User clicked while loading icon is still spinning.
      this.setState({
        message: "Sorry for the delay, the transaction is still processing."
      });
    } // end loading is spinning check
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
          <Header icon="browser" content="Create a New Party"/>
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
                <label>Maximum Guests permitted to join your party</label>
                <input id="max_guests"
                       placeholder="(optional) defaults to no limit"
                       onChange={event =>
                           this.setState({
                             maxNumberOfGuests: event.target.value
                           })}
                />
              </Form.Field>

              <Form.Field>
                <label>Time Limit until the Party Closes (in minutes)</label>
                <input id="time_limit"
                       placeholder="(optional) defaults to 5 minutes"
                       onChange={event =>
                           this.setState({
                             timeLimit: event.target.value
                           })}
                />
              </Form.Field>

              <Message error header="Oops!" content={this.state.errorMessage}/>
              <Button primary type="submit" loading={this.state.loading}>
                <Icon name="check"/>
                Open the party!
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

export default CreateParty;