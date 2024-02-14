import React, { useState, useEffect } from "react";
import { Label, Item, Icon, Segment, Message } from "semantic-ui-react";
import { useSelector } from 'react-redux';
import sanitizeHtml from 'sanitize-html';

import { searchHTML } from '../_search';
import Text from '../Text';
import Toolbar from '../Toolbar';
import Animation from '../Animation';
import MetaInfo from '../MetaInfo';
import DeleteButton from "../DeleteButton";
import LinkButton from "../LinkButton";

import { USER_TYPES } from "../../constants";
const { ADMIN } = USER_TYPES;

const COLLAPSEDCONTENTLIMIT = 50;

export default function Reply({ reply, onDelete, onMarkAsAnswer }) {
    const [open, setOpen] = useState(true);
    const [hover, setHover] = useState(false);
    
    const user = useSelector(state => state.users.currentUser);

    const query = useSelector(state => state.filter.query);
    useEffect(() => {   // Close if query not found in reply
        if (query && searchHTML(reply.body, query).length === 0) {
            setOpen(false);
        }
    }, [query, reply.body])

    var btns = [
        <LinkButton 
            open={hover}
            icon='minus' 
            text='Collapse'
            onClick={() => setOpen(false)}
        />
    ];
    //todo: be able to revert answer back to reply
    if (!reply.isVerifiedAnswer && user.role === ADMIN) {
        btns.push(
            <LinkButton 
                open={hover}
                icon='check' 
                text='Mark as answer'
                onClick={onMarkAsAnswer}
            />
        );
    }
    if (user._id === reply.user._id) {
        btns.push(
            <DeleteButton 
                open={hover}
                msg='Are you sure you want to delete this reply?'
                onDelete={onDelete} 
            />
        );
    }

    const color = reply.isVerifiedAnswer ? '#00ff284d' : null,
        bodyText = sanitizeHtml(reply.body, { allowedTags: [] });

    var shortBody = bodyText;
    if (shortBody.length > COLLAPSEDCONTENTLIMIT) {
        shortBody = shortBody.substring(0, COLLAPSEDCONTENTLIMIT) + '...'
    }

    return (
        <Animation open={open} show={
            <Message
                as={Segment}
                floating={hover}
                positive={reply.isVerifiedAnswer}
                onMouseEnter={() => setHover(true)} 
                onMouseLeave={() => setHover(false)}
            > 
                <Toolbar
                    color={color}
                    left={btns}
                    right={reply.isVerifiedAnswer && [ 'Answer' ]}
                />
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Item.Meta>
                                    <MetaInfo post={reply} />
                                </Item.Meta>
                                <Item.Description>
                                    <Text isHTML text={reply.body} />
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Message>
            } hide={
                <Label 
                    as='a' onClick={() => setOpen(true)}
                    style={{ margin: "0.5rem 1rem 0 0", backgroundColor: color }}
                >
                    <Icon name='plus' />{ reply.user.name } - { shortBody }
                </Label>
            } 
        />
    );
}