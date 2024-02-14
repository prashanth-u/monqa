import React, { useState } from "react";
import { Divider, Header, Grid, Transition } from "semantic-ui-react";

import PostCard from './PostCard';

export default function CardList({ posts, width, title, onCollapse }) {
    const [hover, setHover] = useState(false);

    var content;

    if (posts.length) {
        content = posts.map((post, index) => <PostCard post={post} key={index} />)
    } else {
        content = (
            <Transition transitionOnMount animation='fade down' >
                <Header 
                    as='h4'
                    color='grey'
                    textAlign='center' 
                    content='No results'
                />
            </Transition>
        );
    }

    const listStyle = {
        maxHeight: '80vh',
        overflow: 'auto', 
        scrollbarWidth: 'thin',
        marginBottom: '1rem'
    };

    return (
        <Grid.Column width={width}>
            <Divider horizontal>
                <Header 
                    as='h2' 
                    style={{ cursor: 'pointer' }}
                    textAlign='center' 
                    onClick={onCollapse}
                    onMouseEnter={() => setHover(true)} 
                    onMouseLeave={() => setHover(false)}
                    color={hover ? 'grey' : null}
                    content={hover ? 'Collapse' : title}
                />
            </Divider>
            <div style={listStyle}>{ content }</div>
        </Grid.Column>
    );
}
