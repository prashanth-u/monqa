import React, { useState, Fragment } from "react";
import { useSelector } from 'react-redux';
import { Icon, Label, Button } from "semantic-ui-react";
import { GiRobotAntennas } from 'react-icons/gi';
import { BallBeat } from 'react-pure-loaders';
import axios from 'axios';
import moment from 'moment'; 

import MessageWrapper from './MessageWrapper';
import { USER_TYPES } from '../../constants';
const { ADMIN } = USER_TYPES; 

// TODO: this file can be split up. somehow

function DisplayPicture({ name, bot }) {
    if (bot) {
        return (
            <i className="dp-bot circular icon">
                <GiRobotAntennas />
            </i>
        );
    }

    if (name === 'Anonymous') {
        return <Icon circular name='user secret' />
    }

    return (
        <i className="dp-user circular icon">
            { name[0] }
        </i>
    );
}

function MessageLabel({ pointing, message, details, loading }) {
    const messageTextStyle = {
        fontSize: '1.2em', 
        marginBottom: '.5em', 
        color: 'black'
    };

    const metaTextStyle = { fontSize: '.9em' };

    if (loading) {
        return (
            <Label pointing={pointing}>
                <BallBeat color={'blue'} loading={true}/>
            </Label>
        );
    }

    if (message && details) {
        return (
            <Label pointing={pointing}>
                <div style={messageTextStyle}>
                    { message }
                </div>
                <div style={metaTextStyle}>
                    { details }
                </div>
            </Label>
        );
    }

    return <Label pointing={pointing}>{ message }</Label>
}

// TODO: Rename message to answers
function BotMessage({ align, loading, error, message }) {
    
    if (!loading && !error && !message) return null;

    var content = [];

    if (loading) {
        content.push(<MessageLabel pointing={align} loading />);
    } else if (error) {
        content.push(<MessageLabel pointing={align} message={'Error: ' + error} />);
    } else if (message) {
        const reply = message.length === 0 ? 
            <div>Sorry, I couldn't find an answer</div> : (
            <>
                <div style={{ color: 'black' }}>This is what I found:</div>
                { message.map((a, index) => (
                    <div key={index}>
                        <div><b>{ a.question }</b></div>
                        <div>{ a.answer }</div>
                    </div>
                )) }
            </>
        );
        content.push(<MessageLabel pointing={align} message={reply} />);
    }

    content.push(<DisplayPicture bot />);

    if (align === 'left') content.reverse();

    return (
        <MessageWrapper align={align}>
            { content.map((elem, index) => (
                <Fragment key={index}>
                    { elem }
                </Fragment>
            )) }
        </MessageWrapper>
    );
}

// TODO: Disable button after ask?
function AskButton({ onClick }) {
    const style = {
        display: 'inline-block',
        alignSelf: 'flex-end',
        minWidth: '71px',
    };

    return (
        <Button size='mini' color='green' basic style={style} onClick={onClick}>
            Ask &nbsp;&nbsp; <GiRobotAntennas />
        </Button>
    );
}

export default function ChatMessage({ message, disableAsk }) {
    const user = useSelector(state => state.users.currentUser);
    const room = useSelector(state => state.chat.room);

    // TODO: Move into own component?
    const [answer, setAnswer] = useState(null);
    const [answerLoading, setAnswerLoading] = useState(false);
    const [answerError, setAnswerError] = useState(null);

    const [displayName, setDisplayName] = useState(message.anonymous ? 'Anonymous' : message.user);

    const handleAsk = () => {
        setAnswerLoading(true);
        setAnswer(null);
        setAnswerError(null);

        const request = {
            question: message.message,
            unit: room
        };
        axios.post('/api/qnamaker/answer', request)
            .then(res => {
                setAnswerLoading(false);
                setAnswer(res.data);
                setAnswerError(null);
            })
            .catch(err => {
                setAnswerLoading(false);
                setAnswer(null);
                setAnswerError(err.message);
            });
    };

    var align = message.sentByUser ? 'right' : 'left';

    var wrapperContents = [
        <DisplayPicture name={displayName} />,
        <MessageLabel 
            pointing={align}
            message={message.message}
            details={`${displayName} - ${moment(message.timestamp).format('hh:mm a')}`} 
        />        
    ];

    if (disableAsk !== true) wrapperContents.push(
        <AskButton onClick={handleAsk} />
    )

    const style = {
        display: 'inline-block',
        alignSelf: 'flex-end',
        minWidth: '67px',
    };

    if (user.role === ADMIN && displayName === 'Anonymous') wrapperContents.push(
        <Button 
            size='mini' 
            style={style} 
            content='Reveal' 
            onClick={() => setDisplayName(message.user)} 
        />
    );

    if (align === 'right') wrapperContents = wrapperContents.reverse();

    return (
        <>
            <MessageWrapper align={align}>
                { wrapperContents.map((elem, index) => 
                    <Fragment key={index}>{ elem }</Fragment>
                ) }
            </MessageWrapper>
            <BotMessage 
                align={align}
                loading={answerLoading}
                error={answerError}
                message={answer}
            />
        </>
    );
}