import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, Button, Input, Form } from "semantic-ui-react";

import { TOGGLE_VISIBLE, TOGGLE_ANONYMOUS } from '../../actions/types';
import { USER_TYPES } from '../../constants';
const { STUDENT } = USER_TYPES;

export default function InputBar({ userTyping, allowAnon, onTyping, onSend }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.currentUser);
    const chat = useSelector(state => state.chat);
    const { visible, anonymous } = chat;

    const [width, setWidth] = useState(window.innerWidth + 'px');
    const [input, setInput] = useState('');

    const updateWidth = () => {
        const wWidth = window.innerWidth;
        if (wWidth <= 767) return setWidth((wWidth - 25) + 'px');

        const sideBars = document.getElementsByClassName('side-bar');
        if (sideBars.length) {
            var newWidth = wWidth;

            for (let bar of sideBars) {
                if (bar.classList.contains('visible')) {
                    newWidth -= bar.clientWidth;
                }
            }
            newWidth = (newWidth - 25) + 'px';
            setWidth(newWidth);
        }
    }

    useEffect(() => {
        var widthSetter = window.setInterval(updateWidth, 200);
        return () => window.clearInterval(widthSetter);
    }, []);

    const sendMsg = message => {
        onSend(message);
        setInput('');
    }
 
    const handleKeyDown = e => {
        onTyping();
    
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMsg(e.target.value);
        }
    }

    return (
        <div 
            id='bottom-content'
            style={{ margin: '0 1rem', width }}
        >
            <Form>
            { userTyping && 
                <div>
                    <i>{ userTyping } is typing...</i>
                </div> 
            }
            <Button
                size='mini'
                basic={!visible}
                color={visible ? 'green' : null}
                onClick={() => dispatch({ type: TOGGLE_VISIBLE })}
                content={visible ? 'Visible' : 'Invisible'}
            />
            { (allowAnon && user.role === STUDENT) &&
                <Checkbox 
                    checked={anonymous}
                    label='Send anonymously' 
                    style={{ margin: '1rem' }}
                    onChange={() => dispatch({ type: TOGGLE_ANONYMOUS })}
                />
            }
            <Input 
                fluid 
                action 
                type='text' 
                placeholder='Message...' 
            >
                <input 
                    value={input} 
                    onKeyDown={handleKeyDown}
                    onChange={e => setInput(e.target.value)}
                />
                <Button
                    color='blue'
                    onClick={() => sendMsg(input)}
                    content='Send'
                />
            </Input>
            </Form>
        </div>
    );
}