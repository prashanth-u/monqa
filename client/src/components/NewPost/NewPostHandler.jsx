import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Icon, Segment, Form, Button, Label, Input, Header, Loader,
    Message, Container, TextArea } from "semantic-ui-react";
import { useSelector } from "react-redux";
import axios from 'axios';

import Editor from '../Editor';
import { POST_TYPES, USER_TYPES } from "../../constants";

export const SUGGESTED_TAGS = [
    'Textbook',
    'Workshop',
    'Administrative',
    'Assignment', 
    'Exam', 
    'Tutorial', 
    'Labratory', 
    'Lecture', 
    'Quiz', 
    'Mid-Semester Test',
    'Week #',
    'Not examinable',
];

function CreatedMessage({ id }) {
    const history = useHistory();
    
    return (
        <Segment 
            placeholder 
            as={Container}
            style={{ backgroundColor: '#fcfff5' }}
        >
            <Header icon>
                <Icon name='check' />
                Post created successfully
            </Header>
            <Segment.Inline>
                <Button 
                    primary 
                    content='Go to created post' 
                    onClick={() => history.push(`/post/${id}`)} 
                />
            </Segment.Inline>
        </Segment>
    );
} 

function PostForm({ post, onCreated }) {
    const history = useHistory();
    const user = useSelector(state => state.users.currentUser);

    const [unit, setUnit] = useState(null);
    const [category, setCategory] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState([]);

    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (post) {
            if (user.units.includes(post.unit)) setUnit(post.unit);
            if (Object.values(POST_TYPES).includes(post.category)) {
                setCategory(post.category);
            } 
            setTitle(post.title);
            if (post.body) setBody(post.body);
            if (post.tags) setTags(post.tags);
        } else if (user.role === USER_TYPES.STUDENT) {
            setCategory(POST_TYPES.POST);
        }
    }, [post, user.role, user.units]);
    
    const handleTagAdd = () => {
        if (!(tags.includes(newTag))) {
            // TODO: mention that users can enter multiple tags split by ,
            const newTags = newTag.split(', ')
            setTags(tags.concat(newTags));
            setNewTag('');
        }
    };
    const handleTagDelete = tag => setTags(tags.filter(t => t !== tag));
    const getErrors = () => {
        var errs = [];
        if (!unit) errs.push('Unit is required');
        if (!category) errs.push('Category is required');

        if (category === POST_TYPES.FAQ) {
            if(!title) errs.push('Question is required');
            if (!body) errs.push('Answer is required');
        } else if (!title) errs.push('Title is required');

        setErrors(errs)
        return errs;
    };
    const prepareSubmit = () => {
        // TODO: Show message when uploading FAQ (this might take a while...)
        if (getErrors().length) return;

        setLoading(true);

        if (post && post._id) {
            const updatedPost = { title, body, tags };
            axios.patch(`/api/post/${post._id}`, updatedPost)
                .then(() => {
                    setLoading(false);
                    history.push(`/post/${post._id}`);
                })
                .catch(err => {
                    setErrors([err.message]);
                    setLoading(false);
                });
        } else {
            const newPost = { unit, category, title, body, tags };
            axios.post('/api/post/new', newPost)
                .then(res => {
                    setLoading(false);
                    onCreated(res.data);
                })
                .catch(err => {
                    setErrors([err.message]);
                    setLoading(false);
                });
        }
    };

    return (
        <Segment>
            <Form>
                <Form.Group inline>
                    <label>Unit: </label>
                    { user.units.map((u, index) => (
                        <Form.Radio
                            key={index}
                            label={u}
                            value={u}
                            checked={unit === u}
                            onClick={(e, { value }) => setUnit(value)}
                            disabled={post && post._id}
                        />
                    )) }
                </Form.Group>
                { user.role !== USER_TYPES.STUDENT &&
                    <Form.Group inline>
                        <label>Category: </label>
                        { Object.values(POST_TYPES).map((type, index) => (
                            <Form.Radio
                                key={index}
                                label={type}
                                value={type}
                                checked={category === type}
                                onClick={(e, { value }) => setCategory(value)}
                                disabled={post && post._id}
                            />
                        )) }
                    </Form.Group>
                }
                <Form.Field inline>
                    <label>Tags: </label>
                    <span style={{ margin: '0 0.8rem 0 0' }}>
                        { tags.length ?
                            tags.map((tag, index) => (
                                <span key={index}>
                                    <Label tag>
                                        { tag }
                                        <Icon 
                                            color='red' 
                                            name='delete' 
                                            onClick={() => handleTagDelete(tag)}
                                        />
                                    </Label>&nbsp;
                                </span>
                            )) :
                            <span style={{ color: 'grey' }}>None</span>
                        }
                    </span>
                </Form.Field>
                <Form.Field inline>
                    <Input
                        list='suggested_tags'
                        size='mini'
                        placeholder='Add tag'
                        value={newTag}
                        onChange={(e, { value }) => setNewTag(value)}
                        action={
                            <Button icon='plus' size='mini' onClick={handleTagAdd} />
                        }
                    />
                    <datalist id='suggested_tags'>
                        { SUGGESTED_TAGS.map((tag, index) => (
                            <option key={index} value={tag} />
                        )) }
                    </datalist>
                </Form.Field>
                <Form.Field
                    control={TextArea}
                    rows={1}
                    value={title}
                    label={category === POST_TYPES.FAQ ? 'Question' : 'Title'}
                    placeholder={category === POST_TYPES.FAQ ? 'Question' : 'Title'}
                    onChange={(e, { value }) => setTitle(value)}
                />
                { category === POST_TYPES.FAQ ?
                    <Form.Field
                        control={TextArea}
                        rows={1}
                        value={body}
                        label="Answer"
                        placeholder="Answer"
                        onChange={(e, { value }) => setBody(value)}
                    /> :
                    <Form.Field>
                        <label>Body</label>
                        <Editor 
                            value={body}
                            onModelChange={model => setBody(model)} 
                        />
                    </Form.Field>
                }
                { errors.length !== 0 && 
                    <Message negative>
                        <Message.Header>Please fix the following errors</Message.Header>
                        <Message.List>
                            { errors.map((error, index) => (
                                <Message.Item key={index}>{error}</Message.Item>
                            )) }
                        </Message.List>
                    </Message>
                }
                <Button 
                    icon='check'
                    color='green' 
                    loading={loading}
                    onClick={prepareSubmit}
                    content='Done'
                />
            </Form>
            { category === POST_TYPES.FAQ &&
                <Message warning>
                    <Icon name='exclamation' />
                    Creating FAQs might take a while as they are uploaded to QNAMaker
                </Message>
            }
        </Segment>
    );
}

export default function NewPostHandler({ id, prefillData }) {
    const user = useSelector(state => state.users.currentUser);

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    useEffect(() => {
        if (id) {       // Edit mode
            setLoading("Fetching post");
            axios.get(`/api/post/${id}`)
                .then(res => {
                    setPost(res.data);
                    setLoading(null);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(null);
                });
        }
    }, [id]);


    const [createdPostId, setCreatedPostId] = useState(null);
    const handleCreated = postId => setCreatedPostId(postId);

    if (createdPostId) {
        return <CreatedMessage id={createdPostId} />
    }

    if (error) return <div>{ error }</div>

    if (loading) return (
        <Loader 
            active 
            style={{ marginTop: "5rem" }} 
            inline='centered' 
            content={loading}
        />
    );

    if (user && post && user._id !== post.user._id) {
        return (
            <Message negative>
                <Message.Header>Restricted</Message.Header>
                <p>You do not have the right permissions to edit this post</p>
            </Message>
        )
    }

    return <PostForm post={post ? post : prefillData} onCreated={handleCreated} />
}

// TODO: huge file. split into components