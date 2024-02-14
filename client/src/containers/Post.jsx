import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader, Message, Button } from "semantic-ui-react";

import Reply from "../components/Post/Reply";
import SearchBar from "../components/SearchBar";
import PostHeader from '../components/Post/PostHeader';
import ReplyForm from "../components/Post/ReplyForm";

import { resetFilter } from '../actions/filter';
import { POST_TYPES } from "../constants";
const { POST, FAQ } = POST_TYPES;

export default function Post() {
    const dispatch = useDispatch();
    let { id } = useParams();

    const user = useSelector(state => state.users.currentUser);

    const [multiplier, setMultiplier] = useState(1);

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const [replies, setReplies] = useState(null);

    const [post, setPost] = useState(null);
    const fetchPost = useCallback(() => {
        setLoading("Fetching post");
        axios.get(`/api/post/${id}`)
            .then(res => {
                setPost(res.data);
                setLoading(null);
                axios.get(`/api/replies/${id}`)
                    .then(res2 => setReplies(res2.data));
            })
            .catch(error => {
                setError(error.message);
                setLoading(null);
            });
    }, [id]);

    useEffect(() => {
        dispatch(resetFilter());
        fetchPost();
    }, [dispatch, fetchPost]);
    useEffect(() => {
        if (post && !post.readBy.includes(user._id) && post.category !== FAQ) {
            axios.patch(`/api/post/${id}/toggleRead`);
        }
    }, [post, id, user._id]);

    const handleCreateReply = reply => {
        setLoading("Creating reply");
        axios.post(`/api/reply/${id}`, { reply })
            .then(fetchPost)
            .catch(error => {
                setError(error.message);
                setLoading(null);
            });
    };
    const handleDeleteReply = replyId => {
        axios.delete(`/api/reply/${replyId}`)
            .then(fetchPost);
    };
    const handleMarkReplyAsAnswer = replyId => {
        axios.post(`/api/reply/${replyId}/markAnswer`)
            .then(fetchPost);
    }

    if (error) {
        // TODO: Make this it's own component?
        return (
            <div style={{ margin: '3rem' }}>
                <Message floating negative content={error} />
            </div>
        );
    }

    if (loading || !post) {
        return (
            <Loader 
                active 
                style={{ marginTop: "5rem" }}  
                inline='centered' 
                content={loading} 
            />
        );
    }

    return (
        <div style={{ margin: '1rem' }}>
            { post.category === POST &&
                <Button
                    size='mini'
                    icon='plus'
                    content='Expand all replies'
                    onClick={() => setMultiplier(-1 * multiplier)}
                />
            }
            <SearchBar placeholder='Search post' />
            <PostHeader 
                post={post} 
                answers={replies && replies.filter(r => r.isVerifiedAnswer)}
            />
            { post.category === POST && (replies ?
                replies.map((reply, index) => 
                    <Reply 
                        reply={reply}
                        key={multiplier * (index + 1)} 
                        onDelete={() => handleDeleteReply(reply._id)}
                        onMarkAsAnswer={() => handleMarkReplyAsAnswer(reply._id)}
                    />
                ) :
                <Loader 
                    active 
                    inline='centered' 
                    style={{ marginTop: "5rem" }}  
                    content="Fetching replies" 
                />
            ) }
            { post.category === POST &&
                <ReplyForm onSubmit={handleCreateReply} />
            }
        </div>
    );
}