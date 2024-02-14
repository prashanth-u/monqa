import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { refreshMessages } from '../../actions/chat';
var refreshTimeout;

export default function Timer() {
    const dispatch = useDispatch();

    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        var endDate = new Date()
        endDate.setHours(23, 59, 59, 0);
        
        refreshTimeout = setInterval(() => {
            setTimeLeft(parseInt((endDate.getTime() - (new Date()).getTime()) / 1000))
        }, 1000);
        return () => clearInterval(refreshTimeout);
    }, [])

    if (timeLeft === 86400) {       // Reached midnight
        clearInterval(refreshTimeout);
        dispatch(refreshMessages());
        return (
            <Message negative compact size='mini'>
                <Message.Header>
                    Messages will dissapear once you refresh the screen
                </Message.Header>
            </Message>
        );
    } else if (timeLeft > 0) {
        var timeRemaining = timeLeft;

        // var days = parseInt(timeRemaining / 86400);
        timeRemaining = (timeRemaining % 86400);

        var hours = parseInt(timeRemaining / 3600);
        timeRemaining = (timeRemaining % 3600);

        var minutes = parseInt(timeRemaining / 60);
        timeRemaining = (timeRemaining % 60);

        if(minutes < 10) minutes = '0'+minutes;

        var seconds = parseInt(timeRemaining);
        if(seconds < 10) seconds = '0'+seconds;

        if (hours === 0 && minutes < 11) {
            return (
                <Message warning compact size='mini'>
                    <Message.Header>
                        Time left for chat to clear: { minutes }:{ seconds }
                    </Message.Header>
                </Message>
            )
        }
    }
    
    return null;
}