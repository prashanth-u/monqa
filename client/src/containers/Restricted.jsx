import React from 'react';
import { Message } from 'semantic-ui-react';
import { USER_TYPES } from "../constants";
import { useSelector } from 'react-redux';

// Page for when non Admin tries to access Admin page
export default function Restricted(props) {
    const user = useSelector(state => state.users.currentUser);

    if (user.role !== USER_TYPES.ADMIN) {
        return (
            <Message negative>
                <Message.Header>Restricted</Message.Header>
                <p>You do not have the right permissions to view this page</p>
            </Message>
        );
    }

    return (
        <>{ props.children }</>
    );
}