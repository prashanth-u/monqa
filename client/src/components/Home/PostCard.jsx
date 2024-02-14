import React, { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Item, Message } from "semantic-ui-react";

import Text from "../Text"
import Toolbar from '../Toolbar';
import Animation from '../Animation';
import MetaInfo from '../MetaInfo';
import { fetchPosts } from "../../actions/posts";
import { POST_TYPES, USER_TYPES } from "../../constants";
import { FOCUS_UNIT, UPDATE_SEARCH } from '../../actions/types';
import LinkButton from "../LinkButton";

const { POST, ANNOUNCEMENT } = POST_TYPES;

export default function PostCard(props) {
    const { post } = props;

    const [answers, setAnswers] = useState(null);
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        setOpen(!open);
        if (!answers) {
            axios.get(`/api/answers/${post._id}`)
                .then(res => setAnswers(res.data));
        }
    };

    const [hover, setHover] = useState(false);

    const dispatch = useDispatch();
    const toggleRead = () => {
        axios.patch(`/api/post/${post._id}/toggleRead`)
            .then(() => dispatch(fetchPosts()));
    };

    const user = useSelector(state => state.users.currentUser);

    var btns = [];
    if (post.category === POST) {
        if (post.hasVerifiedAnswer) {
            btns.push(
                <LinkButton open={hover} onClick={toggleOpen} 
                    icon={open ? 'chevron up' : 'chevron down'} 
                    text={open ? 'Hide solution' : 'Show solution'} 
                />
            )
        } else {
            btns.push(
                <LinkButton asText open={hover} icon='exclamation' 
                    text='Unsolved' 
                />
            )
        }
    }
    if (post.category === POST || post.category === ANNOUNCEMENT) {
        btns.push(
            <LinkButton open={hover} onClick={toggleRead}
                icon={post.readBy.includes(user._id) ? 'circle outline' : 'circle'}
                text={post.readBy.includes(user._id) ? 'Mark as unread' : 'Mark as read'}
            />
        );
    }
    if (post.category === POST) {
        btns.push(
            <LinkButton asText icon='comment outline' open={hover} 
                text={'Replies: ' + post.numReplies} 
            />
        )
    }

    const backColor = (post.category === POST && !post.hasVerifiedAnswer 
        && user.role === USER_TYPES.ADMIN) && '#fcbd084f';
        
    var highlightColor;
    if (!post.readBy.includes(user._id)) {
        if (post.category === POST) highlightColor = 'green';
        else if (post.category === ANNOUNCEMENT) highlightColor = 'red';
    }

    const labels = post.tags
        .map(tag => 
            <span 
                style={{ cursor: 'pointer' }}
                onClick={() => dispatch({ type: UPDATE_SEARCH, query: tag })}
            >
                <Text text={tag} />
            </span>
        )
        .concat([
            <a 
                href='#0' 
                onClick={() => dispatch({ type: FOCUS_UNIT, unit: post.unit })} 
            >
                { post.unit }
            </a>
        ]);

    var parsedAnswers;
    if (answers) {
        parsedAnswers = answers.map((answer, index) => 
            <Animation key={index} open={open} show={
                <Message positive as={Segment}>
                    <div className="meta">
                        <MetaInfo post={answer} />
                    </div>
                    <Text toText text={answer.body} />
                </Message>
            } />
        );
    }

    return (
        <Segment.Group 
            raised={hover} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
        >
            <Segment color={highlightColor}>
                <Toolbar color={backColor} left={btns} right={labels} />
                <Item.Group>
                    <Item as={Link} to={`/post/${props.post._id}`} >
                        <Item.Content>
                            <Item.Header>
                                <Text text={post.title} lines={1} />
                            </Item.Header>
                            <Item.Meta>
                                <MetaInfo post={post} />
                            </Item.Meta>
                            <Item.Description>
                                <Text toText text={post.body} lines={2} />
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            { parsedAnswers }
        </Segment.Group>
    );
}