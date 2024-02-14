import React, { useState, useRef } from "react";
import axios from 'axios';
import Papa from 'papaparse';
import { Header, Button, Form } from "semantic-ui-react";

import UserList from './UserList';

function parseFile(e, callback) {
    const filePath = e.target.files[0];

    const performCallback = function(result) {
        const data = result.data.flat()
            .filter(item => item !== "");
        callback(data);
    }
    
    Papa.parse(filePath, { 
        header: false, 
        download: true, 
        skipEmptyLines: true, 
        complete: performCallback
    });
}

export default function UnitEnrolment({ unit }) {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [key, setKey] = useState(0)
    const fileInputRef = useRef(null);

    if (error) return <div>{ error }</div>;

    const handleChange = () => setKey(key+1)

    const handleAdd = function(user) {
        const newUserEmail = user ? user.email : email;
        axios.post(`/api/unit/${unit}/enrol/${newUserEmail}`)
            .then(handleChange)
            .catch(err => setError(err.message));
    };

    const enrolUsers = async function(emails) {
        for (var i = 0; i < emails.length; i++) {
            try {
                await axios.post(`/api/unit/${unit}/enrol/${emails[i]}`);
            } catch (err) { setError(err.message) }
        }
        handleChange();
    };

    // TODO: add error checking when multiple enrolments fail

    return (         
        <>
            <Header as='h3'>{ unit } Enrolment </Header>
            <UserList 
                key={key}
                unit={unit} 
                onAccept={handleAdd}
            />
            <Form>
                <Form.Group inline>
                    <Form.Input
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                        content='Add user'
                        onClick={() => handleAdd()}
                    />
                    <Button
                        content='Add from CSV'
                        onClick={() => fileInputRef.current.click()}
                    />
                    <input
                        hidden
                        type="file"
                        ref={fileInputRef}
                        onChange={e => parseFile(e, enrolUsers)}
                    />
                </Form.Group>
            </Form>
        </>
    );
}