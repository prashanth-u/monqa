import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Loader, Message } from "semantic-ui-react";

import ChatMessage from './ChatMessage';

function FeedbackMessage({ width }) {
    const [visible, setVisible] = useState(true);

    const content = `
        Welcome to the Feedback room! This is a chat room where 
        you can discuss any feedback that you may have of monqa
        with all users. Feel free to comment on anything you 
        like/dislike, all feedback is appreciated. Thank you, 
        the devs :)
    `;

    if (!visible) return null;

    setTimeout(() => setVisible(false), 10000);

    const style = {
        position: 'absolute', 
        top: '.1rem', 
        width: `${width - 40}px`,
        zIndex: '1000',
        textAlign: 'center'
    };

    return (
        <Message
            style={style}
            positive
            onDismiss={() => setVisible(false)}
            header='Feedback room'
        >
            {content}
            <div style={{ fontSize: '.7rem' }}>
                (This message will self destruct in 10s)
            </div>
        </Message>
    );
}

export default function MessageList({ scroll }) {
    const messagesBottom = useRef(null);

    const chat = useSelector(state => state.chat);
    const { loading, error, messages, room } = chat;

    const [height, setHeight] = useState(window.innerHeight + 'px');
    const [width, setWidth] = useState(window.innerWidth + 'px');

    // TODO: move this to some wrapper component
    const updateDimensions = () => {
        const navbar = document.getElementById('navbar');
        const bottomContent = document.getElementById('bottom-content');
        if (navbar && bottomContent) {
            const newHeight = window.innerHeight - navbar.clientHeight 
                - bottomContent.clientHeight - 10;
            setHeight(newHeight + 'px');
        }

        if (window.innerWidth <= 767) return;

        const sideBars = document.getElementsByClassName('side-bar');
        if (sideBars.length) {
            var newWidth = window.innerWidth;
            for (let bar of sideBars) {
                // Check if side bar is visible
                if (bar.classList.contains('visible')) {
                    newWidth -= bar.clientWidth;
                }
            }
            setWidth(newWidth);
        }
    };

    useEffect(() => {
        var dimensionSetter = window.setInterval(updateDimensions, 200);
        return () => window.clearInterval(dimensionSetter);
    }, []);

    useEffect(() => {
        if (messagesBottom.current) {
            messagesBottom.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [scroll]);

    const style = { height, width: `${width}px` };

    if (loading || !messages) {
        return (
            <div style={{ ...style, marginTop: "5rem" }}>
                <Loader 
                    active 
                    inline='centered' 
                    content="Fetching messages" 
                />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...style, margin: '3rem' }}>
                <Message floating negative content={error} />
            </div>
        );
    }

    return (
        <div style={{ ...style, overflow: 'auto', padding: window.innerWidth <= 767 ? null : '0 1rem' }}>
            { room === 'Feedback' && <FeedbackMessage width={width} /> }
            { messages.map((message, index) => (
                <ChatMessage key={index} message={message} disableAsk={room === 'Feedback'} />
            )) }
            <div ref={messagesBottom} />
        </div>
    )
}