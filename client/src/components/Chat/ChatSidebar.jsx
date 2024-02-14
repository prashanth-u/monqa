import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Label, Responsive, Icon, Loader } from "semantic-ui-react";
import { FaGraduationCap } from 'react-icons/fa';

import { changeRoom } from '../../actions/chat';
import { USER_TYPES } from '../../constants';
import { TOGGLE_SIDEBAR } from '../../actions/types';
const { STUDENT, ADMIN } = USER_TYPES;

// TODO: userlist

export default function ChatSidebar({ users }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.currentUser);
    const chat = useSelector(state => state.chat);
    const { visible, room } = chat;

    const [studentListOpen, setStudentListOpen] = useState(true);
    const [tutorListOpen, setTutorListOpen] = useState(true);

    const toggleSidebar = () => dispatch({ type: TOGGLE_SIDEBAR });

    if (!users) {
        return (
            <Loader 
                active 
                inline='centered' 
                style={{ marginTop: "5rem" }}   
                content='Loading users' 
            />
        );
    }

    const students = users.filter(u => u.role === STUDENT);
    const tutors = users.filter(u => u.role === ADMIN);

    const handleRoomChange = newRoom => {
        dispatch(changeRoom(newRoom));
        if (window.innerWidth <= 767) toggleSidebar();
    };

    return (
        <>
            <Responsive {...Responsive.onlyMobile}>
                <Menu.Item onClick={toggleSidebar}>
                    <span style={{ color: 'red' }}>
                        <Icon name='times' color='red' />
                        Close
                    </span>
                </Menu.Item>
            </Responsive>
            <Menu.Item><h3>Rooms</h3></Menu.Item>
            { user.units.map((u, index) => (
                <Menu.Item 
                    as='a' 
                    key={index}
                    active={room === u}
                    color={room === u ? 'blue' : null}
                    onClick={() => handleRoomChange(u)}
                >
                    <FaGraduationCap />
                    &nbsp;&nbsp;{u}
                </Menu.Item>
            )) }
            <Menu.Item 
                as='a' 
                active={room === 'Feedback'}
                color={room === 'Feedback' ? 'blue' : null}
                onClick={() => handleRoomChange('Feedback')}
            >
                Feedback
            </Menu.Item>
            <Menu.Item />
            <Menu.Item>
                <h3>Users</h3>
            </Menu.Item>
            <Menu.Item>
                { visible ? 'You are visible' : 'You are invisible' }
            </Menu.Item>
            {/* Move this to own component */}
            <Menu.Item as='a' onClick={() => setStudentListOpen(!studentListOpen)}>
                <Label color={ students.length ? 'green' : null}>
                    { students.length }
                </Label>
                <Icon name={studentListOpen ? 'angle up' : 'angle down'} />
                Students
                { studentListOpen &&
                    <Menu.Menu>
                        { students.length ?
                            students.map((s, index) => (
                                <Menu.Item key={index} content={s.name} />
                            )) : null
                        }
                    </Menu.Menu>
                }
            </Menu.Item>
            <Menu.Item as='a' onClick={() => setTutorListOpen(!tutorListOpen)}>
                <Label color={tutors.length ? 'green' : null}>
                    { tutors.length }
                </Label>
                <Icon name={tutorListOpen ? 'angle up' : 'angle down'} />
                Tutors
                { tutorListOpen &&
                    <Menu.Menu>
                        { tutors.length ?
                            tutors.map((t, index) => (
                                <Menu.Item key={index} content={t.name} />
                            )) : null
                        }
                    </Menu.Menu>
                }
            </Menu.Item>
        </>
    );
}