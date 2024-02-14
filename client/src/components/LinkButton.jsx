import React from "react";
import { Icon } from "semantic-ui-react";

export default function LinkButton(props) {
    // Not really a button :/
    if (props.asText) {
        return (
            <span style={{ color: props.color }}>
                { props.icon && <Icon name={props.icon} />}
                { props.open && props.text }
            </span>
        );
    }

    return (
        <>
            <a 
                href='#0' 
                onClick={props.onClick} 
                style={{ color: props.color }}
            >
                { props.icon && <Icon name={props.icon} />}
                { props.open && props.text }
            </a>
        </>
    );
}