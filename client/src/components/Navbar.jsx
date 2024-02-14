import React, { Fragment, useRef } from 'react';
import { Sticky, Icon, Menu, Popup } from 'semantic-ui-react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { USER_TYPES } from '../constants';
import { useState } from 'react';

function MenuPageItem({ link, icon, label }) {
    let location = useLocation();

    return (
        <Menu.Item 
            active={location.pathname === link} 
            as={Link}
            to={link}
        >
            <Icon name={icon} />{ label }
        </Menu.Item>
    )
}

const pages = [
    <MenuPageItem label="Chat" icon="discussions" link="/chat" />,
    <MenuPageItem label="Search" icon="search" link="/docsearch" />,
];

const adminPages = [
    <MenuPageItem label="Analytics" icon="database" link="/events" />,
    <MenuPageItem label="Upload" icon="upload" link="/uploaddoc" />,
    <MenuPageItem label="Admin" icon="wrench" link="/admin" />,
];

export default function Navbar() {
    const user = useSelector(state => state.users.currentUser);
    const navbarRef = useRef(null);

    const [popupOpen, setPopupOpen] = useState(false);

    return (
        <>
        <Popup  
            hoverable
            position='bottom right'
            style={{ padding: '0' }}
            open={popupOpen}
            context={navbarRef}
        >
            <Menu size='massive' fluid vertical>
                <Menu.Item color='red' active onClick={() => window.location.href = '/api/logout'}>
                    <Icon name='sign out' />Logout
                </Menu.Item>
            </Menu>
        </Popup>
        <Sticky id='navbar'>
            <Menu icon='labeled' attached='top' style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>
                <Link to=''>
                    <img 
                        alt='logo' 
                        src='/monqa_logo.jpeg' 
                        style={{ height: '4rem', margin: '0.5rem 1rem' }} 
                    />
                </Link>
                <Menu.Item style={{ minWidth: '0', padding: '0', margin: '0' }} />
                { pages.map((item, index) => 
                    <Fragment key={index}>
                        { item }
                    </Fragment>
                ) }
                { user.role === USER_TYPES.ADMIN && adminPages.map((item, index) => 
                    <Fragment key={index}>
                        { item }
                    </Fragment>
                ) }
                <Menu.Menu position='right'>
                    <Menu.Item onClick={() => setPopupOpen(!popupOpen)}>
                        <Icon name='user circle' />
                        { user.name }
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        </Sticky>
        <div ref={navbarRef} />
        </>
    );
}