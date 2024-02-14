import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Segment, Header, Icon, Button, Input, Container, List } from 'semantic-ui-react';

import LinkButton from '../components/LinkButton'
import TermsAndConditions from '../components/Request/TermsAndConditions'
import { fetchUser } from '../actions/users';

export default function Request() {
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.currentUser);

    const [unit, setUnit] = useState('');
    const [error, setError] = useState(null);

    const handleChange = e => {
        setError(null);
        const newUnit = e.target.value.toUpperCase().substring(0, 7);
        setUnit(newUnit);
        if (newUnit.length === 7) {  
            if (!(/^[A-Z]*$/).test(newUnit.substring(0, 3)) || 
                !(/^\d+$/).test(newUnit.substring(3, 7))) {
                setError('Error: Invalid unit code');
            }
        }
    }
    
    const requestAccess = () => {
        if (error) return;

        axios.post(`/api/unit/${unit}/request`)
            .then(() => dispatch(fetchUser()));
    };

    const removeRequest = u => {
        axios.delete(`/api/unit/${u}/enrol/${user.email}`)
            .then(() => dispatch(fetchUser()));
    }

    const handleLogout = () => window.location.href = '/api/logout'

    return (
        <Segment placeholder style={{ height: '100vh' }}>
            <Header icon>
                <Icon loading name='frown outline' />
                Oops! Looks like you are not enrolled in any units
            </Header>
            <Button color="red" content='Logout' onClick={handleLogout} />
            <Container style={{ marginTop: '5rem' }} textAlign='center'>
                <p>
                    You can request access for units here. Units must be <br />
                    formatted as 3 letters followed by 4 digits. <br />
                    By requesting access you agree to our <TermsAndConditions />. 
                </p>
                <p>
                    <Input
                        placeholder='Unit code'
                        value={unit}
                        onChange={handleChange}
                        error={error ? true : false}
                        action={{
                            content: 'Request access',
                            onClick: requestAccess
                        }}
                    />
                </p>
                { error && 
                    <p style={{ color: 'red' }}>{ error }</p>
                }
                { (user.requestingUnits && user.requestingUnits.length !== 0) && 
                    <p>
                        You have requested access for the following units. <br />
                        Please wait for an administrator to enrol you to these units.
                        <List>
                            { user.requestingUnits.map(u => (
                                <List.Item>
                                    <LinkButton
                                        color='red' 
                                        icon='delete' 
                                        onClick={() => removeRequest(u)} 
                                    />
                                    { u }
                                </List.Item>
                            )) }
                        </List>
                    </p>
                }
            </Container>
        </Segment>
    );
}