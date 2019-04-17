import React, { Component } from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Message from "semantic-ui-react/dist/commonjs/collections/Message";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";

class CreateParty extends Component {
    state = {
        modalOpen: false,
        creator: "",
        partyName: "",
        error: "",
        loading: false
    };

    handleOpen = () => this.setState({ modalOpen: true });

    handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (
            <Modal
                trigger={
                    <Button  color="green" onClick={this.handleOpen}>
                        Create a New Party
                    </Button>
                }
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Header icon="browser" content="Create a New Party" />
                <Modal.Content>
                    <Form onSubmit={this.onSubmit} error={!!this.state.error}>
                        <Form.Field>
                            <label>Creator</label>
                            <input
                                placeholder="Creator"
                                onChange={event => this.setState({ creator: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Party Name</label>
                            <input
                                placeholder="Party Name"
                                onChange={event => this.setState({ partyName: event.target.value })}
                            />
                        </Form.Field>
                        <Message error header="Oops!" content={this.state.error} />
                        <Button primary type="submit" loading={this.state.loading}>
                            <Icon name="check" />
                            Open the party!
                        </Button>
                        <hr />
                        <h2>{this.state.partyName}</h2>
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