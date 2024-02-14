
import React from "react";
import { Container } from "semantic-ui-react";

export default function MessageWrapper({ align, children }) {
    const containerStyle = {
        width: '100%', 
        marginTop: '.8rem'
    };

    const messageWrapperStyle = {
        display: 'flex', 
        justifyContent: align === 'right' ? 'flex-end' : null,
        alignItems: 'center'
    };

    return (
        <Container style={containerStyle}>
            <div style={messageWrapperStyle }>
                { children }
            </div>
        </Container>
    )
}