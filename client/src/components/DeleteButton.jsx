import React from "react";
import { Button, Modal } from "semantic-ui-react";

import LinkButton from './LinkButton';

// TODO: Confirm semantic component already does this :/
export default class DeleteButton extends React.Component {
    state = { open: false }
    
    handleOpen = () => this.setState({ open: true })

    handleClose = () => this.setState({ open: false })

    onClick = () => {
        this.handleClose()
        this.props.onDelete();
    }

    render() {
        return (
            <>
                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <Modal.Header icon='times' content={this.props.msg} />
                    <Modal.Actions>
                        <Button 
                            color='red' 
                            content='Yes' 
                            onClick={this.onClick} 
                        />
                        <Button 
                            content='No' 
                            onClick={this.handleClose} 
                        />
                    </Modal.Actions>
                </Modal>
                <LinkButton 
                    color='red'
                    icon='delete' 
                    text='Delete'
                    onClick={this.handleOpen}
                    open={this.props.open}
                />
            </>
        );
    } 
}
