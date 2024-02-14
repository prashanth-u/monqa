import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Message, Item, Segment, Dimmer, Loader } from "semantic-ui-react";

import Toolbar from "../Toolbar";
import Text from '../Text';
import DeleteButton from "../DeleteButton";
import LinkButton from '../LinkButton';
import MetaInfo from '../MetaInfo';

export default function PostHeader({ post, answers }) {
    let history = useHistory();

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [hover, setHover] = useState(false);
    const user = useSelector(state => state.users.currentUser);

    const handleDelete = () => {
        setLoading('Deleting post');
        axios.delete(`/api/post/${post._id}`)
            .then(() => {
                setLoading(null);
                history.push('/');
            })
            .catch(error => {
                setLoading(null);
                setError(error.message);
            });
    };

    var btns;
    if (post.user._id === user._id) {
        btns = [
            <LinkButton 
                open={hover}
                icon='edit' 
                text='Edit'
                onClick={() => history.push(`/post/new/${post._id}`)}
            />,
            <DeleteButton 
                open={hover}
                msg='This will delete the whole post and any replies made. Are you sure?' 
                onDelete={handleDelete}
            />
        ]
    }

    return (
        <Segment.Group
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
        >
            { error &&
                <Message negative content={`Error: ${error}`} />
            }
            <Message as={Segment} floating={hover} size='large'>
                { loading &&
                    <Dimmer active inverted>
                        <Loader inverted>{loading}</Loader>
                    </Dimmer>
                }
                <Toolbar 
                    left={btns}
                    right={post.tags.concat([post.unit])}
                />
                <Item.Group>
                    <Item>
                        <Item.Content>
                            <Item.Header>
                                <Text text={post.title} />
                            </Item.Header>
                            { post.user && 
                                <Item.Meta>
                                    <MetaInfo post={post} />
                                </Item.Meta>
                            }
                            <Item.Description>
                                <Text isHTML text={post.body} />
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Message>
            { answers && answers.map((reply, index) => (
                <Message key={index} as={Segment} positive>
                    <div className="meta">
                        <MetaInfo post={reply} />
                    </div>
                    <Text isHTML text={reply.body}/>
                </Message>
            )) }
        </Segment.Group>
    );
}