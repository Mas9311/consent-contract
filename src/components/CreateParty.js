import React, { Component } from "react";
import { Button, Header, Icon, Modal, Form, Message } from "semantic-ui-react";
import web3 from "../web3";
import consent from "../consent";

class CreateParty extends Component {
    state = {
        modalOpen: false,
        partyName: "",
        errorMessage: "",
        loading: false
    };

    handleOpen = () => this.setState({ modalOpen: true, message: "", errorMessage: "" });

    handleClose = () => this.setState({ modalOpen: false });

    onSubmit = async event => {
        if (!this.state.loading && this.state.partyName !== "") {
            event.preventDefault();
            this.setState({
                loading: true,
                errorMessage: "",
                message: "waiting for blockchain transaction to complete..."
            });
            try {
                // console.log(consent.jsonInterface.getMethods());
                const accounts = await web3.eth.getAccounts();
                await consent.methods
                    .createParty1A(this.state.partyName) // contains the user account name
                    .send({
                        from: accounts[0]
                    });
                this.setState({
                    loading: false,
                    message: "You have been created a new Party"
                });
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