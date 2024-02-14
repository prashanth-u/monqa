import React, { Fragment, useState } from "react";
import { Divider, Header, Segment, Form } from "semantic-ui-react";
import { useSelector } from 'react-redux';
import axios from 'axios';

import UnitEnrolment from "../components/Admin/UnitEnrolment";
import LinkButton from "../components/LinkButton";

// TODO: let admin enrol themselves into a unit

export default function Admin() {
    const [enrollingUnit, setEnrollingUnit] = useState('');
    const [error, setError] = useState(null);

    const [validUnit, setValidUnit] = useState(null);
    const user = useSelector(state => state.users.currentUser);

    const handleChange = e => {
        setError(null);
        const newUnit = e.target.value.toUpperCase().substring(0, 7);
        setEnrollingUnit(newUnit);
        if (newUnit.length === 7) {  
            if (!(/^[A-Z]*$/).test(newUnit.substring(0, 3)) || 
                !(/^\d+$/).test(newUnit.substring(3, 7))) {
                setError('Error: Invalid unit code');
            }
        }
    }

    const handleEnrol = () => {
        if (error) return;
        axios.post(`/api/unit/${enrollingUnit}/enrol/${user.email}`)
            .then(() => window.location.reload());
    }

    const showEnrolment = unit => {
        setValidUnit(null);
        setValidUnit(unit);
    }

    return (
        <div style={{ margin: '1rem' }}>
            <Divider horizontal>
                <Header textAlign='center' as='h2'>Enrolment</Header>
            </Divider>
            <Segment>
                <p>
                    You can edit the enrolment of your units or 
                    enrol yourself into a unit here.
                </p>
                <Form>
                    <Form.Group inline>
                        <label>Your units: </label>
                        { user && user.units.map((u, index) => (
                            <Fragment key={index}>
                                <LinkButton 
                                    open
                                    text={u}
                                    onClick={() => showEnrolment(u)}
                                />
                                &nbsp;&nbsp;
                            </Fragment>
                        )) }
                    </Form.Group>
                    <Form.Group inline>
                        <label>Enrol into: </label>
                        <Form.Input
                            value={enrollingUnit}
                            placeholder='Unit'
                            onChange={handleChange}
                            error={error ? true : false}
                        />
                        <Form.Button
                            disabled={enrollingUnit.length !== 7 || error}
                            content='Enrol'
                            onClick={handleEnrol}
                        />
                    </Form.Group>
                    { error &&
                        <p style={{ color: 'red' }}>{ error }</p>
                    }
                </Form>
                { validUnit && <UnitEnrolment unit={validUnit} />}
            </Segment>
        </div>
    );
}