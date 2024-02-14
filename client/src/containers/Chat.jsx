import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button, Loader, Sidebar, Menu } from "semantic-ui-react";
import io from 'socket.io-client';
import axios from 'axios';

import ChatSidebar from '../components/Chat/ChatSidebar';
import MessageList from '../components/Chat/MessageList';
import Timer from '../components/Chat/Timer';
import InputBar from '../components/Chat/InputBar';
import { changeRoom, refreshMessages } from '../actions/chat';
import { RESET_ROOM, TOGGLE_SIDEBAR } from '../actions/types';

var socket;
const socketOptions = {
    pingTimeout: 60000,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    timeout: 60000
};

export default function Chat() {
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.currentUser);
    const chat = useSelector(state => state.chat);
    const { visible, anonymous, room, sidebarOpen } = chat;

    const [users, setUsers] = useState(null);
    const [userTyping, setUserTyping] = useState(null);
    const [allowAnon, setAllowAnon] = useState(false);
    const [scroll, setScroll] = useState((new Date()).getTime());

    const handleSend = message => {
        if (message !== '') {
            const data = {
                user: user._id,
                room,
                anonymous,
                message,
            };
            socket.emit('sendMessage', data);
        }
    }

    const handleTyping = () => {
        socket.emit('typing', anonymous ? 'Anonymous' : user.name, room);
    }

    const updateScroll = () => {
        setTimeout(() => setScroll((new Date()).getTime()), 500);
    }

    useEffect(() => {        
        socket = io.connect('', socketOptions);
        socket.on('typing', function(data) {
            setUserTyping(data);
            setTimeout(() => setUserTyping(null), 4000);
        });
        socket.on('sendMessage', function(err) {
            if (err) console.log(err.message);
            else dispatch(refreshMessages());
            updateScroll();
        });
        socket.on('usersUpdated', function(data) {
            setUsers(data);
        });
        dispatch(changeRoom(user.units[0]));

        return () => {
            if (socket) {
                socket.emit('disconnect', { user: user._id });
                socket.disconnect();
                socket = undefined;
            }
            dispatch({ type: RESET_ROOM });
        }
    }, [user, dispatch]);

    useEffect(() => {        
        if (!room || !socket) return;

        socket.emit('joined', room);
        axios.get('/api/chat/permission/' + room)
            .then((res) => setAllowAnon(res.data.allowAnon));

        const leaveRoom = () => {
            if (!room || !socket) return;
            socket.emit('leave', room);
        }
        
        window.addEventListener('beforeunload', leaveRoom);
        updateScroll();

        return () => {
            leaveRoom();
            window.removeEventListener('beforeunload', leaveRoom);
        }
    }, [room]);

    useEffect(() => {
        if (!room || !socket) return;

        const data = {
            room, visible, id: user._id,
            user: {
                name: anonymous ? 'Anonymous' : user.name,
                role: user.role
            }
        };
        socket.off('getUsers');  
        socket.on('getUsers', function() {
            socket.emit('updateUser', data)
        });
        socket.emit('updateUser', data)
    }, [user, room, visible, anonymous])

    if (!room) {
        return (
            <Loader 
                active 
                inline='centered' 
                style={{ marginTop: "5rem" }}   
                content='Loading chat'
            />
        );
    }

    return (
        <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                vertical
                animation={window.innerWidth <= 767 ? 'overlay' : 'push'}
                visible={sidebarOpen}
                className='side-bar'
            >
                <ChatSidebar users={users} />
            </Sidebar>
            <Sidebar.Pusher>
                <div style={{ position: 'absolute', top: '.2rem', left: '.3rem', zIndex: 20 }}>
                    <Button
                        onClick={() => dispatch({ type: TOGGLE_SIDEBAR })}
                        icon='bars'
                        color={sidebarOpen ? 'green' : null}
                    />
                    <Timer />
                </div>
                <MessageList scroll={scroll} />
                <InputBar 
                    userTyping={userTyping} 
                    allowAnon={allowAnon}
                    onSend={handleSend}
                    onTyping={handleTyping}
                />
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}