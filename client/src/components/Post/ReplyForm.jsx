import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Form, Button, Segment } from "semantic-ui-react";

import Editor from '../Editor';
import { USER_TYPES } from "../../constants";
const { ADMIN } = USER_TYPES;

const SUGGESTED_REPLIES = [
    'Please refer to the unit guide', 
    'Yes, that is correct',
    'This question has been answered already',
];

export default function ReplyForm(props) {
    const user = useSelector(state => state.users.currentUser);

    const [text, setText] = useState('');
    const [value, setValue] = useState('');

    return (
        <Segment>
            <Form>
                { user.role === ADMIN &&
                    <Form.Group inline>
                        <label>Common Replies:</label>
                        { SUGGESTED_REPLIES.map((r, index) => 
                            <Button
                                size='mini'
                                key={index}
                                content={r}
                                onClick={() => setValue(r)}
                            />
                        )}
                    </Form.Group>
                }
                <Form.Field>
                    <Editor value={value} onModelChange={value => setText(value)} />
                </Form.Field>
                <Button 
                    color='green' 
                    icon='reply' 
                    content='Reply' 
                    onClick={() => props.onSubmit(text)} 
                />
            </Form>
        </Segment>
    );
}