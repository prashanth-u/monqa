import React, { useState, useEffect } from "react";
import {  Loader, Radio, Button, Modal, Table } from "semantic-ui-react";
import axios from 'axios';

import LinkButton from "../LinkButton";
import { USER_TYPES } from '../../constants';
const { ADMIN, STUDENT } = USER_TYPES;

export default function UserList({ key, unit, onAccept }) { 
    const [error, setError] = useState(null);
    const [changingUser, setChangingUser] = useState(null);
    const [acceptingAll, setAcceptingAll] = useState(false);

    const [enrolledUsers, setEnrolledUsers] = useState(null);
    const [requestingUsers, setRequestingUsers] = useState(null);

    const getUsers = function() {
        setEnrolledUsers(null);
        setRequestingUsers(null);

        axios.get(`/api/unit/${unit}/users`)
            .then(res => setEnrolledUsers(res.data))
            .catch(err => setError(err.message));

        axios.get(`/api/unit/${unit}/requestingUsers`)
            .then(res => setRequestingUsers(res.data))
            .catch(err => setError(err.message));
    };

    useEffect(getUsers, [key, unit])

    if (error) return <div>{ error }</div>;

    const handleRemove = function(user) {
        axios.delete(`/api/unit/${unit}/enrol/${user.email}`)
            .then(getUsers)
            .catch(err => setError(err.message));
    };

    const handleRoleChange = function(user, role) {
        if (user.role !== role) {
            axios.post(`/api/user/${user.email}/role/${role}`)
                .then(getUsers)
                .catch(err => setError(err.message));
        }
        setChangingUser(null);
    };

    const handleAcceptAll = function() {
        axios.post(`/api/unit/${unit}/enrolAll`)
            .then(getUsers)
            .catch(err => setError(err.message));
        setAcceptingAll(false);
    };

    if (!enrolledUsers || !requestingUsers) { 
        return (
            <Loader 
                active 
                inline='centered' 
                content="Fetching users"
                style={{ marginTop: "5rem" }}
            />
        );
    }

    return (
        <>
            <Table compact celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'></Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Name</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>E-mail address</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { requestingUsers.length !== 0 &&
                        <>
                            <Table.Row warning style={{ fontWeight: 700 }}>
                                <Table.Cell colSpan='4'>
                                    Requesting users: { requestingUsers.length }
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <LinkButton 
                                        open 
                                        color="#21ba45"
                                        text='Accept all'
                                        icon="check"
                                        onClick={() => setAcceptingAll(true)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                            { requestingUsers.map((user, index) => (
                                <Table.Row key={index} warning>
                                    <Table.Cell colSpan='2' textAlign='center'>
                                        <LinkButton 
                                            open 
                                            color="#21ba45"
                                            text="Accept"
                                            icon="check"
                                            onClick={() => onAccept(user)}
                                        />
                                        &nbsp;&nbsp;&nbsp;
                                        <LinkButton
                                            open
                                            color="red"
                                            icon="delete"
                                            text="Reject"
                                            onClick={() => handleRemove(user)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell textAlign='right'>{ user.name }</Table.Cell>
                                    <Table.Cell textAlign='right'>{ user.email }</Table.Cell>
                                </Table.Row>
                            )) }
                        </>
                    }
                    <Table.Row style={{ fontWeight: 700 }}>
                        <Table.Cell colSpan='4'>
                            Enrolled users: { enrolledUsers.length }
                        </Table.Cell>
                    </Table.Row>
                    { enrolledUsers
                        .sort(a => a.role === 'Admin' ? -1 : 1)
                        .map((user, index) => (
                        <Table.Row key={index} positive={user.role === 'Admin'}>
                            <Table.Cell collapsing>
                                <LinkButton 
                                    open 
                                    color="red"
                                    icon="delete"
                                    text="Remove" 
                                    onClick={() => handleRemove(user)}
                                />
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Radio
                                    label={ADMIN}
                                    checked={user.role === ADMIN}
                                    onClick={() => setChangingUser(user)}
                                />
                                &nbsp;&nbsp;&nbsp;
                                <Radio
                                    label={STUDENT}
                                    checked={user.role === STUDENT}
                                    onChange={() => handleRoleChange(user, STUDENT)}
                                />
                            </Table.Cell>
                            <Table.Cell textAlign='right'>{ user.name }</Table.Cell>
                            <Table.Cell textAlign='right'>{ user.email }</Table.Cell>
                        </Table.Row>
                    )) }
                </Table.Body>
            </Table>
            { changingUser &&
                <Modal open>
                    <Modal.Content>
                        <p>Are you sure you want to make user with email {changingUser.email} an admin?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative content='Yes' onClick={() => handleRoleChange(changingUser, ADMIN)} />
                        <Button content='No' onClick={() => setChangingUser(null)} />
                    </Modal.Actions>
                </Modal>
            }
            { acceptingAll &&
                <Modal open>
                    <Modal.Content>
                        <p>Are you sure you want to accept all requests for this unit?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative content='Yes' onClick={handleAcceptAll} />
                        <Button content='No' onClick={() => setAcceptingAll(false)} />
                    </Modal.Actions>
                </Modal>
            }
        </>
    )
}